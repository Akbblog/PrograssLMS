const Book = require('../../models/Library/Book.model');
const BookIssue = require('../../models/Library/BookIssue.model');

exports.getStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const totalBooks = await Book.countDocuments({ schoolId });
    const issuedCount = await BookIssue.countDocuments({ schoolId, status: 'issued' });
    const overdueCount = await BookIssue.countDocuments({ schoolId, status: 'issued', dueDate: { $lt: new Date() } });

    // Most borrowed books
    const mostBorrowed = await BookIssue.aggregate([
      { $match: { schoolId: schoolId } },
      { $group: { _id: '$book', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'book' } },
      { $unwind: { path: '$book', preserveNullAndEmptyArrays: true } },
      { $project: { book: 1, count: 1 } }
    ]);

    res.status(200).json({ status: 'success', data: { totalBooks, issuedCount, overdueCount, mostBorrowed } });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
