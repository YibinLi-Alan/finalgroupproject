const express = require("express");
const router = express.Router();
const loggedIn = require("../controller/loggedIn");
const path = require("path");
const logout = require("../controller/logout");
const { upload, docxtopdf } = require("../controller/docxtopdf");
const isAuthenticated = require("../middleware/auth"); // Import middleware
const db = require("../routes/db-config");


////////////////////////////////////////////////
router.post("/delete-history/:id", loggedIn, (req, res) => {
    const id = req.params.id; // Get the history entry ID from the route parameter
    const userId = req.user.id; // Ensure the logged-in user's ID matches the entry's owner

    // Delete the file and its database record
    const query = "SELECT file_path FROM pdf_history WHERE id = ? AND userid = ?";
    db.query(query, [id, userId], (err, results) => {
        if (err || results.length === 0) {
            console.error("Error finding history entry or unauthorized access:", err || "Not found");
            return res.status(404).send("History entry not found or unauthorized.");
        }

        const filePath = results[0].file_path;

        // Delete the file from the server
        const fs = require("fs");
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
                console.error("Error deleting file from server:", unlinkErr);
            }
        });

        // Delete the database record
        const deleteQuery = "DELETE FROM pdf_history WHERE id = ? AND userid = ?";
        db.query(deleteQuery, [id, userId], (deleteErr) => {
            if (deleteErr) {
                console.error("Error deleting history entry from database:", deleteErr);
                return res.status(500).send("Error deleting history entry.");
            }

            console.log("History entry deleted successfully.");
            res.redirect("/history"); // Redirect to the history page
        });
    });
});
////////////////////////////////////////////////

// Route to render an index page
router.get("/", loggedIn, (req, res) => {
    //console.log("User object in route:", req.user); // Debugging
    if (req.user) {
        res.render("index", { status: "loggedIn", user: req.user });
    } else {
        res.render("index", { status: "no", user: "nothing" });
    }
});

// Route to serve register.html
router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: path.join(__dirname, "../public") });
});

// Route to serve login.html
router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: path.join(__dirname, "../public") });
});



// Serve the DOCX to PDF HTML page
router.get("/docxtopdf",isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../views/docxtopdf.html"));
});


// Handle the file upload and PDF conversion
router.post("/docxtopdf",isAuthenticated, upload, docxtopdf);


////////////////////////////
// Route to fetch and display PDF history
router.get("/history",isAuthenticated, loggedIn, (req, res) => {
    if (!req.user || !req.user.id) {
        return res.status(403).send("You must be logged in to view your history.");
    }

    const query = "SELECT * FROM pdf_history WHERE userid = ? ORDER BY created_at DESC";
    db.query(query, [req.user.id], (err, results) => {
        if (err) {
            console.error("Error fetching PDF history:", err);
            res.status(500).send("Error fetching PDF history.");
        } else {
            res.render("history", { history: results });
        }
    });
});

////////////////////////////////

router.get("/logout",logout)
module.exports = router;
