
/**
 * API Endpoint for Rebeca AI Chatbot
 *
 * This serverless function acts as a backend for the chat widget.
 * It receives the chat history from the client, formats it with a system prompt,
 * sends it to the DeepSeek AI API, and then streams the response back to the client.
 *
 * Environment Variables:
 * - DEEPSEEK_API_KEY: The API key for authenticating with the DeepSeek service.
 */

// --- AI Configuration ---

// Retrieve the DeepSeek API key from environment variables.
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

/**
 * System Prompt for the AI model.
 * This prompt defines the persona, directives, and constraints for "Rebeca," the AI assistant.
 * It's a critical piece of configuration that guides the AI's behavior.
 *
 * Key Directives:
 * - Multilingual Support: Must respond in the user's specified language.
 * - Data Privacy: Prohibits sharing private contact information of the team.
 * - Lead Generation: Aims to collect user information (name, event date) to create an inquiry.
 * - Transparency: Instructs the AI to be honest about its nature as a virtual assistant.
 * - Tone: The AI should maintain a warm, reassuring, and "Luxury Service" tone.
 */
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

/**
 * Request handler for the /api/chat endpoint.
 *
 * @param {object} req - The incoming request object.
 * @param {object} res - The outgoing response object.
 */
export default async function handler(req, res) {
    // Only allow POST requests.
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Check for the presence of the DeepSeek API key.
    if (!DEEPSEEK_API_KEY) {
        console.error("Missing DEEPSEEK_API_KEY");
        return res.status(500).json({ error: "Server configuration error: Missing DeepSeek API Key" });
    }

    try {
        // Extract messages and language from the request body.
        const { messages, language } = req.body || {};

        // Validate the presence and format of the messages array.
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid request body" });
        }

        // Determine the language to be used in the AI's response.
        let langName = "English";
        if (language && language.startsWith("es")) langName = "Spanish";
        else if (language && language.startsWith("fr")) langName = "French";
        else if (language && language.startsWith("de")) langName = "German";
        else if (language && language.startsWith("pt")) langName = "Portuguese";
        else if (language && language.startsWith("lb")) langName = "Luxembourgish";

        // Create a dynamic system message that includes the language instruction.
        const systemMessage = {
            role: "system",
            content: SYSTEM_PROMPT + `\n\n*** CRITICAL INSTRUCTION ***\nThe user is speaking in ${langName} (Browsing Language: ${language}).\nYOU MUST REPLY IN ${langName} ONLY.\nDo not switch languages unless explicitly asked.`
        };

        // Construct the conversation history in the format expected by the DeepSeek API.
        const conversationHistory = [systemMessage, ...messages];

        console.log(`[Rebeca AI] Calling DeepSeek. Language: ${langName}`);

        // Make the API call to DeepSeek.
        const response = await fetch("https://api.deepseek.com/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat", // Specify the model to use.
                messages: conversationHistory, // The full conversation history.
                temperature: 0.7, // Controls the creativity of the response.
                max_tokens: 500 // The maximum number of tokens to generate.
            })
        });

        // Handle non-successful API responses.
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`DeepSeek API Error: ${response.status} - ${errorText}`);
            throw new Error(`DeepSeek API Error: ${response.status}`);
        }

        const data = await response.json();
        const generatedText = data.choices?.[0]?.message?.content;

        // Handle cases where the API returns no content.
        if (!generatedText) {
            throw new Error("No content returned from DeepSeek");
        }

        // Send the successful response back to the client.
        return res.status(200).json({
            role: "assistant",
            content: generatedText,
            text: generatedText
        });

    } catch (error) {
        console.error("🔥 FATAL SERVER ERROR:", error);

        // Provide a user-friendly fallback message in case of an error.
        return res.status(200).json({
            role: "assistant",
            content: language?.startsWith("es")
                ? "⚠️ **Sistema Saturado:** Mis servidores neuronales están al máximo de capacidad. Por favor intenta de nuevo en 30 segundos."
                : "⚠️ **System Overload:** All my AI models are currently busy. Please try again in 30 seconds.",
            isOverloaded: true
        });
    }
}
