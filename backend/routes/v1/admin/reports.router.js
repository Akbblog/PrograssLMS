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

// All admin reports require auth + admin + viewReports permission
router.use(isLoggedIn, isAdmin, hasPermission('viewReports'));

router.get('/admin/reports/dashboard', getDashboardOverviewController);
router.get('/admin/reports/attendance', getAttendanceReportController);
router.get('/admin/reports/academic', getAcademicReportController);
router.get('/admin/reports/finance', getFinanceReportController);
router.get('/admin/reports/hr', getHRReportController);
router.get('/admin/reports/transport', getTransportReportController);
router.get('/admin/reports/library', getLibraryReportController);

module.exports = router;
