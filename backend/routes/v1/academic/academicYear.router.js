const express = require('express');
const academicYearRouter = express.Router();
// middleware
const isAdmin = require('../../../middlewares/isAdmin');
const isAdminOrTeacher = require('../../../middlewares/isAdminOrTeacher');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const { getAcademicYearsController, createAcademicYearController, getAcademicYearController, updateAcademicYearController, deleteAcademicYearController } = require('../../../controllers/academic/academicYear.controller');

academicYearRouter.route('/academic-years')
    .get(isLoggedIn, isAdminOrTeacher, getAcademicYearsController)
    .post(isLoggedIn, isAdmin, createAcademicYearController)
academicYearRouter.route('/academic-years/:id')
    .get(isLoggedIn, isAdminOrTeacher, getAcademicYearController)
    .patch(isLoggedIn, isAdmin, updateAcademicYearController)
    .delete(isLoggedIn, isAdmin, deleteAcademicYearController)
module.exports = academicYearRouter;
