import type { AnnotationColorId, AyahNote } from "@munib-tracker/shared/types";
import { sortNotesByReadingOrder } from "@munib-tracker/shared/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { AnnotationSwatches } from "@/components/quran/annotation-swatches";
import { NOTE_ICON } from "@/components/quran/ayah-annotations";
import { MyNoteCard } from "@/components/quran/my-note-card";
import { QuranNotesSheetHost } from "@/components/quran/quran-notes-sheet-host";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Sheet } from "@/components/ui/sheet";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahByNumber } from "@/lib/quran-meta";
import { buildQuranNotesExport, shareNotesText } from "@/lib/quran-notes/export";
import { createQuranNotesSearch, filterQuranNotes } from "@/lib/quran-notes/notes-search";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";
import {
  openQuranNoteEditor,
  useEnsureQuranNotesLoaded,
  useQuranNotesIndex,
  useQuranNotesNearlyFull,
  useQuranNotesReady,
  useQuranNotesSyncHold,
} from "@/stores/quran-notes-store";

/**
 * `/quran/notes` — every personal ayah note (NF-3.21), grouped by surah, with
 * tag + colour filters, a local fuzzy search over note text and tags, and an
 * export to the share sheet. TV is read-only (no editing, no export).
 */
export default function QuranNotesScreen() {
  useEnsureQuranNotesLoaded();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const ready = useQuranNotesReady();
  const index = useQuranNotesIndex();
  const nearlyFull = useQuranNotesNearlyFull();
  const syncHold = useQuranNotesSyncHold();
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [color, setColor] = useState<AnnotationColorId | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  // Settings › Qur'an › Notes › "Export notes" links here with `?export=1`.
  const { export: exportParam } = useLocalSearchParams<{ export?: string }>();
  useEffect(() => {
    if (exportParam === "1" && !tv) setExportOpen(true);
  }, [exportParam, tv]);

  const all = useMemo(() => sortNotesByReadingOrder(index.live), [index.live]);
  const fuzzy = useMemo(() => (all.length ? createQuranNotesSearch(all) : null), [all]);
  const visible = useMemo(
    () => filterQuranNotes(all, fuzzy, { query, tag, color }),
    [all, color, fuzzy, query, tag],
  );
  // Search results stay ranked; otherwise group by surah in reading order.
  const groups = useMemo(() => {
    const out: Array<{ surah: number; notes: AyahNote[] }> = [];
    for (const note of query.trim() ? visible : sortNotesByReadingOrder(visible)) {
      const last = out[out.length - 1];
      if (last && last.surah === note.surah && !query.trim()) last.notes.push(note);
      else out.push({ surah: note.surah, notes: [note] });
    }
    return out;
  }, [query, visible]);

  const openAyah = (note: AyahNote) =>
    router.push({
      pathname: "/quran/[surah]",
      params: { surah: String(note.surah), ayah: String(note.ayah) },
    });

  return (
    <ScreenLayout
      eyebrow={t("quran.title")}
      title={t("quranNotes.title")}
      subtitle={t("quranNotes.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/notes" />
      {!ready ? null : all.length === 0 ? (
        <EmptyState
          icon={NOTE_ICON}
          title={t("quranNotes.emptyTitle")}
          description={tTv(t, "quranNotes.emptyDesc", "quranNotes.emptyDescTv")}
          actionLabel={t("quran.surahList")}
          onAction={() => router.push("/quran")}
        />
      ) : (
        <View style={styles.root}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranNotes.notTafsir")}
          </ThemedText>
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

          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder={t("quranNotes.searchPlaceholder")}
          />

          {index.tags.length ? (
            <View style={styles.chips}>
              {index.tags.slice(0, 24).map((name) => {
                const on = tag === name;
                return (
                  <PressableScale
                    key={name}
                    haptic="selection"
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={t("quranNotes.filterTag", { tag: name })}
                    onPress={() => setTag(on ? null : name)}
                    style={[
                      styles.chip,
                      { backgroundColor: on ? tokens.accentSoft : colors.muted },
                    ]}
                  >
                    <ThemedText
                      type="caption"
                      style={{ color: on ? colors.accentText : colors.mutedForeground }}
                    >
                      #{name} · {index.byTag[name]?.length ?? 0}
                    </ThemedText>
                  </PressableScale>
                );
              })}
            </View>
          ) : null}

          <View style={styles.filterRow}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranNotes.filterColor")}
            </ThemedText>
            <AnnotationSwatches
              value={color}
              onChange={(next) => setColor(next === color ? null : next)}
            />
          </View>

          {!tv ? (
            <Button
              label={t("quranNotes.export.open")}
              variant="secondary"
              icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
              onPress={() => setExportOpen(true)}
            />
          ) : null}

          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranNotes.count", { count: visible.length })}
          </ThemedText>

          {groups.map((group, groupIndex) => (
            <Card key={group.notes[0]?.id ?? group.surah} padding="three">
              <ThemedText type="subtitle" style={styles.groupTitle}>
                {group.surah}. {getSurahByNumber(group.surah)?.nameTransliteration ?? ""}
              </ThemedText>
              <View style={styles.list}>
                {group.notes.map((note, i) => (
                  <View key={note.id} style={styles.noteRow}>
                    <PressableScale
                      haptic="light"
                      accessibilityRole="button"
                      accessibilityLabel={t("quranNotes.goToAyah", {
                        ref: `${note.surah}:${note.ayah}`,
                      })}
                      onPress={() => openAyah(note)}
                      {...(tv && groupIndex === 0 && i === 0 ? { hasTVPreferredFocus: true } : {})}
                      style={styles.noteBody}
                    >
                      <MyNoteCard note={note} numberOfLines={tv ? undefined : 6} />
                    </PressableScale>
                    {!tv ? (
                      <IconButton
                        name={{ ios: "pencil", android: "edit", web: "edit" }}
                        size={18}
                        tintColor={colors.mutedForeground}
                        haptic="light"
                        accessibilityLabel={t("quranNotes.edit")}
                        onPress={() =>
                          openQuranNoteEditor({
                            mode: "note",
                            surah: note.surah,
                            ayah: note.ayah,
                            noteId: note.id,
                          })
                        }
                      />
                    ) : null}
                  </View>
                ))}
              </View>
            </Card>
          ))}
          {visible.length === 0 ? (
            <ThemedText type="small" themeColor="mutedForeground" style={styles.noMatch}>
              {t("quranNotes.noMatches")}
            </ThemedText>
          ) : null}
        </View>
      )}
      {!tv ? (
        <ExportSheet visible={exportOpen} notes={all} onClose={() => setExportOpen(false)} />
      ) : null}
      <QuranNotesSheetHost />
    </ScreenLayout>
  );
}

function ExportSheet({
  visible,
  notes,
  onClose,
}: {
  visible: boolean;
  notes: AyahNote[];
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const surahs = useMemo(() => [...new Set(notes.map((n) => n.surah))], [notes]);
  const [scope, setScope] = useState<"all" | "surah">("all");
  const [surah, setSurah] = useState<number | null>(null);
  const [format, setFormat] = useState<"markdown" | "text">("markdown");
  const [includeAyahText, setIncludeAyahText] = useState(false);
  const [busy, setBusy] = useState(false);
  const chosenSurah = scope === "surah" ? (surah ?? surahs[0] ?? null) : null;

  const run = async () => {
    setBusy(true);
    const text = await buildQuranNotesExport(notes, {
      format,
      surah: chosenSurah ?? undefined,
      includeAyahText,
    });
    const outcome = await shareNotesText(text, t("quranNotes.export.titleAll"));
    setBusy(false);
    if (outcome === "copied") toast.success(t("quranNotes.export.copied"));
    else if (outcome === "failed") toast.error(t("quranNotes.export.failed"));
    else onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      <View style={styles.sheetBody}>
        <ThemedText type="subtitle">{t("quranNotes.export.open")}</ThemedText>
        <SegmentedControl
          options={[
            { id: "all", label: t("quranNotes.export.scopeAll") },
            { id: "surah", label: t("quranNotes.export.scopeSurah") },
          ]}
          value={scope}
          onChange={setScope}
        />
        {scope === "surah" ? (
          <View style={styles.chips}>
            {surahs.map((n) => {
              const on = chosenSurah === n;
              return (
                <PressableScale
                  key={n}
                  haptic="selection"
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  accessibilityLabel={getSurahByNumber(n)?.nameTransliteration ?? String(n)}
                  onPress={() => setSurah(n)}
                  style={[styles.chip, { backgroundColor: on ? tokens.accentSoft : colors.muted }]}
                >
                  <ThemedText
                    type="caption"
                    style={{ color: on ? colors.accentText : colors.mutedForeground }}
                  >
                    {n}. {getSurahByNumber(n)?.nameTransliteration ?? ""}
                  </ThemedText>
                </PressableScale>
              );
            })}
          </View>
        ) : null}
        <SegmentedControl
          options={[
            { id: "markdown", label: t("quranNotes.export.markdown") },
            { id: "text", label: t("quranNotes.export.plainText") },
          ]}
          value={format}
          onChange={setFormat}
        />
        <View style={styles.switchRow}>
          <View style={styles.switchText}>
            <ThemedText type="small">{t("quranNotes.export.includeAyah")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("quranNotes.export.includeAyahHint")}
            </ThemedText>
          </View>
          <ThemedSwitch
            value={includeAyahText}
            onValueChange={setIncludeAyahText}
            accessibilityLabel={t("quranNotes.export.includeAyah")}
          />
        </View>
        <Button
          label={t("quranNotes.export.share")}
          onPress={() => void run()}
          disabled={busy || notes.length === 0}
          fullWidth
        />
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one },
  chip: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half + 1,
    borderRadius: Radius.pill,
  },
  filterRow: { gap: Spacing.one },
  groupTitle: { marginBottom: Spacing.two },
  list: { gap: Spacing.two },
  noteRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.one },
  noteBody: { flex: 1, minWidth: 0 },
  noMatch: { textAlign: "center" },
  sheetBody: { gap: Spacing.three },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.three },
  switchText: { flex: 1, gap: 2 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/notes");
