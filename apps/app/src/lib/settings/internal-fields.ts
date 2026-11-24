/**
 * Persisted fields that are deliberately NOT settings (§4.5.4 coverage test).
 * Every other preference field must be owned by a registered setting
 * (`SettingDef.fields`) — adding a preference without giving it a place in
 * Settings fails `registry.coverage.test.ts`.
 */
export const INTERNAL_FIELDS: Readonly<Record<string, string>> = {
  // UserPreferences
  "prefs.favoriteZikrIds": "User data (favourites), edited from zikr screens.",
  "prefs.favoriteZikrOrder": "User data (favourites order), edited from zikr screens.",
  "prefs.hasCompletedOnboarding": "Onboarding state; Help & about › 'Run setup again' re-opens it.",
  "prefs.displayName": "Account identity, edited in Account (/profile).",
  "prefs.avatarUri": "Legacy synced copy of device.avatarUri (B4), read only as a fallback.",
  "prefs.salahTrackingSession": "Runtime 'Track this Salah' session, not a preference.",
  "prefs.activeExcusedReason": "User data (excused period) set from the tracker.",
  "prefs.updatedAt": "Sync last-write-wins stamp.",
  "prefs.favoritesUpdatedAt": "Sync last-write-wins stamp.",
  // CompanionPrefs
  "companion.schemaVersion": "Blob schema version.",
  "companion.coachDismissed": "One-off UI flag.",
  "companion.lastPassage": "Last practised passage (resume state).",
  "companion.pronunciationConsentAt": "Consent timestamp (privacy record).",
  // StoredLocation
  "location.updatedAt": "Timestamp of the last device fix.",
  // DevicePreferences (B4)
  "device.avatarUri": "Account identity (local gallery path), edited in Account (/profile).",
  "device.languageConfirmedAt": "'Finish setting up' marker: language confirmed.",
  "device.methodReviewedAt": "'Finish setting up' marker: calculation method reviewed.",
};

/**
 * Fields other agents are adding in this wave (NF-3.1–3.9). They may already
 * exist in `DEFAULT_USER_PREFERENCES`; the coverage test tolerates them until
 * their feature registers them (§4.5.8 group › section noted per entry), then
 * the entry is deleted. Wave 1 (madhhab, Hijri date, vault, tasbeeh designs) and
 * rawatib / Witr qaza / voluntary fasting / habits / Dhul-Hijjah / debts /
 * wasiyyah / muhasabah / family ties (`defs/worship-practice.ts`) are registered.
 */
export const PENDING_REGISTRATION: readonly string[] = [];

/**
 * Prefixes for pending families. Madhhab, Hijri date, vault (Private journals)
 * and tasbeeh designs are registered (NF-3.0b step 4), so none are left.
 */
export const PENDING_REGISTRATION_PREFIXES: readonly string[] = [];
