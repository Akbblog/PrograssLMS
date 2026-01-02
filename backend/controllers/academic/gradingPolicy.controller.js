const GradingPolicy = require("../../models/Academic/GradingPolicy.model");

// Create Grading Policy
exports.createGradingPolicy = async (req, res) => {
    try {
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
        res.status(201).json({ status: "success", data: policy });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get All Grading Policies
exports.getAllGradingPolicies = async (req, res) => {
    try {
        const policies = await GradingPolicy.find({ schoolId: req.schoolId })
            .populate("academicYear", "name");
        res.status(200).json({ status: "success", data: policies });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Get Active Policy for current academic year
exports.getActivePolicy = async (req, res) => {
    try {
        const { academicYearId } = req.query;
        const query = { schoolId: req.schoolId, isActive: true };
        if (academicYearId) query.academicYear = academicYearId;

        const policy = await GradingPolicy.findOne(query);
        res.status(200).json({ status: "success", data: policy });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Update Grading Policy
exports.updateGradingPolicy = async (req, res) => {
    try {
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
        res.status(200).json({ status: "success", data: policy });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};

// Delete Grading Policy
exports.deleteGradingPolicy = async (req, res) => {
    try {
        await GradingPolicy.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: "success", message: "Policy deleted successfully" });
    } catch (error) {
        res.status(400).json({ status: "fail", message: error.message });
    }
};
