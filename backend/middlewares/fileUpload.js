const multer = require('multer');
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const unlink = util.promisify(fs.unlink);

// Ensure upload directory exists
const UPLOAD_BASE = path.join(__dirname, '..', 'uploads', 'communication');
const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

let storage;
if (isServerless) {
  console.warn('[fileUpload] Running in serverless environment, using memory storage for uploads');
  storage = multer.memoryStorage();
} else {
  try {
    fs.mkdirSync(UPLOAD_BASE, { recursive: true });
    // Multer storage to disk (fallback for dev)
    storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, UPLOAD_BASE);
      },
      filename: function (req, file, cb) {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + '-' + file.originalname.replace(/\s+/g, '-'));
      }
    });
  } catch (err) {
    console.warn('[fileUpload] Failed to create upload directory, falling back to memory storage:', err.message);
    storage = multer.memoryStorage();
  }
}

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit per file

/**
 * Middleware to accept multiple attachments under the field name `attachments`
 */
exports.uploadAttachments = upload.array('attachments', 10);

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
          // memory uploads without S3 in serverless environment
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
    }

    req.body.attachments = attachments;
    return next();
  } catch (err) {
    console.error('[fileUpload] Error processing attachments:', err.message);
    return res.status(500).json({ status: 'failed', message: 'Failed to process attachments' });
  }
};
