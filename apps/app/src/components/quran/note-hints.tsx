import type { AyahNote } from "@munib-tracker/shared/types";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  type LayoutChangeEvent,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { NotePreviewCard } from "@/components/quran/my-note-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { BorderWidth, Radius, Shadows, Spacing, ZIndex } from "@/constants/theme";
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useWebScreenKeyHandler } from "@/hooks/use-web-key-handler";
import { triggerHaptic } from "@/lib/haptics";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahByNumber } from "@/lib/quran-meta";
import {
  buildNotePreview,
  type NotePreview,
  orderNotesForPreview,
  placePopover,
  type Rect,
} from "@/lib/quran-notes/note-preview";
import { useIsRTL } from "@/lib/rtl";
import { useToast } from "@/providers/toast-provider";
import {
  closeQuranNotePeek,
  openQuranNoteEditor,
  openQuranNotePeek,
  type QuranNotePeekTarget,
  quranNotePeekStore,
  useNotesForAyah,
  useQuranNotePeek,
  useQuranNotesActions,
} from "@/stores/quran-notes-store";

/**
 * NF-3.21 note hints — how a noted ayah / word reveals its note, per platform:
 *
 * - **Desktop web** (fine pointer): hovering or keyboard-focusing the marker,
 *   a noted word or ayah shows a hover card with the note's title, excerpt,
 *   tags and colour; a click opens the note; Esc closes the card.
 * - **Phones / touch web**: tap shows a compact peek sheet with "Open note";
 *   long-press shows the note's actions (iOS: the native context menu on the
 *   marker; Android / web: an action sheet — Material's long-press pattern).
 * - **TV**: read-only — the focused ayah card shows its note inline.
 *
 * One host per screen (`QuranNotePeekHost`, mounted by `QuranNotesSheetHost`)
 * draws whichever preview is open, so word runs only carry handlers — no
 * per-word component state or measuring.
 */

export type NoteHintRef = { surah: number; ayah: number; noteId?: string | null };

const HOVER_OPEN_DELAY_MS = 250;
const HOVER_CLOSE_DELAY_MS = 180;
const HOVER_CARD_WIDTH = 320;
const PEEK_MAX_NOTES = 3;

let openTimer: ReturnType<typeof setTimeout> | null = null;
let closeTimer: ReturnType<typeof setTimeout> | null = null;

function clearTimer(timer: ReturnType<typeof setTimeout> | null): null {
  if (timer) clearTimeout(timer);
  return null;
}

/** Keep the hover card open (pointer moved from the target onto the card). */
export function cancelNotePeekClose(): void {
  closeTimer = clearTimer(closeTimer);
}

function scheduleHoverOpen(target: QuranNotePeekTarget): void {
  closeTimer = clearTimer(closeTimer);
  openTimer = clearTimer(openTimer);
  // Already showing this ayah: just follow the pointer, no delay.
  const current = quranNotePeekStore.getState().target;
  if (current && current.surah === target.surah && current.ayah === target.ayah) {
    openQuranNotePeek(target);
    return;
  }
  openTimer = setTimeout(() => {
    openTimer = null;
    openQuranNotePeek(target);
  }, HOVER_OPEN_DELAY_MS);
}

export function scheduleNotePeekClose(): void {
  openTimer = clearTimer(openTimer);
  closeTimer = clearTimer(closeTimer);
  closeTimer = setTimeout(() => {
    closeTimer = null;
    closeQuranNotePeek(["hover", "focus"]);
  }, HOVER_CLOSE_DELAY_MS);
}

/** The DOM box of a web pointer / focus event's target, in viewport coordinates. */
export function anchorFromEvent(event: unknown): Rect | null {
  const e = event as {
    currentTarget?: { getBoundingClientRect?: () => DOMRect };
    nativeEvent?: { target?: { getBoundingClientRect?: () => DOMRect } };
  } | null;
  const el = e?.currentTarget?.getBoundingClientRect
    ? e.currentTarget
    : e?.nativeEvent?.target?.getBoundingClientRect
      ? e.nativeEvent.target
      : null;
  const box = el?.getBoundingClientRect?.();
  if (!box) return null;
  return { x: box.left, y: box.top, width: box.width, height: box.height };
}

export type NoteHintHandlers = {
  onPress: () => void;
  onLongPress?: () => void;
  onPointerEnter?: (event: unknown) => void;
  onPointerLeave?: () => void;
  onFocus?: (event: unknown) => void;
  onBlur?: () => void;
};

/**
 * Handlers for one noted target (marker, word run, ayah run). Plain function —
 * safe inside loops over glyph tokens. `fineHover` comes from
 * {@link useFinePointerHover} at the component level.
 */
