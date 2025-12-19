const express = require("express");
const questionRouter = express.Router();

// Middleware
// Middleware
const isAdmin = require("../../../middlewares/isAdmin");
const isLoggedIn = require("../../../middlewares/isLoggedIn");
const isAdminOrTeacher = require("../../../middlewares/isAdminOrTeacher");

// Controllers
const {
    createQuestionController,
    getAllQuestionsController,
    getQuestionController,
    updateQuestionController,
    deleteQuestionController,
    bulkImportQuestionsController,
} = require("../../../controllers/academic/question.controller");

// Routes
questionRouter
    .route("/questions")
    .get(isLoggedIn, isAdminOrTeacher, getAllQuestionsController)
    .post(isLoggedIn, isAdminOrTeacher, createQuestionController);

// Bulk import route (must be before /:id route)
questionRouter
    .route("/questions/bulk")
    .post(isLoggedIn, isAdmin, bulkImportQuestionsController);

questionRouter
    .route("/questions/:id")
    .get(isLoggedIn, isAdminOrTeacher, getQuestionController)
    .patch(isLoggedIn, isAdminOrTeacher, updateQuestionController)
    .delete(isLoggedIn, isAdmin, deleteQuestionController);

module.exports = questionRouter;
