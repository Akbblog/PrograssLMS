const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const bookSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
    title: { type: String, required: true },
    author: { type: String },
    isbn: { type: String, unique: true, sparse: true },
    publisher: { type: String },
    category: { type: ObjectId, ref: 'BookCategory' },
    subcategory: { type: String },
    quantity: { type: Number, default: 1 },
    availableQuantity: { type: Number, default: 1 },
    location: { type: String },
    coverImage: { type: String },
    description: { type: String },
    publishedYear: { type: Number },
    status: { type: String, enum: ['available', 'damaged', 'lost'], default: 'available' },
    barcode: { type: String },
    qrCode: { type: String },
    purchaseDate: { type: Date },
    purchasePrice: { type: Number },
    tags: [{ type: String }],
    createdBy: { type: ObjectId, ref: 'Admin' }
  },
  {
    timestamps: true,
  }
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
