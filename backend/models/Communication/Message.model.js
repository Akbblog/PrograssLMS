const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

/**
 * Message Schema
 * Represents a message in a conversation
 */
const MessageSchema = new mongoose.Schema(
    {
        // Parent conversation
        conversation: {
            type: ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
        // Multi-tenancy - for efficient querying
        schoolId: {
            type: ObjectId,
            ref: "School",
            required: true,
            index: true,
        },
        // Sender
        sender: {
            type: ObjectId,
            refPath: "senderModel",
            required: true,
        },
        senderModel: {
            type: String,
            enum: ["Admin", "Teacher", "Student"],
            required: true,
        },
        // Message content
        content: {
            type: String,
            required: true,
        },
        // Message type
        messageType: {
            type: String,
            enum: ["text", "image", "file", "announcement", "system"],
            default: "text",
        },
        // Attachments
        attachments: [{
            url: String,
            type: String, // image, pdf, doc, audio, video
            name: String,
            size: Number, // in bytes
            mimeType: String,
        }],
        // Read receipts
        readBy: [{
            user: {
                type: ObjectId,
                refPath: "readBy.userModel",
            },
            userModel: {
                type: String,
                enum: ["Admin", "Teacher", "Student"],
            },
            readAt: {
                type: Date,
                default: Date.now,
            },
        }],
        // Reply to another message
        replyTo: {
            type: ObjectId,
            ref: "Message",
        },
        // Reactions (optional future enhancement)
        reactions: [{
            user: ObjectId,
            emoji: String,
            createdAt: { type: Date, default: Date.now },
        }],
        // Soft delete
        isDeleted: {
            type: Boolean,
            default: false,
        },
        deletedAt: {
            type: Date,
        },
        deletedBy: {
            type: ObjectId,
        },
        // Edited
        isEdited: {
            type: Boolean,
            default: false,
        },
        editedAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

// Indexes for efficient queries
MessageSchema.index({ conversation: 1, createdAt: -1 });
MessageSchema.index({ schoolId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

module.exports = Message;
