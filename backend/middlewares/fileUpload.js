const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Readable } = require('stream');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

// Ensure upload directory exists
const UPLOAD_BASE = path.join(__dirname, '..', 'uploads', 'communication');
const serverlessEnvKeys = [
  'VERCEL',
  'VERCEL_ENV',
  'VERCEL_URL',
  'AWS_LAMBDA_FUNCTION_NAME',
  'AWS_EXECUTION_ENV',
  'NOW_REGION',
  'FUNCTIONS_WORKER_RUNTIME',
  'FUNCTION_NAME',
  'GCF_FUNCTION'
];

const isRunningInServerless = serverlessEnvKeys.some((key) => Boolean(process.env[key]));
if (isRunningInServerless) {
  console.warn('[fileUpload] Serverless runtime detected – uploads keep working in memory storage');
}

const ensureUploadDirectory = () => {
  if (isRunningInServerless) {
    return false;
  }
  try {
    if (!fs.existsSync(UPLOAD_BASE)) {
      fs.mkdirSync(UPLOAD_BASE, { recursive: true });
    }
    return true;
  } catch (err) {
    console.warn('[fileUpload] Failed to prepare upload directory, falling back to memory storage:', err.message);
    return false;
  }
};

const diskStorageAvailable = ensureUploadDirectory();
const storage = diskStorageAvailable
  ? multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, UPLOAD_BASE);
      },
      filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + '-' + file.originalname.replace(/\s+/g, '-'));
      }
    })
  : multer.memoryStorage();

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit per file

const truthy = (value) => ['1', 'true', 'yes', 'on'].includes(String(value || '').toLowerCase());

const getFtpConfig = () => {
  const host = process.env.FTP_HOST;
  const user = process.env.FTP_USER || process.env.FTP_USERNAME;
  const password = process.env.FTP_PASSWORD || process.env.FTP_PASS;
  const port = process.env.FTP_PORT ? parseInt(process.env.FTP_PORT, 10) : 21;
  const folder = (process.env.FTP_FOLDER || process.env.FTP_BASE_DIR || '').trim();
  const publicBase = (process.env.FTP_PUBLIC_BASE || process.env.FILES_PUBLIC_BASE || '').trim();
  const secure = truthy(process.env.FTP_SECURE);

  return {
    host,
    user,
    password,
    port,
    folder,
    publicBase,
    secure,
    configured: Boolean(host && user && password),
  };
};

const normalizeFtpPath = (value = '') => value.replace(/^\/+|\/+$/g, '');

/**
 * Middleware to accept multiple attachments under the field name `attachments`
 */
exports.uploadAttachments = upload.array('attachments', 10);

// Export helper for single-file uploads (e.g., avatar)
exports.uploadSingle = (fieldName = 'file') => upload.single(fieldName);

/**
 * Process uploaded files and attach metadata to req.body.attachments
 * If AWS S3 is configured, attempt to upload files to S3 and remove local copies.
 */
