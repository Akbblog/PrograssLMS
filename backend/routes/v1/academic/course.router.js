const express = require("express");
const courseRouter = express.Router();

// Middleware
const isAdmin = require("../../../middlewares/isAdmin");
const isLoggedIn = require("../../../middlewares/isLoggedIn");

// Controllers
const {
    createCourseController,
    getAllCoursesController,
    getCourseController,
    updateCourseController,
    deleteCourseController,
    publishCourseController,
    createModuleController,
    updateModuleController,
    deleteModuleController,
    createLessonController,
    updateLessonController,
    deleteLessonController,
    markLessonCompleteController,
} = require("../../../controllers/academic/course.controller");

// ============ COURSE ROUTES ============

courseRouter
    .route("/courses")
    .get(isLoggedIn, getAllCoursesController)
    .post(isLoggedIn, isAdmin, createCourseController);

courseRouter
    .route("/courses/:id")
    .get(isLoggedIn, getCourseController)
    .patch(isLoggedIn, isAdmin, updateCourseController)
    .delete(isLoggedIn, isAdmin, deleteCourseController);

courseRouter
    .route("/courses/:id/publish")
    .post(isLoggedIn, isAdmin, publishCourseController);

// ============ MODULE ROUTES ============

courseRouter
    .route("/courses/:courseId/modules")
    .post(isLoggedIn, isAdmin, createModuleController);

courseRouter
    .route("/modules/:id")
    .patch(isLoggedIn, isAdmin, updateModuleController)
    .delete(isLoggedIn, isAdmin, deleteModuleController);

// ============ LESSON ROUTES ============

courseRouter
    .route("/modules/:moduleId/lessons")
    .post(isLoggedIn, isAdmin, createLessonController);

courseRouter
    .route("/lessons/:id")
    .patch(isLoggedIn, isAdmin, updateLessonController)
    .delete(isLoggedIn, isAdmin, deleteLessonController);

courseRouter
    .route("/lessons/:id/complete")
    .post(isLoggedIn, markLessonCompleteController);

module.exports = courseRouter;
