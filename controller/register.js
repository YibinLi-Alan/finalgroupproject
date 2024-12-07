const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
    const { email, password: Npassword } = req.body;

    // Validate input
    if (!email || !Npassword) {
        return res.json({ status: "error", error: "Please enter your email and password" });
    }

    try {
        // Check if email already exists
        db.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error("Error querying database:", err);
                return res.status(500).json({ status: "error", error: "Internal server error" });
            }

            if (result[0]) {
                return res.json({ status: "error", error: "Email has already been registered" });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(Npassword, 8);

            // Insert user into database
            db.query(
                'INSERT INTO users SET ?',
                { email: email, password: hashedPassword },
                (error, results) => {
                    if (error) {
                        console.error("Error inserting into database:", error);
                        return res.status(500).json({ status: "error", error: "Internal server error" });
                    }

                    return res.json({ status: "success", success: "User has been registered" });
                }
            );
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        return res.status(500).json({ status: "error", error: "Unexpected error occurred" });
    }
};

module.exports = register;
