/*
 * Page: User Data Access Object (DAO) Model
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Dependencies ======
const Datastore = require('gray-nedb'); // Import NeDB-based database
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const saltRounds = 10; // Define the number of salt rounds for hashing

// ====== UserDAO Class ======
class UserDAO {
    constructor(dbFilePath) {
        // Initialize the database, defaulting to 'users.db'
        this.db = new Datastore({ filename: dbFilePath || 'users.db', autoload: true });

        // Check if an admin user exists, and create one if not
        this.db.findOne({ user: 'admin' }, (err, user) => {
            if (err) {
                console.error('Error checking for admin user:', err); // Log database errors
            } else if (!user) {
                this.create('admin', 'adminpass123', true); // Create default admin user
                console.log('Admin user created: admin / adminpass123'); // Log admin creation
            };
        });
    };

    // ====== Create a New User ======
    create(username, password, isAdmin, forename, surname, email = false) {
        bcrypt.hash(password, saltRounds) // Hash the password with defined salt rounds
        .then(hash => {
            const user = { // Define user object
                user: username, 
                password: hash, 
                isAdmin,
                forename,
                surname,
                email 
            }; 
            this.db.insert(user); // Insert the user into the database
        })
        .catch(err => console.error('Error hashing password:', err)); // Handle hashing errors     
    };

    // ====== Lookup User ======
    lookup(username, cb) {
        this.db.findOne({ user: username }, (err, user) => { // Find user by username
            cb(err, user); // Pass result or error to callback
        });
    };
};

module.exports = new UserDAO(); // Export an instance of UserDAO