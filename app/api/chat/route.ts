import { maxContextMessages, maxPromptLength, maxReplyLength, type Message } from "@/lib/chat";

function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object" || !("role" in value) || !("content" in value)) {
    return false;
  }

  const { role, content } = value;
  return (role === "user" || role === "assistant") &&
    typeof content === "string" &&
    content.trim().length > 0 &&
    content.length <= (role === "user" ? maxPromptLength : maxReplyLength);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const messages: unknown = body?.messages;

  if (
    !Array.isArray(messages) ||
    messages.length < 1 ||
    messages.length > maxContextMessages ||
    !messages.every(isMessage) ||
    messages.at(-1)?.role !== "user"
  ) {
    return Response.json({ error: "Send a valid conversation ending with a prompt." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "Add OPENAI_API_KEY to .env.local and restart the server." }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: messages.map(({ role, content }) => ({ role, content })),
        max_output_tokens: 1200,
        store: false,
      }),
      cache: "no-store",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(45000)]),
    });

    if (response.status === 429) {
      return Response.json({ error: "The AI service rate limit or quota was reached." }, { status: 429 });
    }

    if (!response.ok) {
      return Response.json({ error: "The AI service rejected the request. Check the API key and model configuration." }, { status: 502 });
    }

    const result: {
      output?: { type: string; content?: { type: string; text?: string; refusal?: string }[] }[];
    } = await response.json();

    const reply = result.output
      ?.filter((item) => item.type === "message")
      .flatMap((item) => item.content ?? [])
      .map((part) => part.type === "output_text" ? part.text : part.refusal)
      .filter(Boolean)
      .join("\n")
      .trim()
      .slice(0, maxReplyLength);

    if (!reply) {
      return Response.json({ error: "The AI service returned an empty reply. Try again." }, { status: 502 });
    }

    return Response.json({ reply });
  } catch {
    return Response.json({ error: "Could not reach the AI service. Try again." }, { status: 502 });
  }
}
