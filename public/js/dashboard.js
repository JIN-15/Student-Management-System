document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  const navLinks = document.querySelectorAll(".sidebar-nav a[data-section]")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // Hide all sections
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active")
      })

      // Show selected section
      const sectionId = this.getAttribute("data-section")
      document.getElementById(sectionId).classList.add("active")

      // Update active nav link
      navLinks.forEach((navLink) => {
        navLink.parentElement.classList.remove("active")
      })
      this.parentElement.classList.add("active")
    })
  })

  // Modal functionality
  const modals = document.querySelectorAll(".modal")
  const modalTriggers = {
    "add-student-btn": "add-student-modal",
    "edit-student-btn": "edit-student-modal",
    "delete-student-btn": "delete-confirm-modal",
    "delete-dept-students": "delete-dept-confirm-modal",
  }

  // Open modal
  Object.keys(modalTriggers).forEach((triggerId) => {
    const trigger = document.getElementById(triggerId)
    if (trigger) {
      trigger.addEventListener("click", () => {
        const modalId = modalTriggers[triggerId]
        document.getElementById(modalId).classList.add("active")
      })
    }
  })

  // Close modal with X button
  document.querySelectorAll(".close-modal").forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      closeBtn.closest(".modal").classList.remove("active")
    })
  })

  // Close modal with Cancel button
  document.querySelectorAll(".cancel-modal").forEach((cancelBtn) => {
    cancelBtn.addEventListener("click", () => {
      cancelBtn.closest(".modal").classList.remove("active")
    })
  })

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active")
      }
    })
  })

  // Fetch all students
  fetchStudents()

  // Add student form submission
  const addStudentForm = document.getElementById("add-student-form")
  if (addStudentForm) {
    addStudentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const studentData = {
        name: document.getElementById("student-name").value,
        rollNo: Number.parseInt(document.getElementById("student-rollno").value),
        department: document.getElementById("student-department").value,
      }

      fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to add student")
          }
          return response.json()
        })
        .then((data) => {
          // Close modal
          document.getElementById("add-student-modal").classList.remove("active")

          // Reset form
          addStudentForm.reset()

          // Refresh student list
          fetchStudents()

          // Show success message
          alert("Student added successfully!")
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Failed to add student. Please try again.")
        })
    })
  }

  // Edit student form submission
  const editStudentForm = document.getElementById("edit-student-form")
  if (editStudentForm) {
    editStudentForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const studentId = document.getElementById("edit-student-id").value
      const studentData = {
        name: document.getElementById("edit-student-name").value,
        rollNo: Number.parseInt(document.getElementById("edit-student-rollno").value),
        department: document.getElementById("edit-student-department").value,
      }

      fetch(`/api/students/${studentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to update student")
          }
          return response.json()
        })
        .then((data) => {
          // Close modal
          document.getElementById("edit-student-modal").classList.remove("active")

          // Refresh student list
          fetchStudents()

          // Show success message
          alert("Student updated successfully!")
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Failed to update student. Please try again.")
        })
    })
  }

  // Delete student confirmation
  const confirmDeleteBtn = document.getElementById("confirm-delete-btn")
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      const studentId = confirmDeleteBtn.getAttribute("data-student-id")

      fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete student")
          }
          return response.json()
        })
        .then((data) => {
          // Close modal
          document.getElementById("delete-confirm-modal").classList.remove("active")

          // Refresh student list
          fetchStudents()

          // Show success message
          alert("Student deleted successfully!")
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Failed to delete student. Please try again.")
        })
    })
  }

  // Delete department students confirmation
  const confirmDeleteDeptBtn = document.getElementById("confirm-delete-dept-btn")
  if (confirmDeleteDeptBtn) {
    confirmDeleteDeptBtn.addEventListener("click", () => {
      const department = confirmDeleteDeptBtn.getAttribute("data-department")

      fetch(`/api/students/deleteByDept/${department}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to delete department students")
          }
          return response.json()
        })
        .then((data) => {
          // Close modal
          document.getElementById("delete-dept-confirm-modal").classList.remove("active")

          // Refresh student list
          fetchStudents()

          // Show success message
          alert(`${data.message}`)
        })
        .catch((error) => {
          console.error("Error:", error)
          alert("Failed to delete department students. Please try again.")
        })
    })
  }

  // Department view buttons
  document.querySelectorAll(".view-dept-students").forEach((btn) => {
    btn.addEventListener("click", function () {
      const department = this.getAttribute("data-dept")

      // Switch to students section
      document.querySelectorAll(".content-section").forEach((section) => {
        section.classList.remove("active")
      })
      document.getElementById("students-section").classList.add("active")

      // Update active nav link
      navLinks.forEach((navLink) => {
        navLink.parentElement.classList.remove("active")
      })
      document.querySelector('.sidebar-nav a[data-section="students-section"]').parentElement.classList.add("active")

      // Set department filter
      document.getElementById("department-filter").value = department

      // Trigger filter change
      const event = new Event("change")
      document.getElementById("department-filter").dispatchEvent(event)
    })
  })

  // Department delete buttons
  document.querySelectorAll(".delete-dept-students").forEach((btn) => {
    btn.addEventListener("click", function () {
      const department = this.getAttribute("data-dept")

      // Set department in delete confirmation modal
      document.getElementById("confirm-delete-dept-btn").setAttribute("data-department", department)

      // Show delete confirmation modal
      document.getElementById("delete-dept-confirm-modal").classList.add("active")
    })
  })

  // Student search filter
  const studentSearch = document.getElementById("student-search")
  if (studentSearch) {
    studentSearch.addEventListener("input", filterStudents)
  }

  // Department filter
  const departmentFilter = document.getElementById("department-filter")
  if (departmentFilter) {
    departmentFilter.addEventListener("change", filterStudents)
  }

  // Update department counts
  updateDepartmentCounts()
})

