const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const feeStructureSchema = new mongoose.Schema({
    schoolId: {
        type: ObjectId,
        ref: "School",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: String,
    academicYear: {
        type: ObjectId,
        ref: "AcademicYear",
        required: true
    },
    // Fee categories with flexible pricing
    feeCategories: [{
        category: {
            type: String,
            required: true,
            enum: ["tuition", "activity", "technology", "library", "sports", "transport", "miscellaneous"]
        },
        name: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true,
            min: 0
        },
        // Advanced pricing options
        isOptional: { type: Boolean, default: false },
        isOneTime: { type: Boolean, default: false },
        installmentAllowed: { type: Boolean, default: true },
        maxInstallments: { type: Number, default: 1, min: 1 },
        // Class/grade specific pricing
        applicableTo: {
            allClasses: { type: Boolean, default: true },
            specificClasses: [{
                type: ObjectId,
                ref: "ClassLevel"
            }],
            specificPrograms: [{
                type: ObjectId,
                ref: "Program"
            }]
        },
        // Discount eligibility
        discountEligible: { type: Boolean, default: true },
        earlyPaymentDiscount: {
            enabled: { type: Boolean, default: false },
            percentage: { type: Number, min: 0, max: 100, default: 5 },
            daysBeforeDue: { type: Number, default: 30 }
        }
    }],
    // Payment plans
    paymentPlans: [{
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["full", "installment", "custom"],
            default: "full"
        },
        installments: [{
            dueDate: { type: Date, required: true },
            amount: { type: Number, required: true },
            percentage: { type: Number, min: 0, max: 100 } // Percentage of total
        }],
        lateFeePolicy: {
            enabled: { type: Boolean, default: true },
            gracePeriodDays: { type: Number, default: 10 },
            lateFeeAmount: { type: Number, default: 50 },
            lateFeePercentage: { type: Number, min: 0, max: 100, default: 5 }
        }
    }],
    // Sibling discount policy
    siblingDiscount: {
        enabled: { type: Boolean, default: false },
        percentage: { type: Number, min: 0, max: 100, default: 10 },
        maxDiscounts: { type: Number, default: 2 }
    },
    // Financial aid/scholarship options
    financialAidOptions: [{
        name: { type: String, required: true },
        type: {
            type: String,
            enum: ["scholarship", "grant", "bursary", "fee-waiver"],
            required: true
        },
        percentage: { type: Number, min: 0, max: 100 },
        fixedAmount: { type: Number, min: 0 },
        eligibilityCriteria: {
            minAcademicPerformance: { type: Number, min: 0, max: 100 },
            incomeThreshold: { type: Number, min: 0 },
            specificConditions: String
        },
        applicationRequired: { type: Boolean, default: true }
    }],
    status: {
        type: String,
        enum: ["draft", "active", "archived"],
        default: "draft"
    },
    effectiveFrom: Date,
    effectiveUntil: Date,
    createdBy: {
        type: ObjectId,
        ref: "Admin",
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient queries
feeStructureSchema.index({ schoolId: 1, academicYear: 1, status: 1 });

module.exports = mongoose.model("FeeStructure", feeStructureSchema);
