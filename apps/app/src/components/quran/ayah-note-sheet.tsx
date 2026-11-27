import type { AnnotationColorId, AyahNote, AyahWordSpan } from "@munib-tracker/shared/types";
import { QURAN_NOTE_BODY_MAX, QURAN_NOTE_TAGS_MAX } from "@munib-tracker/shared/types";
import {
  detectTextDirection,
  formatNoteRef,
  hashAyahText,
  normalizeNoteTag,
  suggestNoteTags,
} from "@munib-tracker/shared/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { AnnotationSwatches } from "@/components/quran/annotation-swatches";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { Stepper } from "@/components/ui/stepper";
import { TextField } from "@/components/ui/text-field";
import { Radius, Spacing } from "@/constants/theme";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import i18n from "@/i18n";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahAyahs } from "@/lib/quran";
import { splitAyahWords } from "@/lib/quran-companion/align-words";
import { getSurahByNumber } from "@/lib/quran-meta";
import { annotationTint } from "@/lib/quran-notes/annotation-colors";
import { useIsRTL } from "@/lib/rtl";
import type { SttErrorKind } from "@/lib/stt";
import { useToast } from "@/providers/toast-provider";
import {
  useAllNoteTags,
  useNotesForAyah,
  useQuranNote,
  useQuranNotesActions,
  useQuranNotesNearlyFull,
  useQuranNotesSyncHold,
} from "@/stores/quran-notes-store";

type AyahNoteSheetProps = {
  visible: boolean;
  surah: number;
  ayah: number;
  noteId?: string;
  /** Start a new note even if this ayah already has one. */
  fresh?: boolean;
  onClose: () => void;
};

type Draft = {
  body: string;
  tags: string[];
  tagDraft: string;
  color: AnnotationColorId | null;
  endAyah: number;
  words: AyahWordSpan | null;
};

function draftFrom(note: AyahNote | undefined, ayah: number): Draft {
  return {
    body: note?.body ?? "",
    tags: note?.tags ?? [],
    tagDraft: "",
    color: note?.color ?? null,
    endAyah: note?.endAyah ?? note?.ayah ?? ayah,
    words: note?.words ?? null,
  };
}

/**
 * "My note" editor (NF-3.21). The user's own reflection — styled as a personal
 * note, never like the tafsir panel. Plain text with automatic writing
 * direction, tags with autocomplete, a highlight colour, an optional range end,
 * an optional word span, and dictation through the existing speech-to-text.
 * Not mounted on TV (read-only there).
 */
