/*
 * Page: Application Entry Point
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Core Dependencies ======
const express = require('express'); // Import Express framework
const mustacheExpress = require('mustache-express'); // Set up Mustache as the templating engine
const path = require('path'); // Handle and resolve file paths
const cookieParser = require('cookie-parser'); // Middleware to parse cookies
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const dotenv = require('dotenv'); // Load environment variables from .env files
const session = require('express-session'); // Manage user sessions
const flash = require('connect-flash'); // Store and access flash messages in session
const jwt = require('jsonwebtoken'); // Handle JSON Web Tokens for authentication

dotenv.config(); // Configure dotenv to load environment variables

// ====== Application Instance ======
const app = express(); // Create an Express application instance

// ====== Routes ======
const userRoutes = require('./routes/userRoutes'); // Import user-related routes
const courseRoutes = require('./routes/courseRoutes'); // Import course-related routes

// ====== View Engine Setup ======
app.engine('mustache', mustacheExpress()); // Configure Mustache as the template engine
app.set('view engine', 'mustache'); // Set Mustache as the default view engine
app.set('views', path.join(__dirname, 'views')); // Specify the directory for view templates

// ====== Middleware ======
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css'))); // Serve Bootstrap CSS
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// JWT verification for authentication
app.use((req, res, next) => {
  const token = req.cookies.jwt; // Retrieve JWT from cookies
  if (token) {
    try {
      req.user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Verify and decode JWT
    } catch {
      req.user = null; // Set user to null if JWT verification fails
    }
  }
  next(); // Proceed to the next middleware
});

// Session management
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'secret-key', // Set session secret key
    resave: false, // Avoid resaving unchanged sessions
    saveUninitialized: true // Save uninitialized sessions
  })
);
app.use(flash()); // Enable flash messages

// Flash message and user middleware
app.use((req, res, next) => {
  res.locals.success = req.flash('success'); // Pass success messages to views
  res.locals.error = req.flash('error'); // Pass error messages to views
  res.locals.user = req.user || null; // Pass the current user to views
  next(); // Proceed to the next middleware
});

// ====== Routes Setup ======
app.use('/', userRoutes); // Mount user routes at the root URL
app.use('/courses', courseRoutes); // Mount course routes at /courses

// About page route
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html')); // Serve the About page
});

// ====== Error Handling ======
// 404 error handler
app.use((req, res) => {
  res.status(404).render('error/404', { title: 'Page Not Found' }); // Render 404 error page
});

// 500 error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log the error stack
  res.status(500).render('error/500', { title: 'Server Error' }); // Render 500 error page
});

// ====== Server Initialization ======
const PORT = process.env.PORT || 3000; // Use environment port or default to 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Log server startup message
});