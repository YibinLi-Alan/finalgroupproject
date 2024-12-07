const jwt = require("jsonwebtoken");

const isAuthenticated = (req, res, next) => {
    const token = req.cookies.userRegistered;

    if (!token) {
        // No token means the user is not logged in
        return res.redirect("/login");
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error("Invalid token:", err.message);
        return res.redirect("/login");
    }
};

module.exports = isAuthenticated;
