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
