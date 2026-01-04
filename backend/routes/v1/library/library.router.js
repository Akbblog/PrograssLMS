const express = require('express');
const bookController = require('../../../controllers/library/book.controller');
const issueController = require('../../../controllers/library/bookIssue.controller');
const settingsController = require('../../../controllers/library/librarySettings.controller');
const reportsController = require('../../../controllers/library/libraryReports.controller');
const isLoggedIn = require('../../../middlewares/isLoggedIn');
const isAdmin = require('../../../middlewares/isAdmin');
const isAdminOrTeacher = require('../../../middlewares/isAdminOrTeacher');

const router = express.Router();

// Books
router.get('/books', isLoggedIn, bookController.getBooks);
router.post('/books', isLoggedIn, isAdmin, bookController.createBook);
router.get('/books/:id', isLoggedIn, bookController.getBookById);
router.put('/books/:id', isLoggedIn, isAdmin, bookController.updateBook);
router.delete('/books/:id', isLoggedIn, isAdmin, bookController.deleteBook);

// Issue / Return / Renew
router.post('/issue', isLoggedIn, isAdminOrTeacher, issueController.issueBook);
router.post('/return/:issueId', isLoggedIn, isAdminOrTeacher, issueController.returnBook);
router.post('/renew/:issueId', isLoggedIn, isAdminOrTeacher, issueController.renewBook);

// Issues listing
router.get('/issues', isLoggedIn, issueController.listIssues);
router.get('/overdue', isLoggedIn, issueController.listOverdue);
router.get('/borrower/:id', isLoggedIn, issueController.borrowerHistory);

// Settings
router.get('/settings', isLoggedIn, settingsController.getSettings);
router.put('/settings', isLoggedIn, isAdmin, settingsController.updateSettings);

// Reports
router.get('/stats', isLoggedIn, reportsController.getStats);

module.exports = router;
