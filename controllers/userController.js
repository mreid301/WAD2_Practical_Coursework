/*
 * Page: User Authentication and Management Middleware
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Dependencies ======
const userModel = require('../models/userModel'); // Import the user model

// ====== Login Routes ======
exports.loginForm = (req, res) => {
    res.render('user/login', { title: 'Login' }); // Render the login form view
};

exports.handleLogin = (req, res) => {
    res.redirect('/dashboard'); // Redirect to dashboard after login
};

// ====== Registration Routes ======
exports.registerForm = (req, res) => {
    res.render('user/register', { title: 'Register' }); // Render the registration form view
};

exports.handleRegister = (req, res) => {
    const { username, password, forename, surname, email } = req.body; // Extract username and password from request body

    userModel.lookup(username, (err, user) => {
        if (user) {
            return res.status(409).render('user/register', { error: 'User already exists' }); // Handle duplicate users
        };
        userModel.create(username, password, false, forename, surname, email); // Create a new user
        req.flash('success', 'Registration successful!'); // Flash success message
        res.redirect('/login'); // Redirect to login after registration
    });
};

// ====== Logout Route ======
exports.logout = (req, res) => {
    res.clearCookie('jwt'); // Clear the JWT cookie
    res.redirect('/'); // Redirect to homepage
};

// ====== Dashboard Route ======
exports.dashboard = (req, res) => {
    res.render('dashboard', { title: 'Dashboard', user: req.user }); // Render the dashboard view with user data
};