const express = require("express")
const router = express.Router()
const Student = require("../models/Student")
const mongoose = require("mongoose")

// Question 1: Basic CRUD operations

// POST /students - Add a student
router.post("/", async (req, res) => {
  try {
    const { name, rollNo, department } = req.body

    // Check if student with rollNo already exists
    const existingStudent = await Student.findOne({ rollNo })
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this Roll No already exists" })
    }

    const student = new Student({
      name,
      rollNo,
      department,
    })

    const savedStudent = await student.save()
    res.status(201).json(savedStudent)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /students - Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 })
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Search student by roll number
router.get("/search", async (req, res) => {
  try {
    const { name, rollNo, department, createdAt, sortBy, sortOrder } = req.query
    const query = {}

    // Build search query
    if (name) {
      query.name = { $regex: name, $options: "i" }
    }
    if (rollNo) {
      query.rollNo = rollNo
    }
    if (department) {
      query.department = department
    }
    if (createdAt) {
      const date = new Date(createdAt)
      const nextDate = new Date(date)
      nextDate.setDate(date.getDate() + 1)
      query.createdAt = {
        $gte: date,
        $lt: nextDate
      }
    }

    // Build sort options
    const sortOptions = {}
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1
    }

    const students = await Student.find(query).sort(sortOptions)
    res.json(students)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get students by department
router.get("/department/:department", async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.department })
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get top 5 students by department
router.get("/department/:department/top5", async (req, res) => {
  try {
    const students = await Student.find({ department: req.params.department })
      .sort({ createdAt: -1 })
      .limit(5)
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// Get top 5 students overall
router.get("/top5", async (req, res) => {
  try {
    const students = await Student.find()
      .sort({ createdAt: -1 })
      .limit(5)
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /students/:id - Get a student by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" })
    }
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }
    res.json(student)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// PUT /students/:id - Update a student by ID
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" })
    }

    const { name, rollNo, department } = req.body

    // Check if rollNo is being updated and already exists
    if (rollNo) {
      const existingStudent = await Student.findOne({
        rollNo,
        _id: { $ne: req.params.id },
      })

      if (existingStudent) {
        return res.status(400).json({ message: "Student with this roll number already exists" })
      }
    }

    const student = await Student.findByIdAndUpdate(req.params.id, { name, rollNo, department }, { new: true, runValidators: true })

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json(student)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// DELETE /students/:id - Delete a student by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid student ID" })
    }

    const student = await Student.findByIdAndDelete(req.params.id)

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json({ message: "Student deleted successfully" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// PUT /students/updateByRoll/:rollNo - Update by rollNo
router.put("/updateByRoll/:rollNo", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollNo: req.params.rollNo },
      { department: req.body.department },
      { new: true },
    )

    if (!student) {
      return res.status(404).json({ message: "Student not found" })
    }

    res.json(student)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// DELETE /students/deleteByDept/:dept - Delete by department
router.delete("/deleteByDept/:dept", async (req, res) => {
  try {
    const { dept } = req.params;
    const result = await Student.deleteMany({ department: dept });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: `No students found in ${dept} department` });
    }
    
    res.json({ 
      message: `Successfully deleted ${result.deletedCount} students from ${dept} department`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

// Question 2: Advanced find() operations

// GET /students/cs - Find all CS students
router.get("/department/cs", async (req, res) => {
  try {
    const students = await Student.find({ department: "CS" })
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /students/names - Find only names
router.get("/projection/names", async (req, res) => {
  try {
    const students = await Student.find({}, { name: 1, _id: 0 })
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /students/sorted - Sorted students
router.get("/sorted/rollno", async (req, res) => {
  try {
    const students = await Student.find().sort({ rollNo: 1 })
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /students/top5 - Limited results
router.get("/limit/top5", async (req, res) => {
  try {
    const students = await Student.find().limit(5)
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

// GET /students/startsWithA - Regex: Name starts with A
router.get("/regex/startswitha", async (req, res) => {
  try {
    const students = await Student.find({ name: /^A/ })
    res.json(students)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
