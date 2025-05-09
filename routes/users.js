const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("../models/User")

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next()
  }
  res.status(401).json({ message: "Unauthorized" })
}

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.session.userId)
    if (user && user.role === "admin") {
      return next()
    }
    res.status(403).json({ message: "Forbidden" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
}

// Get user profile
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).select("-password")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Update user profile
router.put("/profile", isAuthenticated, async (req, res) => {
  try {
    const { fullName, email, department, role, currentPassword, newPassword, confirmPassword } = req.body
    const user = await User.findById(req.session.userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update basic info
    user.fullName = fullName
    user.email = email
    user.department = department

    // Only admin can change role
    if (user.role === "admin") {
      user.role = role
    }

    // Update password if provided
    if (currentPassword && newPassword && confirmPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" })
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match" })
      }

      const salt = await bcrypt.genSalt(10)
      user.password = await bcrypt.hash(newPassword, salt)
    }

    await user.save()
    res.json({ message: "Profile updated successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Get all users (admin only)
router.get("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Create new user (admin only)
router.post("/", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const { username, password, email, fullName, department, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      email,
      fullName,
      department,
      role: role || "staff"
    })

    await user.save()
    res.status(201).json({ message: "User created successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

// Delete user (admin only)
router.delete("/:id", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Prevent deleting self
    if (user._id.toString() === req.session.userId) {
      return res.status(400).json({ message: "Cannot delete your own account" })
    }

    await user.remove()
    res.json({ message: "User deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
