// this is node 
const express = require("express");
const Database = require("better-sqlite3");

const app = express();
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/sign_up.html");
});

// Allow Express to read form data
app.use(express.urlencoded({ extended: true }));

// Serve your HTML, CSS and frontend JS
app.use(express.static(__dirname));

// SQL database
const db = new Database("users.db");

// Create users table
db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
    )
`).run();

// Receive registration
app.post("/register", (req, res) => {

    const { username, email, password } = req.body;

    // Reject empty fields
    if (!username || !email || !password) {
        return res.status(400).send("Please fill in all fields.");
    }

    // Save to SQL
    db.prepare(`
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `).run(username, email, password);

    console.log("Registered:", username, email);

    res.send(`welcome ${username}`);
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