export function AyahNoteSheet({
  visible,
  surah,
  ayah,
  noteId,
  fresh,
  onClose,
}: AyahNoteSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const actions = useQuranNotesActions();
  const allTags = useAllNoteTags();
  const nearlyFull = useQuranNotesNearlyFull();
  const syncHold = useQuranNotesSyncHold();
  const ayahNotes = useNotesForAyah(surah, ayah);
  const explicit = useQuranNote(noteId);
  const existing = useMemo(() => {
    if (noteId) return explicit;
    if (fresh) return undefined;
    // Newest note that starts on this ayah (a highlight-only one included).
    return ayahNotes?.find((note) => note.ayah === ayah);
  }, [ayah, ayahNotes, explicit, fresh, noteId]);
  const startAyah = existing?.ayah ?? ayah;
  const ayahCount = getSurahByNumber(surah)?.ayahCount ?? startAyah;

  const [draft, setDraft] = useState<Draft>(() => draftFrom(existing, startAyah));
  const [pickWords, setPickWords] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [saving, setSaving] = useState(false);
  const existingId = existing?.id;

  // Reset the form whenever the sheet opens on a (different) note.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on identity, not content
  useEffect(() => {
    if (visible) {
      setDraft(draftFrom(existing, startAyah));
      setPickWords(false);
    }
  }, [visible, existingId, surah, startAyah]);

  const ayahText = useMemo(
    () => (visible ? (getSurahAyahs(surah)[startAyah - 1]?.arabic ?? "") : ""),
    [startAyah, surah, visible],
  );
  const words = useMemo(() => splitAyahWords(ayahText), [ayahText]);

  const handleSttError = useCallback(
    (kind: SttErrorKind) => {
      if (kind === "permission") toast.warning(t("journal.stt.permissionDenied"));
      else if (kind === "unavailable") toast.warning(t("journal.stt.unavailable"));
      else if (kind === "noSpeech") toast.info(t("journal.stt.couldNotHear"));
      else toast.error(t("journal.stt.errorGeneric"));
    },
    [t, toast],
  );
  const stt = useSpeechToText({
    uiLocale: i18n.language ?? "en",
    onTranscript: (text: string) =>
      setDraft((d) => ({ ...d, body: text.slice(0, QURAN_NOTE_BODY_MAX) })),
    onError: handleSttError,
  });
  useEffect(() => {
    if (!visible) stt.abort();
  }, [visible, stt.abort]);

  const bodyDir = detectTextDirection(draft.body, i18n.dir?.() === "rtl" ? "rtl" : "ltr");
  const suggestions = suggestNoteTags(allTags, draft.tagDraft, draft.tags, 6);
  const isRange = draft.endAyah > startAyah;

  const addTag = (raw: string) => {
    const tag = normalizeNoteTag(raw);
    setDraft((d) =>
      !tag || d.tags.includes(tag) || d.tags.length >= QURAN_NOTE_TAGS_MAX
        ? { ...d, tagDraft: "" }
        : { ...d, tags: [...d.tags, tag], tagDraft: "" },
    );
  };

  const toggleWord = (index: number) => {
    setDraft((d) => {
      const span = d.words;
      if (!span) return { ...d, words: { start: index, end: index } };
      if (index < span.start) return { ...d, words: { start: index, end: span.end } };
      if (index > span.end) return { ...d, words: { start: span.start, end: index } };
      // Tapping inside the span shrinks it to that one word; again clears it.
      return span.start === index && span.end === index
        ? { ...d, words: null }
        : { ...d, words: { start: index, end: index } };
    });
  };

  const save = async () => {
    if (saving) return;
    stt.abort();
    const pendingTag = normalizeNoteTag(draft.tagDraft);
    const tags =
      pendingTag && !draft.tags.includes(pendingTag) ? [...draft.tags, pendingTag] : draft.tags;
    setSaving(true);
    const result = await actions.save({
      id: existingId,
      surah,
      ayah: startAyah,
      endAyah: isRange ? draft.endAyah : undefined,
      body: draft.body,
      tags,
      color: draft.color,
      words: !isRange ? draft.words : null,
      textHash: !isRange && draft.words ? hashAyahText(ayahText) : null,
    });
    setSaving(false);
    if (result.ok) {
      toast.success(t("quranNotes.saved"));
      onClose();
    } else if (result.error === "full") {
      toast.error(t("quranNotes.full"));
    } else if (result.error === "empty") {
      toast.info(t("quranNotes.emptyDraft"));
    } else {
      onClose();
    }
  };

  const ref = formatNoteRef({
    surah,
    ayah: startAyah,
    endAyah: isRange ? draft.endAyah : undefined,
  });
  const tv = isTV();
  const rtlUi = useIsRTL();

  return (
    <>
      <Sheet
        title={t("quranNotes.myNote")}
        visible={visible && !confirmDelete}
        onClose={onClose}
        variant="bottom"
        solid
      >
        <View style={styles.header}>
          <ThemedText type="bodyLarge" weight="semibold">
            {getSurahByNumber(surah)?.nameTransliteration ?? ""} · {ref}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranNotes.notTafsir")}
          </ThemedText>
        </View>

        <TextField
          label={t("quranNotes.bodyLabel")}
          value={draft.body}
          onChangeText={(body) => {
            if (stt.listening) stt.abort();
            setDraft((d) => ({ ...d, body }));
          }}
          placeholder={t("quranNotes.bodyPlaceholder")}
          multiline
          minLines={5}
          maxLength={QURAN_NOTE_BODY_MAX}
          style={styles.field}
          inputStyle={[
            styles.bodyInput,
            // The note follows its own script (Urdu / Arabic notes read RTL in any UI).
            { writingDirection: bodyDir, textAlign: bodyDir === "rtl" ? "right" : "left" },
          ]}
          trailing={
            stt.available && !tv ? (
              <View style={styles.mic}>
                <VoiceInputButton
                  size="sm"
                  listening={stt.listening}
                  level={stt.level}
                  accessibilityLabel={
                    stt.listening ? t("journal.stt.stopDictate") : t("journal.stt.dictate")
                  }
                  accessibilityHint={stt.listening ? t("journal.stt.listening") : undefined}
                  onPress={() => {
                    if (stt.listening) stt.stop();
                    else void stt.start("note", draft.body, "other");
                  }}
                />
              </View>
            ) : undefined
          }
          testID="ayah-note-body"
        />

        <View style={styles.section}>
          {draft.tags.length < QURAN_NOTE_TAGS_MAX ? (
            <TextField
              label={t("quranNotes.tags")}
              value={draft.tagDraft}
              onChangeText={(tagDraft) => {
                if (/[,\n]$/.test(tagDraft)) addTag(tagDraft.slice(0, -1));
                else setDraft((d) => ({ ...d, tagDraft }));
              }}
              onSubmitEditing={() => addTag(draft.tagDraft)}
              placeholder={t("quranNotes.tagPlaceholder")}
              autoCapitalize="none"
              returnKeyType="done"
              testID="ayah-note-tag-input"
            />
          ) : (
            <ThemedText type="small">{t("quranNotes.tags")}</ThemedText>
          )}
          <View style={styles.chips}>
            {draft.tags.map((tag) => (
              <PressableScale
                key={tag}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={t("quranNotes.removeTag", { tag })}
                onPress={() => setDraft((d) => ({ ...d, tags: d.tags.filter((x) => x !== tag) }))}
                style={[styles.chip, { backgroundColor: tokens.accentSoft }]}
              >
                <ThemedText type="caption" style={{ color: colors.accentText }}>
                  #{tag} ×
                </ThemedText>
              </PressableScale>
            ))}
          </View>
          {suggestions.length ? (
            <View style={styles.chips}>
              {suggestions.map((tag) => (
                <PressableScale
                  key={tag}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={t("quranNotes.addTag", { tag })}
                  onPress={() => addTag(tag)}
                  style={[styles.chip, { backgroundColor: colors.muted }]}
                >
                  <ThemedText type="caption" themeColor="mutedForeground">
                    + #{tag}
                  </ThemedText>
                </PressableScale>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.section}>
          <ThemedText type="small">{t("quranNotes.highlight")}</ThemedText>
          <AnnotationSwatches
            value={draft.color}
            onChange={(color) => setDraft((d) => ({ ...d, color }))}
          />
        </View>

        {ayahCount > startAyah ? (
          <View style={styles.section}>
            <Stepper
              label={t("quranNotes.rangeEnd")}
              value={draft.endAyah}
              min={startAyah}
              size="sm"
              valueAccessibilityLabel={t("quranNotes.rangeEndValue", { ayah: draft.endAyah })}
              onDecrement={() =>
                setDraft((d) => ({ ...d, endAyah: Math.max(startAyah, d.endAyah - 1) }))
              }
              onIncrement={() =>
                setDraft((d) => ({
                  ...d,
                  endAyah: Math.min(ayahCount, d.endAyah + 1),
                  words: null,
                }))
              }
            />
          </View>
        ) : null}

        {!isRange && words.length > 1 ? (
          <View style={styles.section}>
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityState={{ expanded: pickWords }}
              accessibilityLabel={t("quranNotes.wordsToggle")}
              onPress={() => setPickWords((v) => !v)}
            >
              <ThemedText type="small" style={{ color: colors.accentText }}>
                {draft.words
                  ? t("quranNotes.wordsSelected", {
                      count: draft.words.end - draft.words.start + 1,
                    })
                  : t("quranNotes.wordsToggle")}
              </ThemedText>
            </PressableScale>
            {pickWords ? (
              <>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("quranNotes.wordsHint")}
                </ThemedText>
                <View style={[styles.chips, { flexDirection: rtlUi ? "row" : "row-reverse" }]}>
                  {words.map((word, index) => {
                    const on =
                      !!draft.words && index >= draft.words.start && index <= draft.words.end;
                    return (
                      <PressableScale
                        // biome-ignore lint/suspicious/noArrayIndexKey: a word's position is its identity in a fixed ayah
                        key={`${index}:${word}`}
                        haptic="selection"
                        accessibilityRole="button"
                        accessibilityState={{ selected: on }}
                        accessibilityLabel={t("quranNotes.wordN", { n: index + 1 })}
                        onPress={() => toggleWord(index)}
                        style={[
                          styles.word,
                          {
                            backgroundColor: on
                              ? annotationTint(draft.color ?? "gold", tokens.isDark)
                              : colors.muted,
                          },
                        ]}
                        testID={`ayah-note-word-${index}`}
                      >
                        <ThemedText
                          type="arabic"
                          accessibilityLanguage="ar"
                          style={styles.wordText}
                        >
                          {word}
                        </ThemedText>
                      </PressableScale>
                    );
                  })}
                </View>
              </>
            ) : null}
          </View>
        ) : null}

        {nearlyFull ? (
          <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
            {t("quranNotes.nearlyFull")}
          </ThemedText>
        ) : null}
        {syncHold ? (
          <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
            {t("quranNotes.syncFull", { count: syncHold.pending })}
          </ThemedText>
        ) : null}

        <View style={styles.footer}>
          {existingId ? (
            <Button
              label={t("quranNotes.delete")}
              variant="ghost"
              labelColor={tokens.status.danger.text}
              onPress={() => setConfirmDelete(true)}
            />
          ) : null}
          <View style={styles.footerEnd}>
            <Button label={t("common.cancel")} variant="secondary" onPress={onClose} />
            <Button label={t("quranNotes.save")} onPress={() => void save()} disabled={saving} />
          </View>
        </View>
      </Sheet>
      <ConfirmDialog
        visible={visible && confirmDelete}
        title={t("quranNotes.deleteTitle")}
        message={t("quranNotes.deleteBody", { ref })}
        confirmLabel={t("quranNotes.delete")}
        cancelLabel={t("common.cancel")}
        destructive
        onConfirm={() => {
          setConfirmDelete(false);
          if (existingId) void actions.remove(existingId);
          toast.success(t("quranNotes.deleted"));
          onClose();
        }}
        onCancel={() => setConfirmDelete(false)}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.half },
  field: { marginTop: Spacing.three },
  bodyInput: { maxHeight: 260 },
  mic: { alignSelf: "flex-start" },
  section: { marginTop: Spacing.three, gap: Spacing.two },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
  },
  word: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
    borderRadius: Radius.sm,
  },
  wordText: { fontSize: 20, lineHeight: 34 },
  footer: {
    marginTop: Spacing.four,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  footerEnd: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: Spacing.two,
  },
});
