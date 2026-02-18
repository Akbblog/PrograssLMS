const express = require('express');
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const uploadsController = require('../../controllers/uploads.controller');

const router = express.Router();

// Setup multer storage to uploads folder
const uploadsDir = path.join(__dirname, '..', '..', '..', 'uploads');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = crypto.randomBytes(8).toString('hex') + ext;
    cb(null, name);
  }
});

const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

router.post('/', upload.single('file'), uploadsController.uploadFile);

module.exports = router;
const express = require('express');
const { uploadSingle } = require('../../middlewares/fileUpload');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const isAdmin = require('../../middlewares/isAdmin');
const { uploadFileController } = require('../../controllers/uploads.controller');

const router = express.Router();

router.post('/uploads', isLoggedIn, isAdmin, uploadSingle('file'), uploadFileController);

module.exports = router;
