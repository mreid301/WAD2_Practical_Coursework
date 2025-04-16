/*
 * Page: Error Handling Middleware
 * Title: WAD2 Practical Coursework
 * Author: Matthew Reid
 * Version: 1.0
 */

// ====== Authorization Middleware ======
module.exports = function (req, res, next) {
    if (req.user && req.user.isAdmin) { // Check if the user exists and is an admin
        next(); // Proceed to the next middleware or route
    } else {
        // ====== Error Handling ======
        res.status(403).render('error/403', { // Render 403 error page for forbidden access
            title: 'Access Denied', // Set the page title
            user: req.user // Pass user data to the error page
        }, (err, html) => {
            if (err) { // Handle rendering errors
                console.error("Render error (403):", err); // Log the render error
                res.status(500).send("Could not render 403 page."); // Send a generic error response
            } else {
                res.send(html); // Send the rendered HTML
            };
        });
    };
};