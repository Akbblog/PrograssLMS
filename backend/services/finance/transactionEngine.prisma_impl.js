const { getPrisma } = require("../../lib/prismaClient");

const EPSILON = 0.01;

const SYSTEM_ACCOUNTS = [
  { code: "AR_STUDENT", name: "Accounts Receivable - Students", category: "asset", normalSide: "debit" },
  { code: "REV_TUITION", name: "Tuition and Fee Revenue", category: "revenue", normalSide: "credit" },
  { code: "CASH_MAIN", name: "Cash and Bank", category: "asset", normalSide: "debit" },
  { code: "AP_PAYROLL", name: "Accounts Payable - Payroll", category: "liability", normalSide: "credit" },
  { code: "EXP_PAYROLL", name: "Payroll Expense", category: "expense", normalSide: "debit" },
];

const TX_OPTIONS = {
  maxWait: 20000,
  timeout: 120000,
};

function getPrismaOrThrow() {
  const prisma = getPrisma();
  if (!prisma) {
    throw new Error("Database unavailable");
  }
  return prisma;
}

function asNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function roundMoney(value) {
  return Math.round((asNumber(value) + Number.EPSILON) * 100) / 100;
}

function parseJSON(value, fallback) {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  if (typeof value !== "string") return fallback;
  try {
    return JSON.parse(value);
  } catch (_e) {
    return fallback;
  }
}

function safeISOString(dateValue) {
  const d = dateValue ? new Date(dateValue) : new Date();
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

function buildFeeCategories(feeStructure) {
  let categories = parseJSON(feeStructure.feeCategories, []);
  if (!Array.isArray(categories)) categories = [];

  if (categories.length === 0 && asNumber(feeStructure.legacyAmount, 0) > 0) {
    categories = [
      {
        category: feeStructure.legacyType || "tuition",
        name: feeStructure.name || "Tuition",
        amount: asNumber(feeStructure.legacyAmount, 0),
        applicableTo: { allClasses: true },
      },
    ];
  }

  return categories
    .map((category) => ({
      category: category.category || "tuition",
      name: category.name || feeStructure.name || "Fee Item",
      amount: roundMoney(category.amount),
      applicableTo: category.applicableTo || { allClasses: true },
      isOptional: Boolean(category.isOptional),
    }))
    .filter((category) => category.amount > 0 && !category.isOptional);
}

function isCategoryApplicableToContext(category, context = {}) {
  const applicableTo = category.applicableTo || { allClasses: true };
  if (applicableTo.allClasses) return true;

  const classLevel = context.classLevel || null;
  if (classLevel && Array.isArray(applicableTo.specificClasses) && applicableTo.specificClasses.length > 0) {
    return applicableTo.specificClasses.map(String).includes(String(classLevel));
  }

  return true;
}

function normalizePayerSplits(totalDue, payerSplits = []) {
  const amount = roundMoney(totalDue);
  if (amount <= 0) {
    return [];
  }

  let splits = Array.isArray(payerSplits) ? payerSplits : [];
  if (splits.length === 0) {
    splits = [{ payerType: "parent", percentage: 100 }];
  }

  const withAmounts = [];
  let remaining = amount;
  let remainingPct = 100;

  splits.forEach((split, idx) => {
    const isLast = idx === splits.length - 1;
    const payerType = split.payerType || "parent";
    const payerRef = split.payerRef || null;
    const fixedAmount = split.fixedAmount != null ? roundMoney(split.fixedAmount) : null;
    const pct = split.percentage != null ? asNumber(split.percentage, 0) : null;

    let due;
    if (fixedAmount != null && fixedAmount >= 0) {
      due = roundMoney(Math.min(fixedAmount, remaining));
    } else if (pct != null && pct >= 0) {
      const cappedPct = Math.min(pct, remainingPct);
      due = isLast ? remaining : roundMoney((amount * cappedPct) / 100);
      remainingPct = Math.max(0, remainingPct - cappedPct);
    } else {
      due = isLast ? remaining : 0;
    }

    due = roundMoney(Math.max(0, Math.min(due, remaining)));
    remaining = roundMoney(remaining - due);

    withAmounts.push({
      payerType,
      payerRef,
      percentage: pct,
      fixedAmount,
      amountDue: due,
      amountPaid: 0,
      status: due <= EPSILON ? "paid" : "pending",
      metadata: split.metadata ? JSON.stringify(split.metadata) : null,
    });
  });

  if (remaining > EPSILON && withAmounts.length > 0) {
    const last = withAmounts[withAmounts.length - 1];
    last.amountDue = roundMoney(last.amountDue + remaining);
    last.status = last.amountDue <= EPSILON ? "paid" : "pending";
  }

  return withAmounts.filter((item) => item.amountDue > EPSILON);
}

async function ensureSystemAccountsTx(tx, schoolId) {
  const ensured = [];
  for (const account of SYSTEM_ACCOUNTS) {
    const row = await tx.financialAccount.upsert({
      where: {
        schoolId_code: {
          schoolId: String(schoolId),
          code: account.code,
        },
      },
      update: {
        name: account.name,
        category: account.category,
        normalSide: account.normalSide,
        isSystem: true,
        isActive: true,
      },
      create: {
        schoolId: String(schoolId),
        code: account.code,
        name: account.name,
        category: account.category,
        normalSide: account.normalSide,
        isSystem: true,
        isActive: true,
      },
    });
    ensured.push(row);
  }
  return ensured;
}

async function getAccountMapTx(tx, schoolId) {
  const accounts = await ensureSystemAccountsTx(tx, schoolId);
  return accounts.reduce((acc, item) => {
    acc[item.code] = item;
    return acc;
  }, {});
}

function validateBalancedLines(lines = []) {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error("Journal entry lines are required");
  }

  let debit = 0;
  let credit = 0;
  for (const line of lines) {
    debit += asNumber(line.debit, 0);
    credit += asNumber(line.credit, 0);
  }

  const roundedDebit = roundMoney(debit);
  const roundedCredit = roundMoney(credit);
  if (Math.abs(roundedDebit - roundedCredit) > EPSILON) {
    throw new Error(`Journal entry is not balanced (debit=${roundedDebit}, credit=${roundedCredit})`);
  }
}

