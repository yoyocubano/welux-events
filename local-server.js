
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// --- REBECA AI SYSTEM PROMPT ---
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

// --- ROUTE: CHAT (Rebeca AI) ---
// --- ROUTE: CHAT (Rebeca AI) ---
// --- DEEPSEEK CONFIG ---
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

// --- ROUTE: CHAT (Rebeca AI) ---
const chatHandler = async (req, res) => {
    if (!DEEPSEEK_API_KEY) {
        console.error("Missing DEEPSEEK_API_KEY");
        return res.status(500).json({ error: "Server configuration error: Missing DeepSeek API Key" });
    }

    try {
        const { messages, language } = req.body || {};

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        console.log(`[Rebeca AI] Request received. Language: ${language}`); // DEBUG LOG

        let langName = "English";
        if (language && language.startsWith("es")) langName = "Spanish";
        else if (language && language.startsWith("fr")) langName = "French";
        else if (language && language.startsWith("de")) langName = "German";
        else if (language && language.startsWith("pt")) langName = "Portuguese";
        else if (language && language.startsWith("lb")) langName = "Luxembourgish";

        console.log(`[Rebeca AI] Generating response in: ${langName}`); // DEBUG LOG

        // Enhanced System Instruction
        const systemMessage = {
            role: "system",
            content: SYSTEM_PROMPT + `\n\n*** CRITICAL INSTRUCTION ***\nThe user is speaking in ${langName} (Browsing Language: ${language}).\nYOU MUST REPLY IN ${langName} ONLY.\nDo not switch languages unless explicitly asked.`
        };

        const conversationHistory = [systemMessage, ...messages];

        console.log(`[Rebeca AI] Calling DeepSeek...`);

        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: conversationHistory,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DeepSeek API Error: ${response.status} - ${errorText}`);
            throw new Error(`DeepSeek API Error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content;

        if (!generatedText) {
            console.error("🔥 DeepSeek returned empty content.");
            return res.status(200).json({
                role: "assistant",
                content: language?.startsWith("es")
                    ? "⚠️ **Sistema Saturado:** Mis servidores neuronales están al máximo de capacidad. Por favor intenta de nuevo en 30 segundos."
                    : "⚠️ **System Overload:** All my AI models are currently busy. Please try again in 30 seconds.",
                isOverloaded: true
            });
        }

        return res.status(200).json({
            role: "assistant",
            content: generatedText,
            text: generatedText
        });

    } catch (error) {
        console.error("🔥 FATAL SERVER ERROR:", error);
        return res.status(500).json({
            error: "Internal Server Error",
            details: error.message || String(error)
        });
    }
};

app.post('/.netlify/functions/chat', chatHandler);
app.post('/api/chat', chatHandler);

// --- ROUTE: SUBMIT INQUIRY (Forms) ---
const inquiryHandler = async (req, res) => {
    if (!SUPABASE_URL || !SUPABASE_KEY || !RESEND_API_KEY) {
        console.error("Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or RESEND_API_KEY");
        return res.status(500).json({ error: "Server configuration error: Missing Database/Email Keys" });
    }

    try {
        const data = req.body || {};
        const { name, email, message, phone, event_type, event_date, location, budget, guest_count, service_interest } = data;

        // 1. Initialize Clients
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        const resend = new Resend(RESEND_API_KEY);

        // 2. Insert into Supabase
        const { error: dbError } = await supabase
            .from("inquiries")
            .insert([
                {
                    name,
                    email,
                    phone,
                    event_type,
                    event_date,
                    location,
                    budget,
                    guest_count,
                    service_interest,
                    message,
                },
            ]);

        if (dbError) {
            console.error("Supabase Error:", dbError);
            throw new Error("Database insertion failed");
        }

        // 3. Send Email to Admin
        await resend.emails.send({
            from: "Weddings Lux <onboarding@resend.dev>", // Only works if domain verified or testing
            to: ["weddingeventslux@gmail.com"],
            subject: `New Inquiry: ${name} - ${event_type}`,
            html: `
        <h1>New Web Inquiry</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Event Type:</strong> ${event_type}</p>
        <p><strong>Date:</strong> ${event_date || "N/A"}</p>
        <p><strong>Message:</strong></p>
        <p>${message || "No message"}</p>
      `,
        });

        // 4. Send Confirmation to Client
        if (email) {
            await resend.emails.send({
                from: "Weddings Lux <onboarding@resend.dev>",
                to: [email],
                subject: "We received your inquiry - Weddings & Events Luxembourg",
                html: `
            <h1>Thank you, ${name}!</h1>
            <p>We have received your inquiry regarding <strong>${event_type}</strong> photography/videography.</p>
            <p>Our team will review your details and get back to you shortly.</p>
            <br>
            <p>Best regards,</p>
            <p><strong>The Weddings & Events Luxembourg Team</strong></p>
          `,
            });
        }

        return res.status(200).json({ message: "Success" });

    } catch (error) {
        console.error("Submit Inquiry Error:", error);
        return res.status(500).json({ error: error.message || "Internal Server Error" });
    }
};

app.post('/.netlify/functions/submit-inquiry', inquiryHandler);
app.post('/api/submit-inquiry', inquiryHandler);

app.listen(PORT, () => {
    console.log(`Local AI & Backend Server running on http://localhost:${PORT}`);
    console.log(`- Chat Endpoint: http://localhost:${PORT}/.netlify/functions/chat`);
    console.log(`- Form Endpoint: http://localhost:${PORT}/.netlify/functions/submit-inquiry`);
});
