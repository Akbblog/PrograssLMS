const Payroll = require("../../models/HR/Payroll.model");
const { getPrisma } = require("../../lib/prismaClient");
const financeEngine = require("../../services/finance/transactionEngine.prisma_impl");

const usePrisma = process.env.USE_PRISMA === "true" || process.env.USE_PRISMA === "1";

function getSchoolId(req) {
  return req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
}

function parseMetrics(metrics) {
  if (!metrics) return {};
  if (typeof metrics === "object") return metrics;
  try {
    return JSON.parse(metrics);
  } catch (_e) {
    return {};
  }
}

function mapStatus(status) {
  if (status === "processed") return "approved";
  return status || "pending";
}

function normalizePayrollRun(run, staffById = {}) {
  const metrics = parseMetrics(run.metrics);
  const staff = staffById[run.staffId] || { _id: run.staffId, id: run.staffId, name: metrics.staffName || "Staff" };

  const allowances = [];
  if (Number(run.activityAmount || 0) > 0) allowances.push({ type: "Activity", amount: Number(run.activityAmount) });
  if (Number(run.bonusAmount || 0) > 0) allowances.push({ type: "Bonus", amount: Number(run.bonusAmount) });

  const deductions = [];
  if (Number(run.deductionAmount || 0) > 0) deductions.push({ type: "Deductions", amount: Number(run.deductionAmount) });

  return {
    ...run,
    _id: run.id,
    staff,
    basicSalary: Number(run.baseSalary || 0),
    allowances,
    deductions,
    status: mapStatus(run.status),
  };
}

async function loadTeacherMap(prisma, staffIds = []) {
  const uniqueStaffIds = [...new Set((staffIds || []).filter(Boolean).map(String))];
  if (uniqueStaffIds.length === 0) return {};

  const teachers = await prisma.teacher.findMany({
    where: { id: { in: uniqueStaffIds } },
    select: { id: true, name: true, firstName: true, lastName: true },
  });

  const map = {};
  for (const teacher of teachers) {
    const fallbackName = [teacher.firstName, teacher.lastName].filter(Boolean).join(" ").trim();
    map[teacher.id] = {
      _id: teacher.id,
      id: teacher.id,
      name: teacher.name || fallbackName || "Staff",
      personalInfo: {
        firstName: teacher.firstName || teacher.name || "Staff",
        lastName: teacher.lastName || "",
      },
    };
  }
  return map;
}

