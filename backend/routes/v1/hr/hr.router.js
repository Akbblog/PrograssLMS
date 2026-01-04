const express = require('express');
const staffController = require('../../../controllers/hr/staff.controller');
const leaveController = require('../../../controllers/hr/leave.controller');
const payrollController = require('../../../controllers/hr/payroll.controller');
const appraisalController = require('../../../controllers/hr/appraisal.controller');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');

const router = express.Router();

// Staff
router.get('/staff', isLoggedIn, isAdmin, staffController.listStaff);
router.post('/staff', isLoggedIn, isAdmin, staffController.createStaff);
router.get('/staff/:id', isLoggedIn, isAdmin, staffController.getStaff);
router.put('/staff/:id', isLoggedIn, isAdmin, staffController.updateStaff);

// Leaves
router.get('/leaves', isLoggedIn, isAdmin, leaveController.listLeaves);
router.post('/leaves', isLoggedIn, leaveController.applyLeave);
router.put('/leaves/:id/approve', isLoggedIn, isAdmin, leaveController.approveLeave);
router.put('/leaves/:id/reject', isLoggedIn, isAdmin, leaveController.rejectLeave);
router.get('/leaves/balance/:staffId', isLoggedIn, leaveController.getBalance);

// Payroll
router.get('/payroll', isLoggedIn, isAdmin, payrollController.listPayrolls);
router.post('/payroll/generate', isLoggedIn, isAdmin, payrollController.generatePayroll);
router.post('/payroll/:id/process', isLoggedIn, isAdmin, payrollController.processPayroll);

// Appraisals
router.get('/appraisals', isLoggedIn, isAdmin, appraisalController.listAppraisals);
router.post('/appraisals', isLoggedIn, isAdmin, appraisalController.createAppraisal);
router.put('/appraisals/:id', isLoggedIn, isAdmin, appraisalController.updateAppraisal);

module.exports = router;