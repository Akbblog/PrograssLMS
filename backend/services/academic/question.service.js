const QuestionBank = require("../../models/Academic/Question.model");
const Admin = require("../../models/Staff/admin.model");
const responseStatus = require("../../handlers/responseStatus.handler.js");

/**
 * Create Question Service
 */
exports.createQuestionService = async (data, userId, res) => {
    const {
        questionText, questionType, options, correctAnswer, explanation,
        marks, negativeMark, difficulty, subject, classLevel, tags, media, hints
    } = data;

    // Get admin's schoolId
    const admin = await Admin.findById(userId);
    if (!admin) {
        return responseStatus(res, 401, "failed", "Admin not found");
    }

    const schoolId = admin.schoolId;
    if (!schoolId) {
        return responseStatus(res, 400, "failed", "No school associated with this admin");
    }

    // Validate MCQ questions have options
    if (questionType === "mcq" && (!options || options.length < 2)) {
        return responseStatus(res, 400, "failed", "MCQ questions must have at least 2 options");
    }

    // Create question
    const question = await QuestionBank.create({
        questionText,
        questionType: questionType || "mcq",
        options: options || [],
        correctAnswer,
        explanation,
        marks: marks || 1,
        negativeMark: negativeMark || 0,
        difficulty: difficulty || "medium",
        subject,
        classLevel,
        tags: tags || [],
        media: media || [],
        hints: hints || [],
        schoolId,
        createdBy: userId,
    });

    return responseStatus(res, 201, "success", question);
};

/**
 * Get All Questions Service
 * Supports filtering by subject, difficulty, tags
 */
exports.getAllQuestionsService = async (schoolId, filters = {}) => {
    // If schoolId is provided, filter by it. Otherwise show all (for debugging/superadmin)
    const query = schoolId ? { schoolId } : {};

    // Apply filters
    if (filters.subject) query.subject = filters.subject;
    if (filters.classLevel) query.classLevel = filters.classLevel;
    if (filters.difficulty) query.difficulty = filters.difficulty;
    if (filters.questionType) query.questionType = filters.questionType;
    if (filters.tags && filters.tags.length > 0) {
        query.tags = { $in: filters.tags };
    }

    // Temporary: removed isActive: true to ensure we see all seeded data
    return await QuestionBank.find(query)
        .populate("subject", "name")
        .populate("classLevel", "name")
        .sort({ createdAt: -1 });
};

/**
 * Get Single Question Service
 */
exports.getQuestionService = async (id) => {
    return await QuestionBank.findById(id)
        .populate("subject", "name")
        .populate("classLevel", "name");
};

/**
 * Update Question Service
 */
exports.updateQuestionService = async (data, id, res) => {
    const question = await QuestionBank.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true }
    );

    if (!question) {
        return responseStatus(res, 404, "failed", "Question not found");
    }

    return responseStatus(res, 200, "success", question);
};

/**
 * Delete Question Service (soft delete)
 */
exports.deleteQuestionService = async (id, res) => {
    const question = await QuestionBank.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );

    if (!question) {
        return responseStatus(res, 404, "failed", "Question not found");
    }

    return responseStatus(res, 200, "success", { message: "Question deleted successfully" });
};

/**
 * Bulk Import Questions Service
 */
exports.bulkImportQuestionsService = async (questions, userId, res) => {
    const admin = await Admin.findById(userId);
    if (!admin || !admin.schoolId) {
        return responseStatus(res, 401, "failed", "Admin not found or no school associated");
    }

    const questionsToInsert = questions.map(q => ({
        ...q,
        schoolId: admin.schoolId,
        createdBy: userId,
    }));

    const result = await QuestionBank.insertMany(questionsToInsert);
    return responseStatus(res, 201, "success", {
        message: `${result.length} questions imported successfully`,
        count: result.length
    });
};

