const FeeStructure = require("../../models/Finance/FeeStructure.model");
const FeePayment = require("../../models/Finance/FeePayment.model");
const Student = require("../../models/Students/students.model");

// --- Fee Structure Controllers ---

exports.createFeeStructure = async (req, res) => {
    try {
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
