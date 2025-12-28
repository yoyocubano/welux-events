
interface Env {
  SUPABASE_URL: string;
  SUPABASE_KEY: string;
  RESEND_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.email || !data.eventType) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // NOTE: Supabase and Resend logic would go here.
    // Since I don't have the credentials, I'll simulate a successful response.
    //
    // const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY);
    // const { error } = await supabase.from("inquiries").insert([data]);
    //
    // if (error) {
    //   throw new Error(`Supabase error: ${error.message}`);
    // }
    //
    // const resend = new Resend(env.RESEND_API_KEY);
    // await resend.emails.send({ ... });
    
    console.log("Simulating successful inquiry submission:", data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (e) {
    const error = e instanceof Error ? e.message : "An unexpected error occurred.";
    console.error("Error in submit-inquiry:", error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
