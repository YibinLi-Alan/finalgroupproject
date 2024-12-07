const sql = require("mysql"); // Import the MySQL module
const dotenv = require("dotenv").config(); // Load environment variables

// Create the MySQL connection
const db = sql.createConnection({ // Use `sql.createConnection` instead of `createConnection`
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE // Ensure your .env has the DATABASE variable set
});

// Export the connection
module.exports = db;
