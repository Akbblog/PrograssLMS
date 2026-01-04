const express = require('express');
const docController = require('../../../controllers/documents/documents.controller');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');

const router = express.Router();

router.get('/templates', isLoggedIn, docController.listTemplates);
router.post('/templates', isLoggedIn, isAdmin, docController.createTemplate);
router.put('/templates/:id', isLoggedIn, isAdmin, docController.updateTemplate);

router.post('/generate/fee-voucher/:studentId', isLoggedIn, isAdmin, docController.generateFeeVoucher);
router.get('/download/:documentId', isLoggedIn, docController.downloadDocument);

module.exports = router;