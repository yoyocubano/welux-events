
interface Env {
  DEEPSEEK_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const { message } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // NOTE: DeepSeek API call logic would go here.
    // Since I don't have the API key, I'll simulate a response.
    //
    // const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${env.DEEPSEEK_API_KEY}`
    //   },
    //   body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: message }] })
    // });
    //
    // const data = await response.json();
    // const reply = data.choices[0].message.content;

    const simulatedReply = "This is a simulated response from Rebeca AI. The real chatbot is currently under maintenance, but I'll be back soon!";

    return new Response(JSON.stringify({ reply: simulatedReply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    const error = e instanceof Error ? e.message : "An unexpected error occurred.";
    console.error("Error in chat function:", error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
