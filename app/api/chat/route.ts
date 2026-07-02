import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    const response = await fetch("https://portfolio-chatbot-3jqz.onrender.com/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Chatbot proxy error:", error);
    return NextResponse.json({ answer: "Sorry, I'm having trouble connecting right now." }, { status: 500 });
  }
}
