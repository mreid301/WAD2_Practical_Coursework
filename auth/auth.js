/*
 * Page: Login and Verification Middleware
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Dependencies ======
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const jwt = require('jsonwebtoken'); // Import JSON Web Token library for authentication
const userModel = require('../models/userModel'); // Import the user model

// ====== Login Function ======
exports.login = (req, res, next) => {
    const { username, password } = req.body; // Extract username and password from request body

    userModel.lookup(username, (err, user) => {
        if (err) return res.status(500).send("Server error"); // Handle server error
        if (!user) return res.status(401).render("user/login", { error: "User not found" }); // Handle unknown user

        bcrypt.compare(password, user.password, (err, result) => {
            if (err || !result) return res.status(403).render("user/login", { error: "Invalid password" }); // Handle invalid password

            const token = jwt.sign(
                { username: user.user, isAdmin: user.isAdmin }, // Create JWT payload
                process.env.ACCESS_TOKEN_SECRET, // Use secret from environment variables
                { expiresIn: '1h' } // Set token expiration time
            );
            res.cookie("jwt", token, { httpOnly: true }); // Set JWT as an HTTP-only cookie
            next(); // Proceed to next middleware
        });
    });
};

// ====== Verify Function ======
exports.verify = (req, res, next) => {
    const token = req.cookies.jwt; // Extract JWT from cookies

    if (!token) return res.status(403).render("user/login", { error: "Please login to continue" }); // Handle missing token

    try {
        req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify and decode JWT
        next(); // Proceed to next middleware
    } catch (err) {
        return res.status(401).render("user/login", { error: "Invalid or expired session" }); // Handle invalid or expired token
    };
};