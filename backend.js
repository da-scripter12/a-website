// this is node 
const express = require("express");
const Database = require("better-sqlite3");

const app = express();
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Serve your HTML, CSS and frontend JS
app.use(express.static(__dirname));

const bdb = new Database("bharatbot.db");

bdb.prepare(`
    CREATE TABLE IF NOT EXISTS training_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        category TEXT NOT NULL,
        response TEXT NOT NULL
    )
`).run();
// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
