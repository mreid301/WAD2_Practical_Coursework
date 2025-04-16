# 💃 Local Dance Lessons – Web Application

## 📝 Project Description

This web application allows users to register, log in, browse and join dance courses, and manage their account.  
Admins can manage all courses and view participants.  
Built using **Node.js**, **Express**, **Mustache**, **NeDB**, and **Bootstrap**.

---

## 🔧 Installation Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**  
   Create a `.env` file in the root directory:
   ```
   ACCESS_TOKEN_SECRET=your_jwt_secret_here
   PORT=3000
   ```

3. **Run the Application**
   ```bash
   node index.js
   ```
   Open your browser and navigate to: [http://localhost:10000](http://localhost:10000)

---

## Features & How to Use Them

### User Registration & Login
- Go to `/register` to sign up with username, forename, surname, email, and password.
- Login at `/login`.

### View All Courses
- Visit `/courses` to browse all available courses.
- Use the search bar to filter by name or location.

### Join a Course
- Logged-in users can click **Join** next to any course.
- Joined courses appear in `/courses/mine`.

### Leave a Course
- Users can remove themselves from enrolled courses on `/courses/mine`.

### View My Courses
- Shows only the user's joined courses.

### Admin Functionality
Admins (set via `userModel.create`) can:
- Add, edit, and delete courses
- View participant lists

### Flash Messages
- Shown after login, join, logout, or errors.

### Search & Pagination
- Search courses by name or location.
- Basic pagination supported.

### Responsive Design
- Fully styled with Bootstrap for mobile and desktop usability.

---

## Roles and Permissions

| Feature              | Guest | Regular User | Admin |
|----------------------|:-----:|:------------:|:-----:|
| View Courses         | ✅    | ✅           | ✅    |
| Join/Leave Course    | ❌    | ✅           | ❌    |
| Add/Edit/Delete      | ❌    | ❌           | ✅    |
| View Participants    | ❌    | ❌           | ✅    |
| Access Dashboard     | ❌    | ✅           | ✅    |

---

## Testing

Please see the Test-Report.docx.

---

## Deployment

The application is deployed live on **Render** via: [https://dance-course-app.onrender.com](https://dance-course-app.onrender.com)

Developed by **Matthew Reid (S1827209)**  
As part of the **Web Application Development 2** coursework at Glasgow Caledonian University.
