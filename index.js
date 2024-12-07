const express = require("express");
const db = require("./routes/db-config");
const app = express();
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 3000;
const path = require("path");

// Serve static files
app.use("/js", express.static(__dirname + "/public/js"));
app.use("/css", express.static(__dirname + "/public/css"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});


// Set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Middleware
app.use(cookieParser());
app.use(express.json());

// Database connection
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        process.exit(1); // Exit process if database connection fails
    }
    console.log("Database connected");
});

// Routers
app.use("/", require("./routes/pages"));
app.use("/api", require("./controller/auth"));

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
