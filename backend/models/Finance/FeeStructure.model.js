const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const feeStructureSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
        },
        // Multi-tenancy
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        academicYear: {
            type: ObjectId,
            ref: "AcademicYear",
            required: true,
        },
        academicTerm: {
            type: ObjectId,
            ref: "AcademicTerm",
            required: true,
        },
        classLevels: [
            {
                type: ObjectId,
                ref: "ClassLevel",
            },
        ],
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        currency: {
            type: String,
            default: "USD",
        },
        dueDate: {
            type: Date,
            required: true,
        },
        type: {
            type: String,
            enum: ["tuition", "transport", "library", "exam", "other"],
            default: "tuition",
        },
        createdBy: {
            type: ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);

module.exports = FeeStructure;
