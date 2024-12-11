# Word to PDF Converter
A simple and efficient tool that can convert Word files (.docx) to PDF files, supporting historical backtracking

## Function
- Account security: registration and login required
- Support multiple platforms
- Keep past conversion results for easy download

## Installation and Configuration

### 1. Install Homebrew
Ensure that your system has Homebrew installed. If not, you can install it using the following command:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Set Homebrew Environment
Run the following commands to add the Homebrew environment variables to your `.zprofile` file:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### 3. Install Node.js
Install Node.js using Homebrew:

```bash
brew install node
```

### 4. Install Nodemon
Globally install Nodemon for automatic service restarts:

```bash
npm install -g nodemon
```

### 5. Ensure MySQL is Up to Date
Install the latest version of the MySQL connector library:

```bash
npm install mysql2@latest
```

### 6. Configure Database Connection
Use the following code in the `db-config.js` file to ensure the database connection is correctly configured:

```javascript
const sql = require("mysql2"); // Import the MySQL module
const dotenv = require("dotenv").config(); // Load environment variables

// Create the MySQL connection
const db = sql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: process.env.DATABASE_PORT || 3306, // Optional, defaults to 3306
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Connected to the database.");
    }
});

module.exports = db;
```

Ensure that `sql = require("mysql2")` references the correct version of the MySQL module.

### 7. Configure Environment Variables
Create a `.env` file and set your database information as follows:

```plaintext
DATABASE_HOST=your_host
DATABASE_USER=your_username
DATABASE_PASSWORD=your_password
DATABASE=your_database_name
DATABASE_PORT=3306
```