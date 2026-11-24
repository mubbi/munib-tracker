import type { AnnotationColorId, AyahNote } from "@munib-tracker/shared/types";
import { detectTextDirection, formatNoteRef } from "@munib-tracker/shared/utils";

/**
 * NF-3.21 note hints: the short, read-only preview shown when the reader
 * hovers / focuses / taps a noted ayah or word (desktop popover, phone peek,
 * TV focus card). Pure — the UI only lays these fields out.
 */

export const NOTE_PREVIEW_TITLE_MAX = 80;
export const NOTE_PREVIEW_EXCERPT_MAX = 140;
/** Tags shown on a preview before a "+N" overflow count. */
export const NOTE_PREVIEW_TAGS_MAX = 3;

export type NotePreview = {
  id: string;
  surah: number;
  ayah: number;
  /** `2:255` or `2:255–257`. */
  ref: string;
  /** First non-empty line, clipped at a word boundary. "" for a highlight-only note. */
  title: string;
  /** The rest of the text on one line, clipped. "" when the note fits in the title. */
  excerpt: string;
  tags: string[];
  /** Tags not shown on the preview. */
  moreTags: number;
  color: AnnotationColorId | null;
  dir: "ltr" | "rtl";
  /** Colour only — no text and no tags. */
  highlightOnly: boolean;
};

/** Clip at the last word boundary before `max` and add an ellipsis. */
export function clipAtWord(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const space = cut.lastIndexOf(" ");
  // Don't cut a long first word to nothing — fall back to a hard cut.
  const body = space > max * 0.5 ? cut.slice(0, space) : cut;
  return `${body.replace(/[\s.,;:!?،؛-]+$/u, "")}…`;
}

export function buildNotePreview(note: AyahNote): NotePreview {
  const lines = note.body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const first = lines[0] ?? "";
  const title = clipAtWord(first, NOTE_PREVIEW_TITLE_MAX);
  // The excerpt carries on after the words the title shows (same line when it was clipped).
  const shownWords = title.endsWith("…") ? title.slice(0, -1).split(" ").length : Infinity;
  const firstWords = first.split(/\s+/).filter(Boolean);
  const excerptSource = [
    ...(Number.isFinite(shownWords) ? [firstWords.slice(shownWords).join(" ")] : []),
    ...lines.slice(1),
  ]
    .join(" ")
    .trim();
  return {
    id: note.id,
    surah: note.surah,
    ayah: note.ayah,
    ref: formatNoteRef(note),
    title,
    excerpt: excerptSource ? clipAtWord(excerptSource, NOTE_PREVIEW_EXCERPT_MAX) : "",
    tags: note.tags.slice(0, NOTE_PREVIEW_TAGS_MAX),
    moreTags: Math.max(0, note.tags.length - NOTE_PREVIEW_TAGS_MAX),
    color: note.color ?? null,
    dir: detectTextDirection(note.body),
    highlightOnly: !note.body.trim() && note.tags.length === 0,
  };
}

/** True when a note carries something to read (text or tags), not only a colour. */
export function noteHasContent(note: Pick<AyahNote, "body" | "tags">): boolean {
  return note.body.trim().length > 0 || note.tags.length > 0;
}

/**
 * Notes to preview for an ayah: written notes first (newest first, the index
 * order), then highlight-only ones; `preferId` (the word/marker that was
 * pointed at) always leads.
 */
export function orderNotesForPreview(
  notes: readonly AyahNote[] | undefined,
  preferId?: string | null,
): AyahNote[] {
  if (!notes?.length) return [];
  const written = notes.filter(noteHasContent);
  const colourOnly = notes.filter((note) => !noteHasContent(note));
  const ordered = [...written, ...colourOnly];
  if (!preferId) return ordered;
  const preferred = ordered.find((note) => note.id === preferId);
  return preferred ? [preferred, ...ordered.filter((note) => note !== preferred)] : ordered;
}

/** One-line spoken summary for a screen reader: "Has my note: <title>". */
export function notePreviewSpeech(preview: NotePreview | undefined): string {
  if (!preview) return "";
  return preview.title || preview.tags.map((tag) => `#${tag}`).join(" ");
}

// ---------------------------------------------------------------------------
// Desktop popover placement
// ---------------------------------------------------------------------------

export type Rect = { x: number; y: number; width: number; height: number };
export type Size = { width: number; height: number };

export const POPOVER_GAP = 8;
export const POPOVER_MARGIN = 12;

/**
 * Where a hover card goes next to its anchor, in viewport coordinates: below
 * the anchor when it fits, otherwise above (whichever side has more room when
 * neither fits). Horizontally it lines up with the anchor's leading edge
 * (right edge in RTL) and is clamped inside the viewport margins.
 */
export function placePopover(
  anchor: Rect,
  size: Size,
  viewport: Size,
  rtl = false,
): { left: number; top: number; placement: "below" | "above" } {
  const below = viewport.height - (anchor.y + anchor.height) - POPOVER_GAP - POPOVER_MARGIN;
  const above = anchor.y - POPOVER_GAP - POPOVER_MARGIN;
  const placement: "below" | "above" =
    size.height <= below || (size.height > above && below >= above) ? "below" : "above";
  const top =
    placement === "below"
      ? anchor.y + anchor.height + POPOVER_GAP
      : anchor.y - POPOVER_GAP - size.height;
  const preferredLeft = rtl ? anchor.x + anchor.width - size.width : anchor.x;
  const maxLeft = viewport.width - POPOVER_MARGIN - size.width;
  const left = Math.max(POPOVER_MARGIN, Math.min(preferredLeft, maxLeft));
  return { left, top: Math.max(POPOVER_MARGIN, top), placement };
}
