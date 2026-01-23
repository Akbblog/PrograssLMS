const express = require('express');
const router = express.Router();

// Import services directly so these routes remain public even if other routers
// accidentally apply auth middleware earlier.
const { superAdminLoginService } = require("../../services/superadmin/auth.service");
const { loginAdminService } = require("../../services/staff/admin.service.prisma_impl");
const { teacherLoginService } = require("../../services/staff/teachers.service.prisma_impl");
const { studentLoginService } = require("../../services/students/students.service.prisma_impl");

// Keep these routes intentionally minimal and public
router.post('/public/superadmin/login', async (req, res) => {
  try { await superAdminLoginService(req.body, res); } catch (e) { res.status(500).json({ success:false, message: e.message }); }
});

router.post('/public/admin/login', async (req, res) => {
  try { await loginAdminService(req.body, res); } catch (e) { res.status(500).json({ success:false, message: e.message }); }
});

router.post('/public/teachers/login', async (req, res) => {
  try { await teacherLoginService(req.body, res); } catch (e) { res.status(500).json({ success:false, message: e.message }); }
});

router.post('/public/students/login', async (req, res) => {
  try { await studentLoginService(req.body, res); } catch (e) { res.status(500).json({ success:false, message: e.message }); }
});

module.exports = router;
