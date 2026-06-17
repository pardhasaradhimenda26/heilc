import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "edge";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") 
    || req.headers.get("x-real-ip") 
    || "anonymous";
  
  const limit = rateLimit(ip, 5, 60000);
  
  if (!limit.success) {
    return new Response(
      JSON.stringify({ 
        error: "Too many requests. Please wait a moment.",
        resetIn: Math.ceil(limit.resetIn / 1000) + " seconds"
      }),
      { 
        status: 429,
        headers: { 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": "0",
          "Retry-After": String(Math.ceil(limit.resetIn / 1000))
        }
      }
    );
  }

  const { industry, problem } = await req.json();

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const prompt = `Generate a professional branded proposal for HEILC — an AI & Digital Transformation agency.

Client Industry: ${industry}
Client Problem: ${problem}

Write a concise, compelling proposal with these sections:
1. **Understanding Your Challenge** (2-3 sentences)
2. **Our Recommended Solution** (3-4 sentences, specific to their industry/problem)
3. **Tech Stack We'd Use** (bullet list of 4-6 technologies)
4. **Estimated Timeline** (4-week breakdown)
5. **Why HEILC** (2-3 sentences on our edge)
6. **Next Step** (single CTA sentence)

Keep it professional, specific, and confident. Format with clear headers. Total length: 250-300 words.`;

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
