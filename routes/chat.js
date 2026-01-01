const express = require('express');
const router = express.Router();

// POST /api/chat - Send message to AI
router.post('/', async (req, res) => {
    const { message } = req.body;

    // --- Google Gemini API Integration ---
    // Make sure to replace YOUR_API_KEY with your actual key
    const API_KEY = "";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

    try {
        if (!API_KEY) {
            return res.json({ reply: "Configuration Error: API Key is missing. Please open 'routes/chat.js' and add your Google Gemini API Key." });
        }

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Gemini API Error:", errText);
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        if (data.candidates && data.candidates[0].content) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            return res.json({ reply: aiResponse });
        } else {
            return res.json({ reply: "I received an empty response from the AI." });
        }

    } catch (error) {
        console.error("AI API Error:", error);
        res.status(500).json({ reply: "Sorry, I'm having trouble connecting to the brain. Please try again later." });
    }
});

module.exports = router;
