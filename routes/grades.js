const express = require("express")
const router = express.Router()
const Grade = require("../models/Grade")
const Student = require("../models/Student")
const Course = require("../models/Course")

// Get all grades
router.get("/", async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate("student", "name rollNo")
      .populate("course", "code name")
      .populate("gradedBy", "fullName")
      .sort({ createdAt: -1 })
    res.json(grades)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get grade by ID
router.get("/:id", async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate("student", "name rollNo")
      .populate("course", "code name")
      .populate("gradedBy", "fullName")
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" })
    }
    res.json(grade)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Create new grade
router.post("/", async (req, res) => {
  try {
    const { student, course, grade, marks, semester, year, remarks } = req.body

    // Check if student exists
    const studentExists = await Student.findById(student)
    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" })
    }

    // Check if course exists
    const courseExists = await Course.findById(course)
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found" })
    }

    // Check if grade already exists for this student and course
    const existingGrade = await Grade.findOne({ student, course, semester, year })
    if (existingGrade) {
      return res.status(400).json({ message: "Grade already exists for this student and course" })
    }

    const newGrade = new Grade({
      student,
      course,
      grade,
      marks,
      semester,
      year,
      remarks,
      gradedBy: req.session.userId,
    })

    await newGrade.save()
    res.status(201).json(newGrade)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Update grade
router.put("/:id", async (req, res) => {
  try {
    const { grade, marks, remarks } = req.body

    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { grade, marks, remarks },
      { new: true }
    )

    if (!updatedGrade) {
      return res.status(404).json({ message: "Grade not found" })
    }

    res.json(updatedGrade)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Delete grade
router.delete("/:id", async (req, res) => {
  try {
    const grade = await Grade.findByIdAndDelete(req.params.id)
    if (!grade) {
      return res.status(404).json({ message: "Grade not found" })
    }
    res.json({ message: "Grade deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get grades by student
router.get("/student/:studentId", async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate("course", "code name credits")
      .populate("gradedBy", "fullName")
      .sort({ year: -1, semester: -1 })
    res.json(grades)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get grades by course
router.get("/course/:courseId", async (req, res) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId })
      .populate("student", "name rollNo")
      .populate("gradedBy", "fullName")
      .sort({ marks: -1 })
    res.json(grades)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get student GPA
router.get("/gpa/:studentId", async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate("course", "credits")

    let totalCredits = 0
    let totalPoints = 0

    const gradePoints = {
      "A+": 4.0,
      "A": 4.0,
      "A-": 3.7,
      "B+": 3.3,
      "B": 3.0,
      "B-": 2.7,
      "C+": 2.3,
      "C": 2.0,
      "C-": 1.7,
      "D+": 1.3,
      "D": 1.0,
      "F": 0.0,
    }

    grades.forEach((grade) => {
      const points = gradePoints[grade.grade] * grade.course.credits
      totalPoints += points
      totalCredits += grade.course.credits
    })

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0

    res.json({
      gpa: gpa.toFixed(2),
      totalCredits,
      totalPoints,
    })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get course statistics
router.get("/stats/course/:courseId", async (req, res) => {
  try {
    const grades = await Grade.find({ course: req.params.courseId })

    const stats = {
      totalStudents: grades.length,
      averageMarks: 0,
      highestMarks: 0,
      lowestMarks: 100,
      gradeDistribution: {
        "A+": 0,
        "A": 0,
        "A-": 0,
        "B+": 0,
        "B": 0,
        "B-": 0,
        "C+": 0,
        "C": 0,
        "C-": 0,
        "D+": 0,
        "D": 0,
        "F": 0,
      },
    }

    if (grades.length > 0) {
      let totalMarks = 0
      grades.forEach((grade) => {
        totalMarks += grade.marks
        stats.highestMarks = Math.max(stats.highestMarks, grade.marks)
        stats.lowestMarks = Math.min(stats.lowestMarks, grade.marks)
        stats.gradeDistribution[grade.grade]++
      })
      stats.averageMarks = totalMarks / grades.length
    }

    res.json(stats)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router 