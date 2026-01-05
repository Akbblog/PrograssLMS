const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const bookSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true, index: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    
    // Authors as array of strings
    authors: [{ type: String, required: true }],
    
    isbn: { type: String, unique: true, sparse: true, index: true },
    publisher: { type: String, required: true },
    publishedYear: { type: Number },
    edition: { type: String },
    language: { type: String, default: 'English' },
    
    // Category can be a reference or string depending on implementation. 
    // Keeping mixed approaches support or sticking to String as per prompt interface unless Category model is critical.
    category: { type: String, required: true }, 
    subcategory: { type: String },
    
    description: { type: String },
    coverImage: { type: String }, // URL
    
    // Inventory
    totalCopies: { type: Number, required: true, min: 0 },
    availableCopies: { type: Number, required: true, min: 0 },
    
    // Location
    location: {
      shelf: { type: String },
      row: { type: String }
    },
    
    // Acquisition
    acquisitionInfo: {
      dateReceived: { type: Date },
      source: { type: String, enum: ['purchased', 'donated', 'sponsored'], default: 'purchased' },
      vendor: { type: String },
      price: { type: Number }
    },

    status: { type: String, enum: ['available', 'low_stock', 'out_of_stock', 'discontinued'], default: 'available' },
    tags: [{ type: String }],
    
    createdBy: { type: ObjectId, ref: 'Admin' }
  },
  {
    timestamps: true,
  }
);

// Indexes for searching
bookSchema.index({ title: 'text', 'authors': 'text', isbn: 'text' });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
