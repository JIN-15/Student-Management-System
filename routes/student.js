const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const Student = require("../models/Student")
const Course = require("../models/Course")

// Middleware to check if student is authenticated
const isStudentAuthenticated = (req, res, next) => {
  if (req.session.studentId) {
    return next()
  }
  res.redirect("/student/login")
}

// Student login page
router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "student-login.html"))
})

// Student login
router.post("/login", async (req, res) => {
  try {
    const { rollNo, password } = req.body

    // Find student
    const student = await Student.findOne({ rollNo })
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, student.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Set session
    req.session.studentId = student._id
    res.redirect("/student/dashboard")
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Student logout
router.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/student/login")
})

// Student dashboard
router.get("/dashboard", isStudentAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "student-dashboard.html"))
})

// Get student profile
router.get("/profile", isStudentAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.session.studentId).select("-password")
    res.json(student)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get student's registered courses
router.get("/courses", isStudentAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.session.studentId).populate("courses")
    res.json(student.courses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get available courses for registration
router.get("/available-courses", isStudentAuthenticated, async (req, res) => {
  try {
    const student = await Student.findById(req.session.studentId)
    const courses = await Course.find({
      _id: { $nin: student.courses },
      department: student.department
    })
    res.json(courses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Register for a course
router.post("/register-course", isStudentAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.body
    const student = await Student.findById(req.session.studentId)
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (student.courses.includes(courseId)) {
      return res.status(400).json({ message: "Already registered for this course" })
    }

    student.courses.push(courseId)
    course.students.push(student._id)

    await Promise.all([student.save(), course.save()])
    res.json({ message: "Course registered successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Drop a course
router.post("/drop-course", isStudentAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.body
    const student = await Student.findById(req.session.studentId)
    const course = await Course.findById(courseId)

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    if (!student.courses.includes(courseId)) {
      return res.status(400).json({ message: "Not registered for this course" })
    }

    student.courses = student.courses.filter(id => id.toString() !== courseId)
    course.students = course.students.filter(id => id.toString() !== student._id.toString())

    await Promise.all([student.save(), course.save()])
    res.json({ message: "Course dropped successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router 