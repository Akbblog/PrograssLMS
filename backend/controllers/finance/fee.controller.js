const FeeStructure = require("../../models/Finance/FeeStructure.model");
const FeePayment = require("../../models/Finance/FeePayment.model");
const Student = require("../../models/Students/students.model");
const financeEngine = require("../../services/finance/transactionEngine.prisma_impl");

const { getPrisma } = require("../../lib/prismaClient");
const usePrisma = process.env.USE_PRISMA === "true" || process.env.USE_PRISMA === "1";

function getSchoolId(req) {
    return (
        req.userAuth?.schoolId ||
        req.user?.schoolId ||
        req.schoolId ||
        null
    );
}

function normalizePrismaFeeStructure(fs) {
    const parsed = { ...fs };
    try {
        parsed.feeCategories = fs.feeCategories ? JSON.parse(fs.feeCategories) : [];
    } catch (e) {
        parsed.feeCategories = [];
    }
    try {
        parsed.paymentPlans = fs.paymentPlans ? JSON.parse(fs.paymentPlans) : [];
    } catch (e) {
        parsed.paymentPlans = [];
    }

    // Backward-compat fields expected by legacy frontend pages
    if (parsed.legacyAmount == null && Array.isArray(parsed.feeCategories) && parsed.feeCategories.length > 0) {
        parsed.legacyAmount = Number(parsed.feeCategories[0]?.amount || 0);
    }
    parsed.amount = parsed.legacyAmount || 0;
    parsed.dueDate = parsed.legacyDueDate || null;
    parsed.type = parsed.legacyType || parsed.feeCategories?.[0]?.category || "tuition";
    parsed._id = parsed.id;
    return parsed;
}

// --- Fee Structure Controllers ---

