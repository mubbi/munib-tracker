import { NextResponse } from "next/server";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  /** Honeypot: real users never fill this. */
  company?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;

// Fixed-window in-memory rate limit. Adequate for a single-region marketing
// route; not a substitute for an edge rate limiter at scale.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now >= bucket.resetAt) {
    rateBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  return bucket.count > RATE_LIMIT;
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      { status: 429 },
    );
  }

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
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }
  if (email.length > MAX_EMAIL) {
    return NextResponse.json({ error: "Email is too long" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message required" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    // No delivery destination configured — fail loud rather than pretending
    // the message was received and silently dropping it.
    console.error("CONTACT_WEBHOOK_URL is not set; cannot deliver contact message.");
    return NextResponse.json(
      { error: "Contact form is not configured. Please email us directly." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (!response.ok) {
      throw new Error(`Webhook responded ${response.status}`);
    }
  } catch {
    return NextResponse.json({ error: "Contact service unavailable" }, { status: 503 });
  }

  return NextResponse.json({ ok: true, message: "Message received" });
}
