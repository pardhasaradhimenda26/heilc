import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") 
      || req.headers.get("x-real-ip") 
      || "anonymous";
    
    // Rate limit: 3 submissions per minute
    const limit = rateLimit(ip, 3, 60000);
    
    if (!limit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment before trying again." },
        { 
          status: 429,
          headers: { 
            "Retry-After": String(Math.ceil(limit.resetIn / 1000))
          }
        }
      );
    }

    const { name, email, company, budget, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || "pardhasaradhimenda26@gmail.com";

    if (!resendApiKey) {
      console.error("Missing RESEND_API_KEY in environment variables.");
      return NextResponse.json(
        { error: "Email service is not configured correctly." },
        { status: 500 }
      );
    }

    // Call Resend API via fetch to send the email
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: "HEILC Contact Form <onboarding@resend.dev>",
        to: receiverEmail,
        subject: `New Project Inquiry from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Budget Range:</strong> ${budget || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; background: #f4f4f5; padding: 12px; border-radius: 6px; border: 1px solid #e4e4e7;">${message}</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Resend API error:", errorText);
      return NextResponse.json(
        { error: "Failed to send email notification." },
        { status: 500 }
      );
    }

    const emailData = await emailResponse.json();

    return NextResponse.json({
      success: true,
      messageId: emailData.id,
    });
  } catch (error: any) {
    console.error("Error in contact API:", error);
    return NextResponse.json(
      { error: error?.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