exports.createFeeStructure = async (req, res) => {
    try {
        if (usePrisma) {
            const prisma = getPrisma();
            if (!prisma) {
                return res.status(503).json({ status: "fail", message: "Database unavailable" });
            }

            const schoolId = getSchoolId(req);
            if (!schoolId) {
                return res.status(400).json({ status: "fail", message: "Missing schoolId" });
            }

            const body = req.body || {};
            const legacyAmount = Number(body.amount || 0);
            const feeCategories = Array.isArray(body.feeCategories) && body.feeCategories.length > 0
                ? body.feeCategories
                : (legacyAmount > 0
                    ? [{
                        category: body.type || "tuition",
                        name: body.name || "Fee",
                        amount: legacyAmount,
                        applicableTo: { allClasses: true },
                    }]
                    : []);
            const paymentPlans = Array.isArray(body.paymentPlans) ? body.paymentPlans : [];

            const created = await prisma.feeStructure.create({
                data: {
                    schoolId,
                    name: body.name || "Fee Structure",
                    description: body.description || null,
                    academicYear: body.academicYear || "",
                    academicTerm: body.academicTerm || null,
                    status: body.status || "active",
                    feeCategories: JSON.stringify(feeCategories),
                    paymentPlans: JSON.stringify(paymentPlans),
                    legacyAmount: legacyAmount > 0 ? legacyAmount : null,
                    legacyDueDate: body.dueDate ? new Date(body.dueDate) : null,
                    legacyType: body.type || null,
                    effectiveFrom: body.effectiveFrom ? new Date(body.effectiveFrom) : null,
                    effectiveUntil: body.effectiveUntil ? new Date(body.effectiveUntil) : null,
                },
            });

            return res.status(201).json({ status: "success", data: normalizePrismaFeeStructure(created) });
        }

        const { name, amount, dueDate, academicYear, academicTerm, classLevels, type } = req.body;

        // Assuming req.user is populated by auth middleware
        const schoolId = req.userAuth.schoolId;
        const createdBy = req.userAuth._id;

        const feeStructure = await FeeStructure.create({
            name,
            amount,
            dueDate,
            academicYear,
            academicTerm,
            classLevels,
            type,
            schoolId,
            createdBy,
        });

        res.status(201).json({
            status: "success",
            data: feeStructure,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.getFeeStructures = async (req, res) => {
    try {
        if (usePrisma) {
            const prisma = getPrisma();
            if (!prisma) {
                return res.status(503).json({ status: "fail", message: "Database unavailable" });
            }
            const schoolId = getSchoolId(req);
            if (!schoolId) {
                return res.status(200).json({ status: "success", data: [] });
            }

            const feeStructures = await prisma.feeStructure.findMany({
                where: { schoolId },
                orderBy: { createdAt: "desc" },
            });
            const normalized = feeStructures.map(normalizePrismaFeeStructure);

            return res.status(200).json({ status: "success", data: normalized });
        }

        const schoolId = req.userAuth.schoolId;
        const feeStructures = await FeeStructure.find({ schoolId })
            .populate("academicYear", "name")
            .populate("academicTerm", "name")
            .populate("classLevels", "name");

        res.status(200).json({
            status: "success",
            data: feeStructures,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

// --- Fee Payment Controllers ---

exports.recordPayment = async (req, res) => {
    try {
        if (usePrisma) {
            const schoolId = getSchoolId(req);
            if (!schoolId) {
                return res.status(400).json({ status: "fail", message: "Missing schoolId" });
            }

            const {
                invoiceId: incomingInvoiceId,
                studentId,
                feeStructureId,
                amountPaid,
                paymentMethod,
                remarks,
                transactionId,
                payerSplits,
                dueDate,
                academicYear,
                academicTerm,
            } = req.body || {};

            if (!amountPaid || Number(amountPaid) <= 0) {
                return res.status(400).json({ status: "fail", message: "amountPaid is required" });
            }

            let invoiceId = incomingInvoiceId;
            if (!invoiceId) {
                if (!studentId) {
                    return res.status(400).json({ status: "fail", message: "invoiceId or studentId is required" });
                }
                const generated = await financeEngine.triggerEnrollmentInvoice({
                    schoolId,
                    studentId,
                    academicYear: academicYear || null,
                    academicTerm: academicTerm || null,
                    sourceType: "manual_fee",
                    sourceRef: `manual:${studentId}:${Date.now()}`,
                    feeStructureId: feeStructureId || null,
                    payerSplits: Array.isArray(payerSplits) ? payerSplits : [],
                    dueDate: dueDate || null,
                    metadata: { initiatedBy: req.userAuth?.id || req.userId || null },
                });
                invoiceId = generated?.invoice?.id;
            }

            const result = await financeEngine.applyPayment({
                schoolId,
                invoiceId,
                amount: Number(amountPaid),
                paymentMethod: paymentMethod || "cash",
                transactionId: transactionId || null,
                remarks: remarks || null,
                recordedBy: req.userAuth?.id || req.userId || null,
                academicYear: academicYear || null,
                academicTerm: academicTerm || null,
            });

            return res.status(201).json({
                status: "success",
                data: result.payment,
                invoice: result.invoice,
                clearance: result.clearance,
            });
        }

        const { studentId, feeStructureId, amountPaid, paymentMethod, remarks } = req.body;
        const schoolId = req.userAuth.schoolId;
        const recordedBy = req.userAuth._id;

        const feeStructure = await FeeStructure.findById(feeStructureId);
        if (!feeStructure) {
            return res.status(404).json({ status: "fail", message: "Fee structure not found" });
        }

        // Calculate due amount (simple logic for now, can be complex with partial payments)
        // Check if previous payments exist for this student and fee structure
        const previousPayments = await FeePayment.find({
            student: studentId,
            feeStructure: feeStructureId,
        });

        const totalPaidSoFar = previousPayments.reduce((acc, curr) => acc + curr.amountPaid, 0);
        const remainingDue = feeStructure.amount - totalPaidSoFar;

        if (amountPaid > remainingDue) {
            return res.status(400).json({ status: "fail", message: "Amount paid exceeds remaining due" });
        }

        const newAmountDue = remainingDue - amountPaid;
        let status = "partial";
        if (newAmountDue <= 0) status = "paid";

        const payment = await FeePayment.create({
            student: studentId,
            feeStructure: feeStructureId,
            schoolId,
            amountPaid,
            amountDue: newAmountDue,
            paymentMethod,
            status,
            remarks,
            recordedBy,
        });

        res.status(201).json({
            status: "success",
            data: payment,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.getStudentPayments = async (req, res) => {
    try {
        if (usePrisma) {
            const schoolId = getSchoolId(req);
            const { studentId } = req.params;
            if (!schoolId) return res.status(200).json({ status: "success", data: [] });
            if (req.userRole === "student" && req.userAuth?._id?.toString() !== studentId) {
                return res.status(403).json({ status: "fail", message: "Unauthorized" });
            }
            const payments = await financeEngine.listStudentPayments(schoolId, studentId);
            return res.status(200).json({ status: "success", data: payments });
        }

        const { studentId } = req.params;
        // If student is requesting, ensure they can only see their own
        if (req.userRole === "student" && req.userAuth._id.toString() !== studentId) {
            return res.status(403).json({ status: "fail", message: "Unauthorized" });
        }

        const payments = await FeePayment.find({ student: studentId })
            .populate("feeStructure")
            .populate("recordedBy", "name");

        res.status(200).json({
            status: "success",
            data: payments,
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.getDueFees = async (req, res) => {
    try {
        if (usePrisma) {
            const schoolId = getSchoolId(req);
            const { studentId } = req.params;
            if (!schoolId) return res.status(200).json({ status: "success", data: [] });
            if (req.userRole === "student" && req.userAuth?._id?.toString() !== studentId) {
                return res.status(403).json({ status: "fail", message: "Unauthorized" });
            }
            const dueFees = await financeEngine.listStudentDue(schoolId, studentId);
            return res.status(200).json({ status: "success", data: dueFees });
        }

        const { studentId } = req.params;
        // If student is requesting, ensure they can only see their own
        if (req.userRole === "student" && req.userAuth._id.toString() !== studentId) {
            return res.status(403).json({ status: "fail", message: "Unauthorized" });
        }

        const student = await Student.findById(studentId).populate('currentClassLevels');
        if (!student) return res.status(404).json({ status: 'fail', message: 'Student not found' });

        // Find applicable fee structures for student's class and school
        // This is a simplified logic. In real app, we check academic year/term too.
        const feeStructures = await FeeStructure.find({
            schoolId: student.schoolId,
            classLevels: { $in: student.currentClassLevels.map(c => c._id) }
        });

        const dueFees = [];

        for (const fee of feeStructures) {
            const payments = await FeePayment.find({
                student: studentId,
                feeStructure: fee._id
            });
            const totalPaid = payments.reduce((acc, curr) => acc + curr.amountPaid, 0);
            if (totalPaid < fee.amount) {
                dueFees.push({
                    feeStructure: fee,
                    paid: totalPaid,
                    due: fee.amount - totalPaid
                });
            }
        }

        res.status(200).json({
            status: 'success',
            data: dueFees
        });

    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
}
