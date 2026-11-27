import { NextResponse } from "next/server";
import type { ContactErrorCode, ContactErrorResponse } from "@/lib/contact-errors";
import {
  CONTACT_IP_RATE_LIMIT,
  CONTACT_RATE_LIMIT,
  countRecentContactMessagesByEmail,
  countRecentContactMessagesByIp,
  insertContactMessage,
} from "@/lib/contact-messages";

type ContactBody = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot: real users never fill this. */
  company?: unknown;
};

const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,253}\.[^\s@]{2,63}$/;
/** Control characters (CR/LF included) are never valid in a name. */
// biome-ignore lint/suspicious/noControlCharactersInRegex: matching control characters is the point
const NAME_CONTROL_RE = /[\u0000-\u001f\u007f]/;
/** Messages may span lines/tabs, but no other control characters. */
// biome-ignore lint/suspicious/noControlCharactersInRegex: matching control characters is the point
const MESSAGE_CONTROL_RE = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

const MAX_NAME = 100;
const MAX_EMAIL = 254;
const MAX_MESSAGE = 5000;
/** Generous cap on the raw JSON body (fields are capped far below this). */
const MAX_BODY_BYTES = 32 * 1024;
/** `contact_messages.ipAddress` is varchar(64). */
const MAX_IP = 64;

/**
 * English description per error code, for logs and API callers. Visitors see
 * `contactForm.errors.<code>` from the catalog instead (the form maps codes).
 */
const ERROR_MESSAGES: Record<ContactErrorCode, string> = {
  invalid_content_type: "Content-Type must be application/json",
  body_too_large: "Request body too large",
  invalid_json: "Invalid JSON",
  invalid_field_type: "Invalid field type",
  name_required: "Name required",
  name_too_long: "Name is too long",
  name_invalid: "Name contains invalid characters",
  email_invalid: "Valid email required",
  message_required: "Message required",
  message_too_long: "Message is too long",
  message_invalid: "Message contains invalid characters",
  not_configured: "Contact form is not configured. Please try again later.",
  rate_limited_email: `You have reached the limit of ${CONTACT_RATE_LIMIT} messages per day for this email. Please try again tomorrow.`,
  rate_limited_ip: "Too many messages from your network today. Please try again tomorrow.",
  unavailable: "Contact service unavailable",
};

function fail(code: ContactErrorCode, status: number, extra?: Pick<ContactErrorResponse, "limit">) {
  const body: ContactErrorResponse = { error: ERROR_MESSAGES[code], code, ...extra };
  return NextResponse.json(body, { status });
}

function clientIp(request: Request): string {
  // Vercel overwrites these headers with the real client address; elsewhere
  // they are only as trustworthy as the reverse proxy in front of the app.
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]?.trim() : request.headers.get("x-real-ip")?.trim();
  return ip ? ip.slice(0, MAX_IP) : "unknown";
}

function optionalString(value: unknown): string | undefined | null {
  if (value === undefined || value === null) return undefined;
  return typeof value === "string" ? value : null;
}

export async function POST(request: Request) {
  // Require a JSON content type: cross-site <form> posts (text/plain,
  // urlencoded, multipart) are rejected, and fetch() from another origin
  // needs a CORS preflight this route never grants.
  const contentType = request.headers.get("content-type") ?? "";
  if (!/^application\/json\b/i.test(contentType.trim())) {
    return fail("invalid_content_type", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return fail("body_too_large", 413);
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return fail("invalid_json", 400);
  }
  if (raw.length > MAX_BODY_BYTES) {
    return fail("body_too_large", 413);
  }

  let body: ContactBody;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return fail("invalid_json", 400);
    }
    body = parsed as ContactBody;
  } catch {
    return fail("invalid_json", 400);
  }

  const rawName = optionalString(body.name);
  const rawEmail = optionalString(body.email);
  const rawMessage = optionalString(body.message);
  const rawCompany = optionalString(body.company);
  if (rawName === null || rawEmail === null || rawMessage === null || rawCompany === null) {
    return fail("invalid_field_type", 400);
  }

  // Honeypot: bots fill hidden fields. Respond 200 so they cannot detect the
  // trap, but discard the submission.
  if (rawCompany?.trim()) {
    return NextResponse.json({ ok: true, message: "Message received" });
  }

  const name = rawName?.trim();
  const email = rawEmail?.trim().toLowerCase();
  const message = rawMessage?.trim();

  if (!name) {
    return fail("name_required", 400);
  }
  if (name.length > MAX_NAME) {
    return fail("name_too_long", 400);
  }
  if (NAME_CONTROL_RE.test(name)) {
    return fail("name_invalid", 400);
  }
  if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
    return fail("email_invalid", 400);
  }
  if (!message) {
    return fail("message_required", 400);
  }
  if (message.length > MAX_MESSAGE) {
    return fail("message_too_long", 400);
  }
  if (MESSAGE_CONTROL_RE.test(message)) {
    return fail("message_invalid", 400);
  }

  if (!process.env.DATABASE_URL?.trim()) {
    console.error("DATABASE_URL is not set; cannot store contact message.");
    return fail("not_configured", 503);
  }

  const ipAddress = clientIp(request);

  try {
    const recent = await countRecentContactMessagesByEmail(email);
    if (recent >= CONTACT_RATE_LIMIT) {
      return fail("rate_limited_email", 429, { limit: CONTACT_RATE_LIMIT });
    }

    // Per-address limit alone is trivially bypassed by rotating emails; also
    // cap submissions per client IP so the inbox / table can't be flooded.
    if (ipAddress !== "unknown") {
      const recentFromIp = await countRecentContactMessagesByIp(ipAddress);
      if (recentFromIp >= CONTACT_IP_RATE_LIMIT) {
        return fail("rate_limited_ip", 429);
      }
    }

    await insertContactMessage({
      name,
      email,
      message,
      ipAddress,
      userAgent: request.headers.get("user-agent")?.slice(0, 512) ?? null,
    });
  } catch (error) {
    console.error("Failed to store contact message", error);
    return fail("unavailable", 503);
  }

  return NextResponse.json({ ok: true, message: "Message received" });
}
