const responseStatus = require("../../handlers/responseStatus.handler.js");

const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';
const GradingPolicy = usePrisma ? null : require("../../models/Academic/GradingPolicy.model");

// Create Grading Policy
exports.createGradingPolicy = async (req, res) => {
    try {
        if (usePrisma) {
            return responseStatus(res, 501, "failed", "Grading policies are not yet supported in Prisma mode");
        }

        const schoolId = req.schoolId;
        const policyData = { ...req.body, schoolId };

        // If this policy is being set to active, deactivate others for the same year
        if (policyData.isActive) {
            await GradingPolicy.updateMany(
                { schoolId, academicYear: policyData.academicYear, isActive: true },
                { isActive: false }
            );
        }

        const policy = await GradingPolicy.create(policyData);
        return responseStatus(res, 201, "success", policy);
    } catch (error) {
        return responseStatus(res, 400, "failed", error.message);
    }
};

// Get All Grading Policies
exports.getAllGradingPolicies = async (req, res) => {
    try {
        if (usePrisma) {
            // Prisma schema doesn't include grading policies yet; return empty list to keep UI functional.
            return responseStatus(res, 200, "success", []);
        }

        const policies = await GradingPolicy.find({ schoolId: req.schoolId })
            .populate("academicYear", "name");
        return responseStatus(res, 200, "success", policies);
    } catch (error) {
        return responseStatus(res, 400, "failed", error.message);
    }
};

// Get Active Policy for current academic year
exports.getActivePolicy = async (req, res) => {
    try {
        if (usePrisma) {
            return responseStatus(res, 200, "success", null);
        }

        const { academicYearId } = req.query;
        const query = { schoolId: req.schoolId, isActive: true };
        if (academicYearId) query.academicYear = academicYearId;

        const policy = await GradingPolicy.findOne(query);
        return responseStatus(res, 200, "success", policy);
    } catch (error) {
        return responseStatus(res, 400, "failed", error.message);
    }
};

// Update Grading Policy
exports.updateGradingPolicy = async (req, res) => {
    try {
        if (usePrisma) {
            return responseStatus(res, 501, "failed", "Grading policies are not yet supported in Prisma mode");
        }

        const { id } = req.params;
        const updates = req.body;

        if (updates.isActive) {
            const policy = await GradingPolicy.findById(id);
            await GradingPolicy.updateMany(
                { schoolId: req.schoolId, academicYear: policy.academicYear, isActive: true },
                { isActive: false }
            );
        }

        const policy = await GradingPolicy.findByIdAndUpdate(id, updates, { new: true });
        return responseStatus(res, 200, "success", policy);
    } catch (error) {
        return responseStatus(res, 400, "failed", error.message);
    }
};

// Delete Grading Policy
exports.deleteGradingPolicy = async (req, res) => {
    try {
        if (usePrisma) {
            return responseStatus(res, 501, "failed", "Grading policies are not yet supported in Prisma mode");
        }

        await GradingPolicy.findByIdAndDelete(req.params.id);
        return responseStatus(res, 200, "success", { message: "Policy deleted successfully" });
    } catch (error) {
        return responseStatus(res, 400, "failed", error.message);
    }
};