async function postJournalEntryTx(tx, payload) {
  const {
    schoolId,
    referenceType,
    referenceId = null,
    description = null,
    postedAt = new Date(),
    lines = [],
    metadata = null,
  } = payload;

  validateBalancedLines(lines);

  const entry = await tx.journalEntry.create({
    data: {
      schoolId: String(schoolId),
      referenceType: String(referenceType),
      referenceId: referenceId ? String(referenceId) : null,
      description,
      postedAt,
      metadata: metadata ? JSON.stringify(metadata) : null,
    },
  });

  if (lines.length > 0) {
    await tx.journalLine.createMany({
      data: lines.map((line) => ({
        journalEntryId: entry.id,
        accountId: String(line.accountId),
        debit: roundMoney(line.debit),
        credit: roundMoney(line.credit),
        memo: line.memo || null,
      })),
    });
  }

  return entry;
}

async function evaluateStudentClearanceTx(tx, schoolId, studentId) {
  const invoices = await tx.invoice.findMany({
    where: {
      schoolId: String(schoolId),
      studentId: String(studentId),
      outstanding: { gt: 0 },
      status: { in: ["pending", "partial", "overdue"] },
    },
    select: { outstanding: true, dueDate: true },
  });

  const outstandingAmount = roundMoney(
    invoices.reduce((sum, invoice) => sum + asNumber(invoice.outstanding, 0), 0)
  );
  const hasOverdue = invoices.some(
    (invoice) => invoice.dueDate && new Date(invoice.dueDate).getTime() < Date.now()
  );
  const onHold = outstandingAmount > EPSILON;
  const reason = onHold
    ? hasOverdue
      ? "Outstanding overdue invoices"
      : "Outstanding invoices"
    : null;

  const clearance = await tx.studentFinancialClearance.upsert({
    where: {
      schoolId_studentId: {
        schoolId: String(schoolId),
        studentId: String(studentId),
      },
    },
    update: {
      status: onHold ? "hold" : "clear",
      outstandingAmount,
      holdCourses: onHold,
      holdGrades: onHold,
      holdCertificates: onHold,
      reason,
      lastEvaluatedAt: new Date(),
    },
    create: {
      schoolId: String(schoolId),
      studentId: String(studentId),
      status: onHold ? "hold" : "clear",
      outstandingAmount,
      holdCourses: onHold,
      holdGrades: onHold,
      holdCertificates: onHold,
      reason,
      lastEvaluatedAt: new Date(),
    },
  });

  return clearance;
}

