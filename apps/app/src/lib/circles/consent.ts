/**
 * Parental consent for child profiles (NF-3.16, D7 / D34).
 *
 * The server records `{ parentUserId, consentedAt, policyVersion }`. The app
 * sends the privacy-policy version the parent saw. The legal review (COPPA,
 * GDPR Art. 8, UK AADC, DPIA) is an OPEN owner action (D35) — the copy never
 * claims compliance, and this version string must be bumped when the policy
 * text the parent confirms changes.
 */
import type { ChildProfile } from "./api";

/** Privacy-policy version the in-app consent text corresponds to. */
export const CHILD_CONSENT_POLICY_VERSION = "2026-11";

/** Privacy policy on the marketing site (same source as Settings › About). */
export const PRIVACY_POLICY_URL = `${process.env.EXPO_PUBLIC_SITE_URL ?? "https://munibtracker.app"}/privacy`;

/** D34: transferred profiles waiting for this parent's re-confirmation. */
export function pendingConsentChildren(
  children: readonly ChildProfile[] | undefined,
): ChildProfile[] {
  return (children ?? []).filter((child) => child.consentPending === true);
}

/** Whole days left before an unconfirmed transferred profile is deleted (≥ 0), or null. */
export function consentDaysLeft(child: ChildProfile, now: Date = new Date()): number | null {
  if (!child.consentPendingUntil) return null;
  const ms = Date.parse(child.consentPendingUntil) - now.getTime();
  if (Number.isNaN(ms)) return null;
  return Math.max(0, Math.ceil(ms / 86_400_000));
}
