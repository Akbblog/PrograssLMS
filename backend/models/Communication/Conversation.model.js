const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Conversation Schema
 * Represents a chat conversation (private or group)
 * IMPORTANT: All conversations are strictly within the same school
 */
const ConversationSchema = new mongoose.Schema(
    {
        // Multi-tenancy - REQUIRED for isolation
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        // Conversation type
        type: {
            type: String,
            enum: ["private", "group", "announcement"],
            required: true,
            default: "group",
        },
        // Group name (only for group conversations)
        name: {
            type: String,
            trim: true,
        },
        // Group description
        description: {
            type: String,
            trim: true,
        },
        // Group avatar/icon
        avatar: {
            type: String,
        },
        // Participants
        participants: [{
            user: {
                type: ObjectId,
                refPath: "participants.userModel",
                required: true,
            },
            userModel: {
                type: String,
                enum: ["Admin", "Teacher", "Student"],
                required: true,
            },
            role: {
                type: String,
                enum: ["owner", "admin", "member"],
                default: "member",
            },
            joinedAt: {
                type: Date,
                default: Date.now,
            },
            canSendMessages: {
                type: Boolean,
                default: true,
            },
            isMuted: {
                type: Boolean,
                default: false,
            },
        }],
        // Created by
        createdBy: {
            type: ObjectId,
            refPath: "createdByModel",
            required: true,
        },
        createdByModel: {
            type: String,
            enum: ["Admin", "Teacher"],
            required: true,
        },
        // Status
        isActive: {
            type: Boolean,
            default: true,
        },
        // Settings
        settings: {
            allowStudents: { type: Boolean, default: false },
            allowAttachments: { type: Boolean, default: true },
            onlyAdminsCanPost: { type: Boolean, default: false },
        },
        // Last message info for quick display
        lastMessage: {
            content: String,
            sender: ObjectId,
            sentAt: Date,
        },
        // Predefined group type
        groupType: {
            type: String,
            enum: ["custom", "all_teachers", "all_staff", "class_group", null],
            default: "custom",
        },
    },
    { timestamps: true }
);

// Indexes
ConversationSchema.index({ schoolId: 1, type: 1 });
ConversationSchema.index({ "participants.user": 1 });
ConversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
