const Book = require('../../models/Library/Book.model');
const BookIssue = require('../../models/Library/BookIssue.model');
const LibrarySettings = require('../../models/Library/LibrarySettings.model');

exports.issueBook = async (req, res) => {
  try {
    const { bookId, borrowerId, borrowerType, dueDate } = req.body;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;

    const book = await Book.findOne({ _id: bookId, schoolId });
    if (!book) return res.status(404).json({ status: 'fail', message: 'Book not found' });
    if (book.availableQuantity <= 0) return res.status(400).json({ status: 'fail', message: 'No copies available' });

    const settings = await LibrarySettings.findOne({ schoolId });
    // Optional: check borrower limits here (students/teachers)

    const issue = await BookIssue.create({
      schoolId,
      book: bookId,
      borrower: borrowerId,
      borrowerType,
      issueDate: new Date(),
      dueDate,
      issuedBy: req.userId || req.user?. _id || req.userAuth?.id
    });

    // decrement available quantity
    book.availableQuantity = Math.max(0, book.availableQuantity - 1);
    await book.save();

    res.status(201).json({ status: 'success', data: issue });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.returnBook = async (req, res) => {
  try {
    const { issueId } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;

    const issue = await BookIssue.findOne({ _id: issueId, schoolId }).populate('book');
    if (!issue) return res.status(404).json({ status: 'fail', message: 'Issue record not found' });
    if (issue.status === 'returned') return res.status(400).json({ status: 'fail', message: 'Already returned' });

    issue.actualReturnDate = new Date();
    issue.status = 'returned';
    issue.returnedTo = req.userId || req.user?. _id || req.userAuth?.id;

    // calculate fine if overdue
    if (issue.actualReturnDate > issue.dueDate) {
      const daysLate = Math.ceil((issue.actualReturnDate - issue.dueDate) / (1000 * 60 * 60 * 24));
      const settings = await LibrarySettings.findOne({ schoolId });
      const finePerDay = settings?.finePerDay || 0;
      issue.fineAmount = daysLate * finePerDay;
      issue.finePaid = false;
    }

    await issue.save();

    // increment book available quantity
    const book = await Book.findById(issue.book._id);
    book.availableQuantity = (book.availableQuantity || 0) + 1;
    await book.save();

    res.status(200).json({ status: 'success', data: issue });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.renewBook = async (req, res) => {
  try {
    const { issueId } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;

    const issue = await BookIssue.findOne({ _id: issueId, schoolId });
    if (!issue) return res.status(404).json({ status: 'fail', message: 'Issue record not found' });
    if (issue.status !== 'issued') return res.status(400).json({ status: 'fail', message: 'Cannot renew unless issued' });

    const settings = await LibrarySettings.findOne({ schoolId });
    const maxRenewals = issue.maxRenewals || settings?.maxRenewals || 2;

    if (issue.renewalCount >= maxRenewals) {
      return res.status(400).json({ status: 'fail', message: 'Maximum renewals reached' });
    }

    // extend due date by renewalPeriodDays
    const extensionDays = settings?.renewalPeriodDays || 7;
    issue.dueDate = new Date(issue.dueDate.getTime() + extensionDays * 24 * 60 * 60 * 1000);
    issue.renewalCount = (issue.renewalCount || 0) + 1;

    await issue.save();

    res.status(200).json({ status: 'success', data: issue });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.listIssues = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const issues = await BookIssue.find({ schoolId }).populate('book').populate('borrower');
    res.status(200).json({ status: 'success', data: issues });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.listOverdue = async (req, res) => {
  try {
    const schoolId = req.user.schoolId;
    const now = new Date();
    const overdue = await BookIssue.find({ schoolId, status: 'issued', dueDate: { $lt: now } }).populate('book').populate('borrower');
    res.status(200).json({ status: 'success', data: overdue });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.borrowerHistory = async (req, res) => {
  try {
    const { id } = req.params; // borrower id
    const schoolId = req.user.schoolId;
    const history = await BookIssue.find({ schoolId, borrower: id }).populate('book');
    res.status(200).json({ status: 'success', data: history });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
