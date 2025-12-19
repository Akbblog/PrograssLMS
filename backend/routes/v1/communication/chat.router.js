const express = require("express");
const chatRouter = express.Router();

// Middleware
const isLoggedIn = require("../../../middlewares/isLoggedIn");

// Controllers
const {
    createConversationController,
    getConversationsController,
    getConversationController,
    sendMessageController,
    addParticipantsController,
    removeParticipantController,
    deleteMessageController,
    deleteConversationController,
    markMessagesReadController,
    searchMessagesController,
} = require("../../../controllers/communication/chat.controller");

// ============ CONVERSATION ROUTES ============

// Get all conversations / Create new conversation
chatRouter
    .route("/conversations")
    .get(isLoggedIn, getConversationsController)
    .post(isLoggedIn, createConversationController);

// Get single conversation with messages / Delete conversation
chatRouter
    .route("/conversations/:id")
    .get(isLoggedIn, getConversationController)
    .delete(isLoggedIn, deleteConversationController);

// Send message to conversation
chatRouter
    .route("/conversations/:id/messages")
    .post(isLoggedIn, sendMessageController);

// Add participants to conversation
chatRouter
    .route("/conversations/:id/participants")
    .post(isLoggedIn, addParticipantsController);

// Remove participant from conversation
chatRouter
    .route("/conversations/:id/participants/:participantId")
    .delete(isLoggedIn, removeParticipantController);

// Mark messages as read
chatRouter
    .route("/conversations/:id/read")
    .post(isLoggedIn, markMessagesReadController);

// ============ MESSAGE ROUTES ============

// Search messages
chatRouter
    .route("/messages/search")
    .get(isLoggedIn, searchMessagesController);

// Delete message
chatRouter
    .route("/messages/:id")
    .delete(isLoggedIn, deleteMessageController);

module.exports = chatRouter;

