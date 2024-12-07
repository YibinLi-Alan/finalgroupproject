const path = require("path");
const multer = require("multer");
const puppeteer = require("puppeteer");
const mammoth = require("mammoth");
const db = require("../routes/db-config");

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Ensure this directory exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
    },
});
const upload = multer({ storage }).single("file");

// Define the docxtopdf function
const docxtopdf = async (req, res) => {
    if (!req.file) {
        console.error("No file uploaded.");
        return res.status(400).send("No file uploaded.");
    }

    if (!req.user || !req.user.id) {
        console.error("User not authenticated. req.user:", req.user);
        return res.status(403).send("You must be logged in to upload files.");
    }

    const userid = req.user.id; // Get the logged-in user's ID
    const inputFilePath = req.file.path;
    const outputFilePath = `uploads/${Date.now()}_output.pdf`;
    const outputFileName = `${Date.now()}_output.pdf`;

    console.log("File uploaded by user ID:", userid);
    console.log("Input file path:", inputFilePath);

    let browser;
    try {
        // Extract DOCX content as HTML using Mammoth
        const { value: htmlContent } = await mammoth.convertToHtml({ path: inputFilePath });

        if (!htmlContent.trim()) {
            console.error("DOCX content is empty. File path:", inputFilePath);
            return res.status(400).send("The uploaded DOCX file has no readable content.");
        }

        console.log("Extracted DOCX content successfully.");

        // Launch Puppeteer
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
            timeout: 60000, // Increase timeout to 60 seconds
        });

        const page = await browser.newPage();
        console.log("Puppeteer browser launched.");

        // Set the extracted content in Puppeteer
        await page.setContent(`
            <html>
                <body>
                    ${htmlContent}
                </body>
            </html>
        `);

        console.log("Content set in Puppeteer.");

        // Generate PDF from the extracted content
        await page.pdf({ path: outputFilePath, format: "A4" });
        console.log("PDF generated at:", outputFilePath);

        // Save PDF metadata to the database
        const query = "INSERT INTO pdf_history (userid, file_name, file_path) VALUES (?, ?, ?)";
        db.query(query, [userid, outputFileName, outputFilePath], (err, result) => {
            if (err) {
                console.error("Error saving PDF info to database:", err);
                return res.status(500).send("Error saving file information.");
            }
            console.log("PDF info saved to database with ID:", result.insertId);
        });

        // Send the generated PDF to the client
        res.download(outputFilePath, (err) => {
            if (err) {
                console.error("Error sending file to client. Path:", outputFilePath, err);
                return res.status(500).send("Error sending the file.");
            }
            console.log("File sent successfully to the client.");
        });
    } catch (err) {
        console.error("Error during DOCX processing:", err);
        res.status(500).send("An error occurred while processing the DOCX file.");
    } finally {
        if (browser) {
            await browser.close();
            console.log("Puppeteer browser closed.");
        }
    }
};

// Export the middleware and the function
module.exports = { upload, docxtopdf };