exports.listPayrolls = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ status: "fail", message: "Missing schoolId" });
    }

    if (usePrisma) {
      const prisma = getPrisma();
      if (!prisma) return res.status(503).json({ status: "fail", message: "Database unavailable" });

      const where = { schoolId: String(schoolId) };
      if (req.query?.month) where.month = Number(req.query.month);
      if (req.query?.year) where.year = Number(req.query.year);
      if (req.query?.staffId) where.staffId = String(req.query.staffId);

      const runs = await prisma.payrollRun.findMany({
        where,
        orderBy: [{ year: "desc" }, { month: "desc" }, { createdAt: "desc" }],
      });

      const staffById = await loadTeacherMap(prisma, runs.map((run) => run.staffId));
      const normalized = runs.map((run) => normalizePayrollRun(run, staffById));
      return res.status(200).json({ status: "success", data: normalized });
    }

    const list = await Payroll.find({ schoolId }).populate("staff");
    return res.status(200).json({ status: "success", data: list });
  } catch (err) {
    return res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.generatePayroll = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ status: "fail", message: "Missing schoolId" });
    }

    if (usePrisma) {
      const prisma = getPrisma();
      if (!prisma) return res.status(503).json({ status: "fail", message: "Database unavailable" });

      const {
        month,
        year,
        staffId,
        staffIds,
        baseSalary,
        policy,
        metricsByStaff,
      } = req.body || {};

      if (!month || !year) {
        return res.status(400).json({ status: "fail", message: "month and year are required" });
      }

      const runs = await financeEngine.generatePayrollRuns({
        schoolId,
        month: Number(month),
        year: Number(year),
        staffId: staffId || null,
        staffIds: Array.isArray(staffIds) ? staffIds : null,
        baseSalary: Number(baseSalary || 0),
        policy: policy || {},
        metricsByStaff: metricsByStaff || {},
      });

      const staffById = await loadTeacherMap(prisma, runs.map((run) => run.staffId));
      const normalized = runs.map((run) => normalizePayrollRun(run, staffById));
      return res.status(201).json({ status: "success", data: normalized });
    }

    const { staff, month, year, earnings, deductions } = req.body;
    const totalEarnings = (earnings.basic || 0) + (earnings.hra || 0) + (earnings.bonus || 0);
    const totalDeductions = (deductions.pf || 0) + (deductions.tax || 0);
    const gross = totalEarnings;
    const net = gross - totalDeductions;

    const payroll = await Payroll.create({
      schoolId,
      staff,
      month,
      year,
      earnings: { ...earnings, totalEarnings },
      deductions: { ...deductions, totalDeductions },
      grossSalary: gross,
      netSalary: net,
    });
    return res.status(201).json({ status: "success", data: payroll });
  } catch (err) {
    return res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.processPayroll = async (req, res) => {
  try {
    if (usePrisma) {
      const schoolId = getSchoolId(req);
      if (!schoolId) {
        return res.status(400).json({ status: "fail", message: "Missing schoolId" });
      }

      const prisma = getPrisma();
      if (!prisma) return res.status(503).json({ status: "fail", message: "Database unavailable" });

      const payrollRunId = req.params.id;
      const processed = await financeEngine.processPayrollRun({ schoolId, payrollRunId });

      let finalRun = processed;
      if (req.body?.settle === true || req.body?.autoPay === true) {
        finalRun = await financeEngine.settlePayrollRun({
          schoolId,
          payrollRunId,
          paymentMethod: req.body?.paymentMethod || "bank_transfer",
          transactionId: req.body?.transactionId || null,
        });
      }

      const staffById = await loadTeacherMap(prisma, [finalRun.staffId]);
      return res.status(200).json({
        status: "success",
        data: normalizePayrollRun(finalRun, staffById),
      });
    }

    const { id } = req.params;
    const payroll = await Payroll.findById(id);
    if (!payroll) return res.status(404).json({ status: "fail", message: "Not found" });
    payroll.status = "processed";
    payroll.paymentDate = new Date();
    await payroll.save();
    return res.status(200).json({ status: "success", data: payroll });
  } catch (err) {
    return res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.settlePayroll = async (req, res) => {
  try {
    if (!usePrisma) {
      return res.status(501).json({ status: "fail", message: "Settlement endpoint is only supported in Prisma mode" });
    }

    const schoolId = getSchoolId(req);
    if (!schoolId) {
      return res.status(400).json({ status: "fail", message: "Missing schoolId" });
    }

    const prisma = getPrisma();
    if (!prisma) return res.status(503).json({ status: "fail", message: "Database unavailable" });

    const payrollRunId = req.params.id;
    const paid = await financeEngine.settlePayrollRun({
      schoolId,
      payrollRunId,
      paymentMethod: req.body?.paymentMethod || "bank_transfer",
      transactionId: req.body?.transactionId || null,
    });

    const staffById = await loadTeacherMap(prisma, [paid.staffId]);
    return res.status(200).json({
      status: "success",
      data: normalizePayrollRun(paid, staffById),
    });
  } catch (err) {
    return res.status(400).json({ status: "fail", message: err.message });
  }
};

exports.getPayslip = async (req, res) => {
  try {
    const schoolId = getSchoolId(req);
    if (!schoolId) return res.status(400).json({ status: 'fail', message: 'Missing schoolId' });

    if (usePrisma) {
      const prisma = getPrisma();
      if (!prisma) return res.status(503).json({ status: 'fail', message: 'Database unavailable' });

      const payrollRunId = req.params.id;
      const run = await prisma.payrollRun.findFirst({ where: { id: String(payrollRunId), schoolId: String(schoolId) } });
      if (!run) return res.status(404).json({ status: 'fail', message: 'Payroll run not found' });

      const staff = await prisma.teacher.findUnique({ where: { id: run.staffId } }).catch(() => null);

      const docGen = require('../../services/documentGenerator');
      if (typeof docGen.generateSalarySlip === 'function') {
        const pdfBuffer = await docGen.generateSalarySlip({ payrollRun: run, staff: staff || {}, schoolId });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="payslip-${run.id}.pdf"`);
        return res.send(pdfBuffer);
      } else {
        return res.status(200).json({ status: 'success', data: { payroll: run, staff } });
      }
    }

    const payroll = await Payroll.findById(req.params.id).populate('staff').lean();
    if (!payroll) return res.status(404).json({ status: 'fail', message: 'Not found' });

    const docGen = require('../../services/documentGenerator');
    if (typeof docGen.generateSalarySlip === 'function') {
      const pdfBuffer = await docGen.generateSalarySlip({ payroll, staff: payroll.staff });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="payslip-${payroll._id}.pdf"`);
      return res.send(pdfBuffer);
    }

    return res.status(200).json({ status: 'success', data: payroll });
  } catch (err) {
    return res.status(400).json({ status: 'fail', message: err.message });
  }
};
