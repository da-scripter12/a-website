// This is Node

const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const Groq = require("groq-sdk");

dotenv.config();

const app = express();

// Main website
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

// Serve HTML, CSS and frontend JS
app.use(express.static(__dirname));

app.use(express.json());

// ByteLabs - Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use("/AI_web", express.static(path.join(__dirname, "bytelabs")));

app.post("/AI_web/ask", async (req, res) => {
    try {
        const conversation = req.body.conversation;

        if (!conversation || conversation.length === 0) {
            return res.status(400).json({
                error: "No conversation provided."
            });
        }

        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-20b",
            messages: conversation
        });

        res.json({
            response: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Groq error:", error);

        res.status(500).json({
            error: "ByteLabs couldn't get a response right now."
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});