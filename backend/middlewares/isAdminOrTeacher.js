const responseStatus = require("../handlers/responseStatus.handler");
const Admin = require("../models/Staff/admin.model");
const Teacher = require("../models/Staff/teachers.model");

const isAdminOrTeacher = async (req, res, next) => {
    try {
        // allow super_admin to pass
        if (req.userRole === "super_admin") return next();

        const userId = req.userId || req.userAuth?._id;
        if (!userId) return responseStatus(res, 401, "failed", "Unauthorized");

        // Optimization: Check role from token first to decide which DB to query
        if (req.userRole === "admin") {
            const admin = await Admin.findById(userId);
            if (admin && (admin.role === "admin" || admin.role === "super_admin")) return next();
        }
        else if (req.userRole === "teacher") {
            const teacher = await Teacher.findById(userId);
            if (teacher && teacher.role === "teacher") return next();
        }
        else {
            // If role in token is unknown or missing, try both (fallback)
            const adminPromise = Admin.findById(userId);
            const teacherPromise = Teacher.findById(userId);

            const [admin, teacher] = await Promise.all([adminPromise, teacherPromise]);

            if (admin && (admin.role === "admin" || admin.role === "super_admin")) return next();
            if (teacher && teacher.role === "teacher") return next();
        }

        return responseStatus(res, 401, "failed", "Unauthorized: User not found/Invalid Role");
    } catch (error) {
        return responseStatus(res, 500, "failed", error.message);
    }
};

module.exports = isAdminOrTeacher;
