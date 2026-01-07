const { getPrisma } = require('../../lib/prismaClient');

class FinanceService {
  constructor(schoolId) {
    this.schoolId = schoolId;
  }

  async generateStudentFeeStructure(studentId, academicYearId, paymentPlan = 'full') {
    // Basic implementation using Prisma models FeeStructure and Student
    const student = await prisma.student.findUnique({ where: { id: studentId }, include: { currentClassLevel: true, program: true } });
    const activeFeeStructure = await prisma.feeStructure.findFirst({ where: { schoolId: this.schoolId, academicYear: academicYearId, status: 'active' } });

    if (!activeFeeStructure) throw new Error('No active fee structure found for this academic year');

    let totalAmount = 0;
    const applicableCategories = [];

    for (const category of activeFeeStructure.feeCategories || []) {
      // very simple applicability check
      if (category.applicableTo?.allClasses) {
        let categoryAmount = category.amount || 0;
        applicableCategories.push({ ...category, finalAmount: categoryAmount });
        totalAmount += categoryAmount;
      }
    }

    const installments = [{ installmentNumber: 1, dueDate: new Date(), amountDue: totalAmount, status: 'pending' }];

    return { student: studentId, feeStructure: activeFeeStructure.id, academicYear: academicYearId, totalAmount, applicableCategories, installments, dueDate: new Date(), paymentPlan };
  }

  async generateFinancialReport(academicYearId, reportType = 'summary') {
    const payments = await prisma.feePayment.findMany({ where: { schoolId: this.schoolId, academicYear: academicYearId }, include: { student: true } });
    const report = { totalRevenue: 0, pendingPayments: 0, receivedPayments: 0, overdueAmount: 0, classWiseBreakdown: {}, paymentMethodBreakdown: {}, monthlyTrend: {} };

    for (const payment of payments) {
      report.totalRevenue += payment.amountPaid || 0;
      if (payment.status === 'paid') report.receivedPayments += payment.amountPaid || 0;
      else if (payment.status === 'overdue') report.overdueAmount += payment.balanceDue || 0;
      else report.pendingPayments += payment.balanceDue || 0;

      const className = payment.student?.currentClassLevel?.name || 'Unknown';
      if (!report.classWiseBreakdown[className]) report.classWiseBreakdown[className] = { total: 0, paid: 0, pending: 0 };
      report.classWiseBreakdown[className].total += payment.totalAmount || 0;
      report.classWiseBreakdown[className].paid += payment.amountPaid || 0;
      report.classWiseBreakdown[className].pending += payment.balanceDue || 0;

      report.paymentMethodBreakdown[payment.paymentMethod] = (report.paymentMethodBreakdown[payment.paymentMethod] || 0) + (payment.amountPaid || 0);
      const month = (payment.updatedAt || new Date()).getMonth();
      report.monthlyTrend[month] = (report.monthlyTrend[month] || 0) + (payment.amountPaid || 0);
    }

    return report;
  }

  async sendPaymentReminders() {
    const overduePayments = await prisma.feePayment.findMany({ where: { schoolId: this.schoolId, status: 'overdue' }, include: { student: true } });
    const upcomingPayments = await prisma.feePayment.findMany({ where: { schoolId: this.schoolId, status: { in: ['pending', 'partial'] }, dueDate: { gte: new Date(), lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } }, include: { student: true } });

    const reminders = [];
    for (const payment of overduePayments) {
      reminders.push({ type: 'overdue', paymentId: payment.id, student: payment.student?.name, guardianEmail: payment.student?.guardian?.email, amountDue: payment.balanceDue, daysOverdue: Math.floor((new Date() - payment.dueDate) / (24 * 60 * 60 * 1000)) });
    }
    for (const payment of upcomingPayments) {
      reminders.push({ type: 'upcoming', paymentId: payment.id, student: payment.student?.name, guardianEmail: payment.student?.guardian?.email, amountDue: payment.balanceDue, daysUntilDue: Math.ceil((payment.dueDate - new Date()) / (24 * 60 * 60 * 1000)) });
    }
    return reminders;
  }
}

module.exports = FinanceService;
