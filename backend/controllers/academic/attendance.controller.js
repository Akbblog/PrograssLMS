const responseStatus = require("../../handlers/responseStatus.handler.js");

// Check if Prisma mode is enabled
const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';

// Conditionally load models/services based on USE_PRISMA
let Attendance, Student, Admin, Teacher, prismaService;

if (usePrisma) {
    // Use Prisma service implementations
    prismaService = require("../../services/academic/attendance.service.prisma_impl");
} else {
    // Use Mongoose models
    Attendance = require("../../models/Academic/Attendance.model");
    Student = require("../../models/Students/students.model");
    Admin = require("../../models/Staff/admin.model");
    Teacher = require("../../models/Staff/teachers.model");
}

/**
 * Helper to get schoolId from user (Mongoose mode)
 */
const getSchoolId = async (userId, userRole) => {
    if (usePrisma) {
        // Prisma service handles schoolId resolution internally
        return null;
    }
    if (userRole === "admin") {
        const admin = await Admin.findById(userId);
        return admin?.schoolId;
    }
    const teacher = await Teacher.findById(userId);
    return teacher?.schoolId;
};

/**
 * @desc Mark Attendance
 * @route POST /api/v1/attendance
 * @access Private (Admin/Teacher)
 */
exports.markAttendance = async (req, res) => {
    try {
        if (usePrisma) {
            return await prismaService.markAttendanceService(
                req.body, 
                req.userAuth?.id || req.userAuth?._id, 
                req.userAuth?.role || "admin", 
                res
            );
        }
        
        const { classLevel, academicYear, academicTerm, date, records } = req.body;

        // Get schoolId from authenticated user
        const schoolId = req.schoolId || await getSchoolId(req.userAuth?._id, req.userAuth?.role || "admin");
        const takenBy = req.userAuth?._id;

        if (!schoolId) {
            return responseStatus(res, 400, "failed", "No school associated with this user");
        }

        // Normalize date to start of day
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Check if attendance already exists
        let attendance = await Attendance.findOne({
            schoolId,
            classLevel,
            date: attendanceDate,
        });

        if (attendance) {
            // Update existing
            attendance.records = records;
            attendance.takenBy = takenBy;
            await attendance.save();
        } else {
            // Create new
            attendance = await Attendance.create({
                schoolId,
                classLevel,
                academicYear,
                academicTerm,
                date: attendanceDate,
                records,
                takenBy,
            });
        }

        responseStatus(res, 200, "success", {
            message: "Attendance marked successfully",
            data: attendance,
        });
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Attendance by Class and Date
 * @route GET /api/v1/attendance
 * @access Private
 */
exports.getAttendance = async (req, res) => {
    try {
        const { classLevel, date } = req.query;

        if (!classLevel) {
            return responseStatus(res, 400, "failed", "classLevel is required");
        }

        if (usePrisma) {
            const schoolId = req.schoolId || 'SCHOOL-IMPORT-1';
            const attendance = await prismaService.getAttendanceService(classLevel, date, schoolId);
            return responseStatus(res, 200, "success", attendance);
        }

        const schoolId = req.schoolId || await getSchoolId(req.userAuth?._id, req.userAuth?.role || "admin");

        // If date provided, get attendance for that date
        // Otherwise return null (no pre-existing attendance)
        if (date) {
            const attendanceDate = new Date(date);
            attendanceDate.setHours(0, 0, 0, 0);

            const attendance = await Attendance.findOne({
                schoolId,
                classLevel,
                date: attendanceDate,
            }).populate("records.student", "name studentId rollNumber section");

            responseStatus(res, 200, "success", attendance);
        } else {
            responseStatus(res, 200, "success", null);
        }
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Students for Attendance Marking
 * @route GET /api/v1/attendance/students/:classLevel
 * @access Private
 */
exports.getStudentsForAttendance = async (req, res) => {
    try {
        const { classLevel } = req.params;

        if (usePrisma) {
            const schoolId = req.schoolId || 'SCHOOL-IMPORT-1';
            const students = await prismaService.getStudentsForAttendanceService(classLevel, schoolId);
            return responseStatus(res, 200, "success", students);
        }

        const schoolId = req.schoolId || await getSchoolId(req.userAuth?._id, req.userAuth?.role || "admin");

        const students = await Student.find({
            schoolId,
            $or: [
                { currentClassLevel: classLevel },
                { currentClassLevels: classLevel },
            ],
            isWithdrawn: false,
        })
            .select("name studentId rollNumber section avatar")
            .sort({ rollNumber: 1, name: 1 });

        responseStatus(res, 200, "success", students);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Attendance History for Class
 * @route GET /api/v1/attendance/history/:classLevel
 * @access Private
 */
exports.getAttendanceHistory = async (req, res) => {
    try {
        const { classLevel } = req.params;
        const { startDate, endDate } = req.query;

        if (usePrisma) {
            const schoolId = req.schoolId || 'SCHOOL-IMPORT-1';
            const history = await prismaService.getAttendanceHistoryService(classLevel, startDate, endDate, schoolId);
            return responseStatus(res, 200, "success", history);
        }

        const schoolId = req.schoolId || await getSchoolId(req.userAuth?._id, req.userAuth?.role || "admin");

        const query = { schoolId, classLevel };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const attendanceRecords = await Attendance.find(query)
            .populate("takenBy", "name")
            .sort({ date: -1 });

        responseStatus(res, 200, "success", attendanceRecords);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Student Attendance
 * @route GET /api/v1/attendance/student/:studentId
 * @access Private
 */
exports.getStudentAttendance = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { startDate, endDate } = req.query;

        if (usePrisma) {
            const schoolId = req.schoolId || 'SCHOOL-IMPORT-1';
            const attendance = await prismaService.getStudentAttendanceService(studentId, startDate, endDate, schoolId);
            return responseStatus(res, 200, "success", attendance);
        }

        const schoolId = req.schoolId || await getSchoolId(req.userAuth?._id, req.userAuth?.role || "admin");

        const attendance = await Attendance.find({
            schoolId,
            "records.student": studentId,
        })
            .populate("classLevel", "name")
            .select("date classLevel records.$")
            .sort({ date: -1 });

        // Transform data
        const formattedAttendance = attendance.map((record) => ({
            date: record.date,
            classLevel: record.classLevel,
            status: record.records[0]?.status || "absent",
            remarks: record.records[0]?.remarks || "",
        }));

        responseStatus(res, 200, "success", formattedAttendance);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Attendance Summary
 * @route GET /api/v1/attendance/summary/:classLevel
 * @access Private
 */
exports.getAttendanceSummary = async (req, res) => {
    try {
        const { classLevel } = req.params;
        const { startDate, endDate } = req.query;

        if (usePrisma) {
            const schoolId = req.schoolId || 'SCHOOL-IMPORT-1';
            const summary = await prismaService.getAttendanceSummaryService(classLevel, startDate, endDate, schoolId);
            return responseStatus(res, 200, "success", summary);
        }

        const schoolId = req.schoolId || await getSchoolId(req.userAuth?._id, req.userAuth?.role || "admin");

        const query = { schoolId, classLevel };

        if (startDate && endDate) {
            query.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            };
        }

        const attendanceRecords = await Attendance.find(query);

        // Calculate summary
        let totalDays = attendanceRecords.length;
        let totalPresent = 0;
        let totalAbsent = 0;
        let totalLate = 0;
        let totalExcused = 0;

        attendanceRecords.forEach(record => {
            record.records.forEach(r => {
                if (r.status === "present") totalPresent++;
                else if (r.status === "absent") totalAbsent++;
                else if (r.status === "late") totalLate++;
                else if (r.status === "excused") totalExcused++;
            });
        });

        const totalRecords = totalPresent + totalAbsent + totalLate + totalExcused;
        const attendanceRate = totalRecords > 0
            ? Math.round(((totalPresent + totalLate) / totalRecords) * 100)
            : 0;

        responseStatus(res, 200, "success", {
            totalDays,
            totalPresent,
            totalAbsent,
            totalLate,
            totalExcused,
            attendanceRate,
        });
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};
