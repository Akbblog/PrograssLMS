const responseStatus = require('../../handlers/responseStatus.handler');
const qrGenerator = require('../../services/qrcode/qrGenerator.service');
const documentGenerator = require('../../services/documentGenerator');
const { resolveAvatarToBase64 } = require('../../services/cardAvatarHelper');

let CardTemplate;
try { CardTemplate = require('../../models/Documents/CardTemplate.model'); } catch (e) { CardTemplate = null; }

async function fetchSchoolById(schoolId) {
  if (!schoolId) return {};
  try {
    const School = require('../../models/School.model');
    return await School.findById(schoolId).lean() || {};
  } catch (e) {
    return {};
  }
}

async function fetchStudentById(id) {
  if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const s = await prisma.student.findUnique({ where: { id } });
    await prisma.$disconnect();
    return s;
  }
  const Student = require('../../models/Students/students.model');
  return Student.findById(id)
    .populate('currentClassLevel', 'name')
    .lean();
}

async function fetchTeacherById(id) {
  if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const t = await prisma.teacher.findUnique({ where: { id } });
    await prisma.$disconnect();
    return t;
  }
  const Teacher = require('../../models/Staff/teachers.model');
  return Teacher.findById(id).lean();
}

/**
 * Get the active card template for a school and entity type.
 */
async function getActiveTemplate(schoolId, entityType) {
  if (!CardTemplate || !schoolId) return null;
  try {
    return await CardTemplate.findOne({ schoolId, entityType, isActive: true }).lean();
  } catch (e) {
    return null;
  }
}

/**
 * Generate a single card PDF for a student or staff member.
 */
async function generateSingleCard(entity, type, schoolId) {
  const entityType = type === 'students' ? 'student' : 'teacher';
  const entityId = entity.id || entity._id;

  // Resolve avatar to base64 for PDF
  const avatarBase64 = await resolveAvatarToBase64(entity.avatar);
  if (avatarBase64) entity.avatar = avatarBase64;

  // Fetch school info
  const school = await fetchSchoolById(schoolId || entity.schoolId);

  // Get active template
  const template = await getActiveTemplate(schoolId || entity.schoolId, entityType);

  // Generate enriched QR code
  const qr = await qrGenerator.generateQRCodeImage({
    id: String(entityId),
    type: entityType,
    schoolId: String(schoolId || entity.schoolId || ''),
    templateVersion: template?.version || 1,
  });

  // Generate PDF
  if (type === 'students') {
    return documentGenerator.generateStudentCard({
      student: entity,
      qrDataUrl: qr.dataUrl,
      school,
      template,
    });
  } else {
    return documentGenerator.generateStaffCard({
      staff: entity,
      qrDataUrl: qr.dataUrl,
      school,
      template,
    });
  }
}

exports.bulkDownloadCardsController = async (req, res) => {
  try {
    const { ids = [], type = 'students' } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) return responseStatus(res, 400, 'failed', 'No ids provided');

    const schoolId = req.userAuth?.schoolId;

    // Stream a ZIP to the client
    const archiver = require('archiver');
    res.attachment(`cards-${type}-${Date.now()}.zip`);
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', err => { throw err; });
    archive.pipe(res);

    for (const id of ids) {
      let entity = null;
      if (type === 'students') entity = await fetchStudentById(id);
      else entity = await fetchTeacherById(id);
      if (!entity) continue;

      const pdfBuffer = await generateSingleCard(entity, type, schoolId);
      const filename = `${type === 'students' ? 'student' : 'staff'}-${id}-card.pdf`;
      archive.append(pdfBuffer, { name: filename });
    }

    await archive.finalize();
  } catch (error) {
    console.error('bulkDownloadCardsController error:', error);
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// Simple file-based job store (persisted per-job json) for pre-generation
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
const pregDir = path.join(uploadsDir, 'pregenerated');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(pregDir)) fs.mkdirSync(pregDir, { recursive: true });

