/*
 * Page: Course Routes
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Dependencies ======
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new Express router
const { verify } = require('../auth/auth'); // Import middleware for authentication
const isAdmin = require('../auth/admin'); // Import middleware for admin verification
const courseController = require('../controllers/courseController'); // Import course controller

// ====== Course Management ======
router.get('/', courseController.viewCourses); // View all courses
router.get('/add', verify, isAdmin, courseController.addCourseForm); // Display form to add a new course
router.post('/add', verify, isAdmin, courseController.addCourse); // Handle new course submission
router.get('/update/:id', verify, isAdmin, courseController.updateCourseForm); // Display form to update a course
router.post('/update/:id', verify, isAdmin, courseController.updateCourse); // Handle course update submission
router.post('/delete/:id', verify, isAdmin, courseController.deleteCourse); // Handle course deletion

// ====== Course Interaction ======
router.post('/join/:id', verify, courseController.joinCourse); // Join a course
router.post('/leave/:id', verify, courseController.leaveCourse); // Leave a course
router.get('/mine', verify, courseController.viewMyCourses); // View user's enrolled courses

// ====== Participant Management ======
router.get('/participants/:id', verify, courseController.participantsList); // View participants in a course

module.exports = router; // Export the router