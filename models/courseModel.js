/*
 * Page: Course Data Management Model
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Dependencies ======
const Datastore = require('gray-nedb'); // Import NeDB-based database
const { v4: uuidv4 } = require('uuid'); // Import UUID for unique ID generation

// ====== CourseModel Class ======
class CourseModel {
    constructor(dbFilePath) {
        this.db = new Datastore({ filename: dbFilePath || 'courses.db', autoload: true }); // Initialize the database
    };

    // ====== Initialize Database ======
    init() {
        this.db.count({}, (err, count) => {
            if (!err && count === 0) {
                const sample = {
                    id: uuidv4(), // Unique course ID
                    name: "Beginner Salsa", // Sample course name
                    duration: "6 weeks", // Duration of the course
                    datetime: "2025-05-01 18:00", // Start date and time
                    description: "Perfect for newcomers!", // Course description
                    location: "Studio A", // Course location
                    price: "£50", // Course price
                    participants: [] // Empty participant list
                };
                this.db.insert(sample); // Insert sample course
            };
        });
    };

    // ====== Retrieve All Courses ======
    getAllCourses() {
        return new Promise((resolve, reject) => {
            this.db.find({}, (err, docs) => {
                if (err) reject(err); // Handle errors
                else resolve(docs); // Return all courses
            });
        });
    };

    // ====== Add New Course ======
    addCourse(course) {
        course.id = uuidv4(); // Assign unique ID
        course.participants = []; // Initialize participants
        return new Promise((resolve, reject) => {
            this.db.insert(course, (err, newDoc) => {
                if (err) reject(err); // Handle errors
                else resolve(newDoc); // Return newly added course
            });
        });
    };

    // ====== Retrieve Course by ID ======
    getCourseById(id) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ id }, (err, doc) => {
                if (err) reject(err); // Handle errors
                else resolve(doc); // Return the course
            });
        });
    };

    // ====== Update Course ======
    updateCourse(id, updatedCourse) {
        return new Promise((resolve, reject) => {
            this.db.update({ id }, { $set: updatedCourse }, {}, (err, numReplaced) => {
                if (err) reject(err); // Handle errors
                else resolve(numReplaced); // Return number of updated records
            });
        });
    };

    // ====== Delete Course ======
    deleteCourse(id) {
        return new Promise((resolve, reject) => {
            this.db.remove({ id }, {}, (err, numRemoved) => {
                if (err) reject(err); // Handle errors
                else resolve(numRemoved); // Return number of deleted records
            });
        });
    };

    // ====== Join Course ======
    joinCourse(courseId, username) {
        return new Promise((resolve, reject) => {
            this.db.update({ id: courseId }, { $addToSet: { participants: username } }, {}, (err, numUpdated) => {
                if (err) reject(err); // Handle errors
                else resolve(numUpdated); // Return number of updated records
            });
        });
    };

    // ====== Leave Course ======
    leaveCourse(courseId, username) {
        return new Promise((resolve, reject) => {
            this.db.update({ id: courseId }, { $pull: { participants: username } }, {}, (err, numUpdated) => {
                if (err) reject(err); // Handle errors
                else resolve(numUpdated); // Return number of updated records
            });
        });
    };

    // ====== Get Courses by Participant ======
    getCoursesByParticipant(username) {
        return new Promise((resolve, reject) => {
            this.db.find({ participants: username }, (err, docs) => {
                if (err) reject(err); // Handle errors
                else resolve(docs); // Return user courses
            });
        });
    };

    // ====== Get Participants of a Course ======
    getParticipants(courseId) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ id: courseId }, (err, doc) => {
                if (err) reject(err); // Handle errors
                else resolve(doc?.participants || []); // Return participants
            });
        });
    };
};

module.exports = CourseModel; // Export the CourseModel class