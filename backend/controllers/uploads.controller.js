const path = require('path');
const fs = require('fs');

const ensureUploadsDir = () => {
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  return uploadsDir;
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ status: 'fail', message: 'No file provided' });
    const uploadsDir = ensureUploadsDir();
    // file is already saved by multer middleware; construct accessible URL
    const fileName = req.file.filename;

    // Prefer public API base if configured
    let baseUrl = null;
    if (process.env.NEXT_PUBLIC_API_URL) {
      baseUrl = String(process.env.NEXT_PUBLIC_API_URL).replace(/\/$/, '');
      // if NEXT_PUBLIC_API_URL points to /api/v1, strip trailing /api/v1
      baseUrl = baseUrl.replace(/\/api\/?v?1\/?$/i, '');
    }

    const relativePath = `/uploads/${fileName}`;
    const url = baseUrl ? `${baseUrl}${relativePath}` : `${req.protocol}://${req.get('host')}${relativePath}`;

    return res.status(201).json({ status: 'success', data: { url, name: req.file.originalname, type: req.file.mimetype } });
  } catch (err) {
    return res.status(500).json({ status: 'fail', message: err.message });
  }
};
const { processAttachments } = require('../middlewares/fileUpload');

exports.uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    req.files = [req.file];
    await processAttachments(req, res, async () => {});

    const attachments = req.body.attachments || [];
    const uploaded = attachments[0];
    if (!uploaded || !uploaded.url) {
      return res.status(500).json({
        status: 'fail',
        message: uploaded?.note || 'Upload failed. Configure local uploads or S3 storage.',
      });
    }

    return res.status(201).json({
      url: uploaded.url,
      name: uploaded.name || req.file.originalname,
      type: uploaded.mimeType || uploaded.type || req.file.mimetype || 'application/octet-stream',
    });
  } catch (err) {
    return res.status(500).json({ status: 'fail', message: err.message || 'Upload failed' });
  }
};
