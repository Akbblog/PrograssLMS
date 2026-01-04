const express = require('express');
const attendanceController = require('../../../controllers/attendance/attendance.controller');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const isAdminOrTeacher = require('../../../middlewares/isAdminOrTeacher');

const router = express.Router();

// QR Scan (public devices will send data; device should include token or use server auth)
router.post('/qr/scan', attendanceController.scanQRCode);
router.post('/qr/generate/:studentId', isLoggedIn, isAdminOrTeacher, attendanceController.generateQRCode);
router.post('/qr/generate-bulk', isLoggedIn, isAdmin, attendanceController.generateBulk);
router.get('/qr/download/:id', isLoggedIn, attendanceController.downloadQRCode);

// Devices
router.get('/devices', isLoggedIn, isAdminOrTeacher, attendanceController.listDevices);
router.post('/devices', isLoggedIn, isAdmin, attendanceController.registerDevice);

// Stats
router.get('/live-stats', isLoggedIn, attendanceController.liveStats);
router.get('/recent-scans', isLoggedIn, attendanceController.recentScans);

module.exports = router;