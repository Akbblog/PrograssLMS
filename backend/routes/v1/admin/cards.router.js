const express = require('express');
const router = express.Router();
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const { hasPermission } = require('../../../middlewares/permissions');


const { bulkDownloadCardsController, pregenerateCardsController, getJobStatusController, downloadJobArtifactController } = require('../../../controllers/admin/cards.controller');

// POST /api/v1/admin/cards/bulk-download (streaming)
router.post('/admin/cards/bulk-download', isLoggedIn, isAdmin, hasPermission('manageStudents'), bulkDownloadCardsController);

// POST /api/v1/admin/cards/pre-generate (create background job to generate and store ZIP)
router.post('/admin/cards/pre-generate', isLoggedIn, isAdmin, hasPermission('manageStudents'), pregenerateCardsController);

// GET /api/v1/admin/cards/jobs/:jobId/status
router.get('/admin/cards/jobs/:jobId/status', isLoggedIn, isAdmin, hasPermission('manageStudents'), getJobStatusController);

// GET /api/v1/admin/cards/jobs/:jobId/download
router.get('/admin/cards/jobs/:jobId/download', isLoggedIn, isAdmin, hasPermission('manageStudents'), downloadJobArtifactController);

module.exports = router;