// Fetch all students
function fetchStudents() {
  fetch("/api/students")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }
      return response.json()
    })
    .then((students) => {
      // Update total students count
      document.querySelector(".total-students").textContent = students.length

      // Update department counts
      updateDepartmentCounts()

      // Populate students table
      const tableBody = document.querySelector("#students-table tbody")

      if (students.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="4" class="loading-message">No students found</td></tr>'
        return
      }

      let tableHTML = ""

      students.forEach((student) => {
        tableHTML += `
          <tr data-id="${student._id}" data-name="${student.name}" data-rollno="${student.rollNo}" data-department="${student.department}">
            <td>${student.name}</td>
            <td>${student.rollNo}</td>
            <td>${student.department}</td>
            <td>
              <div class="action-buttons">
                <button class="btn btn-sm btn-primary edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `
      })

      tableBody.innerHTML = tableHTML

      // Add event listeners to edit buttons
      document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const row = this.closest("tr")
          const studentId = row.getAttribute("data-id")
          const studentName = row.getAttribute("data-name")
          const studentRollNo = row.getAttribute("data-rollno")
          const studentDepartment = row.getAttribute("data-department")

          // Populate edit form
          document.getElementById("edit-student-id").value = studentId
          document.getElementById("edit-student-name").value = studentName
          document.getElementById("edit-student-rollno").value = studentRollNo
          document.getElementById("edit-student-department").value = studentDepartment

          // Show edit modal
          document.getElementById("edit-student-modal").classList.add("active")
        })
      })

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
          const row = this.closest("tr")
          const studentId = row.getAttribute("data-id")

          // Set student ID in delete confirmation modal
          document.getElementById("confirm-delete-btn").setAttribute("data-student-id", studentId)

          // Show delete confirmation modal
          document.getElementById("delete-confirm-modal").classList.add("active")
        })
      })

      // Filter students based on current filters
      filterStudents()
    })
    .catch((error) => {
      console.error("Error:", error)
      const tableBody = document.querySelector("#students-table tbody")
      tableBody.innerHTML = '<tr><td colspan="4" class="loading-message">Error loading students</td></tr>'
    })
}

// Filter students based on search and department filter
function filterStudents() {
  const searchTerm = document.getElementById("student-search").value.toLowerCase()
  const departmentFilter = document.getElementById("department-filter").value

  const rows = document.querySelectorAll("#students-table tbody tr")

  rows.forEach((row) => {
    const name = row.getAttribute("data-name").toLowerCase()
    const rollNo = row.getAttribute("data-rollno").toLowerCase()
    const department = row.getAttribute("data-department")

    const matchesSearch = name.includes(searchTerm) || rollNo.includes(searchTerm)
    const matchesDepartment = departmentFilter === "" || department === departmentFilter

    if (matchesSearch && matchesDepartment) {
      row.style.display = ""
    } else {
      row.style.display = "none"
    }
  })
}

// Update department counts
function updateDepartmentCounts() {
  fetch("/api/students")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch students")
      }
      return response.json()
    })
    .then((students) => {
      // Count departments
      const departments = {}
      students.forEach((student) => {
        if (!departments[student.department]) {
          departments[student.department] = 0
        }
        departments[student.department]++
      })

      // Update department count elements
      document.querySelectorAll(".department-count").forEach((element) => {
        const dept = element.getAttribute("data-dept")
        element.textContent = departments[dept] || 0
      })

      // Update total departments count
      document.querySelector(".total-departments").textContent = Object.keys(departments).length
    })
    .catch((error) => {
      console.error("Error:", error)
    })
}
