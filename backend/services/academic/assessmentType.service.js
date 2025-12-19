const AssessmentType = require("../../models/Academic/AssessmentType.model");
const Admin = require("../../models/Staff/admin.model");
const responseStatus = require("../../handlers/responseStatus.handler");

/**
 * Create Assessment Type Service
 */
exports.createAssessmentTypeService = async (data, userId, res) => {
    const { name, description, category, weightage, defaultDuration, defaultTotalMarks, defaultPassingMarks } = data;

    // Get admin's schoolId
    const admin = await Admin.findById(userId);
    if (!admin) {
        return responseStatus(res, 401, "failed", "Admin not found");
    }

    const schoolId = admin.schoolId;
    if (!schoolId) {
        return responseStatus(res, 400, "failed", "No school associated with this admin");
    }

    // Check if assessment type already exists for this school
    const existing = await AssessmentType.findOne({ name, schoolId });
    if (existing) {
        return responseStatus(res, 400, "failed", "Assessment type with this name already exists");
    }

    // Create assessment type
    const assessmentType = await AssessmentType.create({
        name,
        description,
        category: category || "formative",
        weightage: weightage || 0,
        defaultDuration: defaultDuration || 60,
        defaultTotalMarks: defaultTotalMarks || 100,
        defaultPassingMarks: defaultPassingMarks || 40,
        schoolId,
        createdBy: userId,
    });

    return responseStatus(res, 201, "success", assessmentType);
};

/**
 * Get All Assessment Types Service
 */
exports.getAllAssessmentTypesService = async (schoolId) => {
    const filter = schoolId ? { schoolId } : {};
    return await AssessmentType.find(filter).sort({ createdAt: -1 });
};

/**
 * Get Single Assessment Type Service
 */
exports.getAssessmentTypeService = async (id) => {
    return await AssessmentType.findById(id);
};

/**
 * Update Assessment Type Service
 */
exports.updateAssessmentTypeService = async (data, id, userId, res) => {
    const { name, description, category, weightage, defaultDuration, defaultTotalMarks, defaultPassingMarks, isActive } = data;

    // Get admin's schoolId
    const admin = await Admin.findById(userId);
    if (!admin) {
        return responseStatus(res, 401, "failed", "Admin not found");
    }

    // Check if name already exists for another assessment type in this school
    if (name) {
        const existing = await AssessmentType.findOne({
            name,
            schoolId: admin.schoolId,
            _id: { $ne: id }
        });
        if (existing) {
            return responseStatus(res, 400, "failed", "Assessment type with this name already exists");
        }
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (weightage !== undefined) updateData.weightage = weightage;
    if (defaultDuration !== undefined) updateData.defaultDuration = defaultDuration;
    if (defaultTotalMarks !== undefined) updateData.defaultTotalMarks = defaultTotalMarks;
    if (defaultPassingMarks !== undefined) updateData.defaultPassingMarks = defaultPassingMarks;
    if (isActive !== undefined) updateData.isActive = isActive;

    const assessmentType = await AssessmentType.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
    );

    if (!assessmentType) {
        return responseStatus(res, 404, "failed", "Assessment type not found");
    }

    return responseStatus(res, 200, "success", assessmentType);
};

/**
 * Delete Assessment Type Service
 */
exports.deleteAssessmentTypeService = async (id, res) => {
    const assessmentType = await AssessmentType.findByIdAndDelete(id);
    if (!assessmentType) {
        return responseStatus(res, 404, "failed", "Assessment type not found");
    }
    return responseStatus(res, 200, "success", { message: "Assessment type deleted successfully" });
};