export function noteHintHandlers(ref: NoteHintRef, fineHover: boolean): NoteHintHandlers {
  const peek = (via: QuranNotePeekTarget["via"], anchor?: Rect | null) =>
    openQuranNotePeek({ surah: ref.surah, ayah: ref.ayah, noteId: ref.noteId, via, anchor });
  if (fineHover) {
    return {
      onPress: () => {
        closeTimer = clearTimer(closeTimer);
        openTimer = clearTimer(openTimer);
        openQuranNoteEditor({
          mode: "note",
          surah: ref.surah,
          ayah: ref.ayah,
          noteId: ref.noteId ?? undefined,
        });
      },
      onPointerEnter: (event) =>
        scheduleHoverOpen({
          surah: ref.surah,
          ayah: ref.ayah,
          noteId: ref.noteId,
          via: "hover",
          anchor: anchorFromEvent(event),
        }),
      onPointerLeave: scheduleNotePeekClose,
      onFocus: (event) => {
        openTimer = clearTimer(openTimer);
        closeTimer = clearTimer(closeTimer);
        peek("focus", anchorFromEvent(event));
      },
      onBlur: () => closeQuranNotePeek("focus"),
    };
  }
  return {
    onPress: () => peek("press"),
    onLongPress: () => {
      triggerHaptic("selection");
      peek("actions");
    },
  };
}

/** Hook form for a single target (marker / ayah block). */
export function useNoteHintHandlers(ref: NoteHintRef): NoteHintHandlers {
  const fineHover = useFinePointerHover();
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the ref's fields
  return useMemo(
    () => noteHintHandlers(ref, fineHover),
    [ref.surah, ref.ayah, ref.noteId, fineHover],
  );
}

/**
 * Web-only props for an element (typed loosely — RN's types don't list every
 * DOM handler). `keyboard: true` also makes a plain text run a Tab stop
 * (`focusable` → tabIndex 0, no role, so a word run stays an inline span and
 * Arabic joining is kept) and opens the note on Enter / Space. Focusing it
 * shows the same preview card, announced through its live region.
 */
export function webHintProps(
  handlers: NoteHintHandlers,
  { keyboard = false }: { keyboard?: boolean } = {},
): Record<string, unknown> {
  if (Platform.OS !== "web" || !handlers.onPointerEnter) return {};
  return {
    onPointerEnter: handlers.onPointerEnter,
    onPointerLeave: handlers.onPointerLeave,
    onFocus: handlers.onFocus,
    onBlur: handlers.onBlur,
    ...(keyboard
      ? {
          focusable: true,
          onKeyDown: (event: { key?: string; preventDefault?: () => void }) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault?.();
            handlers.onPress();
          },
        }
      : {}),
  };
}

/** Previews for an ayah, the pointed-at note first. */
export function useNotePreviews(
  surah: number,
  ayah: number,
  preferId?: string | null,
): NotePreview[] {
  const notes = useNotesForAyah(surah, ayah);
  return useMemo(
    () =>
      orderNotesForPreview(notes, preferId)
        .filter((note) => note.body.trim() || note.tags.length)
        .map(buildNotePreview),
    [notes, preferId],
  );
}

/** "My note on 2:255: <title>" — what a screen reader hears for a noted target. */
export function useNoteHintLabel(surah: number, ayah: number): string | null {
  const { t } = useTranslation();
  const previews = useNotePreviews(surah, ayah);
  const first = previews[0];
  if (!first) return null;
  return t("quranNotes.hint.label", {
    ref: `${surah}:${ayah}`,
    title: first.title || first.tags.map((tag) => `#${tag}`).join(" "),
  });
}

// ---------------------------------------------------------------------------
// Host
// ---------------------------------------------------------------------------

/** Draws the open note hint for this screen (desktop hover card, phone peek or actions). */
export function QuranNotePeekHost() {
  const target = useQuranNotePeek();
  // Unmounting closes any stray hover card (route change).
  useEffect(() => () => closeQuranNotePeek(), []);
  if (!target || isTV()) return null;
  if (target.via === "hover" || target.via === "focus") {
    return Platform.OS === "web" ? <NoteHoverCard target={target} /> : null;
  }
  if (target.via === "actions") return <NoteActionsSheet target={target} />;
  return <NotePeekSheet target={target} />;
}

