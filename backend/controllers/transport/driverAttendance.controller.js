const DriverAttendanceService = require('../../services/transport/driverAttendance.service');

exports.markAttendance = DriverAttendanceService.markAttendance;
exports.getAttendance = DriverAttendanceService.getAttendance;
exports.getStats = DriverAttendanceService.getStats;