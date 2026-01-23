const express = require('express');
const router = express.Router();

// Import services directly so these routes remain public even if other routers
// accidentally apply auth middleware earlier.
const { superAdminLoginService } = require("../../services/superadmin/auth.service");
const { loginAdminService } = require("../../services/staff/admin.service.prisma_impl");
const { teacherLoginService } = require("../../services/staff/teachers.service.prisma_impl");
const { studentLoginService } = require("../../services/students/students.service.prisma_impl");

// Keep these routes intentionally minimal and public
// Public endpoints (both /public/* and the original paths) so frontend can use existing URLs
const handlers = [
  { path: '/public/superadmin/login', orig: '/superadmin/login', fn: superAdminLoginService },
  { path: '/public/admin/login', orig: '/admin/login', fn: loginAdminService },
  { path: '/public/teachers/login', orig: '/teachers/login', fn: teacherLoginService },
  { path: '/public/students/login', orig: '/students/login', fn: studentLoginService },
];

for (const h of handlers) {
  router.post(h.path, async (req, res) => {
    try { await h.fn(req.body, res); } catch (e) { res.status(500).json({ success:false, message: e.message }); }
  });
  // also register the original path so existing frontend calls continue to work
  router.post(h.orig, async (req, res) => {
    try { await h.fn(req.body, res); } catch (e) { res.status(500).json({ success:false, message: e.message }); }
  });
}

module.exports = router;
