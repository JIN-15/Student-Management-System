const mongoose = require("mongoose")

const GradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  grade: {
    type: String,
    required: true,
    enum: ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "F"],
  },
  marks: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  semester: {
    type: String,
    required: true,
    enum: ["Fall", "Spring", "Summer"],
  },
  year: {
    type: Number,
    required: true,
  },
  remarks: {
    type: String,
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Update the updatedAt timestamp before saving
GradeSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

module.exports = mongoose.model("Grade", GradeSchema) 