const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const bookCategorySchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true },
    name: { type: String, required: true },
    description: { type: String },
    parentCategory: { type: ObjectId, ref: 'BookCategory' },
    icon: { type: String },
    color: { type: String },
  },
  {
    timestamps: true,
  }
);

const BookCategory = mongoose.model('BookCategory', bookCategorySchema);

module.exports = BookCategory;
