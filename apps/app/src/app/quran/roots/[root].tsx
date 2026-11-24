import { useLocalSearchParams, useRouter } from "expo-router";
import { memo, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { RootDataGate } from "@/components/quran/roots/root-data-gate";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useSurahWords } from "@/hooks/use-quran";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahAyahs } from "@/lib/quran";
import { splitAyahWords } from "@/lib/quran-companion/align-words";
import { getSurahByNumber } from "@/lib/quran-meta";
import type { WordLocation } from "@/lib/quran-morphology/codec";
import { QAC_SITE } from "@/lib/quran-morphology/source";
import {
  buildAyahSnippet,
  getRootOccurrences,
  type LemmaOccurrences,
  rootToArabic,
  studyWordIndexes,
} from "@/lib/quran-roots";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { usePreferences } from "@/stores/preferences-store";
import { useRootIndex } from "@/stores/quran-roots-store";

const PAGE = 10;
const CHART_PREVIEW = 12;

/** `/quran/roots/[root]` — every occurrence of one Arabic root (NF-3.22). */
export default function QuranRootScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { root = "" } = useLocalSearchParams<{ root: string }>();
  const letters = rootToArabic(root);

  return (
    <ScreenLayout
      eyebrow={t("quranRoots.page.eyebrow")}
      title={letters || t("quranRoots.page.eyebrow")}
      subtitle={t("quranRoots.page.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran/search")}
    >
      <Seo
        path={`/quran/roots/${encodeURIComponent(root)}`}
        title={t("quranRoots.page.seoTitle", { root: letters })}
        description={t("quranRoots.page.subtitle")}
        index={false}
      />
      <View style={styles.stack}>
        <Card padding="three">
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranRoots.guardrail")}
          </ThemedText>
        </Card>
        <RootDataGate>
          <RootBody root={root} />
        </RootDataGate>
      </View>
    </ScreenLayout>
  );
}

function RootBody({ root }: { root: string }) {
  const { t } = useTranslation();
  const index = useRootIndex();
  const data = useMemo(() => (index ? getRootOccurrences(index, root) : null), [index, root]);
  if (!index) return null;
  if (!data) {
    return (
      <EmptyState
        icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
        title={t("quranRoots.page.unknown")}
      />
    );
  }
  return (
    <View style={styles.stack}>
      <Card padding="three">
        <View style={styles.summary}>
          <ThemedText type="arabic" style={styles.bigRoot} accessibilityLabel={data.arabic}>
            {data.arabic}
          </ThemedText>
          <ThemedText type="smallBold">
            {t("quranRoots.occurrences", { count: data.total })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("quranRoots.lemmaCount", { count: data.lemmas.length })} ·{" "}
            {t("quranRoots.surahCount", { count: data.distribution.length })}
          </ThemedText>
        </View>
      </Card>
      <Distribution distribution={data.distribution} />
      <ThemedText type="smallBold">{t("quranRoots.page.lemmas")}</ThemedText>
      {data.lemmas.map((lemma, i) => (
        <LemmaCard key={lemma.lemma || "none"} lemma={lemma} initiallyOpen={i === 0} />
      ))}
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("quranRoots.attribution", { site: QAC_SITE })}
      </ThemedText>
    </View>
  );
}