async function getClearance(schoolId, studentId) {
  const prisma = getPrismaOrThrow();
  const existing = await prisma.studentFinancialClearance.findUnique({
    where: {
      schoolId_studentId: {
        schoolId: String(schoolId),
        studentId: String(studentId),
      },
    },
  });
  if (existing) {
    return existing;
  }

  return await prisma.$transaction((tx) => evaluateStudentClearanceTx(tx, schoolId, studentId), TX_OPTIONS);
}

function checkClearanceForPermission(clearance, permission) {
  const keyByPermission = {
    courses: "holdCourses",
    grades: "holdGrades",
    certificates: "holdCertificates",
  };
  const holdKey = keyByPermission[permission];
  if (!holdKey) return { allowed: true };
  return {
    allowed: !Boolean(clearance && clearance[holdKey]),
    reason: clearance && clearance[holdKey] ? clearance.reason || "Financial hold active" : null,
  };
}

async function assertClearance(schoolId, studentId, permission) {
  const clearance = await getClearance(schoolId, studentId);
  const decision = checkClearanceForPermission(clearance, permission);
  return {
    ...decision,
    clearance,
  };
}

async function createInvoiceForEnrollmentTx(tx, payload) {
  const {
    schoolId,
    studentId,
    academicYear = null,
    academicTerm = null,
    classLevel = null,
    sourceType = "enrollment",
    sourceRef = null,
    payerSplits = [],
    dueDate = null,
    feeStructureId = null,
    metadata = {},
  } = payload;

  const where = {
    schoolId: String(schoolId),
    status: "active",
  };
  if (feeStructureId) {
    where.id = String(feeStructureId);
  } else if (academicYear) {
    where.academicYear = String(academicYear);
  }

  const feeStructure = await tx.feeStructure.findFirst({
    where,
    orderBy: { createdAt: "desc" },
  });

  if (!feeStructure) {
    throw new Error("No active fee structure found for invoice generation");
  }

  const categories = buildFeeCategories(feeStructure).filter((category) =>
    isCategoryApplicableToContext(category, { classLevel })
  );

  if (categories.length === 0) {
    throw new Error("No applicable fee categories found for enrollment");
  }

  const subtotal = roundMoney(categories.reduce((sum, category) => sum + category.amount, 0));
  if (subtotal <= EPSILON) {
    throw new Error("Calculated invoice total is zero");
  }

  const invoiceDueDate =
    dueDate ||
    feeStructure.legacyDueDate ||
    feeStructure.effectiveUntil ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const invoice = await tx.invoice.create({
    data: {
      schoolId: String(schoolId),
      studentId: String(studentId),
      feeStructureId: feeStructure.id,
      sourceType,
      sourceRef: sourceRef ? String(sourceRef) : null,
      academicYear: academicYear ? String(academicYear) : feeStructure.academicYear,
      academicTerm: academicTerm ? String(academicTerm) : feeStructure.academicTerm,
      currency: "USD",
      status: "pending",
      subtotal,
      totalDue: subtotal,
      totalPaid: 0,
      outstanding: subtotal,
      dueDate: new Date(invoiceDueDate),
      issuedAt: new Date(),
      metadata: JSON.stringify({
        ...metadata,
        feeStructureName: feeStructure.name,
        generatedAt: safeISOString(new Date()),
      }),
    },
  });

  await tx.invoiceLine.createMany({
    data: categories.map((category) => ({
      invoiceId: invoice.id,
      code: category.category,
      name: category.name,
      quantity: 1,
      unitPrice: roundMoney(category.amount),
      amount: roundMoney(category.amount),
      metadata: JSON.stringify({ applicableTo: category.applicableTo || { allClasses: true } }),
    })),
  });

  const allocations = normalizePayerSplits(subtotal, payerSplits);
  if (allocations.length > 0) {
    await tx.invoicePayerAllocation.createMany({
      data: allocations.map((allocation) => ({
        invoiceId: invoice.id,
        payerType: allocation.payerType,
        payerRef: allocation.payerRef,
        percentage: allocation.percentage,
        fixedAmount: allocation.fixedAmount,
        amountDue: roundMoney(allocation.amountDue),
        amountPaid: roundMoney(allocation.amountPaid),
        status: allocation.status,
        metadata: allocation.metadata,
      })),
    });
  }

  const accounts = await getAccountMapTx(tx, schoolId);
  await postJournalEntryTx(tx, {
    schoolId,
    referenceType: "invoice",
    referenceId: invoice.id,
    description: `Invoice issued for student ${studentId}`,
    lines: [
      {
        accountId: accounts.AR_STUDENT.id,
        debit: subtotal,
        credit: 0,
        memo: "Student receivable recognized",
      },
      {
        accountId: accounts.REV_TUITION.id,
        debit: 0,
        credit: subtotal,
        memo: "Revenue recognized",
      },
    ],
    metadata: { sourceType, sourceRef },
  });

  const clearance = await evaluateStudentClearanceTx(tx, schoolId, studentId);
  return { invoice, feeStructure, clearance };
}

