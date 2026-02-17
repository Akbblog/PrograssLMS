const financeEngine = require("../services/finance/transactionEngine.prisma_impl");

const usePrisma = process.env.USE_PRISMA === "true" || process.env.USE_PRISMA === "1";

function resolveStudentId(req) {
  if (req.userRole === "student") {
    return req.userAuth?._id || req.userAuth?.id || req.userId || null;
  }
  return (
    req.params?.studentId ||
    req.query?.studentId ||
    req.body?.studentId ||
    req.params?.id ||
    null
  );
}

function requireFinancialClearance(permission) {
  return async (req, res, next) => {
    try {
      if (!usePrisma) return next();

      const role = String(req.userRole || req.userAuth?.role || "").toLowerCase();
      if (role && role !== "student") {
        return next();
      }

      const schoolId = req.schoolId || req.userAuth?.schoolId || req.user?.schoolId || null;
      const studentId = resolveStudentId(req);

      if (!schoolId || !studentId) return next();

      const decision = await financeEngine.assertClearance(schoolId, studentId, permission);
      if (decision.allowed) {
        req.financialClearance = decision.clearance;
        return next();
      }

      return res.status(402).json({
        status: "fail",
        code: "FINANCIAL_HOLD",
        message: decision.reason || "Financial clearance required",
        data: {
          permission,
          clearance: decision.clearance,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: "fail",
        message: error.message || "Unable to validate financial clearance",
      });
    }
  };
}

module.exports = {
  requireFinancialClearance,
};
