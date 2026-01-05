const TeacherAttendance = require("../../models/Academic/TeacherAttendance.model");
const Teacher = require("../../models/Staff/teachers.model");
const Admin = require("../../models/Staff/admin.model");
const responseStatus = require("../../handlers/responseStatus.handler.js");

/**
 * Mark Teacher Attendance Service
 * Creates or updates teacher attendance for a specific date
 */
exports.markTeacherAttendanceService = async (data, userId, res) => {
    const { date, records } = data;

    // Get admin's schoolId
    const admin = await Admin.findById(userId);
    if (!admin) return responseStatus(res, 401, "failed", "User not found");
    const schoolId = admin.schoolId;

    if (!schoolId) {
        return responseStatus(res, 400, "failed", "No school associated with this user");
    }

    // Parse date and set to start of day
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if attendance already exists for this date
    let attendance = await TeacherAttendance.findOne({
        schoolId,
        date: attendanceDate,
    });

    if (attendance) {
        // Update existing attendance
        attendance.records = records;
        attendance.takenBy = userId;
        await attendance.save();

        return responseStatus(res, 200, "success", {
            message: "Teacher attendance updated successfully",
            data: attendance,
        });
    }

    // Create new attendance
    attendance = await TeacherAttendance.create({
        schoolId,
        date: attendanceDate,
        records,
        takenBy: userId,
    });

    return responseStatus(res, 201, "success", {
        message: "Teacher attendance marked successfully",
        data: attendance,
    });
};

/**
 * Get Teacher Attendance by Date Service
 */
exports.getTeacherAttendanceService = async (date, schoolId) => {
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendance = await TeacherAttendance.findOne({
        schoolId,
        date: attendanceDate,
    })
        .populate("records.teacher", "name email teacherId subject")
        .populate("takenBy", "name");

    return attendance;
};

/**
 * Get All Teachers for Attendance Service
 */
exports.getTeachersForAttendanceService = async (schoolId) => {
    const teachers = await Teacher.find({
        schoolId,
        isWithdrawn: false,
    })
        .select("name email teacherId subject avatar")
        .populate("subject", "name")
        .sort({ name: 1 });

    return teachers;
};

/**
 * Get Teacher Attendance History Service
 */
exports.getTeacherAttendanceHistoryService = async (startDate, endDate, schoolId) => {
    const query = { schoolId };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const attendanceRecords = await TeacherAttendance.find(query)
        .populate("takenBy", "name")
        .sort({ date: -1 });

    return attendanceRecords;
};

/**
 * Get Individual Teacher Attendance Service
 */
exports.getIndividualTeacherAttendanceService = async (teacherId, startDate, endDate, schoolId) => {
    const query = {
        schoolId,
        "records.teacher": teacherId,
    };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const attendanceRecords = await TeacherAttendance.find(query).sort({ date: -1 });

    // Extract teacher's attendance from records
    const teacherAttendance = attendanceRecords.map(record => {
        const teacherRecord = record.records.find(
            r => r.teacher.toString() === teacherId
        );
        return {
            date: record.date,
            status: teacherRecord?.status || "absent",
            checkInTime: teacherRecord?.checkInTime || "",
            checkOutTime: teacherRecord?.checkOutTime || "",
            remarks: teacherRecord?.remarks || "",
        };
    });

    return teacherAttendance;
};

/**
 * Get Teacher Attendance Summary Service
 */
exports.getTeacherAttendanceSummaryService = async (startDate, endDate, schoolId) => {
    const query = { schoolId };

    if (startDate && endDate) {
        query.date = {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
        };
    }

    const attendanceRecords = await TeacherAttendance.find(query);

    // Calculate summary
    let totalDays = attendanceRecords.length;
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let totalLeave = 0;

    attendanceRecords.forEach(record => {
        record.records.forEach(r => {
            if (r.status === "present") totalPresent++;
            else if (r.status === "absent") totalAbsent++;
            else if (r.status === "late") totalLate++;
            else if (r.status === "leave") totalLeave++;
        });
    });

    const totalRecords = totalPresent + totalAbsent + totalLate + totalLeave;
    const attendanceRate = totalRecords > 0
        ? Math.round((totalPresent / totalRecords) * 100)
        : 0;

    return {
        totalDays,
        totalPresent,
        totalAbsent,
        totalLate,
        totalLeave,
        attendanceRate,
    };
};
