const responseStatus = require("../handlers/responseStatus.handler.js");

const isStudent = async (req, res, next) => {
  try {
    const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
    // In Prisma mode we don't have a Mongoose connection; rely on the signed token role.
    if (usePrisma) {
      if (req.userRole === 'student') return next();
      return responseStatus(res, 403, 'failed', 'Access Denied. students only route!');
    }

    const Student = require("../models/Students/students.model");
    const userId = req.userId || req.userAuth?._id || req.userAuth?.id;
    if (!userId) return responseStatus(res, 401, "failed", "Unauthorized");

    const student = await Student.findById(userId);
    if (student && student.role === "student") return next();

    return responseStatus(res, 403, "failed", "Access Denied. students only route!");
  } catch (error) {
    return responseStatus(res, 500, "failed", error.message);
  }
};

module.exports = isStudent;
