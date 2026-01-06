const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const ClassLevelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    description: {
      type: String,
    },
    // Multi-tenancy: School this belongs to
    schoolId: {
      type: ObjectId,
      ref: "School",
      required: true,
      index: true,
    },
    createdBy: {
      type: ObjectId,
      ref: "Admin",
      required: true,
    },
    //students will be added to the class level when they are registered
    students: [
      {
        type: ObjectId,
        ref: "Student",
      },
    ],
    //optional.
    subjects: [
      {
        type: ObjectId,
        ref: "Subject",
      },
    ],
    teachers: [
      {
        type: ObjectId,
        ref: "Teacher",
      },
    ],
  },
  { timestamps: true }
);

// Add text index for search fields
ClassLevelSchema.index({
  name: 'text'
});

const ClassLevel = mongoose.models.ClassLevel || mongoose.model("ClassLevel", ClassLevelSchema);

module.exports = ClassLevel;
