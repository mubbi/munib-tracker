import type {
  MuhasabahAnswer,
  MuhasabahBuiltInPromptId,
  MuhasabahConfig,
  MuhasabahCustomPrompt,
  MuhasabahEntry,
  MuhasabahItem,
  MuhasabahPromptId,
  MuhasabahRetentionDays,
} from "@munib-tracker/shared/types";
import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";

/**
 * Nightly muhasabah model (NF-3.6, plan §6). Pure helpers only — the store and
 * screens call these; nothing here touches the vault or the clock implicitly.
 */

/** Built-in prompt catalog, in display order (copy: `muhasabah.prompts.<id>`). */
export const MUHASABAH_PROMPT_CATALOG: readonly MuhasabahBuiltInPromptId[] = [
  "tongue",
  "gaze",
  "family",
  "trust",
  "time",
  "anger",
];

export const MUHASABAH_MIN_PROMPTS = 3;
export const MUHASABAH_MAX_PROMPTS = 6;
export const MUHASABAH_CUSTOM_PROMPT_MAX_LENGTH = 120;
export const MUHASABAH_NOTE_MAX_LENGTH = 280;

export const MUHASABAH_ANSWERS: readonly MuhasabahAnswer[] = ["yes", "partly", "no"];
export const MUHASABAH_RETENTION_OPTIONS: readonly MuhasabahRetentionDays[] = [30, 90, 365, 0];

/** Vault item id of the single config item. */
export const MUHASABAH_CONFIG_ID = "config";

/** The day rolls over at 04:00, so a review finished after midnight still counts for the evening. */
export const MUHASABAH_DAY_ROLLOVER_HOUR = 4;

export const DEFAULT_MUHASABAH_CONFIG: MuhasabahConfig = {
  kind: "config",
  prompts: ["tongue", "gaze", "family", "time"],
  customPrompts: [],
  // Privacy defaults (plan §6): text saved only when the person keeps it, 90-day retention.
  prefs: { time: "bedtime", saveRepentText: true, retentionDays: 90 },
};

export function muhasabahEntryId(date: string): string {
  return `entry:${date}`;
}

export function isMuhasabahEntry<T extends MuhasabahItem>(
  item: T | undefined,
): item is Extract<T, MuhasabahEntry> {
  return item?.kind === "entry";
}

export function isMuhasabahConfig<T extends MuhasabahItem>(
  item: T | undefined,
): item is Extract<T, MuhasabahConfig> {
  return item?.kind === "config";
}

export function isCustomPromptId(id: string): id is `custom:${string}` {
  return id.startsWith("custom:");
}

export function customPromptKey(prompt: MuhasabahCustomPrompt): `custom:${string}` {
  return `custom:${prompt.id}`;
}

function isRetention(value: unknown): value is MuhasabahRetentionDays {
  return MUHASABAH_RETENTION_OPTIONS.includes(value as MuhasabahRetentionDays);
}

/**
 * Coerces a stored (possibly older or partially synced) config into a valid
 * one: unknown prompt ids dropped, custom prompts that no longer exist dropped,
 * the selection kept within 3–6 by topping up from the catalog.
 */
export function normalizeMuhasabahConfig(
  raw: Partial<MuhasabahConfig> | undefined,
): MuhasabahConfig {
  const base = DEFAULT_MUHASABAH_CONFIG;
  const customPrompts = Array.isArray(raw?.customPrompts)
    ? raw.customPrompts
        .filter((p) => p && typeof p.id === "string" && typeof p.text === "string" && p.text.trim())
        .map((p) => ({
          id: p.id,
          text: p.text.trim().slice(0, MUHASABAH_CUSTOM_PROMPT_MAX_LENGTH),
        }))
    : [];
  const customKeys = new Set(customPrompts.map(customPromptKey));
  const valid = (id: string): id is MuhasabahPromptId =>
    (MUHASABAH_PROMPT_CATALOG as readonly string[]).includes(id) || customKeys.has(id as never);

  const seen = new Set<string>();
  const prompts: MuhasabahPromptId[] = [];
  for (const id of Array.isArray(raw?.prompts) ? raw.prompts : base.prompts) {
    if (typeof id === "string" && valid(id) && !seen.has(id)) {
      seen.add(id);
      prompts.push(id);
    }
  }
  for (const id of MUHASABAH_PROMPT_CATALOG) {
    if (prompts.length >= MUHASABAH_MIN_PROMPTS) break;
    if (!seen.has(id)) {
      seen.add(id);
      prompts.push(id);
    }
  }

  const prefs = raw?.prefs;
  return {
    kind: "config",
    prompts: prompts.slice(0, MUHASABAH_MAX_PROMPTS),
    customPrompts,
    prefs: {
      time: typeof prefs?.time === "string" && prefs.time ? prefs.time : base.prefs.time,
      saveRepentText:
        typeof prefs?.saveRepentText === "boolean"
          ? prefs.saveRepentText
          : base.prefs.saveRepentText,
      retentionDays: isRetention(prefs?.retentionDays)
        ? prefs.retentionDays
        : base.prefs.retentionDays,
    },
    ...(raw?.firstCompletedAt ? { firstCompletedAt: raw.firstCompletedAt } : {}),
    ...(raw?.reminderOfferAnswered ? { reminderOfferAnswered: true } : {}),
  };
}

