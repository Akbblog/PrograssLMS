const FinanceService = require("../../services/finance/finance.service");
const financeEngine = require("../../services/finance/transactionEngine.prisma_impl");

const usePrisma = process.env.USE_PRISMA === "true" || process.env.USE_PRISMA === "1";

function getSchoolId(req) {
    return req.schoolId || req.userAuth?.schoolId || req.user?.schoolId || null;
}

exports.generateStudentFee = async (req, res) => {
    try {
        const schoolId = getSchoolId(req);
        if (!schoolId) {
            return res.status(400).json({ status: "fail", message: "Missing schoolId" });
        }

        const {
            studentId,
            academicYearId,
            academicTerm,
            classLevel,
            paymentPlan,
            payerSplits,
            feeStructureId,
            dueDate,
            sourceRef,
            idempotencyKey,
            force,
        } = req.body || {};

        if (!studentId) {
            return res.status(400).json({ status: "fail", message: "studentId is required" });
        }

        if (usePrisma) {
            const defaultEventKey = [
                "student_fee",
                String(studentId),
                String(academicYearId || "na"),
                String(academicTerm || "na"),
                String(feeStructureId || "default"),
            ].join(":");

            const result = await financeEngine.triggerEnrollmentInvoice({
                schoolId,
                studentId,
                academicYear: academicYearId || null,
                academicTerm: academicTerm || null,
                classLevel: classLevel || null,
                sourceType: "manual_student_fee",
                sourceRef: sourceRef || `manual:${studentId}:${Date.now()}`,
                eventType: "manual_student_fee",
                eventKey: force ? null : (idempotencyKey || defaultEventKey),
                feeStructureId: feeStructureId || null,
                dueDate: dueDate || null,
                payerSplits: Array.isArray(payerSplits) ? payerSplits : [],
                metadata: {
                    paymentPlan: paymentPlan || "full",
                    initiatedBy: req.userAuth?._id || req.userAuth?.id || req.userId || null,
                },
            });

            return res.status(200).json({
                status: "success",
                data: {
                    deduplicated: result.deduplicated,
                    invoice: result.invoice,
                    feeStructure: result.feeStructure || null,
                    clearance: result.clearance || null,
                },
            });
        }

        const financeService = new FinanceService(schoolId);
        const result = await financeService.generateStudentFeeStructure(
            studentId,
            academicYearId,
            paymentPlan
        );

        return res.status(200).json({
            status: "success",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.getFinancialReport = async (req, res) => {
    try {
        const schoolId = getSchoolId(req);
        if (!schoolId) {
            return res.status(400).json({ status: "fail", message: "Missing schoolId" });
        }

        const { academicYearId, reportType } = req.query;

        if (usePrisma) {
            const report = await financeEngine.generateFinancialReport(schoolId, academicYearId || null, reportType || "summary");
            return res.status(200).json({ status: "success", data: report });
        }

        const financeService = new FinanceService(schoolId);
        const report = await financeService.generateFinancialReport(academicYearId, reportType);
        return res.status(200).json({
            status: "success",
            data: report,
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.getPaymentReminders = async (req, res) => {
    try {
        const schoolId = getSchoolId(req);
        if (!schoolId) {
            return res.status(400).json({ status: "fail", message: "Missing schoolId" });
        }

        if (usePrisma) {
            const reminders = await financeEngine.getPaymentReminders(schoolId);
            return res.status(200).json({ status: "success", data: reminders });
        }

        const financeService = new FinanceService(schoolId);
        const reminders = await financeService.sendPaymentReminders();

        return res.status(200).json({
            status: "success",
            data: reminders,
        });
    } catch (error) {
        return res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};
