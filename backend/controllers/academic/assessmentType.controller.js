const responseStatus = require("../../handlers/responseStatus.handler");
const {
    createAssessmentTypeService,
    getAllAssessmentTypesService,
    getAssessmentTypeService,
    updateAssessmentTypeService,
    deleteAssessmentTypeService,
} = require("../../services/academic/assessmentType.service");

/**
 * @desc Create Assessment Type
 * @route POST /api/v1/assessment-types
 * @access Private (Admin)
 */
exports.createAssessmentTypeController = async (req, res) => {
    try {
        await createAssessmentTypeService(req.body, req.userAuth._id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get All Assessment Types
 * @route GET /api/v1/assessment-types
 * @access Private (Admin)
 */
exports.getAllAssessmentTypesController = async (req, res) => {
    try {
        const result = await getAllAssessmentTypesService(req.schoolId);
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Single Assessment Type
 * @route GET /api/v1/assessment-types/:id
 * @access Private (Admin)
 */
exports.getAssessmentTypeController = async (req, res) => {
    try {
        const result = await getAssessmentTypeService(req.params.id);
        if (!result) {
            return responseStatus(res, 404, "failed", "Assessment type not found");
        }
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Update Assessment Type
 * @route PATCH /api/v1/assessment-types/:id
 * @access Private (Admin)
 */
exports.updateAssessmentTypeController = async (req, res) => {
    try {
        await updateAssessmentTypeService(req.body, req.params.id, req.userAuth._id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Assessment Type
 * @route DELETE /api/v1/assessment-types/:id
 * @access Private (Admin)
 */
exports.deleteAssessmentTypeController = async (req, res) => {
    try {
        await deleteAssessmentTypeService(req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};
