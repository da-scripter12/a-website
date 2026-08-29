const express = require("express");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 3001;

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.static(__dirname));

app.post("/ask", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                error: "No message provided."
            });
        }

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: message
        });

        res.json({
            response: response.text
        });

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: "ByteLabs couldn't get a response from Gemini."
        });
    }
});

app.listen(PORT, () => {
    console.log(`ByteLabs running at http://localhost:${PORT}`);
});