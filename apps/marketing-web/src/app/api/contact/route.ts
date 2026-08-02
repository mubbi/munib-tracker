import { NextResponse } from "next/server";
import {
  CONTACT_RATE_LIMIT,
  countRecentContactMessagesByEmail,
  insertContactMessage,
} from "@/lib/contact-messages";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  /** Honeypot: real users never fill this. */
  company?: string;
};

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,63}$/;

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Respond 200 so they cannot detect the
  // trap, but discard the submission.
  if (body.company?.trim()) {
    return NextResponse.json({ ok: true, message: "Message received" });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const message = body.message?.trim();

  if (!name) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  if (name.length > MAX_NAME) {
    return NextResponse.json({ error: "Name is too long" }, { status: 400 });
  }
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set; cannot store contact message.");
    return NextResponse.json(
      { error: "Contact form is not configured. Please try again later." },
      { status: 503 },
    );
  }

  try {
    const recent = await countRecentContactMessagesByEmail(email);
    if (recent >= CONTACT_RATE_LIMIT) {
      return NextResponse.json(
        {
          error:
            "You have reached the limit of 2 messages per day for this email. Please try again tomorrow.",
        },
        { status: 429 },
      );
    }

    await insertContactMessage({
      name,
      email,
      message,
      ipAddress: clientIp(request),
      userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
    });
  } catch (error) {
    console.error("Failed to store contact message", error);
    return NextResponse.json({ error: "Contact service unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, message: "Message received" });
}
