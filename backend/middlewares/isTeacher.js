const responseStatus = require("../handlers/responseStatus.handler.js");
const Teacher = require("../models/Staff/teachers.model");

const isTeacher = async (req, res, next) => {
  try {
    const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
    // In Prisma mode we don't have a Mongoose connection; rely on the signed token role.
    if (usePrisma) {
      if (req.userRole === 'teacher' || req.userRole === 'super_admin') return next();
      return responseStatus(res, 403, 'failed', 'Access Denied. teachers only route!');
    }

    // allow super_admin to pass
    if (req.userRole === "super_admin") return next();

    const userId = req.userId || req.userAuth?._id;
    if (!userId) return responseStatus(res, 401, "failed", "Unauthorized");

    const teacher = await Teacher.findById(userId);
    if (teacher && teacher.role === "teacher") return next();

    return responseStatus(res, 403, "failed", "Access Denied. teachers only route!");
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};
module.exports = isTeacher;