async function triggerEnrollmentInvoice(payload) {
  const prisma = getPrismaOrThrow();
  const {
    schoolId,
    eventType = "enrollment",
    eventKey,
  } = payload;

  return await prisma.$transaction(async (tx) => {
    if (eventKey) {
      const existing = await tx.financialEvent.findUnique({
        where: {
          schoolId_eventType_eventKey: {
            schoolId: String(schoolId),
            eventType: String(eventType),
            eventKey: String(eventKey),
          },
        },
      });
      if (existing) {
        const invoice = payload.sourceRef
          ? await tx.invoice.findFirst({
              where: {
                schoolId: String(schoolId),
                sourceType: payload.sourceType || "enrollment",
                sourceRef: String(payload.sourceRef),
              },
              orderBy: { createdAt: "desc" },
            })
          : null;
        return { deduplicated: true, invoice };
      }
    }

    const result = await createInvoiceForEnrollmentTx(tx, payload);

    if (eventKey) {
      await tx.financialEvent.upsert({
        where: {
          schoolId_eventType_eventKey: {
            schoolId: String(schoolId),
            eventType: String(eventType),
            eventKey: String(eventKey),
          },
        },
        update: {
          status: "processed",
          payload: JSON.stringify(payload),
          processedAt: new Date(),
        },
        create: {
          schoolId: String(schoolId),
          eventType: String(eventType),
          eventKey: String(eventKey),
          status: "processed",
          payload: JSON.stringify(payload),
          processedAt: new Date(),
        },
      });
    }

    return {
      deduplicated: false,
      invoice: result.invoice,
      feeStructure: result.feeStructure,
      clearance: result.clearance,
    };
  }, TX_OPTIONS);
}

async function applyPayment(payload) {
  const prisma = getPrismaOrThrow();
  const {
    schoolId,
    invoiceId,
    amount,
    paymentMethod = "cash",
    transactionId = null,
    remarks = null,
    recordedBy = null,
    academicYear = null,
    academicTerm = null,
  } = payload;

  return await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.findFirst({
      where: {
        id: String(invoiceId),
        schoolId: String(schoolId),
      },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }
    if (invoice.outstanding <= EPSILON) {
      throw new Error("Invoice is already fully paid");
    }

    const requestedAmount = roundMoney(amount);
    if (requestedAmount <= EPSILON) {
      throw new Error("Payment amount must be greater than zero");
    }

    const payAmount = roundMoney(Math.min(requestedAmount, invoice.outstanding));
    let remaining = payAmount;

    const allocations = await tx.invoicePayerAllocation.findMany({
      where: { invoiceId: invoice.id },
      orderBy: { createdAt: "asc" },
    });

    for (const allocation of allocations) {
      if (remaining <= EPSILON) break;

      const allocOutstanding = roundMoney(
        Math.max(0, asNumber(allocation.amountDue, 0) - asNumber(allocation.amountPaid, 0))
      );
      if (allocOutstanding <= EPSILON) continue;

      const allocPay = roundMoney(Math.min(remaining, allocOutstanding));
      const nextPaid = roundMoney(asNumber(allocation.amountPaid, 0) + allocPay);
      const allocStatus = nextPaid + EPSILON >= asNumber(allocation.amountDue, 0) ? "paid" : "partial";

      await tx.invoicePayerAllocation.update({
        where: { id: allocation.id },
        data: {
          amountPaid: nextPaid,
          status: allocStatus,
        },
      });

      remaining = roundMoney(remaining - allocPay);
    }

    const effectivePaid = roundMoney(payAmount - remaining);
    if (effectivePaid <= EPSILON) {
      throw new Error("No payable allocation found for this invoice");
    }

    const nextTotalPaid = roundMoney(asNumber(invoice.totalPaid, 0) + effectivePaid);
    const nextOutstanding = roundMoney(Math.max(0, asNumber(invoice.totalDue, 0) - nextTotalPaid));
    const invoiceStatus =
      nextOutstanding <= EPSILON ? "paid" : nextTotalPaid > EPSILON ? "partial" : "pending";

    const payment = await tx.feePayment.create({
      data: {
        schoolId: String(schoolId),
        studentId: String(invoice.studentId),
        feeStructureId: invoice.feeStructureId || null,
        invoiceId: invoice.id,
        totalAmount: roundMoney(invoice.totalDue),
        amountPaid: effectivePaid,
        amountDue: nextOutstanding,
        balanceDue: nextOutstanding,
        dueDate: invoice.dueDate,
        paymentDate: new Date(),
        paymentMethod,
        transactionId,
        remarks,
        recordedBy: recordedBy ? String(recordedBy) : null,
        status: invoiceStatus,
        academicYear: academicYear || invoice.academicYear,
        academicTerm: academicTerm || invoice.academicTerm,
      },
    });

    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        totalPaid: nextTotalPaid,
        outstanding: nextOutstanding,
        status: invoiceStatus,
        paidAt: nextOutstanding <= EPSILON ? new Date() : null,
      },
    });

    const accounts = await getAccountMapTx(tx, schoolId);
    await postJournalEntryTx(tx, {
      schoolId,
      referenceType: "payment",
      referenceId: payment.id,
      description: `Payment received for invoice ${invoice.id}`,
      lines: [
        {
          accountId: accounts.CASH_MAIN.id,
          debit: effectivePaid,
          credit: 0,
          memo: "Cash received",
        },
        {
          accountId: accounts.AR_STUDENT.id,
          debit: 0,
          credit: effectivePaid,
          memo: "Student receivable settled",
        },
      ],
      metadata: { invoiceId: invoice.id, paymentMethod, transactionId },
    });

    const clearance = await evaluateStudentClearanceTx(tx, schoolId, invoice.studentId);
    const updatedInvoice = await tx.invoice.findUnique({ where: { id: invoice.id } });
    return { payment, invoice: updatedInvoice, clearance };
  }, TX_OPTIONS);
}

