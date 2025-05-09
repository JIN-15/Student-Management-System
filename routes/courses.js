const express = require("express")
const router = express.Router()
const Course = require("../models/Course")

// Get all courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get course by ID
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }
    res.json(course)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Create new course
router.post("/", async (req, res) => {
  try {
    const { code, name, department, credits, description, instructor, semester, year } = req.body

    // Check if course with code already exists
    const existingCourse = await Course.findOne({ code })
    if (existingCourse) {
      return res.status(400).json({ message: "Course with this code already exists" })
    }

    const course = new Course({
      code,
      name,
      department,
      credits,
      description,
      instructor,
      semester,
      year,
    })

    await course.save()
    res.status(201).json(course)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Update course
router.put("/:id", async (req, res) => {
  try {
    const { code, name, department, credits, description, instructor, semester, year } = req.body

    // Check if code is being updated and already exists
    if (code) {
      const existingCourse = await Course.findOne({
        code,
        _id: { $ne: req.params.id },
      })
      if (existingCourse) {
        return res.status(400).json({ message: "Course with this code already exists" })
      }
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { code, name, department, credits, description, instructor, semester, year },
      { new: true }
    )

    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }

    res.json(course)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Delete course
router.delete("/:id", async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id)
    if (!course) {
      return res.status(404).json({ message: "Course not found" })
    }
    res.json({ message: "Course deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get courses by department
router.get("/department/:department", async (req, res) => {
  try {
    const courses = await Course.find({ department: req.params.department })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get courses by semester and year
router.get("/semester/:semester/:year", async (req, res) => {
  try {
    const courses = await Course.find({
      semester: req.params.semester,
      year: parseInt(req.params.year),
    })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router 