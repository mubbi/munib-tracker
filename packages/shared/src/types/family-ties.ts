/**
 * Silat al-rahim — family ties reminders (NF-3.7). Third-party names and phone
 * numbers live in the end-to-end-encrypted vault document `relatives` (D2
 * extension, plan §4.2).
 *
 * The vault document is a map of independently edited items (per-item LWW), so
 * the plan's `RelativesDoc` is stored as `relative` items, one `log` item per
 * contact and a single `settings` item. The `type` field discriminates them.
 */

export type Kinship =
  | "mother"
  | "father"
  | "grandparent"
  | "child"
  | "sibling"
  | "spouse_parent"
  | "aunt_paternal"
  | "aunt_maternal"
  | "uncle_paternal"
  | "uncle_maternal"
  | "cousin"
  | "niece_nephew"
  | "other";

export type ContactKind = "call" | "visit" | "message" | "gift" | "dua";

export interface RelativeLastContact {
  /** Local calendar day YYYY-MM-DD. */
  date: string;
  kind: ContactKind;
}

export interface Relative {
  type: "relative";
  name: string;
  kinship: Kinship;
  /** Optional; entered by hand (no contacts import in v1). */
  phone?: string;
  /** Days between contacts before the relative shows as due. */
  cadenceDays: number;
  lastContact?: RelativeLastContact;
  notes?: string;
  /** Paused relatives never show as due and never count in reminders. */
  paused?: boolean;
  /** Deceased relatives move to the "Remember in dua" list (no cadence). */
  deceased?: boolean;
  createdAt: string;
}

export interface RelativeContactLog {
  type: "log";
  relativeId: string;
  /** Local calendar day YYYY-MM-DD. */
  date: string;
  contact: ContactKind;
}

/** `after-jumuah` = Friday Dhuhr + 90 min (or 14:00 without a location); otherwise "HH:MM". */
export type FamilyTiesDigestTime = "after-jumuah" | (string & {});

export interface FamilyTiesSettings {
  type: "settings";
  /** 0 = Sunday … 6 = Saturday. Default 5 (Friday). */
  digestWeekday: number;
  digestTime: FamilyTiesDigestTime;
}

/** One vault item of the `relatives` document. */
export type FamilyTiesItem = Relative | RelativeContactLog | FamilyTiesSettings;

/**
 * Read-only summary for the NF-3.14 coach and the home count. Counts only —
 * never names, phone numbers or notes.
 */
export interface FamilyTiesSummary {
  /** Living, non-paused relatives with a cadence. */
  tracked: number;
  /** Of those, how many are due on `asOf`. */
  dueCount: number;
  /** A mother or father is due (overdue past their cadence). */
  parentDue: boolean;
  /** Contacts logged in the 7 days ending `asOf` (dua included). */
  contactsThisWeek: number;
  asOf: string;
}
