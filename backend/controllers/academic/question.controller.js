const responseStatus = require("../../handlers/responseStatus.handler.js");
const {
    createQuestionService,
    getAllQuestionsService,
    getQuestionService,
    updateQuestionService,
    deleteQuestionService,
    bulkImportQuestionsService,
} = require("../../services/academic/question.service");

/**
 * @desc Create Question
 * @route POST /api/v1/questions
 * @access Private (Admin/Teacher)
 */
exports.createQuestionController = async (req, res) => {
    try {
        await createQuestionService(req.body, req.userAuth._id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get All Questions
 * @route GET /api/v1/questions
 * @access Private (Admin/Teacher)
 */
exports.getAllQuestionsController = async (req, res) => {
    try {
        const filters = {
            subject: req.query.subject,
            classLevel: req.query.classLevel,
            difficulty: req.query.difficulty,
            questionType: req.query.questionType,
            tags: req.query.tags ? req.query.tags.split(",") : [],
        };
        const result = await getAllQuestionsService(req.schoolId, filters);
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Single Question
 * @route GET /api/v1/questions/:id
 * @access Private (Admin/Teacher)
 */
exports.getQuestionController = async (req, res) => {
    try {
        const result = await getQuestionService(req.params.id);
        if (!result) {
            return responseStatus(res, 404, "failed", "Question not found");
        }
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Update Question
 * @route PATCH /api/v1/questions/:id
 * @access Private (Admin/Teacher)
 */
exports.updateQuestionController = async (req, res) => {
    try {
        await updateQuestionService(req.body, req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Question
 * @route DELETE /api/v1/questions/:id
 * @access Private (Admin/Teacher)
 */
exports.deleteQuestionController = async (req, res) => {
    try {
        await deleteQuestionService(req.params.id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Bulk Import Questions
 * @route POST /api/v1/questions/bulk
 * @access Private (Admin)
 */
exports.bulkImportQuestionsController = async (req, res) => {
    try {
        const { questions } = req.body;
        if (!questions || !Array.isArray(questions)) {
            return responseStatus(res, 400, "failed", "Questions array is required");
        }
        await bulkImportQuestionsService(questions, req.userAuth._id, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};