async function listStudentPayments(schoolId, studentId) {
  const prisma = getPrismaOrThrow();
  const payments = await prisma.feePayment.findMany({
    where: { schoolId: String(schoolId), studentId: String(studentId) },
    orderBy: { createdAt: "desc" },
  });

  const feeStructureIds = [...new Set(payments.map((p) => p.feeStructureId).filter(Boolean))];
  let feeStructures = [];
  if (feeStructureIds.length > 0) {
    feeStructures = await prisma.feeStructure.findMany({
      where: { id: { in: feeStructureIds } },
      select: { id: true, name: true, description: true, legacyDueDate: true },
    });
  }
  const feeMap = feeStructures.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});

  return payments.map((payment) => ({
    ...payment,
    _id: payment.id,
    feeStructure:
      (payment.feeStructureId ? feeMap[payment.feeStructureId] || null : null) || {
        id: null,
        name: "Fee Payment",
        description: null,
        dueDate: payment.dueDate || null,
      },
  }));
}

async function listStudentDue(schoolId, studentId) {
  const prisma = getPrismaOrThrow();
  const invoices = await prisma.invoice.findMany({
    where: {
      schoolId: String(schoolId),
      studentId: String(studentId),
      outstanding: { gt: 0 },
      status: { in: ["pending", "partial", "overdue"] },
    },
    orderBy: { dueDate: "asc" },
  });

  return invoices.map((invoice) => {
    const meta = parseJSON(invoice.metadata, {});
    return {
      invoiceId: invoice.id,
      feeStructure: {
        id: invoice.feeStructureId,
        name: meta.feeStructureName || "Fee Invoice",
        description: meta.description || null,
        dueDate: invoice.dueDate,
      },
      paid: roundMoney(invoice.totalPaid),
      due: roundMoney(invoice.outstanding),
    };
  });
}

