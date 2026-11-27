import {
  type AnnotationColorId,
  type AyahNote,
  type AyahWordSpan,
  QURAN_NOTE_BODY_MAX,
  QURAN_NOTES_MAX_BYTES,
  QURAN_NOTES_WARN_RATIO,
  type QuranNotesMap,
} from "@munib-tracker/shared/types";
import {
  asQuranNotesMap,
  buildQuranNotesIndex,
  gcQuranNoteTombstones,
  normalizeNoteTags,
  noteAyahKey,
  type QuranNotesIndex,
  quranNotesPayloadBytes,
} from "@munib-tracker/shared/utils";
import { useEffect } from "react";
import { createId } from "@/db/id";
import { DB_KEYS } from "@/db/keys";
import { readJSON, withKeyLock, writeJSON } from "@/db/store";
import { onBlobHoldChange, readBlobHold } from "@/sync/blob-hold";

import { createStore, useStore } from "./create-store";

/**
 * NF-3.21 personal ayah notes, highlights and tags. One `Record<id, AyahNote>`
 * blob under `DB_KEYS.quranNotes`, synced as `quran_notes` (D15: normal sync —
 * notes are reflections, not vault records) with the per-note merge in
 * `@munib-tracker/shared/utils` `mergeQuranNotes`. Deletes keep a tombstone so
 * they propagate; tombstones are GC'd after 90 days.
 *
 * Privacy: note text never goes to Sentry, logs, notifications or analytics —
 * nothing in this module logs a note.
 */

export type SaveNoteInput = {
  /** Existing note id to edit; omit to create. */
  id?: string;
  surah: number;
  ayah: number;
  endAyah?: number;
  body: string;
  tags: readonly string[];
  color?: AnnotationColorId | null;
  words?: AyahWordSpan | null;
  textHash?: string | null;
};

export type SaveNoteResult =
  | { ok: true; note: AyahNote }
  | { ok: false; error: "full" | "empty" | "missing" };

interface QuranNotesState {
  notes: QuranNotesMap;
  index: QuranNotesIndex;
  /** Serialized size / {@link QURAN_NOTES_MAX_BYTES}, 0..1. */
  usage: number;
  /**
   * H2: notes from another device that didn't fit under the 1 MB sync cap.
   * They wait (nothing is deleted) and this device pauses pushing notes until
   * the user makes room. `null` when sync isn't held.
   */
  syncHold: { pending: number } | null;
  isReady: boolean;
  load: () => Promise<void>;
  save: (input: SaveNoteInput) => Promise<SaveNoteResult>;
  remove: (id: string) => Promise<void>;
  /** Highlight a whole ayah (null clears every whole-ayah highlight starting there). */
  setAyahHighlight: (
    surah: number,
    ayah: number,
    color: AnnotationColorId | null,
  ) => Promise<SaveNoteResult | null>;
}

const EMPTY_INDEX = buildQuranNotesIndex({});

function derive(notes: QuranNotesMap): Pick<QuranNotesState, "notes" | "index" | "usage"> {
  return {
    notes,
    index: buildQuranNotesIndex(notes),
    usage: quranNotesPayloadBytes(notes) / QURAN_NOTES_MAX_BYTES,
  };
}

const QURAN_NOTES_ENTITY = "quran_notes";

function holdState(hold: { pending?: number } | null): QuranNotesState["syncHold"] {
  return hold ? { pending: Math.max(1, hold.pending ?? 1) } : null;
}

function hasContent(note: Pick<AyahNote, "body" | "tags" | "color">): boolean {
  return note.body.trim().length > 0 || note.tags.length > 0 || note.color != null;
}

/** Read-modify-write under the key lock; `mutate` returns null to abort without writing. */
async function mutateNotes(
  mutate: (current: QuranNotesMap) => QuranNotesMap | null,
): Promise<QuranNotesMap | null> {
  return withKeyLock(DB_KEYS.quranNotes, async () => {
    const current = asQuranNotesMap(await readJSON<unknown>(DB_KEYS.quranNotes, {}));
    const next = mutate(current);
    if (!next) return null;
    await writeJSON(DB_KEYS.quranNotes, next);
    return next;
  });
}

function tombstone(note: AyahNote, nowIso: string): AyahNote {
  return { ...note, body: "", tags: [], color: undefined, updatedAt: nowIso, deletedAt: nowIso };
}

