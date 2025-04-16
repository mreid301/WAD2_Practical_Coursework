/*
 * Page: User Routes
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Dependencies ======
const express = require('express'); // Import Express framework
const router = express.Router(); // Create a new Express router
const { login, verify } = require('../auth/auth'); // Import authentication middleware
const userController = require('../controllers/userController'); // Import user controller

// ====== Authentication Routes ======
router.get('/login', userController.loginForm); // Display the login form
router.post('/login', login, userController.handleLogin); // Handle login submissions
router.get('/logout', verify, userController.logout); // Handle user logout

// ====== Registration Routes ======
router.get('/register', userController.registerForm); // Display the registration form
router.post('/register', userController.handleRegister); // Handle registration submissions

// ====== User Dashboard Route ======
router.get('/dashboard', verify, userController.dashboard); // Display the user dashboard

// ====== Default Route ======
router.get('/', (req, res) => res.redirect('/courses')); // Redirect to courses route

module.exports = router; // Export the router