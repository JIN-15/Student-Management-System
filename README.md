# Student Management System

A comprehensive web-based student management system built with Node.js, Express, MongoDB, and modern frontend technologies. The system allows for efficient management of students, courses, and academic activities.

## Features

### For Administrators/Staff
- User authentication and authorization
- Student management (CRUD operations)
- Course management
- Department management
- Dashboard with statistics
- Search functionality for students

### For Students
- Secure login system
- Personal dashboard
- Course registration
- Course management (view and drop courses)
- Profile management

## Technology Stack

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Express Session (for authentication)
- Bcrypt.js (for password hashing)

### Frontend
- HTML5
- Tailwind CSS
- Font Awesome Icons
- Vanilla JavaScript

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/student-management-system.git
cd student-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/student-management-system
SESSION_SECRET=student-management-secret
```

4. Start the server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Login Instructions

### Admin/Staff Login
1. Navigate to `http://localhost:3000/login`
2. Use the following credentials:
   - Username: `admin`
   - Password: `admin123`

### Student Login
1. Navigate to `http://localhost:3000/student/login`
2. Use your credentials:
   - Roll Number: Your assigned roll number
   - Password: The password set during your account creation

Note: 
- For admin accounts: Use the registration page at `http://localhost:3000/register`
- For student accounts: They must be created by an administrator through the admin dashboard
- When creating a student account, the admin must provide:
  - Student's full name
  - Roll number
  - Department
  - Password (this will be the student's login password)

## Student Portal Features

1. Student Information Display
   - Full name
   - Roll number
   - Department
   - Email address

2. Course Management
   - View registered courses
   - Register for new courses
   - Drop courses
   - Search available courses
   - View course details (credits, instructor, description)

3. Account Management
   - Change password
   - Logout functionality

4. Course Registration
   - View available courses in student's department
   - Search courses by name or code
   - View detailed course information
   - Register for courses with one click
   - Drop courses with confirmation

## Project Structure

```
student-management-system/
├── models/
│   ├── Student.js
│   ├── Course.js
│   └── User.js
├── routes/
│   ├── students.js
│   ├── courses.js
│   ├── users.js
│   └── student.js
├── public/
│   ├── student-login.html
│   ├── student-dashboard.html
│   └── css/
├── server.js
└── README.md
```

## Database Schema

### Student Model
```javascript
{
  name: String,
  rollNo: String (unique),
  department: String,
  email: String (unique),
  password: String,
  courses: [Course References],
  createdAt: Date
}
```

### Course Model
```javascript
{
  code: String (unique),
  name: String,
  department: String,
  credits: Number,
  instructor: String,
  description: String,
  semester: String,
  year: Number,
  students: [Student References],
  createdAt: Date
}
```

## API Endpoints

### Authentication Routes
- `POST /register` - Register new staff user
- `POST /login` - Staff login
- `GET /logout` - Logout user

### Student Routes
- `POST /student/login` - Student login
- `GET /student/dashboard` - Student dashboard
- `GET /student/profile` - Get student profile
- `GET /student/courses` - Get student's registered courses
- `GET /student/available-courses` - Get available courses for registration
- `POST /student/register-course` - Register for a course
- `POST /student/drop-course` - Drop a course

### Admin Routes
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Add new course

## Security Features

1. Password Hashing
   - All passwords are hashed using bcrypt before storage

2. Session Management
   - Secure session handling using express-session
   - Session timeout after 1 hour of inactivity

3. Authentication Middleware
   - Protected routes for both students and staff
   - Role-based access control

## Frontend Features

1. Student Dashboard
   - Responsive design using Tailwind CSS
   - Real-time course registration
   - Interactive course management
   - Profile information display

2. Admin Dashboard
   - Student management interface
   - Course management system
   - Search functionality
   - Statistical overview

## Error Handling

- Comprehensive error handling for all API endpoints
- User-friendly error messages
- Proper HTTP status codes
- Client-side validation
- Server-side validation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Support

For support, email support@studentmanagementsystem.com or create an issue in the repository. 