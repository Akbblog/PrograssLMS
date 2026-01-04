const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const bookIssueSchema = new mongoose.Schema(
  {
    schoolId: { type: ObjectId, ref: 'School', required: true },
    book: { type: ObjectId, ref: 'Book', required: true },
    borrower: { type: ObjectId, refPath: 'borrowerType', required: true },
    borrowerType: { type: String, enum: ['Student', 'Teacher'], required: true },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    actualReturnDate: { type: Date },
    status: { type: String, enum: ['issued', 'returned', 'overdue', 'lost'], default: 'issued' },
    fineAmount: { type: Number, default: 0 },
    finePaid: { type: Boolean, default: false },
    issuedBy: { type: ObjectId, ref: 'Admin' },
    returnedTo: { type: ObjectId, ref: 'Admin' },
    renewalCount: { type: Number, default: 0 },
    maxRenewals: { type: Number, default: 2 },
    notes: { type: String }
  },
  {
    timestamps: true,
  }
);

const BookIssue = mongoose.model('BookIssue', bookIssueSchema);

module.exports = BookIssue;
