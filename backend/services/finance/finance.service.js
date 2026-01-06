const FeeStructure = require("../../models/Finance/FeeStructure.model");
const FeePayment = require("../../models/Finance/FeePayment.model");
const Student = require("../../models/Students/students.model");

class FinanceService {
    constructor(schoolId) {
        this.schoolId = schoolId;
    }

    // Generate fee structure for student
    async generateStudentFeeStructure(studentId, academicYearId, paymentPlan = "full") {
        const student = await Student.findById(studentId).populate('currentClassLevel program');
        const activeFeeStructure = await FeeStructure.findOne({
            schoolId: this.schoolId,
            academicYear: academicYearId,
            status: "active"
        });

        if (!activeFeeStructure) {
            throw new Error("No active fee structure found for this academic year");
        }

        // Calculate total amount with applicable discounts
        let totalAmount = 0;
        const applicableCategories = [];

        for (const category of activeFeeStructure.feeCategories) {
            // Check if category applies to this student
            if (this.isCategoryApplicable(category, student)) {
                let categoryAmount = category.amount;

                // Apply early payment discount if eligible
                if (category.earlyPaymentDiscount.enabled && this.isEarlyPaymentEligible(category)) {
                    categoryAmount -= (categoryAmount * category.earlyPaymentDiscount.percentage) / 100;
                }

                applicableCategories.push({
                    ...category.toObject(),
                    finalAmount: categoryAmount
                });
                totalAmount += categoryAmount;
            }
        }

        // Apply sibling discount
        if (activeFeeStructure.siblingDiscount.enabled) {
            const siblingCount = await this.getSiblingCount(student);
            if (siblingCount > 1) {
                const discount = (totalAmount * activeFeeStructure.siblingDiscount.percentage) / 100;
                totalAmount -= discount;
            }
        }

        // Generate installments based on payment plan
        const installments = this.generateInstallments(
            totalAmount,
            paymentPlan,
            activeFeeStructure.paymentPlans
        );

        return {
            student: studentId,
            feeStructure: activeFeeStructure._id,
            academicYear: academicYearId,
            totalAmount,
            applicableCategories,
            installments,
            dueDate: this.calculateDueDate(activeFeeStructure),
            paymentPlan
        };
    }

    isCategoryApplicable(category, student) {
        if (category.applicableTo.allClasses) return true;

        if (category.applicableTo.specificClasses && category.applicableTo.specificClasses.length > 0) {
            return category.applicableTo.specificClasses.includes(student.currentClassLevel._id);
        }

        if (category.applicableTo.specificPrograms && category.applicableTo.specificPrograms.length > 0 && student.program) {
            return category.applicableTo.specificPrograms.includes(student.program._id);
        }

        return false;
    }

    isEarlyPaymentEligible(category) {
        // Basic logic for early payment eligibility
        // Can be enhanced based on actual date check
        return false;
    }

    calculateDueDate(feeStructure) {
        return feeStructure.effectiveUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    }

    async getSiblingCount(student) {
        return await Student.countDocuments({
            schoolId: this.schoolId,
            'guardian.email': student.guardian.email,
            enrollmentStatus: 'active'
        });
    }

    generateInstallments(totalAmount, paymentPlan, availablePlans) {
        const plan = availablePlans.find(p => p.type === paymentPlan) || availablePlans[0];

        if (!plan || plan.type === "full") {
            return [{
                installmentNumber: 1,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
                amountDue: totalAmount,
                status: "pending"
            }];
        }

        return plan.installments.map((installment, index) => ({
            installmentNumber: index + 1,
            dueDate: installment.dueDate,
            amountDue: installment.amount || (totalAmount * installment.percentage / 100),
            status: "pending"
        }));
    }

    // Financial reporting
    async generateFinancialReport(academicYearId, reportType = "summary") {
        const FeePayment = require("../../models/Finance/FeePayment.model");
        const payments = await FeePayment.find({
            schoolId: this.schoolId,
            academicYear: academicYearId
        }).populate('student', 'name currentClassLevel');

        const report = {
            totalRevenue: 0,
            pendingPayments: 0,
            receivedPayments: 0,
            overdueAmount: 0,
            classWiseBreakdown: {},
            paymentMethodBreakdown: {},
            monthlyTrend: {}
        };

        payments.forEach(payment => {
            report.totalRevenue += payment.amountPaid;

            if (payment.status === "paid") {
                report.receivedPayments += payment.amountPaid;
            } else if (payment.status === "overdue") {
                report.overdueAmount += payment.balanceDue;
            } else {
                report.pendingPayments += payment.balanceDue;
            }

            // Class-wise breakdown
            const className = payment.student.currentClassLevel?.name || "Unknown";
            if (!report.classWiseBreakdown[className]) {
                report.classWiseBreakdown[className] = { total: 0, paid: 0, pending: 0 };
            }
            report.classWiseBreakdown[className].total += payment.totalAmount || 0;
            report.classWiseBreakdown[className].paid += payment.amountPaid || 0;
            report.classWiseBreakdown[className].pending += payment.balanceDue || 0;

            // Payment method breakdown
            report.paymentMethodBreakdown[payment.paymentMethod] =
                (report.paymentMethodBreakdown[payment.paymentMethod] || 0) + payment.amountPaid;

            // Monthly trend
            const month = payment.updatedAt.getMonth();
            report.monthlyTrend[month] = (report.monthlyTrend[month] || 0) + payment.amountPaid;
        });

        return report;
    }

    // Automated payment reminders
    async sendPaymentReminders() {
        const FeePayment = require("../../models/Finance/FeePayment.model");
        const overduePayments = await FeePayment.find({
            schoolId: this.schoolId,
            status: "overdue"
        }).populate('student', 'name guardian');

        const upcomingPayments = await FeePayment.find({
            schoolId: this.schoolId,
            status: { $in: ["pending", "partial"] },
            dueDate: {
                $gte: new Date(),
                $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
            }
        }).populate('student', 'name guardian');

        // Send reminders logic (integrate with email service)
        const reminders = [];

        for (const payment of overduePayments) {
            reminders.push({
                type: "overdue",
                paymentId: payment._id,
                student: payment.student.name,
                guardianEmail: payment.student.guardian.email,
                amountDue: payment.balanceDue,
                daysOverdue: Math.floor((new Date() - payment.dueDate) / (24 * 60 * 60 * 1000))
            });
        }

        for (const payment of upcomingPayments) {
            reminders.push({
                type: "upcoming",
                paymentId: payment._id,
                student: payment.student.name,
                guardianEmail: payment.student.guardian.email,
                amountDue: payment.balanceDue,
                daysUntilDue: Math.ceil((payment.dueDate - new Date()) / (24 * 60 * 60 * 1000))
            });
        }

        return reminders;
    }
}

module.exports = FinanceService;

// If USE_PRISMA is enabled, delegate exports to Prisma implementation
if (process.env.USE_PRISMA === '1' || process.env.USE_PRISMA === 'true') {
    module.exports = require('./finance.service.prisma_impl');
    return;
}
