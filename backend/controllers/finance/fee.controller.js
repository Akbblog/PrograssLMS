const FeeStructure = require("../../models/Finance/FeeStructure.model");
const FeePayment = require("../../models/Finance/FeePayment.model");
const Student = require("../../models/Students/students.model");

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

function notSupported(res, message) {
    return res.status(501).json({ status: "fail", message });
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

            // FeeStructure schema differs between Mongo and Prisma in this repo.
            // For now, allow only minimal creation if fields exist.
            const created = await prisma.feeStructure.create({
                data: {
                    schoolId,
                    // Best-effort mapping
                    name: req.body?.name || "Fee Structure",
                    academicYear: req.body?.academicYear || "",
                    academicTerm: req.body?.academicTerm || "",
                    status: req.body?.status || "active",
                    feeCategories: JSON.stringify(req.body?.feeCategories || []),
                    paymentPlans: JSON.stringify(req.body?.paymentPlans || []),
                },
            });

            return res.status(201).json({ status: "success", data: created });
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

            return res.status(200).json({ status: "success", data: feeStructures });
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
            return notSupported(res, "Fee payments are not supported in Prisma mode yet.");
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
            return res.status(200).json({ status: "success", data: [] });
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
            return res.status(200).json({ status: "success", data: [] });
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
