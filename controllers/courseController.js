/*
 * Page: Course Management Middleware
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Dependencies ======
const CourseModel = require('../models/courseModel'); // Import course model
const courseDB = new CourseModel(); // Create a new instance of the course model
courseDB.init(); // Initialize the database with a sample course

// ====== View Courses ======
exports.viewCourses = async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Parse page number from query
    const limit = 5; // Set the limit of courses per page
    const search = req.query.search || ''; // Get search query, if any
    const skip = (page - 1) * limit; // Calculate number of courses to skip

    try {
        const allCourses = await courseDB.getAllCourses(); // Retrieve all courses from DB
        const filteredCourses = allCourses.filter(course =>
            course.name.toLowerCase().includes(search.toLowerCase()) || 
            course.location.toLowerCase().includes(search.toLowerCase())
        ); // Filter courses based on search query
        const totalPages = Math.ceil(filteredCourses.length / limit); // Calculate total pages
        const paginatedCourses = filteredCourses.slice(skip, skip + limit); // Paginate courses
        const enhancedCourses = paginatedCourses.map(course =>
            req.user && course.participants?.includes(req.user.username)
                ? { ...course, hasJoined: true } // Mark course as joined for current user
                : course
        ); // Add join status for user
        const prevPage = page > 1 ? page - 1 : null; // Determine previous page
        const nextPage = page < totalPages ? page + 1 : null; // Determine next page

        res.render('courses/courses', {
            title: 'Courses', // Render courses view
            courses: enhancedCourses, 
            user: req.user, 
            search, 
            currentPage: page, 
            totalPages, 
            prevPage, 
            nextPage
        });
    } catch (err) {
        console.error('Error loading courses:', err); // Log error
        res.status(500).send('Server error'); // Send error response
    };
};

// ====== Add Course ======
exports.addCourseForm = (req, res) => {
    res.render('courses/newCourse', { title: 'Add Course', user: req.user }); // Render add course form
};

exports.addCourse = (req, res) => {
    const { name, duration, datetime, description, location, price } = req.body; // Extract course details

    courseDB.addCourse({ name, duration, datetime, description, location, price }) // Add course to DB
        .then(() => res.redirect('/courses')) // Redirect to courses page
        .catch(err => res.status(500).send('Error adding course.')); // Handle error
};

// ====== Update Course ======
exports.updateCourseForm = (req, res) => {
    courseDB.getCourseById(req.params.id) // Retrieve course by ID
    .then(course => res.render('courses/newCourse', { title: 'Edit Course', course, user: req.user })) // Render edit form
    .catch(err => res.status(500).send('Course not found.')); // Handle error
};

exports.updateCourse = (req, res) => {
    courseDB.updateCourse(req.params.id, req.body) // Update course in DB
    .then(() => res.redirect('/courses')) // Redirect to courses page
    .catch(err => res.status(500).send('Error updating course.')); // Handle error
};

// ====== Delete Course ======
exports.deleteCourse = (req, res) => {
    if (!req.user || !req.user.isAdmin) { // Check admin permissions
        req.flash('error', 'You do not have permission to delete this course.');
        return res.redirect('/courses'); // Redirect if not authorized
    };

    courseDB.deleteCourse(req.params.id) // Delete course from DB
    .then(() => {
        req.flash('success', 'Course deleted.'); // Flash success message
        res.redirect('/courses'); // Redirect to courses page
    })
    .catch(err => {
        req.flash('error', 'Error deleting course.'); // Flash error message
        res.redirect('/courses'); // Redirect with error
    });
};

// ====== Join Course ======
exports.joinCourse = (req, res) => {
    const courseId = req.params.id; // Extract course ID from params
    const username = req.user.username; // Get current user's username

    if (req.user.isAdmin) { // Prevent admins from joining courses
        req.flash('error', 'Admins are not allowed to join courses.');
        return res.redirect('/courses'); // Redirect with error
    };

    courseDB.joinCourse(courseId, username) // Add user to course participants
    .then(() => {
        req.flash('success', 'You have joined the course!'); // Flash success message
        res.redirect('/courses'); // Redirect to courses page
    })
    .catch(err => {
        console.error('Error joining course:', err); // Log error
        req.flash('error', 'Could not join the course.'); // Flash error message
        res.redirect('/courses'); // Redirect with error
    });
};

// ====== Leave Course ======
exports.leaveCourse = (req, res) => {
    const courseId = req.params.id; // Extract course ID from params
    const username = req.user.username; // Get current user's username

    courseDB.leaveCourse(courseId, username) // Remove user from course participants
    .then(() => {
        req.flash('success', 'You have left the course.'); // Flash success message
        res.redirect('/courses/mine'); // Redirect to user's courses
    })
    .catch(err => {
        console.error('Error leaving course:', err); // Log error
        req.flash('error', 'Could not leave the course.'); // Flash error message
        res.redirect('/courses/mine'); // Redirect with error
    });
};

// ====== View Participants ======
exports.participantsList = (req, res) => {
    const courseId = req.params.id; // Extract course ID from params

    courseDB.getParticipants(courseId) // Retrieve course participants
    .then(participants => {
        res.render('courses/participants', { 
            title: 'Participants', // Render participants view
            participants, 
            user: req.user 
        });
    })
    .catch(err => res.status(500).send("Error retrieving participants.")); // Handle error
};

// ====== View My Courses ======
exports.viewMyCourses = (req, res) => {
    const username = req.user.username; // Get current user's username

    if (req.user.isAdmin) { // Prevent admins from having enrolled courses
        req.flash('error', 'Admins do not have enrolled courses.');
        return res.redirect('/dashboard'); // Redirect with error
    };

    courseDB.getCoursesByParticipant(username) // Retrieve user's courses
    .then(courses => {
        res.render('myCourses', { 
            title: 'My Enrolled Courses', // Render user's courses view
            courses, 
            user: req.user 
        });
    })
    .catch(err => {
        console.error('Error loading enrolled courses:', err); // Log error
        res.status(500).send('Error loading your courses.'); // Handle error
    });
};