function writeJobFile(jobId, data) {
  const file = path.join(pregDir, `${jobId}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function readJobFile(jobId) {
  const file = path.join(pregDir, `${jobId}.json`);
  if (!fs.existsSync(file)) return null;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { return null; }
}

async function uploadToFTPIfConfigured(localPath, remoteName) {
  if (!process.env.FTP_HOST || !process.env.FTP_USER || !process.env.FTP_PASSWORD) {
    console.log('FTP not configured, skipping upload');
    return null;
  }
  try {
    const Client = require('basic-ftp');
    const client = new Client.Client();
    const port = process.env.FTP_PORT ? parseInt(process.env.FTP_PORT, 10) : 21;
    await client.access({ host: process.env.FTP_HOST, port, user: process.env.FTP_USER, password: process.env.FTP_PASSWORD, secure: false });
    const remoteFolder = process.env.FTP_FOLDER || '/public_html';
    const ensurePath = remoteFolder.replace(/^\/+/, '');
    await client.ensureDir(ensurePath);
    const remotePath = `${ensurePath.replace(/\/$/, '')}/${remoteName}`;
    await client.uploadFrom(localPath, remotePath);
    await client.close();
    if (process.env.FTP_PUBLIC_BASE) {
      const base = process.env.FTP_PUBLIC_BASE.replace(/\/$/, '');
      return `${base}/${remotePath}`;
    }
    return `ftp://${process.env.FTP_HOST}/${remotePath}`;
  } catch (e) {
    console.error('FTP upload failed', e);
    return null;
  }
}

// POST create job to pregenerate ZIP and return jobId
exports.pregenerateCardsController = async (req, res) => {
  try {
    const { ids = [], type = 'students' } = req.body || {};
    if (!Array.isArray(ids) || ids.length === 0) return responseStatus(res, 400, 'failed', 'No ids provided');
    const schoolId = req.userAuth?.schoolId;
    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2,6)}`;
    const jobFile = { id: jobId, status: 'queued', createdAt: new Date().toISOString(), type, ids, total: ids.length, completed: 0, output: null };
    writeJobFile(jobId, jobFile);

    // Start async generation (fire-and-forget)
    (async () => {
      try {
        const zipPath = path.join(pregDir, `${jobId}.zip`);
        const outputStream = fs.createWriteStream(zipPath);
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.on('error', err => { throw err; });
        archive.pipe(outputStream);

        let completedCount = 0;
        for (const id of ids) {
          let entity = null;
          if (type === 'students') entity = await fetchStudentById(id);
          else entity = await fetchTeacherById(id);
          if (!entity) continue;

          const pdfBuffer = await generateSingleCard(entity, type, schoolId);
          const filename = `${type === 'students' ? 'student' : 'staff'}-${id}-card.pdf`;
          archive.append(pdfBuffer, { name: filename });

          completedCount++;
          // Update progress
          writeJobFile(jobId, { ...jobFile, status: 'processing', completed: completedCount });
        }

        await archive.finalize();

        const remoteUrl = await uploadToFTPIfConfigured(zipPath, `${jobId}.zip`);
        let output;
        if (remoteUrl) {
          try { fs.unlinkSync(zipPath); } catch (e) { /* ignore */ }
          output = { remoteUrl };
        } else {
          output = { path: zipPath };
        }

        const done = { id: jobId, status: 'completed', createdAt: jobFile.createdAt, completedAt: new Date().toISOString(), type, ids, total: ids.length, completed: completedCount, output };
        writeJobFile(jobId, done);
      } catch (e) {
        const fail = { id: jobId, status: 'failed', createdAt: jobFile.createdAt, error: e.message };
        writeJobFile(jobId, fail);
        console.error('Pre-generation job failed', e);
      }
    })();

    return responseStatus(res, 200, 'success', { jobId });
  } catch (error) {
    console.error('pregenerateCardsController error', error);
    return responseStatus(res, 500, 'failed', error.message);
  }
};

// GET job status
exports.getJobStatusController = async (req, res) => {
  const jobId = req.params.jobId;
  const job = readJobFile(jobId);
  if (!job) return responseStatus(res, 404, 'failed', 'Job not found');
  return responseStatus(res, 200, 'success', job);
};

// GET download job artifact
exports.downloadJobArtifactController = async (req, res) => {
  const jobId = req.params.jobId;
  const job = readJobFile(jobId);
  if (!job) return responseStatus(res, 404, 'failed', 'Job not found');
  if (job.status !== 'completed' || !job.output) return responseStatus(res, 400, 'failed', 'Job not ready');
  if (job.output.remoteUrl) {
    return responseStatus(res, 200, 'success', { remoteUrl: job.output.remoteUrl });
  }
  if (!job.output.path) return responseStatus(res, 404, 'failed', 'File not found');
  const filePath = job.output.path;
  if (!fs.existsSync(filePath)) return responseStatus(res, 404, 'failed', 'File not found');
  return res.download(filePath);
};