/** Toggles one prompt in the selection, respecting the 3–6 bounds. Returns `null` when not allowed. */
export function togglePrompt(
  selected: readonly MuhasabahPromptId[],
  id: MuhasabahPromptId,
): MuhasabahPromptId[] | null {
  if (selected.includes(id)) {
    if (selected.length <= MUHASABAH_MIN_PROMPTS) return null;
    return selected.filter((p) => p !== id);
  }
  if (selected.length >= MUHASABAH_MAX_PROMPTS) return null;
  return [...selected, id];
}

/** The review day for `now`: before 04:00 local it still belongs to the previous evening. */
export function muhasabahDayKey(now: Date): string {
  const today = getLocalDateString(now);
  return now.getHours() < MUHASABAH_DAY_ROLLOVER_HOUR ? addDays(today, -1) : today;
}

export interface MuhasabahDraft {
  answers: Partial<Record<MuhasabahPromptId, MuhasabahAnswer>>;
  gratitude: string;
  repented: boolean;
  repentNote: string;
  readIstighfar: boolean;
  intention: string;
}

export function emptyMuhasabahDraft(): MuhasabahDraft {
  return {
    answers: {},
    gratitude: "",
    repented: false,
    repentNote: "",
    readIstighfar: false,
    intention: "",
  };
}

export function draftFromEntry(entry: MuhasabahEntry | undefined): MuhasabahDraft {
  if (!entry) return emptyMuhasabahDraft();
  return {
    answers: { ...entry.answers },
    gratitude: entry.gratitude ?? "",
    repented: Boolean(entry.repented || entry.repentNote),
    repentNote: entry.repentNote ?? "",
    readIstighfar: entry.readIstighfar,
    intention: entry.intention ?? "",
  };
}

function trimmed(value: string): string | undefined {
  const text = value.trim().slice(0, MUHASABAH_NOTE_MAX_LENGTH);
  return text ? text : undefined;
}

/**
 * Builds the entry to save. Only answers to the currently selected prompts are
 * kept; the repentance text is dropped when `saveRepentText` is off, leaving
 * only the fact (`repented: true`).
 */
export function buildMuhasabahEntry(input: {
  date: string;
  draft: MuhasabahDraft;
  prompts: readonly MuhasabahPromptId[];
  saveRepentText: boolean;
  durationMs: number;
}): MuhasabahEntry {
  const { draft } = input;
  const answers: MuhasabahEntry["answers"] = {};
  for (const id of input.prompts) {
    const answer = draft.answers[id];
    if (answer && MUHASABAH_ANSWERS.includes(answer)) answers[id] = answer;
  }
  const repentNote = input.saveRepentText ? trimmed(draft.repentNote) : undefined;
  const gratitude = trimmed(draft.gratitude);
  const intention = trimmed(draft.intention);
  return {
    kind: "entry",
    date: input.date,
    answers,
    ...(gratitude ? { gratitude } : {}),
    ...(draft.repented || repentNote ? { repented: true } : {}),
    ...(repentNote ? { repentNote } : {}),
    readIstighfar: draft.readIstighfar,
    ...(intention ? { intention } : {}),
    durationMs: Math.max(0, Math.round(input.durationMs)),
  };
}
