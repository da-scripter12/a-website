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

        let response;

        // Try up to 3 times
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: message
                });

                break; // Success
            } catch (error) {
                console.error(`Gemini attempt ${attempt} failed:`, error);

                const errorText = JSON.stringify(error);

                // Only retry temporary/unavailable errors
                if (
                    !errorText.includes("503") &&
                    !errorText.includes("UNAVAILABLE")
                ) {
                    throw error;
                }

                // If this was the final attempt, stop
                if (attempt === 3) {
                    return res.status(503).json({
                        error: "ByteLabs is temporarily busy. Please try again in a few seconds."
                    });
                }

                // Wait 2 seconds, then try again
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});