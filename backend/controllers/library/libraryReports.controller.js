const Book = require('../../models/Library/Book.model');
const BookIssue = require('../../models/Library/BookIssue.model');
const { getPrisma } = require('../../lib/prismaClient');

exports.getStats = async (req, res) => {
  try {
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const prisma = getPrisma();
    if (prisma) {
      try {
        // If Prisma client doesn't have Book model (schema without library), short-circuit
        if (!prisma.book) {
          return res.status(200).json({ status: 'success', data: { totalBooks: 0, issuedCount: 0, overdueCount: 0, mostBorrowed: [] } });
        }
        const totalBooks = await prisma.book.count({ where: { schoolId } });
        const issuedCount = await prisma.bookIssue.count({ where: { schoolId, status: 'issued' } });
        const overdueCount = await prisma.bookIssue.count({ where: { schoolId, status: 'issued', dueDate: { lt: new Date() } } });

        // Most borrowed via groupBy
        let mostBorrowed = [];
        try {
          const grouped = await prisma.bookIssue.groupBy({
            by: ['bookId'],
            where: { schoolId },
            _count: { _all: true },
            orderBy: { _count: { _all: 'desc' } },
            take: 10
          });
          const mapped = await Promise.all(grouped.map(async g => {
            const book = await prisma.book.findUnique({ where: { id: g.bookId } });
            return { book, count: g._count._all };
          }));
          mostBorrowed = mapped;
        } catch (e) {
          console.warn('[Prisma][Library] groupBy failed', e.message);
        }

        return res.status(200).json({ status: 'success', data: { totalBooks, issuedCount, overdueCount, mostBorrowed } });
      } catch (e) {
        console.warn('[Prisma][Library] getStats fallback failed', e.message);
        // fall through to mongoose implementation
      }
    }

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
