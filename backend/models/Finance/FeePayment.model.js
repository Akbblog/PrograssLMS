const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const feePaymentSchema = new mongoose.Schema(
    {
        student: {
            type: ObjectId,
            ref: "Student",
            required: true,
            index: true,
        },
        feeStructure: {
            type: ObjectId,
            ref: "FeeStructure",
            required: true,
        },
        // Multi-tenancy
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        amountPaid: {
            type: Number,
            required: true,
            min: 0,
        },
        amountDue: {
            type: Number,
            required: true,
            min: 0,
        },
        paymentDate: {
            type: Date,
            default: Date.now,
        },
        paymentMethod: {
            type: String,
            enum: ["cash", "card", "bank_transfer", "online"],
            default: "cash",
        },
        transactionId: {
            type: String,
        },
        status: {
            type: String,
            enum: ["pending", "partial", "paid", "overdue"],
            default: "pending",
        },
        remarks: {
            type: String,
        },
        recordedBy: {
            type: ObjectId,
            ref: "Admin", // or Staff
        },
    },
    { timestamps: true }
);

const FeePayment = mongoose.model("FeePayment", feePaymentSchema);

module.exports = FeePayment;
