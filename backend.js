// this is node 
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

// Main website
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Serve your HTML, CSS and frontend JS
app.use(express.static(__dirname));

app.use(express.json());

// BharatBot database
const bdb = new Database("bharatbot.db");

bdb.prepare(`
    CREATE TABLE IF NOT EXISTS training_data (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        category TEXT NOT NULL,
        response TEXT NOT NULL
    )
`).run();

// ByteLabs
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use("/AI_web", express.static(path.join(__dirname, "bytelabs")));

app.post("/AI_web/ask", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "No message provided."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: message
        });

        res.json({
            response: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});