
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const SYSTEM_PROMPT = `
You are "Rebeca" - the Event Coordinator for "WE Weddings & Events Luxembourg". 
You are calm, professional, and very knowledgeable.

**CORE DIRECTIVES:**
1. **Multilingual:** Use the language specified (English, Spanish, French, German, Portuguese, Luxembourgish).
2. **Data Privacy (CRITICAL):** 
   - NEVER share private contact info (private cell, home address) of team members (Joan, Abel, Yusmel). 
   - Only share the public office number (+352 621 430 283) or email (info@weddingslux.com).
   - If asked for "Abel's number", politely direct them to the office line or contact form.
3. **Lead Gathering:**
   - Your goal is to be helpful but also to SECURE A BOOKING or INQUIRY.
   - If the user seems interested, casually ask for their "Name" and "Event Date".
   - If they provide enough info (Name, Email, Event Type), OFFER to submit the inquiry for them.
   - To submit, output this JSON block ONLY (no markdown): [[SUBMIT_INQUIRY: {"name": "...", "email": "...", "eventType": "wedding|corporate|...", "message": "..."}]]
4. **Transparency & Honesty:**
   - **Identity:** You are "Rebeca AI", a **Virtual Assistant** designed to help organize information for the human team.
   - **Honesty:** If asked if you are AI, say YES. explain that you are connecting them with your **human colleagues** (Joan, Abel, Yusmel) to ensure the best service.
   - **Conciseness:** Keep answers **short, concise, and direct**. Avoid long paragraphs.
   - **Role:** You gather details so the human team can take over seamlessly.

**TONE:** Warm, reassuring, "Luxury Service".
`;

app.post('/.netlify/functions/chat', async (req, res) => {
    if (!GOOGLE_API_KEY) {
        console.error("Missing GOOGLE_API_KEY");
        return res.status(500).json({ error: "Server configuration error: Missing Google API Key" });
    }

    try {
        const { messages, language } = req.body || {};

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // Determine language name for the prompt
        let langName = "English";
        if (language && language.startsWith("es")) langName = "Spanish";
        else if (language && language.startsWith("fr")) langName = "French";
        else if (language && language.startsWith("de")) langName = "German";
        else if (language && language.startsWith("pt")) langName = "Portuguese";
        else if (language && language.startsWith("lb")) langName = "Luxembourgish";

        let fullPrompt = SYSTEM_PROMPT + `\n\nIMPORTANT: The user is currently browsing the website in ${langName}. You MUST reply in ${langName}.\n\nConversation History:\n`;
        messages.forEach((msg) => {
            fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
        });
        fullPrompt += "Assistant:";

        // Call Google Gemini API (REST)
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GOOGLE_API_KEY}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: fullPrompt }]
                    }]
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Gemini API Error:", errorText);

            if (response.status === 429 || response.status === 503) {
                return res.status(200).json({
                    role: "assistant",
                    content: language?.startsWith("es")
                        ? "⚠️ **Sistema Saturado:** Estoy recibiendo muchas consultas ahora mismo. Por favor, usa el formulario de contacto para una respuesta prioritaria."
                        : "⚠️ **System Busy:** I am receiving high traffic right now. Please use the contact form for priority service.",
                    isOverloaded: true
                });
            }

            return res.status(response.status).json({ error: "Error communicating with AI provider" });
        }

        const data = await response.json();
        const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";

        return res.status(200).json({
            role: "assistant",
            content: generatedText,
            text: generatedText
        });

    } catch (error) {
        console.error("Function error:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message || String(error)
        });
    }
});

app.listen(PORT, () => {
    console.log(`Local AI Proxy Server running on http://localhost:${PORT}`);
    console.log(`- Endpoint: http://localhost:${PORT}/.netlify/functions/chat`);
});
