const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const session = require("express-session")
const bcrypt = require("bcryptjs")
const app = express()
const PORT = process.env.PORT || 3000

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/student-management-system"
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(
  session({
    secret: "student-management-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 }, // 1 hour
  }),
)

// Models
const Student = require("./models/Student")
const User = require("./models/User")

// Authentication middleware
const isAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next()
  }
  res.redirect("/login")
}

// Routes
app.use("/api/students", require("./routes/students"))
app.use("/api/users", require("./routes/users"))
app.use("/api/courses", require("./routes/courses"))
app.use("/api/grades", require("./routes/grades"))

// Authentication routes
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"))
})

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.post("/register", async (req, res) => {
  try {
    const { username, password, email, fullName, department } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      return res.status(400).send("User already exists")
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
      role: "staff" // Default role for new registrations
    })

    await user.save()
    res.redirect("/login")
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body

    // Find user
    const user = await User.findOne({ username })
    if (!user) {
      return res.status(400).send("Invalid credentials")
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).send("Invalid credentials")
    }

    // Set session
    req.session.userId = user._id
    res.redirect("/dashboard")
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/login")
})

// Dashboard route
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"))
})

// Search form route (Question 4)
app.get("/search-form", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "search.html"))
})

// Search student route
app.get("/students/search", async (req, res) => {
  try {
    const student = await Student.findOne({ rollNo: req.query.rollNo })

    if (student) {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Student Found</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <div class="container result-container">
            <h2>Student Found</h2>
            <div class="student-card">
              <p><strong>Name:</strong> ${student.name}</p>
              <p><strong>Roll No:</strong> ${student.rollNo}</p>
              <p><strong>Department:</strong> ${student.department}</p>
            </div>
            <a href="/search-form" class="btn btn-primary">Search Again</a>
            <a href="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
          </div>
        </body>
        </html>
      `)
    } else {
      res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Student Not Found</title>
          <link rel="stylesheet" href="/css/styles.css">
        </head>
        <body>
          <div class="container result-container">
            <h2>Student Not Found</h2>
            <p>No student found with Roll No: ${req.query.rollNo}</p>
            <a href="/search-form" class="btn btn-primary">Try Again</a>
            <a href="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
          </div>
        </body>
        </html>
      `)
    }
  } catch (err) {
    console.error(err)
    res.status(500).send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error</title>
        <link rel="stylesheet" href="/css/styles.css">
      </head>
      <body>
        <div class="container result-container">
          <h2>Error</h2>
          <p>An error occurred while searching.</p>
          <a href="/search-form" class="btn btn-primary">Try Again</a>
          <a href="/dashboard" class="btn btn-secondary">Back to Dashboard</a>
        </div>
      </body>
      </html>
    `)
  }
})

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Profile route
app.get("/profile", isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"))
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
