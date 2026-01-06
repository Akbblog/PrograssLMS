const express = require('express');
const router = express.Router();
const authMiddleware = require('../../middlewares/isLoggedIn');
const Student = require('../../models/Students/students.model');
const Teacher = require('../../models/Staff/teachers.model');
const Class = require('../../models/Academic/Class.model');
const Subject = require('../../models/Academic/Subject.model');
const Exam = require('../../models/Academic/Exam.model');
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
  if (catFilter('students')) promises.push(Student.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } },
    { studentId: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('teachers')) promises.push(Teacher.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } },
    { subject: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('classes')) promises.push(Class.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { classCode: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('subjects')) promises.push(Subject.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { code: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('exams')) promises.push(Exam.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { subject: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('courses')) promises.push(Course.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { code: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('books')) promises.push(Book.find({ schoolId, $or: [
    { title: { $regex: q, $options: 'i' } },
    { author: { $regex: q, $options: 'i' } },
    { isbn: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('staff')) promises.push(Staff.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { email: { $regex: q, $options: 'i' } },
    { position: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));
  if (catFilter('routes')) promises.push(RouteModel.find({ schoolId, $or: [
    { name: { $regex: q, $options: 'i' } },
    { routeNumber: { $regex: q, $options: 'i' } }
  ] }).limit(limit));
  else promises.push(Promise.resolve([]));

  const [students, teachers, classes, subjects, exams, courses, books, staff, routes] = await Promise.all(promises);

  // Transform data to match frontend expectations
  const result = {
    students: students.map(s => ({
      id: s._id,
      title: s.name,
      subtitle: s.email,
      route: `/admin/students/${s._id}`,
      photo: s.photo
    })),
    teachers: teachers.map(t => ({
      id: t._id,
      title: t.name,
      subtitle: t.subject || t.email,
      route: `/admin/teachers/${t._id}`,
      photo: t.photo
    })),
    classes: classes.map(c => ({
      id: c._id,
      title: c.name,
      subtitle: `Capacity: ${c.capacity}`,
      route: `/admin/academic/classes/${c._id}`,
      badge: c.classCode
    })),
    subjects: subjects.map(s => ({
      id: s._id,
      title: s.name,
      subtitle: s.code,
      route: `/admin/academic/subjects/${s._id}`
    })),
    exams: exams.map(e => ({
      id: e._id,
      title: e.name,
      subtitle: e.subject,
      route: `/admin/exams/${e._id}`
    })),
    courses: courses.map(c => ({
      id: c._id,
      title: c.name,
      subtitle: c.code,
      route: `/admin/academic/learning-courses/${c._id}`
    })),
    books: books.map(b => ({
      id: b._id,
      title: b.title,
      subtitle: b.author,
      route: `/admin/library/books/${b._id}`,
      badge: b.isbn
    })),
    staff: staff.map(s => ({
      id: s._id,
      title: s.name,
      subtitle: s.position,
      route: `/admin/hr/staff/${s._id}`,
      photo: s.photo
    })),
    routes: routes.map(r => ({
      id: r._id,
      title: r.name,
      subtitle: r.routeNumber,
      route: `/admin/transport/routes/${r._id}`
    }))
  };

  res.json(result);
});

module.exports = router;
