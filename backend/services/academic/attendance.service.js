const Attendance = require("../../models/Academic/attendance.model");
const Student = require("../../models/Students/students.model");
const Admin = require("../../models/Staff/admin.model");
const Teacher = require("../../models/Staff/teachers.model");
const responseStatus = require("../../handlers/responseStatus.handler");
const mongoose = require("mongoose");

/**
 * Mark Attendance Service
 * Creates or updates attendance for a class on a specific date
 */
exports.markAttendanceService = async (data, userId, userRole, res) => {
    const { classLevel, date, records, academicYear, academicTerm } = data;

    // Get user's schoolId
    let schoolId;
    if (userRole === "admin") {
        const admin = await Admin.findById(userId);
        if (!admin) return responseStatus(res, 401, "failed", "User not found");
        schoolId = admin.schoolId;
    } else {
        const teacher = await Teacher.findById(userId);
        if (!teacher) return responseStatus(res, 401, "failed", "User not found");
        schoolId = teacher.schoolId;
    }

    if (!schoolId) {
        return responseStatus(res, 400, "failed", "No school associated with this user");
    }

    // Parse date and set to start of day for consistent querying
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this class and date
    let attendance = await Attendance.findOne({
        schoolId,
        classLevel,
        date: attendanceDate,
    });

    if (attendance) {
        // Update existing attendance
        attendance.records = records;
        attendance.takenBy = userId;
        await attendance.save();

        return responseStatus(res, 200, "success", {
            message: "Attendance updated successfully",
            data: attendance,
        });
    }

    // Create new attendance
    attendance = await Attendance.create({
        schoolId,
        classLevel,
        date: attendanceDate,
        records,
        academicYear,
        academicTerm,
        takenBy: userId,
    });

    return responseStatus(res, 201, "success", {
        message: "Attendance marked successfully",
        data: attendance,
    });
};

/**
 * Get Attendance by Class and Date Service
 */
exports.getAttendanceService = async (classLevel, date, schoolId) => {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
        schoolId,
        classLevel,
        date: attendanceDate,
    })
        .populate("records.student", "name studentId rollNumber section")
        .populate("takenBy", "name")
        .populate("classLevel", "name");

    return attendance;
};

/**
 * Get Attendance History for Class Service
 */
exports.getAttendanceHistoryService = async (classLevel, startDate, endDate, schoolId) => {
    const query = {
        schoolId,
        classLevel,
    };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const attendanceRecords = await Attendance.find(query)
        .populate("takenBy", "name")
        .sort({ date: -1 });

    return attendanceRecords;
};

/**
 * Get Student Attendance Service
 * Get attendance history for a specific student
 */
exports.getStudentAttendanceService = async (studentId, startDate, endDate, schoolId) => {
    const matchStage = {
        schoolId: new mongoose.Types.ObjectId(schoolId),
        "records.student": new mongoose.Types.ObjectId(studentId),
    };

    if (startDate && endDate) {
        matchStage.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const attendanceRecords = await Attendance.aggregate([
        { $match: matchStage },
        { $sort: { date: -1 } },
        {
            $lookup: {
                from: "classlevels", // Ensure this matches your collection name
                localField: "classLevel",
                foreignField: "_id",
                as: "classLevelObj"
            }
        },
        { $unwind: "$classLevelObj" },
        {
            $project: {
                date: 1,
                classLevel: "$classLevelObj.name",
                record: {
                    $filter: {
                        input: "$records",
                        as: "r",
                        cond: { $eq: ["$$r.student", new mongoose.Types.ObjectId(studentId)] }
                    }
                }
            }
        },
        { $unwind: "$record" },
        {
            $project: {
                date: 1,
                classLevel: 1,
                status: "$record.status",
                remarks: "$record.remarks"
            }
        }
    ]);

    return attendanceRecords;
};

/**
 * Get Attendance Summary Service
 * Returns attendance statistics for a class
 */
exports.getAttendanceSummaryService = async (classLevel, startDate, endDate, schoolId) => {
    const query = {
        schoolId,
        classLevel,
    };

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

    attendanceRecords.forEach(record => {
        record.records.forEach(r => {
            if (r.status === "present") totalPresent++;
            else if (r.status === "absent") totalAbsent++;
            else if (r.status === "late") totalLate++;
        });
    });

    const totalRecords = totalPresent + totalAbsent + totalLate;
    const attendanceRate = totalRecords > 0
        ? Math.round((totalPresent / totalRecords) * 100)
        : 0;

    return {
        totalDays,
        totalPresent,
        totalAbsent,
        totalLate,
        attendanceRate,
    };
};

/**
 * Delete Attendance Service
 */
exports.deleteAttendanceService = async (attendanceId, schoolId, res) => {
    const attendance = await Attendance.findOneAndDelete({
        _id: attendanceId,
        schoolId,
    });

    if (!attendance) {
        return responseStatus(res, 404, "failed", "Attendance record not found");
    }

    return responseStatus(res, 200, "success", { message: "Attendance deleted successfully" });
};

/**
 * Get Students for Attendance Service
 * Returns list of students in a class for marking attendance
 */
exports.getStudentsForAttendanceService = async (classLevel, schoolId) => {
    const students = await Student.find({
        schoolId,
        $or: [
            { currentClassLevel: classLevel },
            { currentClassLevels: classLevel },
        ],
        enrollmentStatus: "active",
        isWithdrawn: false,
    })
        .select("name studentId rollNumber section avatar")
        .sort({ rollNumber: 1, name: 1 });

    return students;
};
