const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/isLoggedIn');
const Student = require('../../models/Students/students.model');
const Teacher = require('../../models/Staff/teachers.model');
const Class = require('../../models/Academic/class.model');
const Subject = require('../../models/Academic/subject.model');
const Exam = require('../../models/Academic/exams.model');
const Course = require('../../models/Academic/Course.model');
const Book = require('../../models/Library/Book.model');
const Staff = require('../../models/HR/StaffProfile.model');
const RouteModel = require('../../models/Transport/Route.model');

// GET /api/v1/search?q=query&categories=students,teachers&limit=5
router.get('/', authMiddleware, async (req, res) => {
  const { q, categories, limit = 5 } = req.query;
  const schoolId = req.userAuth.schoolId;
  const cats = categories ? categories.split(',') : [];

  // Helper to check if category is requested or all
  const catFilter = (cat) => !cats.length || cats.includes(cat);

  const promises = [];
  if (catFilter('students')) promises.push(Student.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('teachers')) promises.push(Teacher.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('classes')) promises.push(Class.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('subjects')) promises.push(Subject.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('exams')) promises.push(Exam.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('courses')) promises.push(Course.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('books')) promises.push(Book.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('staff')) promises.push(Staff.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('routes')) promises.push(RouteModel.find({ schoolId, $text: { $search: q } }).limit(limit));
  else promises.push(Promise.resolve([]));

  const [students, teachers, classes, subjects, exams, courses, books, staff, routes] = await Promise.all(promises);

  res.json({ students, teachers, classes, subjects, exams, courses, books, staff, routes });
});

module.exports = router;
