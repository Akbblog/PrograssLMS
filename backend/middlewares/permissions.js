const responseStatus = require("../handlers/responseStatus.handler.js");
const Admin = require("../models/Staff/admin.model");

// permissionName is a key under admin.permissions object
const hasPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
      // Prisma schema does not yet include an Admin.permissions field.
      // In Prisma mode, authorize based on role (JWT is signed), otherwise many admin routes 500.
      if (usePrisma) {
        if (req.userRole === 'admin' || req.userRole === 'super_admin') return next();
        return responseStatus(res, 403, 'failed', 'Insufficient permissions');
      }

      // super_admin bypass
      if (req.userRole === "super_admin") return next();

      const userId = req.userId || req.userAuth?._id;
      if (!userId) return responseStatus(res, 401, "failed", "Unauthorized");

      const admin = await Admin.findById(userId).select("permissions role");
      if (!admin) return responseStatus(res, 403, "failed", "Access denied");

      if (admin.role === "super_admin") return next();

      const perms = admin.permissions || {};
      if (perms[permissionName]) return next();

      return responseStatus(res, 403, "failed", "Insufficient permissions");
    } catch (error) {
      return responseStatus(res, 500, "failed", error.message);
    }
  };
};

module.exports = { hasPermission };
