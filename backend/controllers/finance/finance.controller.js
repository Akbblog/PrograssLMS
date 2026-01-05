const FinanceService = require("../../services/finance/finance.service");

// Helper to get schoolId from req
const getSchoolId = (req) => req.userAuth.schoolId;

exports.generateStudentFee = async (req, res) => {
    try {
        const { studentId, academicYearId, paymentPlan } = req.body;
        const financeService = new FinanceService(getSchoolId(req));

        const result = await financeService.generateStudentFeeStructure(
            studentId,
            academicYearId,
            paymentPlan
        );

        res.status(200).json({
            status: "success",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

exports.getFinancialReport = async (req, res) => {
    try {
        const { academicYearId, reportType } = req.query;
        const financeService = new FinanceService(getSchoolId(req));

        const report = await financeService.generateFinancialReport(academicYearId, reportType);

        res.status(200).json({
            status: "success",
            data: report
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};

exports.getPaymentReminders = async (req, res) => {
    try {
        const financeService = new FinanceService(getSchoolId(req));
        const reminders = await financeService.sendPaymentReminders();

        res.status(200).json({
            status: "success",
            data: reminders
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message
        });
    }
};
