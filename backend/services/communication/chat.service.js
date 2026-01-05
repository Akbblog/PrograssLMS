const Conversation = require("../../models/Communication/Conversation.model");
const Message = require("../../models/Communication/Message.model");
const Admin = require("../../models/Staff/admin.model");
const Teacher = require("../../models/Staff/teachers.model");
const responseStatus = require("../../handlers/responseStatus.handler.js");
const eventBus = require("../../utils/eventBus");

/**
 * Create Conversation/Group Service
 */
exports.createConversationService = async (data, userId, userModel, res) => {
    try {
        const { name, description, type, participants, settings } = data;

        // Get user's schoolId
        let schoolId;
        if (userModel === "Admin") {
            const admin = await Admin.findById(userId);
            if (!admin) return responseStatus(res, 401, "failed", "User not found");
            schoolId = admin.schoolId;
        } else {
            const teacher = await Teacher.findById(userId);
            if (!teacher) return responseStatus(res, 401, "failed", "User not found");
            schoolId = teacher.schoolId;
        }

        if (!schoolId) {
            return responseStatus(res, 400, "failed", "No school associated with this user");
        }

        // Build participants list - always include the creator
        let finalParticipants = [{
            user: userId,
            userModel,
            role: "owner",
            canSendMessages: true,
        }];

        // Add additional participants if provided (for DMs or pre-filled groups)
        if (participants && Array.isArray(participants)) {
            participants.forEach(p => {
                // Don't add duplicates
                if (p.user && p.user !== userId) {
                    finalParticipants.push({
                        user: p.user,
                        userModel: p.userModel || "Teacher",
                        role: p.role || "member",
                        canSendMessages: p.canSendMessages !== false,
                    });
                }
            });
        }

        // Create conversation
        const conversation = await Conversation.create({
            schoolId,
            type: type || "group",
            name,
            description,
            participants: finalParticipants,
            createdBy: userId,
            createdByModel: userModel,
            settings: settings || {},
        });

        return responseStatus(res, 201, "success", conversation);
    } catch (error) {
        console.error("createConversationService error:", error);
        return responseStatus(res, 400, "failed", error.message);
    }
};

/**
 * Get All Conversations for User Service
 */
exports.getConversationsService = async (userId, userModel, schoolId) => {
    // Find all conversations where user is a participant
    const conversations = await Conversation.find({
        schoolId,
        isActive: true,
        "participants.user": userId,
    })
        .populate("participants.user", "name email")
        .sort({ updatedAt: -1 });

    return conversations;
};

/**
 * Get Single Conversation with Messages Service
 */
exports.getConversationService = async (conversationId, userId, limit = 50) => {
    const conversation = await Conversation.findById(conversationId)
        .populate("participants.user", "name email avatar");

    if (!conversation) {
        return null;
    }

    // Get messages
    const messages = await Message.find({
        conversation: conversationId,
        isDeleted: false,
    })
        .populate("sender", "name email avatar")
        .sort({ createdAt: -1 })
        .limit(limit);

    return {
        conversation,
        messages: messages.reverse(), // Oldest first for display
    };
};

/**
 * Send Message Service
 */
exports.sendMessageService = async (data, conversationId, userId, userModel, schoolId, res) => {
    const { content, messageType, attachments, replyTo } = data;

    // Verify conversation exists and user is participant
    const conversation = await Conversation.findOne({
        _id: conversationId,
        schoolId,
        "participants.user": userId,
    });

    if (!conversation) {
        return responseStatus(res, 404, "failed", "Conversation not found or access denied");
    }

    // Check if user can send messages
    const participant = conversation.participants.find(
        p => p.user.toString() === userId
    );
    if (participant && !participant.canSendMessages) {
        return responseStatus(res, 403, "failed", "You don't have permission to send messages in this group");
    }

    // Ensure content is at least an empty string (attachments-only messages allowed)
    const safeContent = (content || '').toString();

    // Create message
    const message = await Message.create({
        conversation: conversationId,
        schoolId,
        sender: userId,
        senderModel: userModel,
        content: safeContent,
        messageType: messageType || (attachments && attachments.length ? 'file' : 'text'),
        attachments: attachments || [],
        replyTo,
    });

    // Update conversation's last message summary
    const shortContent = safeContent.length ? safeContent.substring(0, 100) : (attachments && attachments.length ? `[${attachments.length} attachment(s)]` : '');
    conversation.lastMessage = {
        content: shortContent,
        sender: userId,
        sentAt: new Date(),
    };
    await conversation.save();

    // Populate sender info
    await message.populate("sender", "name email avatar");

    // Dispatch event to notify connected clients about the new message
    try {
        const recipients = (conversation.participants || [])
            .filter(p => p.user.toString() !== userId)
            .map(p => ({ userId: p.user.toString() }));

        await eventBus.dispatch('communication.message.sent', { message: message.toObject(), conversationId, recipients });
    } catch (err) {
        console.warn('[Chat] Failed to dispatch message event', err.message);
    }

    return responseStatus(res, 201, "success", message);
};

/**
 * Add Participants to Conversation Service
 */
