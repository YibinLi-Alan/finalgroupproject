const jwt = require("jsonwebtoken");
const db = require("../routes/db-config");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ status: "error", error: "Please Enter your email and password" });
        }

        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                return res.status(500).json({ status: "error", error: "Internal server error" });
            }

            if (!result.length || !(await bcrypt.compare(password, result[0].password))) {
                return res.json({ status: "error", error: "Incorrect Email or password" });
            }

            const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES,
            });

            const cookieOptions = {
                expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };

            res.cookie("userRegistered", token, cookieOptions);
            return res.json({ status: "success", success: "User has been logged In", redirect: "/" });
        });
    } catch (err) {
        console.error("Unexpected error:", err);
        res.status(500).json({ status: "error", error: "Unexpected error occurred" });
    }
};

module.exports = login;