async function generateFinancialReport(schoolId, academicYearId = null) {
  const prisma = getPrismaOrThrow();
  const invoiceWhere = { schoolId: String(schoolId) };
  const paymentWhere = { schoolId: String(schoolId) };
  if (academicYearId) {
    invoiceWhere.academicYear = String(academicYearId);
    paymentWhere.academicYear = String(academicYearId);
  }

  const [invoiceAgg, paymentAgg, payments] = await Promise.all([
    prisma.invoice.aggregate({
      where: invoiceWhere,
      _sum: { totalDue: true, totalPaid: true, outstanding: true },
      _count: { _all: true },
    }),
    prisma.feePayment.aggregate({
      where: paymentWhere,
      _sum: { amountPaid: true },
      _count: { _all: true },
    }),
    prisma.feePayment.findMany({
      where: paymentWhere,
      select: { paymentMethod: true, paymentDate: true, amountPaid: true, createdAt: true, status: true, balanceDue: true },
    }),
  ]);

  const paymentMethodBreakdown = {};
  const monthlyTrend = {};
  let overdueAmount = 0;
  let pendingPayments = 0;
  let receivedPayments = 0;
  for (const payment of payments) {
    const method = payment.paymentMethod || "unknown";
    paymentMethodBreakdown[method] = roundMoney(
      asNumber(paymentMethodBreakdown[method], 0) + asNumber(payment.amountPaid, 0)
    );
    const when = payment.paymentDate || payment.createdAt || new Date();
    const month = new Date(when).getMonth();
    monthlyTrend[month] = roundMoney(asNumber(monthlyTrend[month], 0) + asNumber(payment.amountPaid, 0));

    if (payment.status === "overdue") {
      overdueAmount = roundMoney(overdueAmount + asNumber(payment.balanceDue, 0));
    } else if (payment.status === "paid") {
      receivedPayments = roundMoney(receivedPayments + asNumber(payment.amountPaid, 0));
    } else {
      pendingPayments = roundMoney(pendingPayments + asNumber(payment.balanceDue, 0));
    }
  }

  return {
    totalRevenue: roundMoney(asNumber(paymentAgg._sum.amountPaid, 0)),
    totalInvoiced: roundMoney(asNumber(invoiceAgg._sum.totalDue, 0)),
    pendingAmount: roundMoney(asNumber(invoiceAgg._sum.outstanding, 0)),
    pendingPayments,
    receivedPayments,
    overdueAmount,
    paymentMethodBreakdown,
    monthlyTrend,
    classWiseBreakdown: {},
    totalInvoices: invoiceAgg._count._all || 0,
    totalPayments: paymentAgg._count._all || 0,
  };
}

