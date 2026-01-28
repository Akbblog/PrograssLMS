const express = require('express');

const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const { hasPermission } = require('../../../middlewares/permissions');

const {
  getDashboardOverviewController,
  getAttendanceReportController,
  getAcademicReportController,
  getFinanceReportController,
  getHRReportController,
  getTransportReportController,
  getLibraryReportController,
} = require('../../../controllers/reports.controller');

const router = express.Router();

// Each route has its own middleware chain to prevent global blocking
router.get('/admin/reports/dashboard', isLoggedIn, isAdmin, hasPermission('viewReports'), getDashboardOverviewController);
router.get('/admin/reports/attendance', isLoggedIn, isAdmin, hasPermission('viewReports'), getAttendanceReportController);
router.get('/admin/reports/academic', isLoggedIn, isAdmin, hasPermission('viewReports'), getAcademicReportController);
router.get('/admin/reports/finance', isLoggedIn, isAdmin, hasPermission('viewReports'), getFinanceReportController);
router.get('/admin/reports/hr', isLoggedIn, isAdmin, hasPermission('viewReports'), getHRReportController);
router.get('/admin/reports/transport', isLoggedIn, isAdmin, hasPermission('viewReports'), getTransportReportController);
router.get('/admin/reports/library', isLoggedIn, isAdmin, hasPermission('viewReports'), getLibraryReportController);

module.exports = router;
