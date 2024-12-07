const db = require("../routes/db-config");
const jwt = require("jsonwebtoken");

const loggedIn = (req, res, next) => {
    // Check if the userRegistered cookie exists
    if (!req.cookies.userRegistered) return next();

    try {
        // Verify the JWT token
        const decoded = jwt.verify(req.cookies.userRegistered, process.env.JWT_SECRET);

        // Query the database for the user by ID
        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return next();
            }

            if (!result.length) return next(); // No user found

            // Attach user data to the request object
            req.user = result[0];
            return next();
        });
    } catch (err) {
        console.error("Error verifying token:", err);
        return next();
    }
};

module.exports = loggedIn;
