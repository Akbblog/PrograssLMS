const express = require('express');
const multer = require('multer');
const upload = multer();
const migrationController = require('../../../controllers/migration/migration.controller');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');

const router = express.Router();

router.post('/upload', isLoggedIn, isAdmin, upload.single('file'), migrationController.upload);
router.post('/validate', isLoggedIn, migrationController.validate);
router.post('/execute', isLoggedIn, migrationController.execute);
router.get('/status/:migrationId', isLoggedIn, migrationController.status);
router.get('/logs', isLoggedIn, isAdmin, migrationController.logs);
router.post('/rollback/:id', isLoggedIn, isAdmin, migrationController.rollback);

// Template endpoints
router.get('/templates', isLoggedIn, isAdmin, async (req, res) => { const MigrationTemplate = require('../../../models/Migration/MigrationTemplate.model'); const list = await MigrationTemplate.find({ schoolId: req.user?.schoolId || req.schoolId }); res.json({ status: 'success', data: list }); });
router.post('/templates', isLoggedIn, isAdmin, async (req, res) => { const MigrationTemplate = require('../../../models/Migration/MigrationTemplate.model'); const payload = { ...req.body, schoolId: req.user?.schoolId || req.schoolId }; const t = await MigrationTemplate.create(payload); res.json({ status: 'success', data: t }); });

module.exports = router;