import {
  isAllowedWebPushEndpoint,
  isValidWebPushSubscription,
} from "@munib-tracker/surface-push-delivery";

// The host allowlist (FCM, Mozilla autopush, Apple, WNS; https, default port, no
// credentials) lives in the delivery package so registration here and every
// sender (API, admin broadcasts) apply the same SSRF guard.
export { isAllowedWebPushEndpoint };

export type NormalizedWebPushSubscription = {
  endpoint: string;
  expirationTime: number | null;
  keys: { p256dh: string; auth: string };
};

/**
 * Parse a Web Push subscription JSON string into its canonical form, or `null`
 * when it isn't a well-formed subscription on an allowed push service.
 */
export function parseWebPushSubscriptionTarget(raw: string): NormalizedWebPushSubscription | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!isValidWebPushSubscription(parsed) || !isAllowedWebPushEndpoint(parsed.endpoint)) {
    return null;
  }
  return {
    endpoint: parsed.endpoint,
    expirationTime: parsed.expirationTime ?? null,
    keys: { p256dh: parsed.keys.p256dh, auth: parsed.keys.auth },
  };
}
