import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Stagger } from "@/components/ui/stagger";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getPageForAyah, getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { compactArabicTextStyle } from "@/lib/reading-typography";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  type HifzEntry,
  listHifzEntries,
  useEnsureHifzLoaded,
  useHifzMap,
} from "@/stores/hifz-store";
import { useEnsureCompanionPrefsLoaded } from "@/stores/quran-companion-prefs-store";
import { useDueQueue, useEnsureMemorizationLoaded } from "@/stores/quran-memorization-store";

/** TV grid columns — a long single column of saved ayahs wastes the landscape width. */
const TV_COLUMNS = 2;

const HifzEntryRow = memo(function HifzEntryRow({
  entry,
  preferredFocus,
  onOpen,
}: {
  entry: HifzEntry;
  preferredFocus?: boolean;
  onOpen: (surah: number, ayah: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const tv = isTV();
  const meta = getSurahByNumber(entry.surah);
  const arabic = getSurahAyahs(entry.surah)[entry.ayah - 1]?.arabic ?? "";
  const page = getPageForAyah(entry.surah, entry.ayah);
  const statusPill =
    entry.status === "review"
      ? {
          label: t("quran.actionReview"),
          color: tokens.status.warning.color,
          background: tokens.status.warning.soft,
        }
      : {
          label: t("quran.actionMemorized"),
          color: tokens.status.success.color,
          background: tokens.status.success.soft,
        };

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${meta?.nameTransliteration ?? t("quran.surahNumber", { number: entry.surah })} ${entry.ayah}`}
      onPress={() => onOpen(entry.surah, entry.ayah)}
      {...(preferredFocus ? { hasTVPreferredFocus: true } : {})}
      style={[styles.row, tv && styles.rowTv, { backgroundColor: colors.muted }]}
    >
      <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
        <ThemedText type="caption" style={{ color: colors.accentText }}>
          {entry.surah}:{entry.ayah} · {t("quran.pageN", { n: page })}
        </ThemedText>
      </View>
      <View style={styles.rowBody}>
        <View style={styles.rowTitle}>
          <ThemedText type="small" numberOfLines={1} style={styles.rowName}>
            {meta?.nameTransliteration ?? t("quran.surahNumber", { number: entry.surah })}
          </ThemedText>
          <Pill
            label={statusPill.label}
            color={statusPill.color}
            background={statusPill.background}
          />
        </View>
        <ThemedText
          type="arabic"
          themeColor="mutedForeground"
          numberOfLines={1}
          style={compactArabicTextStyle()}
        >
          {arabic}
        </ThemedText>
      </View>
      {!tv ? (
        <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
      ) : null}
    </PressableScale>
  );
});

export default function HifzScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const tv = isTV();
  const contentBottomInset = useContentBottomInset();
  useEnsureHifzLoaded();
  const statuses = useHifzMap();
  useEnsureCompanionPrefsLoaded();
  useEnsureMemorizationLoaded();
  const dueCount = useDueQueue().length;
  const practice = isPracticeAvailable();

  const entries = useMemo(() => listHifzEntries(statuses), [statuses]);
  const totalMemorized = entries.filter((entry) => entry.status === "memorized").length;
  const totalReview = entries.filter((entry) => entry.status === "review").length;

  const openAyah = useCallback(
    (surah: number, ayah: number) =>
      router.push({
        pathname: "/quran/[surah]",
        params: { surah: String(surah), ayah: String(ayah) },
      }),
    [router],
  );

  const totalsCard = (
    <Card padding="three">
      <View style={styles.totals}>
        <ThemedText type="small">{t("hifz.totals")}</ThemedText>
        <View style={styles.totalPills}>
          <Pill
            label={t("hifz.memorizedCount", { count: totalMemorized })}
            color={tokens.status.success.color}
            background={tokens.status.success.soft}
          />
          {totalReview > 0 ? (
            <Pill
              label={t("hifz.reviewCount", { count: totalReview })}
              color={tokens.status.warning.color}
              background={tokens.status.warning.soft}
            />
          ) : null}
        </View>
      </View>
    </Card>
  );

  // TV: virtualized two-column grid (hundreds of saved ayahs must not mount at
  // once on a Fire TV stick); first entry takes initial D-pad focus.
  if (tv && entries.length > 0) {
    return (
      <ScreenLayout
        scrollable={false}
        eyebrow={t("quran.eyebrow")}
        title={t("hifz.title")}
        subtitle={t("hifz.subtitle")}
        onBack={() => goBackOrReplace(router, "/quran")}
      >
        <Seo path="/quran/hifz" />
        <TvFlatList
          data={entries}
          keyExtractor={(entry) => entry.key}
          numColumns={TV_COLUMNS}
          columnWrapperStyle={styles.gridRowTv}
          ListHeaderComponent={<View style={styles.tvHeader}>{totalsCard}</View>}
          renderItem={({ item, index }) => (
            <HifzEntryRow entry={item} preferredFocus={index === 0} onOpen={openAyah} />
          )}
          style={styles.tvList}
          contentContainerStyle={[styles.tvListContent, { paddingBottom: contentBottomInset }]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={8}
          windowSize={5}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("quran.eyebrow")}
      title={t("hifz.title")}
      subtitle={t("hifz.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/hifz" />
      {practice && (dueCount > 0 || entries.length > 0) ? (
        <View style={styles.revisionRow}>
          <SettingsRow
            icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
            title={t("quranCompanion.revision.title")}
            subtitle={
              dueCount > 0
                ? t("quranCompanion.entry.toRevise", { count: dueCount })
                : t("quranCompanion.revision.hifzRowSub")
            }
            onPress={() => router.push("/quran/revision" as Href)}
          />
        </View>
      ) : null}
      {entries.length === 0 ? (
        <EmptyState
          icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
          title={t("hifz.emptyTitle")}
          description={tTv(t, "hifz.emptyDesc", "hifz.emptyDescTv")}
        />
      ) : (
        <View style={styles.list}>
          {totalsCard}

          <Card padding="three">
            <Stagger>
              {/* Phone: one column. Tablet / desktop: 2–3 saved-ayah tiles per row. */}
              <ResponsiveGrid gap={Spacing.two} maxColumns={3}>
                {entries.map((entry) => (
                  <HifzEntryRow key={entry.key} entry={entry} onOpen={openAyah} />
                ))}
              </ResponsiveGrid>
            </Stagger>
          </Card>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  revisionRow: { marginBottom: Spacing.two },
  list: { gap: Spacing.two },
  totals: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  totalPills: { flexDirection: "row", gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  badge: {
    paddingHorizontal: Spacing.two,
    height: 30,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowTv: {
    flex: 1,
    minWidth: 0,
    minHeight: TvLayout.minFocusTarget + 8,
  },
  tvList: { flex: 1, width: "100%", minHeight: 0 },
  tvListContent: { gap: Spacing.three },
  tvHeader: { marginBottom: Spacing.one },
  gridRowTv: { gap: Spacing.three },
  rowBody: { flex: 1, gap: 2, minWidth: 0 },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowName: { flex: 1, minWidth: 0 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/hifz");
