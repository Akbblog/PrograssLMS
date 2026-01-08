const responseStatus = require("../../handlers/responseStatus.handler.js");

const usePrisma = process.env.USE_PRISMA === "true" || process.env.USE_PRISMA === "1";
const chatServicePath = usePrisma
    ? "../../services/communication/chat.service.prisma_impl"
    : "../../services/communication/chat.service";

const {
    createConversationService,
    getConversationsService,
    getConversationService,
    sendMessageService,
    addParticipantsService,
    removeParticipantService,
    deleteMessageService,
    deleteConversationService,
    markMessagesReadService,
    searchMessagesService,
} = require(chatServicePath);

/**
 * @desc Create Conversation/Group
 * @route POST /api/v1/conversations
 * @access Private
 */
exports.createConversationController = async (req, res) => {
    try {
        // Determine userModel based on role
        const userModel = req.userRole === "admin" ? "Admin" : "Teacher";
        console.log("Creating conversation:", {
            userId: req.userId,
            userModel,
            userRole: req.userRole,
            body: req.body
        });
        await createConversationService(req.body, req.userId, userModel, res);
    } catch (error) {
        console.error("Create conversation error:", error);
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get All User's Conversations
 * @route GET /api/v1/conversations
 * @access Private
 */
exports.getConversationsController = async (req, res) => {
    try {
        const userModel = req.userRole === "admin" ? "Admin" : "Teacher";
        const result = await getConversationsService(req.userId, userModel, req.schoolId);
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Get Single Conversation with Messages
 * @route GET /api/v1/conversations/:id
 * @access Private
 */
exports.getConversationController = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const result = await getConversationService(req.params.id, req.userId, limit);
        if (!result) {
            return responseStatus(res, 404, "failed", "Conversation not found");
        }
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Send Message
 * @route POST /api/v1/conversations/:id/messages
 * @access Private
 */
exports.sendMessageController = async (req, res) => {
    try {
        const userModel = req.userRole === "admin" ? "Admin" : "Teacher";
        await sendMessageService(
            req.body,
            req.params.id,
            req.userId,
            userModel,
            req.schoolId,
            res
        );
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Add Participants to Conversation
 * @route POST /api/v1/conversations/:id/participants
 * @access Private (Owner/Admin only)
 */
exports.addParticipantsController = async (req, res) => {
    try {
        await addParticipantsService(
            req.params.id,
            req.body.participants,
            req.userId,
            res
        );
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Remove Participant from Conversation
 * @route DELETE /api/v1/conversations/:id/participants/:participantId
 * @access Private
 */
exports.removeParticipantController = async (req, res) => {
    try {
        await removeParticipantService(
            req.params.id,
            req.params.participantId,
            req.userId,
            res
        );
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Message
 * @route DELETE /api/v1/messages/:id
 * @access Private (Admin or sender)
 */
exports.deleteMessageController = async (req, res) => {
    try {
        await deleteMessageService(req.params.id, req.userId, req.userRole, res);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Delete Conversation
 * @route DELETE /api/v1/conversations/:id
 * @access Private (Admin or owner)
 */
exports.deleteConversationController = async (req, res) => {
    try {
        await deleteConversationService(
            req.params.id,
            req.userId,
            req.userRole,
            req.schoolId,
            res
        );
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Mark Messages as Read
 * @route POST /api/v1/conversations/:id/read
 * @access Private
 */
exports.markMessagesReadController = async (req, res) => {
    try {
        const userModel = req.userRole === "admin" ? "Admin" : "Teacher";
        await markMessagesReadService(req.params.id, req.userId, userModel);
        responseStatus(res, 200, "success", { message: "Messages marked as read" });
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * @desc Search Messages
 * @route GET /api/v1/messages/search
 * @access Private
 */
exports.searchMessagesController = async (req, res) => {
    try {
        const { q, limit } = req.query;
        if (!q) {
            return responseStatus(res, 400, "failed", "Search query is required");
        }
        const result = await searchMessagesService(req.schoolId, q, parseInt(limit) || 50);
        responseStatus(res, 200, "success", result);
    } catch (error) {
        responseStatus(res, 400, "failed", error.message);
    }
};
