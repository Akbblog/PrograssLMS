const responseStatus = require("../handlers/responseStatus.handler.js");
const Teacher = require("../models/Staff/teachers.model");

const isTeacher = async (req, res, next) => {
  try {
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
