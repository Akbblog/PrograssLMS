const mongoose = require('mongoose');
const { getPrisma } = require('../lib/prismaClient');

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function endOfDay(d) {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

function isValidObjectId(value) {
  return typeof value === 'string' && mongoose.Types.ObjectId.isValid(value);
}

function normalizeRange(dateRange) {
  const start = parseDate(dateRange?.startDate);
  const end = parseDate(dateRange?.endDate);
  if (!start && !end) return null;
  return {
    start: start ? startOfDay(start) : null,
    end: end ? endOfDay(end) : null,
  };
}

function buildMongooseDateFilter(range, field = 'date') {
  if (!range) return {};
  const filter = {};
  if (range.start && range.end) filter[field] = { $gte: range.start, $lte: range.end };
  else if (range.start) filter[field] = { $gte: range.start };
  else if (range.end) filter[field] = { $lte: range.end };
  return filter;
}

function buildPrismaDateFilter(range) {
  if (!range) return undefined;
  const filter = {};
  if (range.start) filter.gte = range.start;
  if (range.end) filter.lte = range.end;
  return Object.keys(filter).length ? filter : undefined;
}

class ReportsAggregationService {
  async getDashboardOverview(schoolId, dateRange) {
    const range = normalizeRange(dateRange);
    const prisma = getPrisma();

    // Prisma-first (works for MySQL deployments)
    if (prisma) {
      const kpis = {
        totalStudents: 0,
        totalTeachers: 0,
        totalClasses: 0,
        totalRevenue: 0,
        attendanceRate: 0,
      };

      try {
        if (prisma.student) kpis.totalStudents = await prisma.student.count({ where: { schoolId } });
      } catch (_) {}
      try {
        if (prisma.teacher) kpis.totalTeachers = await prisma.teacher.count({ where: { schoolId } });
      } catch (_) {}
      try {
        if (prisma.classLevel) kpis.totalClasses = await prisma.classLevel.count({ where: { schoolId } });
      } catch (_) {}
      try {
        if (prisma.feePayment) {
          const sum = await prisma.feePayment.aggregate({ where: { schoolId }, _sum: { amountPaid: true } });
          kpis.totalRevenue = sum?._sum?.amountPaid || 0;
        }
      } catch (_) {}
      try {
        if (prisma.attendance) {
          const date = buildPrismaDateFilter(range);
          const total = await prisma.attendance.count({ where: { schoolId, ...(date ? { date } : {}) } });
          kpis.attendanceRate = total > 0 ? 100 : 0; // Prisma Attendance is class-level in schema; keep simple
        }
      } catch (_) {}

      return {
        kpis,
        alerts: [],
        trends: {
          revenue: [],
          attendance: [],
        },
      };
    }

    // Mongoose fallback (only when schoolId looks like ObjectId)
    if (!isValidObjectId(schoolId)) {
      return {
        kpis: { totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalRevenue: 0, attendanceRate: 0 },
        alerts: [],
        trends: { revenue: [], attendance: [] },
      };
    }

    try {
      const Student = require('../models/Students/student.model');
      const Teacher = require('../models/Staff/teacher.model');
      const ClassLevel = require('../models/Academic/ClassLevel.model');
      const FeePayment = require('../models/Finance/FeePayment.model');
      const Attendance = require('../models/Academic/Attendance.model');

      const schoolObjId = new mongoose.Types.ObjectId(schoolId);
      const kpis = {
        totalStudents: await Student.countDocuments({ schoolId: schoolObjId }),
        totalTeachers: await Teacher.countDocuments({ schoolId: schoolObjId }),
        totalClasses: await ClassLevel.countDocuments({ schoolId: schoolObjId }),
        totalRevenue: 0,
        attendanceRate: 0,
      };

      const payments = await FeePayment.aggregate([
        { $match: { schoolId: schoolObjId, ...buildMongooseDateFilter(range, 'paymentDate') } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } },
      ]);
      kpis.totalRevenue = payments?.[0]?.total || 0;

      const totalAttendance = await Attendance.countDocuments({ schoolId: schoolObjId, ...buildMongooseDateFilter(range, 'date') });
      const presentAttendance = await Attendance.countDocuments({ schoolId: schoolObjId, status: 'present', ...buildMongooseDateFilter(range, 'date') });
      kpis.attendanceRate = totalAttendance > 0 ? Math.round((presentAttendance / totalAttendance) * 100) : 0;

      return { kpis, alerts: [], trends: { revenue: [], attendance: [] } };
    } catch (_) {
      return {
        kpis: { totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalRevenue: 0, attendanceRate: 0 },
        alerts: [],
        trends: { revenue: [], attendance: [] },
      };
    }
  }

  async getAttendanceReport(schoolId, dateRange, _filters) {
    const range = normalizeRange(dateRange);
    const prisma = getPrisma();

    if (prisma && prisma.attendance) {
      try {
        const date = buildPrismaDateFilter(range);
        const items = await prisma.attendance.findMany({
          where: { schoolId, ...(date ? { date } : {}) },
          orderBy: { date: 'asc' },
          take: 500,
        });

        const dailyTrends = items.map((i) => ({ date: i.date.toISOString().slice(0, 10), count: 1 })).reduce((acc, row) => {
          const found = acc.find((x) => x.date === row.date);
          if (found) found.count += 1;
          else acc.push({ date: row.date, count: 1 });
          return acc;
        }, []);

        return {
          kpis: { totalRecords: items.length },
          dailyTrends,
          statusBreakdown: [],
          weeklyPattern: [],
          consecutiveAbsenceAlerts: [],
        };
      } catch (_) {
        // fallthrough
      }
    }

    if (!isValidObjectId(schoolId)) {
      return {
        kpis: { totalRecords: 0 },
        dailyTrends: [],
        statusBreakdown: [],
        weeklyPattern: [],
        consecutiveAbsenceAlerts: [],
      };
    }

    try {
      const Attendance = require('../models/Academic/Attendance.model');
      const schoolObjId = new mongoose.Types.ObjectId(schoolId);

      const match = { schoolId: schoolObjId, ...buildMongooseDateFilter(range, 'date') };

      const statusBreakdownAgg = await Attendance.aggregate([
        { $match: match },
        { $group: { _id: '$status', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } },
        { $sort: { value: -1 } },
      ]);

      const dailyTrendsAgg = await Attendance.aggregate([
        { $match: match },
        {
          $group: {
            _id: { day: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }, status: '$status' },
            value: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: '$_id.day',
            counts: { $push: { status: '$_id.status', value: '$value' } },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const dailyTrends = dailyTrendsAgg.map((d) => {
        const row = { date: d._id, present: 0, absent: 0, late: 0, excused: 0 };
        for (const c of d.counts) {
          if (c.status === 'present') row.present = c.value;
          else if (c.status === 'absent') row.absent = c.value;
          else if (c.status === 'late') row.late = c.value;
          else if (c.status === 'excused') row.excused = c.value;
        }
        return row;
      });

      // Simple weekday pattern (not a full heatmap)
      const weekdayAgg = await Attendance.aggregate([
        { $match: match },
        { $group: { _id: { $dayOfWeek: '$date' }, total: { $sum: 1 }, present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } } } },
        { $project: { _id: 0, weekday: '$_id', presentRate: { $cond: [{ $gt: ['$total', 0] }, { $multiply: [{ $divide: ['$present', '$total'] }, 100] }, 0] } } },
        { $sort: { weekday: 1 } },
      ]);

      const totalRecords = await Attendance.countDocuments(match);

      return {
        kpis: { totalRecords },
        dailyTrends,
        statusBreakdown: statusBreakdownAgg || [],
        weeklyPattern: weekdayAgg || [],
        consecutiveAbsenceAlerts: [],
      };
    } catch (_) {
      return {
        kpis: { totalRecords: 0 },
        dailyTrends: [],
        statusBreakdown: [],
        weeklyPattern: [],
        consecutiveAbsenceAlerts: [],
      };
    }
  }

  async getAcademicReport(schoolId, academicYearId, academicTermId) {
    const prisma = getPrisma();
    if (prisma && prisma.result) {
      try {
        const where = { schoolId };
        if (academicYearId) where.academicYear = academicYearId;
        if (academicTermId) where.academicTerm = academicTermId;

        const results = await prisma.result.findMany({ where, take: 500 });
        const gradeDistribution = results.reduce((acc, r) => {
          const score = typeof r.score === 'number' ? r.score : 0;
          const bucket = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
          acc[bucket] = (acc[bucket] || 0) + 1;
          return acc;
        }, {});

        const dist = ['A', 'B', 'C', 'D', 'F'].map((name) => ({ name, value: gradeDistribution[name] || 0 }));
        return {
          kpis: { totalResults: results.length },
          gradeDistribution: dist,
          gpaTrends: [],
          atRiskStudents: [],
        };
      } catch (_) {}
    }

    if (!isValidObjectId(schoolId)) {
      return { kpis: { totalResults: 0 }, gradeDistribution: [], gpaTrends: [], atRiskStudents: [] };
    }

    try {
      const ExamResult = require('../models/Academic/results.model');
      const match = { schoolId: new mongoose.Types.ObjectId(schoolId) };
      if (academicYearId && isValidObjectId(academicYearId)) match.academicYear = new mongoose.Types.ObjectId(academicYearId);
      if (academicTermId && isValidObjectId(academicTermId)) match.academicTerm = new mongoose.Types.ObjectId(academicTermId);

      const totalResults = await ExamResult.countDocuments(match);
      const gradeDistributionAgg = await ExamResult.aggregate([
        { $match: match },
        {
          $project: {
            bucket: {
              $switch: {
                branches: [
                  { case: { $gte: ['$score', 90] }, then: 'A' },
                  { case: { $gte: ['$score', 80] }, then: 'B' },
                  { case: { $gte: ['$score', 70] }, then: 'C' },
                  { case: { $gte: ['$score', 60] }, then: 'D' },
                ],
                default: 'F',
              },
            },
          },
        },
        { $group: { _id: '$bucket', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } },
      ]);

      const gradeDistribution = ['A', 'B', 'C', 'D', 'F'].map((name) => {
        const found = gradeDistributionAgg.find((x) => x.name === name);
        return { name, value: found ? found.value : 0 };
      });

      const atRiskAgg = await ExamResult.aggregate([
        { $match: match },
        { $group: { _id: '$student', avgScore: { $avg: '$score' } } },
        { $match: { avgScore: { $lt: 60 } } },
        { $sort: { avgScore: 1 } },
        { $limit: 20 },
      ]);

      return {
        kpis: { totalResults },
        gradeDistribution,
        gpaTrends: [],
        atRiskStudents: atRiskAgg.map((r) => ({ studentId: r._id, avgScore: Math.round(r.avgScore) })),
      };
    } catch (_) {
      return { kpis: { totalResults: 0 }, gradeDistribution: [], gpaTrends: [], atRiskStudents: [] };
    }
  }

  async getFinanceReport(schoolId, dateRange) {
    const range = normalizeRange(dateRange);
    const prisma = getPrisma();
    if (prisma && prisma.feePayment) {
      try {
        const paymentDate = buildPrismaDateFilter(range);
        const where = { schoolId, ...(paymentDate ? { paymentDate } : {}) };
        const agg = await prisma.feePayment.aggregate({ where, _sum: { amountPaid: true, amountDue: true }, _count: { _all: true } });
        return {
          kpis: {
            totalCollected: agg?._sum?.amountPaid || 0,
            totalExpected: (agg?._sum?.amountDue || 0) + (agg?._sum?.amountPaid || 0),
            payments: agg?._count?._all || 0,
          },
          collectionTrends: [],
          feeStatus: [],
          overduePayments: [],
        };
      } catch (_) {}
    }

    if (!isValidObjectId(schoolId)) {
      return { kpis: { totalCollected: 0, totalExpected: 0, payments: 0 }, collectionTrends: [], feeStatus: [], overduePayments: [] };
    }

    try {
      const FeePayment = require('../models/Finance/FeePayment.model');
      const schoolObjId = new mongoose.Types.ObjectId(schoolId);
      const match = { schoolId: schoolObjId, ...buildMongooseDateFilter(range, 'paymentDate') };

      const totals = await FeePayment.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            totalCollected: { $sum: '$amountPaid' },
            totalDue: { $sum: '$amountDue' },
            payments: { $sum: 1 },
          },
        },
      ]);

      const status = await FeePayment.aggregate([
        { $match: match },
        { $group: { _id: '$status', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } },
      ]);

      const overdue = await FeePayment.find({ schoolId: schoolObjId, status: 'overdue' }).select('student amountDue amountPaid paymentDate').limit(20).lean();

      const totalCollected = totals?.[0]?.totalCollected || 0;
      const totalDue = totals?.[0]?.totalDue || 0;
      const payments = totals?.[0]?.payments || 0;

      return {
        kpis: { totalCollected, totalExpected: totalCollected + totalDue, payments },
        collectionTrends: [],
        feeStatus: status || [],
        overduePayments: overdue || [],
      };
    } catch (_) {
      return { kpis: { totalCollected: 0, totalExpected: 0, payments: 0 }, collectionTrends: [], feeStatus: [], overduePayments: [] };
    }
  }

  async getHRReport(schoolId, month, year) {
    const prisma = getPrisma();
    if (prisma && prisma.payroll) {
      try {
        const where = { schoolId };
        if (month) where.month = Number(month);
        if (year) where.year = Number(year);
        const count = await prisma.payroll.count({ where });
        return { kpis: { payrollRecords: count }, staffAttendance: [], leaveTypes: [], payrollSummary: [] };
      } catch (_) {}
    }

    if (!isValidObjectId(schoolId)) {
      return { kpis: { payrollRecords: 0 }, staffAttendance: [], leaveTypes: [], payrollSummary: [] };
    }

    try {
      const Payroll = require('../models/HR/Payroll.model');
      const LeaveApplication = require('../models/HR/LeaveApplication.model');

      const schoolObjId = new mongoose.Types.ObjectId(schoolId);
      const where = { schoolId: schoolObjId };
      if (month) where.month = Number(month);
      if (year) where.year = Number(year);

      const payrollRecords = await Payroll.countDocuments(where);
      const payrollAgg = await Payroll.aggregate([
        { $match: where },
        { $group: { _id: '$status', value: { $sum: 1 }, totalNet: { $sum: '$netSalary' } } },
        { $project: { _id: 0, name: '$_id', value: 1, totalNet: 1 } },
      ]);

      const leaveAgg = await LeaveApplication.aggregate([
        { $match: { schoolId: schoolObjId } },
        { $group: { _id: '$leaveType', value: { $sum: 1 } } },
        { $project: { _id: 0, name: '$_id', value: 1 } },
      ]);

      return {
        kpis: { payrollRecords },
        staffAttendance: [],
        leaveTypes: leaveAgg || [],
        payrollSummary: payrollAgg || [],
      };
    } catch (_) {
      return { kpis: { payrollRecords: 0 }, staffAttendance: [], leaveTypes: [], payrollSummary: [] };
    }
  }

  async getTransportReport(schoolId) {
    const prisma = getPrisma();
    if (prisma && prisma.route) {
      try {
        const activeRoutes = await prisma.route.count({ where: { schoolId } });
        const vehicles = prisma.vehicle ? await prisma.vehicle.count({ where: { schoolId } }) : 0;
        return { kpis: { activeRoutes, vehicles }, routeUtilization: [], driverAttendance: [] };
      } catch (_) {}
    }

    if (!isValidObjectId(schoolId)) {
      return { kpis: { activeRoutes: 0, vehicles: 0 }, routeUtilization: [], driverAttendance: [] };
    }

    try {
      const Route = require('../models/Transport/Route.model');
      const Vehicle = require('../models/Transport/Vehicle.model');
      const TransportAllocation = require('../models/Transport/TransportAllocation.model');
      const DriverAttendance = require('../models/Transport/DriverAttendance.model');

      const schoolObjId = new mongoose.Types.ObjectId(schoolId);
      const activeRoutes = await Route.countDocuments({ schoolId: schoolObjId });
      const vehicles = await Vehicle.countDocuments({ schoolId: schoolObjId });

      const routeAlloc = await TransportAllocation.aggregate([
        { $match: { schoolId: schoolObjId } },
        { $group: { _id: '$route', students: { $sum: 1 } } },
        { $sort: { students: -1 } },
        { $limit: 20 },
      ]);

      const driverAttendance = await DriverAttendance.find({ schoolId: schoolObjId }).sort({ date: -1 }).limit(20).lean();

      return {
        kpis: { activeRoutes, vehicles },
        routeUtilization: routeAlloc.map((r) => ({ routeId: r._id, students: r.students })),
        driverAttendance,
      };
    } catch (_) {
      return { kpis: { activeRoutes: 0, vehicles: 0 }, routeUtilization: [], driverAttendance: [] };
    }
  }

  async getLibraryReport(schoolId, dateRange) {
    // Prisma schema in this repo doesn’t include Book/BookIssue, so keep safe defaults.
    const prisma = getPrisma();
    if (prisma && !prisma.book) {
      return { kpis: { totalBooks: 0, issuedCount: 0, overdueCount: 0 }, popularBooks: [], overdueReturns: [] };
    }

    const range = normalizeRange(dateRange);
    if (!isValidObjectId(schoolId)) {
      return { kpis: { totalBooks: 0, issuedCount: 0, overdueCount: 0 }, popularBooks: [], overdueReturns: [] };
    }

    try {
      const Book = require('../models/Library/Book.model');
      const BookIssue = require('../models/Library/BookIssue.model');

      const schoolObjId = new mongoose.Types.ObjectId(schoolId);
      const totalBooks = await Book.countDocuments({ schoolId: schoolObjId });
      const issuedCount = await BookIssue.countDocuments({ schoolId: schoolObjId, status: 'issued' });
      const overdueCount = await BookIssue.countDocuments({ schoolId: schoolObjId, status: 'issued', dueDate: { $lt: new Date() } });

      const mostBorrowed = await BookIssue.aggregate([
        { $match: { schoolId: schoolObjId, ...buildMongooseDateFilter(range, 'issueDate') } },
        { $group: { _id: '$book', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      const overdueReturns = await BookIssue.find({ schoolId: schoolObjId, status: 'issued', dueDate: { $lt: new Date() } })
        .select('book borrower dueDate')
        .limit(20)
        .lean();

      return {
        kpis: { totalBooks, issuedCount, overdueCount },
        popularBooks: mostBorrowed.map((x) => ({ bookId: x._id, count: x.count })),
        overdueReturns,
      };
    } catch (_) {
      return { kpis: { totalBooks: 0, issuedCount: 0, overdueCount: 0 }, popularBooks: [], overdueReturns: [] };
    }
  }
}

module.exports = new ReportsAggregationService();
module.exports.ReportsAggregationService = ReportsAggregationService;