export const quranNotesStore = createStore<QuranNotesState>((set, get) => ({
  notes: {},
  index: EMPTY_INDEX,
  usage: 0,
  syncHold: null,
  isReady: false,

  async load() {
    const [raw, hold] = await Promise.all([
      readJSON<unknown>(DB_KEYS.quranNotes, {}),
      readBlobHold(QURAN_NOTES_ENTITY),
    ]);
    const notes = gcQuranNoteTombstones(asQuranNotesMap(raw));
    set({ ...derive(notes), syncHold: holdState(hold), isReady: true });
  },

  async save(input) {
    const nowIso = new Date().toISOString();
    const body = input.body.slice(0, QURAN_NOTE_BODY_MAX);
    const tags = normalizeNoteTags(input.tags);
    const color = input.color ?? undefined;
    if (!hasContent({ body, tags, color })) return { ok: false, error: "empty" };

    let result: SaveNoteResult = { ok: false, error: "missing" };
    const next = await mutateNotes((current) => {
      const existing = input.id ? current[input.id] : undefined;
      if (input.id && (!existing || existing.deletedAt)) return null;
      const endAyah =
        input.endAyah != null && input.endAyah > input.ayah ? input.endAyah : undefined;
      const note: AyahNote = {
        id: existing?.id ?? createId("note"),
        surah: input.surah,
        ayah: input.ayah,
        body,
        tags,
        createdAt: existing?.createdAt ?? nowIso,
        updatedAt: nowIso,
      };
      if (endAyah) note.endAyah = endAyah;
      if (color) note.color = color;
      // Word spans live inside one ayah, and only with the hash of its text.
      if (!endAyah && input.words && input.textHash) {
        note.words = input.words;
        note.textHash = input.textHash;
      }
      const candidate = { ...current, [note.id]: note };
      if (quranNotesPayloadBytes(candidate) > QURAN_NOTES_MAX_BYTES) {
        result = { ok: false, error: "full" };
        return null;
      }
      result = { ok: true, note };
      return candidate;
    });
    if (next) set(derive(next));
    return result;
  },

  async remove(id) {
    const nowIso = new Date().toISOString();
    const next = await mutateNotes((current) => {
      const existing = current[id];
      if (!existing || existing.deletedAt) return null;
      return { ...current, [id]: tombstone(existing, nowIso) };
    });
    if (next) set(derive(next));
  },

  async setAyahHighlight(surah, ayah, color) {
    // The newest whole-ayah annotation that starts on this ayah carries its colour.
    const candidates = (get().index.byAyah[noteAyahKey(surah, ayah)] ?? []).filter(
      (note) => note.ayah === ayah && note.endAyah == null && !note.words,
    );
    if (color) {
      const target = candidates[0];
      return get().save({
        id: target?.id,
        surah,
        ayah,
        body: target?.body ?? "",
        tags: target?.tags ?? [],
        color,
      });
    }
    const nowIso = new Date().toISOString();
    const ids = new Set(candidates.filter((note) => note.color).map((note) => note.id));
    if (!ids.size) return null;
    const next = await mutateNotes((current) => {
      const out = { ...current };
      for (const id of ids) {
        const existing = out[id];
        if (!existing || existing.deletedAt) continue;
        const cleared: AyahNote = { ...existing, color: undefined, updatedAt: nowIso };
        delete cleared.color;
        // A highlight-only annotation has nothing left once its colour goes.
        out[id] = hasContent(cleared) ? cleared : tombstone(existing, nowIso);
      }
      return out;
    });
    if (next) set(derive(next));
    return null;
  },
}));

// The sync layer parks / releases the notes blob outside this store: keep the flag live.
onBlobHoldChange((entity) => {
  if (entity !== QURAN_NOTES_ENTITY || !quranNotesStore.getState().isReady) return;
  void readBlobHold(QURAN_NOTES_ENTITY).then((hold) =>
    quranNotesStore.setState({ syncHold: holdState(hold) }),
  );
});

export function useEnsureQuranNotesLoaded(): void {
  useEffect(() => {
    if (!quranNotesStore.getState().isReady) void quranNotesStore.getState().load();
  }, []);
}

export function useQuranNotesIndex(): QuranNotesIndex {
  return useStore(quranNotesStore, (s) => s.index);
}

/** Live notes covering `surah:ayah`, newest first (memoised in the store index). */
export function useNotesForAyah(surah: number, ayah: number): AyahNote[] | undefined {
  return useStore(quranNotesStore, (s) => s.index.byAyah[noteAyahKey(surah, ayah)]);
}

export function useQuranNote(id: string | null | undefined): AyahNote | undefined {
  return useStore(quranNotesStore, (s) => {
    const note = id ? s.notes[id] : undefined;
    return note && !note.deletedAt ? note : undefined;
  });
}

export function useAllNoteTags(): string[] {
  return useStore(quranNotesStore, (s) => s.index.tags);
}

export function useQuranNotesReady(): boolean {
  return useStore(quranNotesStore, (s) => s.isReady);
}

