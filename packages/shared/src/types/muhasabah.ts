/**
 * Nightly muhasabah (NF-3.6) — a short, private self-review stored in the
 * end-to-end-encrypted vault document `muhasabah` (D2, plan §4.2).
 *
 * The vault document is a map of independently edited items (per-item LWW), so
 * the plan's `MuhasabahDoc` is stored as one `config` item plus one `entry`
 * item per day (`entry:YYYY-MM-DD`).
 */

/** Built-in prompt ids (copy lives under `muhasabah.prompts.<id>`). */
export type MuhasabahBuiltInPromptId = "tongue" | "gaze" | "family" | "trust" | "time" | "anger";

/** A selected prompt: a built-in id or `custom:<id>`. */
export type MuhasabahPromptId = MuhasabahBuiltInPromptId | `custom:${string}`;

export type MuhasabahAnswer = "yes" | "partly" | "no";

/** When the nightly reminder fires: the shared `bedtime`, Isha + 90 min, or a fixed "HH:MM". */
export type MuhasabahReminderTime = "bedtime" | "isha+90" | (string & {});

/** Entries older than this many days are deleted on launch; 0 = keep forever. */
export type MuhasabahRetentionDays = 0 | 30 | 90 | 365;

export interface MuhasabahPrefs {
  time: MuhasabahReminderTime;
  /** When false, only the fact of repentance is stored, never the text. */
  saveRepentText: boolean;
  retentionDays: MuhasabahRetentionDays;
}

export interface MuhasabahCustomPrompt {
  id: string;
  text: string;
}

export interface MuhasabahConfig {
  kind: "config";
  /** Selected prompt ids in display order (3–6), incl. `custom:<id>`. */
  prompts: MuhasabahPromptId[];
  customPrompts: MuhasabahCustomPrompt[];
  prefs: MuhasabahPrefs;
  /** ISO time of the first completed review (drives the one-time reminder offer). */
  firstCompletedAt?: string;
  /** The one-time "remind me nightly?" offer was answered (yes or no). */
  reminderOfferAnswered?: boolean;
}

export interface MuhasabahEntry {
  kind: "entry";
  /** Local calendar day YYYY-MM-DD the review belongs to. */
  date: string;
  answers: Partial<Record<MuhasabahPromptId, MuhasabahAnswer>>;
  gratitude?: string;
  /** Optional private note; omitted when `prefs.saveRepentText` is off. */
  repentNote?: string;
  /** The person marked something to repent from (kept even when the text is not saved). */
  repented?: boolean;
  readIstighfar: boolean;
  /** Tomorrow's one intention (shown on the next day's Today card). */
  intention?: string;
  durationMs: number;
}

/** One vault item of the `muhasabah` document. */
export type MuhasabahItem = MuhasabahConfig | MuhasabahEntry;

/** Per-prompt answer counts over a window. No overall score, by design. */
export interface MuhasabahPromptTally {
  yes: number;
  partly: number;
  no: number;
}

/**
 * Read-only weekly summary for the NF-3.14 coach: aggregated per-prompt counts
 * only. Never carries gratitude, repentance or intention text.
 */
export interface MuhasabahWeekSummary {
  /** First day of the window (YYYY-MM-DD). */
  weekStart: string;
  /** Days in the window with a saved review. */
  reviewDays: number;
  perPrompt: Partial<Record<MuhasabahPromptId, MuhasabahPromptTally>>;
  /** Days on which Sayyid al-Istighfar was marked as read. */
  istighfarDays: number;
}
