import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "edge";

const HEILC_SYSTEM_PROMPT = `You are HEILC's AI assistant — a smart, professional, and helpful digital advisor for HEILC, an AI & Digital Transformation agency.

ABOUT HEILC:
- Founded by Pardhasaradhi Menda and Varshith Dondamuri
- Specializes in: Artificial Intelligence, Digital Transformation, Enterprise Software Development, Automation Solutions
- Tagline: "Where Human Intelligence Meets the Future"

LIVE PROJECTS:
- GeneRisk AI: ML-powered cancer risk prediction from DNA sequences, XGBoost, 97.37% accuracy, deployed on Railway
- CineGenome: AI film recommendation platform using Claude AI + Pinecone + Next.js, 3,477 films
- ResumeAI: AI resume builder with ATS scoring, built with Groq LLaMA, won at AppXcelerate 1.0 hackathon

SERVICES:
1. AI-Powered Web Platforms
2. Mobile App Development  
3. Custom LLM & Chatbot Integration
4. Data Analytics & Visualization
5. Cloud Infrastructure & DevOps
6. UI/UX Design & Prototyping

INDUSTRIES SERVED:
Healthcare, Education, FinTech, E-Commerce, Real Estate, HR & Recruitment

TECH STACK:
React, Next.js, Node.js, Python, Flask, FastAPI, PostgreSQL, MongoDB, Claude API, OpenAI, XGBoost, TensorFlow, AWS, Vercel, Railway

PERSONALITY:
- Professional but approachable
- Direct and confident
- Always guide toward booking a consultation
- Keep responses concise (2-4 sentences unless asked for detail)
- Never make up specific pricing — say "let's discuss your requirements"

Always end with a relevant CTA like "Want to explore this further? Book a free consultation at heilc.com"`;

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") 
    || req.headers.get("x-real-ip") 
    || "anonymous";
  
  const limit = rateLimit(ip, 20, 60000);
  
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

  const { messages } = await req.json();

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const stream = await client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: HEILC_SYSTEM_PROMPT,
    messages,
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
