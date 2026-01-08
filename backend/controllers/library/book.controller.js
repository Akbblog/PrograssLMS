const Book = require('../../models/Library/Book.model');
const BookCategory = require('../../models/Library/BookCategory.model');

const usePrisma = process.env.USE_PRISMA === 'true' || process.env.USE_PRISMA === '1';

exports.createBook = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(501).json({ status: 'fail', message: 'Library books are not supported in Prisma mode yet.' });
    }
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const data = { ...req.body, schoolId };
    const book = await Book.create(data);
    res.status(201).json({ status: 'success', data: book });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(200).json({ status: 'success', data: [] });
    }
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const { q, category, status } = req.query;
    const filter = { schoolId };
    if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { author: new RegExp(q, 'i') }, { isbn: new RegExp(q, 'i') }];
    if (category) filter.category = category;
    if (status) filter.status = status;

    const books = await Book.find(filter).populate('category');
    res.status(200).json({ status: 'success', data: books });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(200).json({ status: 'success', data: null });
    }
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const book = await Book.findOne({ _id: id, schoolId }).populate('category');
    if (!book) return res.status(404).json({ status: 'fail', message: 'Book not found' });
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(501).json({ status: 'fail', message: 'Library books are not supported in Prisma mode yet.' });
    }
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const book = await Book.findOneAndUpdate({ _id: id, schoolId }, req.body, { new: true });
    if (!book) return res.status(404).json({ status: 'fail', message: 'Book not found' });
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    if (usePrisma) {
      return res.status(501).json({ status: 'fail', message: 'Library books are not supported in Prisma mode yet.' });
    }
    const { id } = req.params;
    const schoolId = req.user?.schoolId || req.schoolId || req.userAuth?.schoolId || null;
    const book = await Book.findOneAndDelete({ _id: id, schoolId });
    if (!book) return res.status(404).json({ status: 'fail', message: 'Book not found' });
    res.status(200).json({ status: 'success', data: book });
  } catch (error) {
    res.status(400).json({ status: 'fail', message: error.message });
  }
};
