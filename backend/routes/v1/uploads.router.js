const express = require('express');
const { uploadSingle } = require('../../middlewares/fileUpload');
const isLoggedIn = require('../../middlewares/isLoggedIn');
const isAdmin = require('../../middlewares/isAdmin');
const { uploadFileController } = require('../../controllers/uploads.controller');

const router = express.Router();

router.post('/uploads', isLoggedIn, isAdmin, uploadSingle('file'), uploadFileController);

module.exports = router;