exports.addParticipantsService = async (conversationId, participants, userId, res) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        return responseStatus(res, 404, "failed", "Conversation not found");
    }

    // Check if user is owner/admin
    const userParticipant = conversation.participants.find(
        p => p.user.toString() === userId && (p.role === "owner" || p.role === "admin")
    );
    if (!userParticipant) {
        return responseStatus(res, 403, "failed", "Only owners/admins can add participants");
    }

    // Add new participants
    for (const p of participants) {
        const exists = conversation.participants.find(
            ep => ep.user.toString() === p.user
        );
        if (!exists) {
            conversation.participants.push({
                user: p.user,
                userModel: p.userModel,
                role: p.role || "member",
                canSendMessages: p.canSendMessages !== false,
            });
        }
    }

    await conversation.save();

    return responseStatus(res, 200, "success", conversation);
};

/**
 * Remove Participant from Conversation Service
 */
exports.removeParticipantService = async (conversationId, participantId, userId, res) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        return responseStatus(res, 404, "failed", "Conversation not found");
    }

    // Check if user is owner/admin or removing themselves
    const userParticipant = conversation.participants.find(
        p => p.user.toString() === userId
    );
    const isOwnerOrAdmin = userParticipant?.role === "owner" || userParticipant?.role === "admin";
    const isSelf = participantId === userId;

    if (!isOwnerOrAdmin && !isSelf) {
        return responseStatus(res, 403, "failed", "Permission denied");
    }

    conversation.participants = conversation.participants.filter(
        p => p.user.toString() !== participantId
    );
    await conversation.save();

    return responseStatus(res, 200, "success", { message: "Participant removed" });
};

/**
 * Delete Message Service (Soft Delete)
 * Admin can delete any message, others can only delete their own
 */
exports.deleteMessageService = async (messageId, userId, userRole, res) => {
    const message = await Message.findById(messageId);

    if (!message) {
        return responseStatus(res, 404, "failed", "Message not found");
    }

    // Admin can delete any message, others can only delete their own
    const isAdmin = userRole === "admin";
    const isSender = message.sender.toString() === userId;

    if (!isAdmin && !isSender) {
        return responseStatus(res, 403, "failed", "You can only delete your own messages");
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.deletedBy = userId;
    await message.save();

    return responseStatus(res, 200, "success", { message: "Message deleted" });
};

/**
 * Mark Messages as Read Service
 */
exports.markMessagesReadService = async (conversationId, userId, userModel) => {
    await Message.updateMany(
        {
            conversation: conversationId,
            "readBy.user": { $ne: userId },
        },
        {
            $push: {
                readBy: {
                    user: userId,
                    userModel,
                    readAt: new Date(),
                },
            },
        }
    );

    return { success: true };
};

/**
 * Create Default Groups for School Service
 * Called when a new school is created
 */
exports.createDefaultGroupsService = async (schoolId, adminId) => {
    const defaultGroups = [
        {
            name: "All Teachers",
            description: "Group for all teachers in the school",
            type: "group",
            groupType: "all_teachers",
            schoolId,
            createdBy: adminId,
            createdByModel: "Admin",
            participants: [{
                user: adminId,
                userModel: "Admin",
                role: "owner",
                canSendMessages: true,
            }],
            settings: {
                allowStudents: false,
                allowAttachments: true,
            },
        },
        {
            name: "Announcements",
            description: "Official school announcements",
            type: "group",
            groupType: "all_staff",
            schoolId,
            createdBy: adminId,
            createdByModel: "Admin",
            participants: [{
                user: adminId,
                userModel: "Admin",
                role: "owner",
                canSendMessages: true,
            }],
            settings: {
                allowStudents: false,
                onlyAdminsCanPost: true,
            },
        },
    ];

    return await Conversation.insertMany(defaultGroups);
};

/**
 * Delete Conversation Service (Admin only)
 */
exports.deleteConversationService = async (conversationId, userId, userRole, schoolId, res) => {
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
        return responseStatus(res, 404, "failed", "Conversation not found");
    }

    // Check school ownership
    if (conversation.schoolId.toString() !== schoolId.toString()) {
        return responseStatus(res, 403, "failed", "Access denied");
    }

    // Only admin or conversation owner can delete
    const isAdmin = userRole === "admin";
    const isOwner = conversation.participants.find(
        p => p.user.toString() === userId && p.role === "owner"
    );

    if (!isAdmin && !isOwner) {
        return responseStatus(res, 403, "failed", "Only admin or conversation owner can delete conversations");
    }

    // Delete all messages in the conversation
    await Message.deleteMany({ conversation: conversationId });

    // Delete the conversation
    await Conversation.findByIdAndDelete(conversationId);

    return responseStatus(res, 200, "success", { message: "Conversation deleted successfully" });
};

/**
 * Search Messages Service
 */
exports.searchMessagesService = async (schoolId, query, limit = 50) => {
    const messages = await Message.find({
        schoolId,
        isDeleted: false,
        content: { $regex: query, $options: "i" },
    })
        .populate("sender", "name email")
        .populate("conversation", "name type")
        .sort({ createdAt: -1 })
        .limit(limit);

    return messages;
};