async function getPaymentReminders(schoolId) {
  const prisma = getPrismaOrThrow();
  const now = new Date();
  const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [overdue, upcoming] = await Promise.all([
    prisma.invoice.findMany({
      where: {
        schoolId: String(schoolId),
        outstanding: { gt: 0 },
        dueDate: { lt: now },
      },
      orderBy: { dueDate: "asc" },
    }),
    prisma.invoice.findMany({
      where: {
        schoolId: String(schoolId),
        outstanding: { gt: 0 },
        dueDate: { gte: now, lte: nextWeek },
      },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const studentIds = [...new Set([...overdue, ...upcoming].map((item) => item.studentId).filter(Boolean))];
  let students = [];
  if (studentIds.length > 0) {
    students = await prisma.student.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, name: true, email: true },
    });
  }
  const studentMap = students.reduce((acc, student) => {
    acc[student.id] = student;
    return acc;
  }, {});

  const reminders = [];
  for (const invoice of overdue) {
    const student = studentMap[invoice.studentId] || {};
    const daysOverdue = Math.max(
      1,
      Math.floor((Date.now() - new Date(invoice.dueDate || now).getTime()) / (24 * 60 * 60 * 1000))
    );
    reminders.push({
      type: "overdue",
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      student: student.name || "Unknown",
      guardianEmail: student.email || null,
      amountDue: roundMoney(invoice.outstanding),
      daysOverdue,
    });
  }

  for (const invoice of upcoming) {
    const student = studentMap[invoice.studentId] || {};
    const daysUntilDue = Math.max(
      0,
      Math.ceil((new Date(invoice.dueDate || now).getTime() - Date.now()) / (24 * 60 * 60 * 1000))
    );
    reminders.push({
      type: "upcoming",
      invoiceId: invoice.id,
      studentId: invoice.studentId,
      student: student.name || "Unknown",
      guardianEmail: student.email || null,
      amountDue: roundMoney(invoice.outstanding),
      daysUntilDue,
    });
  }

  return reminders;
}

function calculatePayrollFromMetrics(payload = {}) {
  const baseSalary = roundMoney(asNumber(payload.baseSalary, 0));
  const studentsTaught = asNumber(payload.studentsTaught, 0);
  const hoursLogged = asNumber(payload.hoursLogged, 0);
  const completionRate = asNumber(payload.completionRate, 0);
  const leaveDays = asNumber(payload.leaveDays, 0);
  const unpaidLeaveDays = asNumber(payload.unpaidLeaveDays, 0);
  const activeDays = asNumber(payload.activeDays, 0);
  const totalDays = asNumber(payload.totalDays, 0);
  const fixedBonus = roundMoney(asNumber(payload.fixedBonus, 0));
  const perStudentRate = roundMoney(asNumber(payload.perStudentRate, 0));
  const perHourRate = roundMoney(asNumber(payload.perHourRate, 0));
  const leavePenaltyPerDay = roundMoney(asNumber(payload.leavePenaltyPerDay, 0));
  const unpaidLeavePenaltyRate = asNumber(payload.unpaidLeavePenaltyRate, 0);
  const completionBonusThreshold = asNumber(payload.completionBonusThreshold, 90);
  const completionBonusRate = asNumber(payload.completionBonusRate, 0);

  let baseFactor = 1;
  if (totalDays > 0 && activeDays > 0 && activeDays < totalDays) {
    baseFactor = activeDays / totalDays;
  }
  const proratedBase = roundMoney(baseSalary * baseFactor);
  const activityAmount = roundMoney(studentsTaught * perStudentRate + hoursLogged * perHourRate);
  const completionBonus =
    completionRate >= completionBonusThreshold
      ? roundMoney((proratedBase * completionBonusRate) / 100)
      : 0;
  const bonusAmount = roundMoney(fixedBonus + completionBonus);
  const deductionAmount = roundMoney(
    leaveDays * leavePenaltyPerDay + proratedBase * unpaidLeavePenaltyRate * unpaidLeaveDays
  );
  const grossSalary = roundMoney(proratedBase + activityAmount + bonusAmount);
  const netSalary = roundMoney(Math.max(0, grossSalary - deductionAmount));

  return {
    baseSalary: proratedBase,
    activityAmount,
    bonusAmount,
    deductionAmount,
    grossSalary,
    netSalary,
    metrics: {
      studentsTaught,
      hoursLogged,
      completionRate,
      leaveDays,
      unpaidLeaveDays,
      activeDays,
      totalDays,
      baseFactor,
      fixedBonus,
      perStudentRate,
      perHourRate,
      leavePenaltyPerDay,
      unpaidLeavePenaltyRate,
      completionBonusThreshold,
      completionBonusRate,
    },
  };
}

async function upsertPayrollRunTx(tx, payload) {
  const {
    schoolId,
    staffId,
    month,
    year,
    calculation,
  } = payload;

  const existing = await tx.payrollRun.findFirst({
    where: {
      schoolId: String(schoolId),
      staffId: String(staffId),
      month: Number(month),
      year: Number(year),
      status: { in: ["pending", "processed"] },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = {
    schoolId: String(schoolId),
    staffId: String(staffId),
    month: Number(month),
    year: Number(year),
    status: "pending",
    baseSalary: calculation.baseSalary,
    activityAmount: calculation.activityAmount,
    bonusAmount: calculation.bonusAmount,
    deductionAmount: calculation.deductionAmount,
    grossSalary: calculation.grossSalary,
    netSalary: calculation.netSalary,
    metrics: JSON.stringify(calculation.metrics),
    generatedAt: new Date(),
  };

  if (existing) {
    return await tx.payrollRun.update({
      where: { id: existing.id },
      data,
    });
  }

  return await tx.payrollRun.create({ data });
}

async function generatePayrollRuns(payload = {}) {
  const prisma = getPrismaOrThrow();
  const {
    schoolId,
    month,
    year,
    staffId = null,
    staffIds = null,
    policy = {},
    metricsByStaff = {},
    baseSalary = 0,
  } = payload;

  if (!schoolId) throw new Error("schoolId is required");
  if (!month || !year) throw new Error("month and year are required");

  let targetStaffIds = [];
  if (staffId) {
    targetStaffIds = [String(staffId)];
  } else if (Array.isArray(staffIds) && staffIds.length > 0) {
    targetStaffIds = staffIds.map(String);
  } else {
    const teachers = await prisma.teacher.findMany({
      where: { schoolId: String(schoolId) },
      select: { id: true },
    });
    targetStaffIds = teachers.map((teacher) => teacher.id);
  }

  if (targetStaffIds.length === 0) {
    return [];
  }

  return await prisma.$transaction(async (tx) => {
    const runs = [];
    for (const currentStaffId of targetStaffIds) {
      const metrics = metricsByStaff[currentStaffId] || metricsByStaff.default || {};
      const calculation = calculatePayrollFromMetrics({
        baseSalary: metrics.baseSalary != null ? metrics.baseSalary : baseSalary,
        ...policy,
        ...metrics,
      });
      const run = await upsertPayrollRunTx(tx, {
        schoolId,
        staffId: currentStaffId,
        month,
        year,
        calculation,
      });
      runs.push(run);
    }
    return runs;
  }, TX_OPTIONS);
}

async function processPayrollRun(payload = {}) {
  const prisma = getPrismaOrThrow();
  const { schoolId, payrollRunId } = payload;
  if (!schoolId || !payrollRunId) throw new Error("schoolId and payrollRunId are required");

  return await prisma.$transaction(async (tx) => {
    const run = await tx.payrollRun.findFirst({
      where: { id: String(payrollRunId), schoolId: String(schoolId) },
    });
    if (!run) throw new Error("Payroll run not found");
    if (run.status === "paid") throw new Error("Payroll run is already paid");
    if (run.status === "processed") return run;

    const accounts = await getAccountMapTx(tx, schoolId);
    const netAmount = roundMoney(run.netSalary);
    if (netAmount <= EPSILON) {
      throw new Error("Payroll run net amount must be greater than zero");
    }

    await postJournalEntryTx(tx, {
      schoolId,
      referenceType: "payroll_run",
      referenceId: run.id,
      description: `Payroll processed for staff ${run.staffId} (${run.month}/${run.year})`,
      lines: [
        {
          accountId: accounts.EXP_PAYROLL.id,
          debit: netAmount,
          credit: 0,
          memo: "Payroll expense recognized",
        },
        {
          accountId: accounts.AP_PAYROLL.id,
          debit: 0,
          credit: netAmount,
          memo: "Payroll payable recognized",
        },
      ],
      metadata: { month: run.month, year: run.year, staffId: run.staffId },
    });

    return await tx.payrollRun.update({
      where: { id: run.id },
      data: { status: "processed", processedAt: new Date() },
    });
  }, TX_OPTIONS);
}

async function settlePayrollRun(payload = {}) {
  const prisma = getPrismaOrThrow();
  const { schoolId, payrollRunId } = payload;
  if (!schoolId || !payrollRunId) throw new Error("schoolId and payrollRunId are required");

  return await prisma.$transaction(async (tx) => {
    const run = await tx.payrollRun.findFirst({
      where: { id: String(payrollRunId), schoolId: String(schoolId) },
    });
    if (!run) throw new Error("Payroll run not found");
    if (run.status === "paid") return run;
    if (run.status !== "processed") {
      throw new Error(`Cannot settle payroll in status ${run.status}`);
    }

    const netAmount = roundMoney(run.netSalary);
    const accounts = await getAccountMapTx(tx, schoolId);
    await postJournalEntryTx(tx, {
      schoolId,
      referenceType: "payroll_payment",
      referenceId: run.id,
      description: `Payroll paid for staff ${run.staffId} (${run.month}/${run.year})`,
      lines: [
        {
          accountId: accounts.AP_PAYROLL.id,
          debit: netAmount,
          credit: 0,
          memo: "Payroll payable settled",
        },
        {
          accountId: accounts.CASH_MAIN.id,
          debit: 0,
          credit: netAmount,
          memo: "Cash paid",
        },
      ],
      metadata: {
        paymentMethod: payload.paymentMethod || "bank_transfer",
        transactionId: payload.transactionId || null,
      },
    });

    return await tx.payrollRun.update({
      where: { id: run.id },
      data: {
        status: "paid",
        paymentDate: new Date(),
      },
    });
  }, TX_OPTIONS);
}

module.exports = {
  // utilities
  parseJSON,
  roundMoney,
  calculatePayrollFromMetrics,

  // clearance
  getClearance,
  assertClearance,
  evaluateStudentClearanceTx,

  // invoices and payments
  createInvoiceForEnrollmentTx,
  triggerEnrollmentInvoice,
  applyPayment,
  listStudentPayments,
  listStudentDue,
  generateFinancialReport,
  getPaymentReminders,

  // ledger
  ensureSystemAccountsTx,
  postJournalEntryTx,

  // payroll
  generatePayrollRuns,
  processPayrollRun,
  settlePayrollRun,
};
