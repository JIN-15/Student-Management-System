const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
    min: 1,
    max: 6,
  },
  instructor: {
    type: String,
    required: true,
  },
  description: String,
  semester: {
    type: String,
    required: true,
    enum: ['Fall', 'Spring', 'Summer'],
  },
  year: {
    type: Number,
    required: true,
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("Course", courseSchema) 