function NoteHoverCard({ target }: { target: QuranNotePeekTarget }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const viewport = useWindowDimensions();
  const rtl = useIsRTL();
  const previews = useNotePreviews(target.surah, target.ayah, target.noteId);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);
  useWebScreenKeyHandler((event) => {
    if (event.key !== "Escape") return undefined;
    closeQuranNotePeek();
    return true;
  });
  if (!previews.length) return null;
  const width = Math.min(HOVER_CARD_WIDTH, viewport.width - 24);
  const anchor = target.anchor ?? {
    x: (viewport.width - width) / 2,
    y: viewport.height / 3,
    width,
    height: 0,
  };
  const place = size ? placePopover(anchor, size, viewport, rtl) : null;
  // `placePopover` works in viewport (physical) coordinates; the card is placed
  // with a logical `start` inset, so in RTL measure it from the right edge.
  const start =
    place && size ? (rtl ? viewport.width - place.left - size.width : place.left) : null;
  const onLayout = (event: LayoutChangeEvent) => {
    const { width: w, height: h } = event.nativeEvent.layout;
    setSize((prev) =>
      prev && prev.width === w && prev.height === h ? prev : { width: w, height: h },
    );
  };
  const shown = previews.slice(0, 2);
  return (
    <View
      testID="note-hover-card"
      accessibilityLiveRegion="polite"
      onLayout={onLayout}
      {...({
        onPointerEnter: cancelNotePeekClose,
        onPointerLeave: scheduleNotePeekClose,
      } as object)}
      style={[
        styles.hoverCard,
        {
          width,
          backgroundColor: colors.card,
          borderColor: tokens.hairline,
          // Measure off-screen first, then place.
          start: start ?? -10_000,
          top: place?.top ?? 0,
          opacity: place ? 1 : 0,
        },
        { position: "fixed" } as unknown as ViewStyle,
      ]}
    >
      {shown.map((preview) => (
        <PressableScale
          key={preview.id}
          haptic={false}
          scaleTo={0.99}
          accessibilityRole="button"
          accessibilityLabel={t("quranNotes.openNote", { ref: preview.ref })}
          onPress={() =>
            openQuranNoteEditor({
              mode: "note",
              surah: preview.surah,
              ayah: preview.ayah,
              noteId: preview.id,
            })
          }
        >
          <NotePreviewCard preview={preview} surface={colors.muted} />
        </PressableScale>
      ))}
      <ThemedText type="caption" themeColor="mutedForeground">
        {previews.length > shown.length
          ? t("quranNotes.hint.moreNotes", { count: previews.length - shown.length })
          : t("quranNotes.hint.clickToOpen")}
      </ThemedText>
    </View>
  );
}

/** Under the sheet title (surah · ref): notes are personal, not tafsir. */
function PeekHeader() {
  const { t } = useTranslation();
  return (
    <View style={styles.header}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("quranNotes.notTafsir")}
      </ThemedText>
    </View>
  );
}

function openEditorFor(preview: Pick<NotePreview, "surah" | "ayah" | "id">) {
  openQuranNoteEditor({
    mode: "note",
    surah: preview.surah,
    ayah: preview.ayah,
    noteId: preview.id,
  });
}

/** Phone tap: a compact read-only peek of the ayah's notes with one primary action. */
function NotePeekSheet({ target }: { target: QuranNotePeekTarget }) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const previews = useNotePreviews(target.surah, target.ayah, target.noteId);
  const close = () => closeQuranNotePeek();
  const first = previews[0];
  return (
    <Sheet
      title={`${getSurahByNumber(target.surah)?.nameTransliteration ?? ""} · ${target.surah}:${target.ayah}`}
      visible
      onClose={close}
      variant="bottom"
    >
      <PeekHeader />
      <View style={styles.body} testID="note-peek-sheet">
        {previews.slice(0, PEEK_MAX_NOTES).map((preview) => (
          <PressableScale
            key={preview.id}
            haptic="light"
            scaleTo={0.99}
            accessibilityRole="button"
            accessibilityLabel={t("quranNotes.openNote", { ref: preview.ref })}
            onPress={() => openEditorFor(preview)}
            onLongPress={() =>
              openQuranNotePeek({ ...target, noteId: preview.id, via: "actions", anchor: null })
            }
          >
            <NotePreviewCard preview={preview} surface={colors.muted} />
          </PressableScale>
        ))}
        {previews.length > PEEK_MAX_NOTES ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranNotes.hint.moreNotes", { count: previews.length - PEEK_MAX_NOTES })}
          </ThemedText>
        ) : null}
        {previews.length === 0 ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("quranNotes.noneOnAyah")}
          </ThemedText>
        ) : null}
      </View>
      {first ? (
        <Button
          label={t("quranNotes.hint.open")}
          fullWidth
          onPress={() => openEditorFor(first)}
          style={styles.primary}
        />
      ) : null}
    </Sheet>
  );
}

type NoteAction = {
  id: "open" | "highlight" | "new" | "delete";
  label: string;
  icon: SymbolViewProps["name"];
  destructive?: boolean;
};