function Distribution({ distribution }: { distribution: { surah: number; count: number }[] }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [all, setAll] = useState(false);
  const max = Math.max(1, ...distribution.map((d) => d.count));
  const rows = all
    ? distribution
    : [...distribution].sort((a, b) => b.count - a.count).slice(0, CHART_PREVIEW);
  return (
    <Card padding="three">
      <ThemedText type="smallBold">{t("quranRoots.page.distribution")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {all ? t("quranRoots.page.distributionAll") : t("quranRoots.page.distributionTop")}
      </ThemedText>
      <View style={styles.chart}>
        {rows.map((d) => {
          const meta = getSurahByNumber(d.surah);
          return (
            <View
              key={d.surah}
              style={styles.barRow}
              accessible
              accessibilityLabel={t("quranRoots.page.barA11y", {
                surah: meta?.nameTransliteration ?? String(d.surah),
                total: d.count,
              })}
            >
              <ThemedText type="caption" numberOfLines={1} style={styles.barLabel}>
                {`${d.surah}. ${meta?.nameTransliteration ?? ""}`}
              </ThemedText>
              {/* ProgressBar fills from the reading edge (chart-rtl.ts). */}
              <ProgressBar
                value={d.count / max}
                color={colors.accent}
                trackColor={tokens.accentSoft}
                style={styles.bar}
              />
              <ThemedText type="caption" style={styles.barCount}>
                {String(d.count)}
              </ThemedText>
            </View>
          );
        })}
      </View>
      {distribution.length > CHART_PREVIEW ? (
        <Button
          label={all ? t("quranRoots.page.showTop") : t("quranRoots.page.showAllSurahs")}
          variant="ghost"
          size="sm"
          onPress={() => setAll((v) => !v)}
        />
      ) : null}
    </Card>
  );
}

const LemmaCard = memo(function LemmaCard({
  lemma,
  initiallyOpen,
}: {
  lemma: LemmaOccurrences;
  initiallyOpen: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [open, setOpen] = useState(initiallyOpen);
  const [shown, setShown] = useState(PAGE);
  return (
    <Card padding="three">
      <PressableScale
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={t("quranRoots.page.lemmaA11y", {
          lemma: lemma.arabic || t("quranRoots.page.noLemma"),
          total: lemma.count,
        })}
        onPress={() => setOpen((v) => !v)}
        style={styles.lemmaHeader}
      >
        <ThemedText type="arabic" style={styles.lemma}>
          {lemma.arabic || t("quranRoots.page.noLemma")}
        </ThemedText>
        <Pill
          label={t("quranRoots.occurrences", { count: lemma.count })}
          color={colors.accent}
          background={tokens.accentSoft}
        />
      </PressableScale>
      {open ? (
        <View style={styles.occurrences}>
          {lemma.locations[0] ? <LemmaGloss loc={lemma.locations[0]} /> : null}
          {lemma.locations.slice(0, shown).map((loc) => (
            <OccurrenceRow key={`${loc.surah}:${loc.ayah}:${loc.word}`} loc={loc} />
          ))}
          {shown < lemma.locations.length ? (
            <Button
              label={t("quranRoots.page.showMore", {
                n: Math.min(PAGE, lemma.locations.length - shown),
              })}
              variant="ghost"
              size="sm"
              onPress={() => setShown((n) => n + PAGE)}
            />
          ) : null}
        </View>
      ) : null}
    </Card>
  );
});

/**
 * The lemma's gloss, taken from the word-by-word gloss of a real occurrence and
 * labelled with that ayah — never a dictionary meaning we wrote ourselves.
 */
function LemmaGloss({ loc }: { loc: WordLocation }) {
  const { t } = useTranslation();
  const index = useRootIndex();
  const { translationLocale, locale } = usePreferences();
  const words = useSurahWords(loc.surah, translationLocale || locale || "en", true);
  const gloss = useMemo(() => {
    if (!index || !words.data) return null;
    const row = words.data[String(loc.ayah)] ?? [];
    const bundled = splitAyahWords(
      getSurahAyahs(loc.surah).find((a) => a.ayah === loc.ayah)?.arabic ?? "",
    );
    // Only when Quran.com's word split matches the bundled split word-for-word.
    if (row.length !== bundled.length) return null;
    const study = studyWordIndexes(index, loc);
    const text = study
      .map((i) => row[i]?.gloss)
      .filter(Boolean)
      .join(" ");
    return text || null;
  }, [index, words.data, loc]);
  if (!gloss) return null;
  return (
    <ThemedText type="caption" themeColor="mutedForeground">
      {t("quranRoots.page.gloss", { gloss, ref: `${loc.surah}:${loc.ayah}` })}
    </ThemedText>
  );
}

function OccurrenceRow({ loc }: { loc: WordLocation }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const arabicFont = useArabicFontFamily();
  const index = useRootIndex();
  const tv = isTV();
  const { snippet, study } = useMemo(() => {
    const ayah = getSurahAyahs(loc.surah).find((a) => a.ayah === loc.ayah);
    const words = splitAyahWords(ayah?.arabic ?? "");
    const studyIdx = index ? studyWordIndexes(index, loc) : [];
    return { snippet: buildAyahSnippet(words, studyIdx), study: studyIdx };
  }, [index, loc]);
  const meta = getSurahByNumber(loc.surah);
  const ref = t("quran.ayahRef", { surah: loc.surah, ayah: loc.ayah });
  const open = () =>
    router.push({
      pathname: "/quran/[surah]",
      params: {
        surah: String(loc.surah),
        ayah: String(loc.ayah),
        // 1-based bundled word to highlight in word-by-word view (absent = ayah only).
        ...(study.length ? { word: String(study[0] + 1) } : {}),
      },
    });
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={t("quranRoots.page.openAyah", {
        surah: meta?.nameTransliteration ?? String(loc.surah),
        ref,
      })}
      onPress={open}
      style={[styles.occurrence, tv && styles.occurrenceTv, { backgroundColor: colors.muted }]}
    >
      <View style={styles.occurrenceHeader}>
        <ThemedText type="caption" numberOfLines={1} style={styles.occurrenceName}>
          {meta?.nameTransliteration ?? ""}
        </ThemedText>
        <Pill label={ref} color={colors.accent} background={tokens.accentSoft} compact />
      </View>
      <Text
        style={[
          styles.snippet,
          { color: colors.foreground, fontFamily: arabicFont, writingDirection: "rtl" },
        ]}
      >
        {snippet.clippedStart ? "… " : ""}
        {snippet.before ? `${snippet.before} ` : ""}
        {snippet.match ? (
          <Text
            style={{ color: colors.accent, backgroundColor: tokens.accentSoft, fontWeight: "700" }}
          >
            {snippet.match}
          </Text>
        ) : null}
        {snippet.after ? ` ${snippet.after}` : ""}
        {snippet.clippedEnd ? " …" : ""}
      </Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  summary: { alignItems: "center", gap: Spacing.one },
  bigRoot: { fontSize: 44, lineHeight: 64, textAlign: "center" },
  chart: { gap: Spacing.two, marginTop: Spacing.two },
  barRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  barLabel: { width: 120 },
  bar: { flex: 1 },
  barCount: { minWidth: 32, textAlign: "center" },
  lemmaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
    minHeight: 44,
  },
  lemma: { fontSize: 26, lineHeight: 40, flexShrink: 1 },
  occurrences: { gap: Spacing.two, marginTop: Spacing.two },
  occurrence: { gap: Spacing.one, padding: Spacing.three, borderRadius: Radius.md },
  occurrenceTv: { minHeight: TvLayout.minFocusTarget },
  occurrenceHeader: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  occurrenceName: { flex: 1 },
  snippet: { fontSize: 22, lineHeight: 38, textAlign: "right" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/roots/[root]");
