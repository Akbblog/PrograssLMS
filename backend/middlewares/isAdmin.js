const responseStatus = require("../handlers/responseStatus.handler.js");
const Admin = require("../models/Staff/admin.model");

const isAdmin = async (req, res, next) => {
  try {
    const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
    // In Prisma mode we don't have a Mongoose connection; rely on the signed token role.
    if (usePrisma) {
      if (req.userRole === 'admin' || req.userRole === 'super_admin') return next();
      return responseStatus(res, 403, 'failed', 'Access Denied. admin only route!');
    }

    // allow super_admin to access admin routes
    if (req.userRole === "super_admin") return next();

    const userId = req.userId || req.userAuth?._id;
    if (!userId) {
      console.log("❌ isAdmin failed: No userId found in request");
      return responseStatus(res, 401, "failed", "Unauthorized");
    }

    const admin = await Admin.findById(userId);
    if (!admin) {
      console.log("❌ isAdmin failed: Admin not found in DB (Stale Token?)", userId);
      return responseStatus(res, 401, "failed", "Unauthorized: User not found");
    }

    if (admin.role === "admin" || admin.role === "super_admin") {
      return next();
    }

    return responseStatus(res, 403, "failed", "Access Denied. admin only route!");
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};
module.exports = isAdmin;