/** The long-press actions for a note (shared by the Android/web sheet and the iOS context menu). */
export function useNoteActions(): NoteAction[] {
  const { t } = useTranslation();
  return useMemo(
    () => [
      {
        id: "open",
        label: t("quranNotes.edit"),
        icon: { ios: "square.and.pencil", android: "edit_note", web: "edit_note" },
      },
      {
        id: "highlight",
        label: t("quranNotes.hint.changeHighlight"),
        icon: { ios: "highlighter", android: "format_color_fill", web: "format_color_fill" },
      },
      {
        id: "new",
        label: t("quranNotes.hint.addAnother"),
        icon: { ios: "plus", android: "add", web: "add" },
      },
      {
        id: "delete",
        label: t("quranNotes.delete"),
        icon: { ios: "trash", android: "delete", web: "delete" },
        destructive: true,
      },
    ],
    [t],
  );
}

/** Runs a note action; "delete" is confirmed by the caller first. */
export function runNoteAction(
  id: NoteAction["id"],
  note: Pick<AyahNote, "id" | "surah" | "ayah">,
): void {
  if (id === "open")
    openQuranNoteEditor({ mode: "note", surah: note.surah, ayah: note.ayah, noteId: note.id });
  else if (id === "highlight")
    openQuranNoteEditor({ mode: "highlight", surah: note.surah, ayah: note.ayah });
  else if (id === "new")
    openQuranNoteEditor({ mode: "note", surah: note.surah, ayah: note.ayah, fresh: true });
}

/** Android / web long-press: the note's actions as a bottom sheet (Material contextual actions). */
function NoteActionsSheet({ target }: { target: QuranNotePeekTarget }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const { remove } = useQuranNotesActions();
  const previews = useNotePreviews(target.surah, target.ayah, target.noteId);
  const actions = useNoteActions();
  const [confirming, setConfirming] = useState(false);
  const note = previews[0];
  const close = () => closeQuranNotePeek();
  if (!note) return null;
  return (
    <>
      <Sheet
        accessibilityLabel={t("quranNotes.myNote")}
        visible={!confirming}
        onClose={close}
        variant="bottom"
      >
        <View style={styles.body} testID="note-actions-sheet">
          <NotePreviewCard preview={note} surface={colors.muted} />
          <View>
            {actions.map((action) => {
              const tint = action.destructive ? tokens.status.danger.text : colors.foreground;
              return (
                <PressableScale
                  key={action.id}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  onPress={() => {
                    if (action.id === "delete") setConfirming(true);
                    else runNoteAction(action.id, note);
                  }}
                  style={[styles.actionRow, { borderTopColor: tokens.hairline }]}
                  testID={`note-action-${action.id}`}
                >
                  <SymbolView name={action.icon} size={20} tintColor={tint} />
                  <ThemedText type="default" style={{ color: tint }}>
                    {action.label}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>
        </View>
      </Sheet>
      <ConfirmDialog
        visible={confirming}
        title={t("quranNotes.deleteTitle")}
        message={t("quranNotes.deleteBody", { ref: note.ref })}
        confirmLabel={t("quranNotes.delete")}
        cancelLabel={t("common.cancel")}
        destructive
        onConfirm={() => {
          setConfirming(false);
          void remove(note.id);
          toast.success(t("quranNotes.deleted"));
          close();
        }}
        onCancel={() => setConfirming(false)}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// TV + wide-screen helpers
// ---------------------------------------------------------------------------

/** TV: the focused ayah card's note, read-only (Select still opens the full action sheet). */
export function TvNoteFocusPreview({ surah, ayah }: { surah: number; ayah: number }) {
  const { colors } = useThemeTokens();
  const previews = useNotePreviews(surah, ayah);
  const first = previews[0];
  if (!first) return null;
  return (
    <View style={styles.tvPreview} testID="tv-note-focus-preview" accessibilityLiveRegion="polite">
      <NotePreviewCard preview={first} surface={colors.muted} />
    </View>
  );
}

/** Underline style for a noted word / ayah run: dotted, in the note's colour (≥3:1) or accent text. */
export function noteUnderlineStyle(color: string): {
  textDecorationLine: "underline";
  textDecorationStyle: "dotted";
  textDecorationColor: string;
} {
  return {
    textDecorationLine: "underline",
    textDecorationStyle: "dotted",
    textDecorationColor: color,
  };
}

const styles = StyleSheet.create({
  hoverCard: {
    zIndex: ZIndex.overlay,
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.lg,
    borderWidth: BorderWidth.hairline,
    ...Shadows.lg,
  },
  header: { gap: Spacing.half },
  body: { marginTop: Spacing.three, gap: Spacing.two },
  primary: { marginTop: Spacing.three, alignSelf: "stretch" },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    minHeight: 48,
    paddingHorizontal: Spacing.one,
    borderTopWidth: BorderWidth.hairline,
  },
  tvPreview: { marginTop: Spacing.two },
});
