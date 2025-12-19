const express = require("express");
const assessmentTypeRouter = express.Router();

// Middleware
const isAdmin = require("../../../middlewares/isAdmin");
const isLoggedIn = require("../../../middlewares/isLoggedIn");

// Controllers
const {
    createAssessmentTypeController,
    getAllAssessmentTypesController,
    getAssessmentTypeController,
    updateAssessmentTypeController,
    deleteAssessmentTypeController,
} = require("../../../controllers/academic/assessmentType.controller");

// Routes
assessmentTypeRouter
    .route("/assessment-types")
    .get(isLoggedIn, isAdmin, getAllAssessmentTypesController)
    .post(isLoggedIn, isAdmin, createAssessmentTypeController);

assessmentTypeRouter
    .route("/assessment-types/:id")
    .get(isLoggedIn, isAdmin, getAssessmentTypeController)
    .patch(isLoggedIn, isAdmin, updateAssessmentTypeController)
    .delete(isLoggedIn, isAdmin, deleteAssessmentTypeController);

module.exports = assessmentTypeRouter;
