/**
 * Stable error codes returned by `POST /api/contact` (`{ error, code }`).
 *
 * The route handler has no locale, so it answers with a code; the contact form
 * (client) maps it to `contactForm.errors.<code>` in the visitor's language.
 * `error` stays an English description for logs and API callers. Client-safe:
 * no server-only imports.
 */
export const CONTACT_ERROR_CODES = [
  "invalid_content_type",
  "body_too_large",
  "invalid_json",
  "invalid_field_type",
  "name_required",
  "name_too_long",
  "name_invalid",
  "email_invalid",
  "message_required",
  "message_too_long",
  "message_invalid",
  "not_configured",
  "rate_limited_email",
  "rate_limited_ip",
  "unavailable",
] as const;

export type ContactErrorCode = (typeof CONTACT_ERROR_CODES)[number];

/** Error body of `POST /api/contact`. `limit` accompanies `rate_limited_email`. */
export type ContactErrorResponse = { error: string; code: ContactErrorCode; limit?: number };

export function isContactErrorCode(value: unknown): value is ContactErrorCode {
  return typeof value === "string" && (CONTACT_ERROR_CODES as readonly string[]).includes(value);
}
