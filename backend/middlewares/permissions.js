const responseStatus = require("../handlers/responseStatus.handler");
const Admin = require("../models/Staff/admin.model");

// permissionName is a key under admin.permissions object
const hasPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
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
