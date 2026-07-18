export type ConsentItemId = "essential" | "analytics";

export type ConsentPreferences = {
  essential: boolean;
  analytics: boolean;
};

export type StoredConsent = {
  preferences: ConsentPreferences;
  version: string;
};

export const CONSENT_VERSION = "1.0";
export const CONSENT_STORAGE_KEY = "munib_tracker_cookie_consent";

export interface ConsentItemDef {
  id: ConsentItemId;
  title: string;
  description: string;
  required: boolean;
}

export const CONSENT_ITEMS: ConsentItemDef[] = [
  {
    id: "essential",
    title: "Essential",
    description:
      "Required for the site to work — security, session management, and core features. These cannot be turned off.",
    required: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Helps us understand which pages people find useful and how the site performs, so we can keep improving it. Never used for advertising.",
    required: false,
  },
];

const CONSENT_ITEM_IDS = new Set<ConsentItemId>(["essential", "analytics"]);

export function toConsentItemId(raw: unknown): ConsentItemId | null {
  if (typeof raw !== "string") return null;
  return CONSENT_ITEM_IDS.has(raw as ConsentItemId) ? (raw as ConsentItemId) : null;
}

export function getStoredConsent(): StoredConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredConsent;
    if (!parsed?.preferences || !parsed?.version) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setStoredConsent(
  preferences: ConsentPreferences,
  version: string = CONSENT_VERSION,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({ preferences, version }));
  } catch {
    // localStorage may be blocked; preferences still apply for this session via gtag update
  }
}

export function hasValidStoredConsent(stored: StoredConsent | null): boolean {
  return Boolean(stored && stored.version === CONSENT_VERSION);
}