exports.processAttachments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      req.body.attachments = req.body.attachments || [];
      return next();
    }

    const attachments = [];

    // Prepare FTP if configured (preferred over local)
    let ftpClient = null;
    let ftpSetupError = null;
    const ftpConfig = getFtpConfig();

    if (ftpConfig.configured) {
      try {
        const ftp = require('basic-ftp');
        ftpClient = new ftp.Client();
        await ftpClient.access({
          host: ftpConfig.host,
          port: ftpConfig.port,
          user: ftpConfig.user,
          password: ftpConfig.password,
          secure: ftpConfig.secure,
        });

        const configuredFolder = normalizeFtpPath(ftpConfig.folder);
        const currentFolder = normalizeFtpPath(await ftpClient.pwd().catch(() => ''));
        const baseDir = (configuredFolder && currentFolder.endsWith(configuredFolder)) ? '' : configuredFolder;
        const ftpActiveDir = baseDir ? `${baseDir}/communication` : 'communication';
        // ensureDir also cd's into target dir, so subsequent uploads use file name only.
        await ftpClient.ensureDir(ftpActiveDir);
      } catch (e) {
        ftpSetupError = e;
        console.warn('[fileUpload] FTP setup failed, continuing without FTP:', e.message || e);
        try { if (ftpClient) await ftpClient.close(); } catch(e){}
        ftpClient = null;
      }
    } else if (isRunningInServerless) {
      console.warn('[fileUpload] FTP is not configured. Set FTP_HOST, FTP_USER and FTP_PASSWORD in deployment environment variables.');
    }

    // Try S3 upload if credentials are available
    let s3, bucketName;
    try {
      bucketName = process.env.AWS_S3_BUCKET;
      const AWS = require('aws-sdk');
      if (bucketName && process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
        AWS.config.update({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION || 'us-east-1',
        });
        s3 = new AWS.S3();
      }
    } catch (err) {
      // aws-sdk not installed or misconfigured; fall back to local
      s3 = null;
    }

    for (const f of req.files) {
      // support memoryStorage (buffer) or disk storage (path)
      const fileBuffer = f.buffer ? f.buffer : await readFile(f.path);

      if (s3) {
        const key = f.path ? `communication/${path.basename(f.path)}` : `communication/${Date.now()}-${f.originalname.replace(/\s+/g, '-')}`;
        try {
          const uploadRes = await s3
            .upload({
              Bucket: bucketName,
              Key: key,
              Body: fileBuffer,
              ACL: 'public-read',
              ContentType: f.mimetype,
            })
            .promise();

          attachments.push({
            url: uploadRes.Location,
            name: f.originalname,
            size: f.size,
            mimeType: f.mimetype,
            type: (f.mimetype || '').split('/')[0],
          });

          // remove local copy if present
          if (f.path) await unlink(f.path);
        } catch (err) {
          console.warn('[fileUpload] S3 upload failed, keeping local file info', err.message);
          if (f.path) {
            attachments.push({
              url: `${process.env.BACKEND_URL || 'http://localhost:' + (process.env.PORT || 3001)}/uploads/communication/${path.basename(f.path)}`,
              name: f.originalname,
              size: f.size,
              mimeType: f.mimetype,
              type: (f.mimetype || '').split('/')[0],
            });
          } else {
            attachments.push({
              url: null,
              name: f.originalname,
              size: f.size,
              mimeType: f.mimetype,
              type: (f.mimetype || '').split('/')[0],
              note: 'No persistent storage available for this upload (running in serverless without S3 configured)'
            });
          }
        }
      } else {
        // FTP if configured (preferred), otherwise local fallback
        if (ftpClient) {
          try {
            const generatedName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${f.originalname.replace(/\s+/g, '-')}`;
            const remotePublicPath = `communication/${generatedName}`;
            const uploadSource = f.path ? f.path : Readable.from(fileBuffer);
            await ftpClient.uploadFrom(uploadSource, generatedName);

            const publicBase = ftpConfig.publicBase;
            const url = publicBase
              ? `${publicBase.replace(/\/$/, '')}/${remotePublicPath}`
              : `ftp://${ftpConfig.host}/${remotePublicPath}`;

            attachments.push({ url, name: f.originalname, size: f.size, mimeType: f.mimetype, type: (f.mimetype || '').split('/')[0] });
            // remove local copy if exists
            if (f.path) await unlink(f.path);
          } catch (e) {
            console.warn('[fileUpload] FTP upload failed, falling back to local URL if present:', e.message || e);
            if (f.path) {
              attachments.push({
                url: `${process.env.BACKEND_URL || 'http://localhost:' + (process.env.PORT || 3001)}/uploads/communication/${path.basename(f.path)}`,
                name: f.originalname,
                size: f.size,
                mimeType: f.mimetype,
                type: (f.mimetype || '').split('/')[0],
              });
            } else {
              attachments.push({
                url: null,
                name: f.originalname,
                size: f.size,
                mimeType: f.mimetype,
                type: (f.mimetype || '').split('/')[0],
                note: 'No persistent storage available for this upload (FTP failed in serverless memory mode).'
              });
            }
          }
        } else {
          // local fallback - disk storage path expected
          if (f.path) {
            attachments.push({
              url: `${process.env.BACKEND_URL || 'http://localhost:' + (process.env.PORT || 3001)}/uploads/communication/${path.basename(f.path)}`,
              name: f.originalname,
              size: f.size,
              mimeType: f.mimetype,
              type: (f.mimetype || '').split('/')[0],
            });
          } else {
            // memory uploads without persistent storage
            attachments.push({
              url: null,
              name: f.originalname,
              size: f.size,
              mimeType: f.mimetype,
              type: (f.mimetype || '').split('/')[0],
              note: ftpSetupError
                ? `No persistent storage available for this upload (FTP setup failed: ${ftpSetupError.message || ftpSetupError})`
                : 'No persistent storage available for this upload (running in serverless without S3/FTP configured). Set FTP_HOST/FTP_USER/FTP_PASSWORD.'
            });
          }
        }
      }
    }

    // close ftp client if opened
    try { if (ftpClient) await ftpClient.close(); } catch(e){}
    req.body.attachments = attachments;
    return next();
  } catch (err) {
    console.error('[fileUpload] Error processing attachments:', err.message);
    return res.status(500).json({ status: 'failed', message: 'Failed to process attachments' });
  }
};