/** True once the notes blob passes {@link QURAN_NOTES_WARN_RATIO} of its 1 MB cap. */
export function useQuranNotesNearlyFull(): boolean {
  return useStore(quranNotesStore, (s) => s.usage >= QURAN_NOTES_WARN_RATIO);
}

/** Notes from another device waiting for room under the sync cap (H2), or null. */
export function useQuranNotesSyncHold(): { pending: number } | null {
  return useStore(quranNotesStore, (s) => s.syncHold);
}

const quranNotesActions = {
  load: () => quranNotesStore.getState().load(),
  save: (input: SaveNoteInput) => quranNotesStore.getState().save(input),
  remove: (id: string) => quranNotesStore.getState().remove(id),
  setAyahHighlight: (surah: number, ayah: number, color: AnnotationColorId | null) =>
    quranNotesStore.getState().setAyahHighlight(surah, ayah, color),
} as const;

export function useQuranNotesActions() {
  return quranNotesActions;
}

// ---------------------------------------------------------------------------
// Editor target — one sheet host per reader opens on request.
// ---------------------------------------------------------------------------

export type QuranNoteEditorTarget = {
  mode: "note" | "highlight";
  surah: number;
  ayah: number;
  /** Edit this note; omit to edit the newest note on the ayah (or create one). */
  noteId?: string;
  /** Start a fresh note even when the ayah already has one. */
  fresh?: boolean;
};

export const quranNoteEditorStore = createStore<{ target: QuranNoteEditorTarget | null }>(() => ({
  target: null,
}));

export function openQuranNoteEditor(target: QuranNoteEditorTarget): void {
  // The editor replaces any preview that led to it.
  quranNotePeekStore.setState({ target: null });
  quranNoteEditorStore.setState({ target });
}

export function closeQuranNoteEditor(): void {
  quranNoteEditorStore.setState({ target: null });
}

export function useQuranNoteEditorTarget(): QuranNoteEditorTarget | null {
  return useStore(quranNoteEditorStore, (s) => s.target);
}

// ---------------------------------------------------------------------------
// Note hints — the read-only preview shown from a noted ayah / word.
// ---------------------------------------------------------------------------

export type QuranNotePeekVia =
  /** Desktop web: pointer hover — a popover that follows the anchor. */
  | "hover"
  /** Desktop web: keyboard focus — the same popover. */
  | "focus"
  /** Touch: tap — a compact bottom peek with "Open note". */
  | "press"
  /** Touch: long-press — the note's actions. */
  | "actions";

export type QuranNotePeekTarget = {
  surah: number;
  ayah: number;
  /** The note pointed at (a word span's note); else the ayah's newest note leads. */
  noteId?: string | null;
  via: QuranNotePeekVia;
  /** Desktop popover anchor in viewport coordinates (hover / focus only). */
  anchor?: { x: number; y: number; width: number; height: number } | null;
};

export const quranNotePeekStore = createStore<{ target: QuranNotePeekTarget | null }>(() => ({
  target: null,
}));

export function openQuranNotePeek(target: QuranNotePeekTarget): void {
  quranNotePeekStore.setState({ target });
}

/** Closes the peek; with `via`, only when it is still the one showing (hover-out vs a tap). */
export function closeQuranNotePeek(via?: QuranNotePeekVia | readonly QuranNotePeekVia[]): void {
  const current = quranNotePeekStore.getState().target;
  if (!current) return;
  if (via) {
    const list: readonly QuranNotePeekVia[] = Array.isArray(via) ? via : [via];
    if (!list.includes(current.via)) return;
  }
  quranNotePeekStore.setState({ target: null });
}

export function useQuranNotePeek(): QuranNotePeekTarget | null {
  return useStore(quranNotePeekStore, (s) => s.target);
}

// ---------------------------------------------------------------------------
// Reader viewport — keeps the wide-screen notes panel in sync with the list.
// ---------------------------------------------------------------------------

export type QuranReaderViewport = { surah: number; from: number; to: number } | null;

/** Written by the surah reader on viewability changes; read only by the notes side panel. */
export const quranReaderViewportStore = createStore<{ viewport: QuranReaderViewport }>(() => ({
  viewport: null,
}));

export function setQuranReaderViewport(viewport: QuranReaderViewport): void {
  const prev = quranReaderViewportStore.getState().viewport;
  if (
    prev === viewport ||
    (prev &&
      viewport &&
      prev.surah === viewport.surah &&
      prev.from === viewport.from &&
      prev.to === viewport.to)
  ) {
    return;
  }
  quranReaderViewportStore.setState({ viewport });
}

export function useQuranReaderViewport(): QuranReaderViewport {
  return useStore(quranReaderViewportStore, (s) => s.viewport);
}
