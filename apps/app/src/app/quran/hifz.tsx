import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { memo, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ChoiceList } from "@/components/settings/choice-list";
import { SettingsRow } from "@/components/settings/settings-rows";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { TvFlatList } from "@/components/ui/tv-flat-list";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useContentBottomInset } from "@/hooks/use-content-bottom-inset";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { triggerHaptic } from "@/lib/haptics";
import { tTv } from "@/lib/i18n/t-tv";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getPageForAyah, getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import { compactArabicTextStyle } from "@/lib/reading-typography";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useStore } from "@/stores/create-store";
import {
  type HifzEntry,
  type HifzStatus,
  hifzStore,
  listHifzEntries,
  useEnsureHifzLoaded,
  useHifzActions,
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
  onStatus,
}: {
  entry: HifzEntry;
  preferredFocus?: boolean;
  onOpen: (surah: number, ayah: number) => void;
  /** Opens the status sheet (memorized / needs review / remove) for this ayah. */
  onStatus: (entry: HifzEntry) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const tv = isTV();
  const meta = getSurahByNumber(entry.surah);
  const arabic = getSurahAyahs(entry.surah)[entry.ayah - 1]?.arabic ?? "";
  const page = getPageForAyah(entry.surah, entry.ayah);
  const name = meta?.nameTransliteration ?? t("quran.surahNumber", { number: entry.surah });
  const statusPill =
    entry.status === "review"
      ? {
          label: t("quran.actionReview"),
          color: tokens.status.warning.onSoft,
          background: tokens.status.warning.soft,
        }
      : {
          label: t("quran.actionMemorized"),
          color: tokens.status.success.onSoft,
          background: tokens.status.success.soft,
        };
  const reference = `${entry.surah}:${entry.ayah}`;

  return (
    <View style={[styles.rowWrap, tv && styles.rowTv]}>
      <PressableScale
        accessibilityRole="button"
        // Name, reference, page and status in words — the pill's colour is never the only cue.
        accessibilityLabel={t("quran.study.hifzRowA11y", {
          surah: name,
          ref: reference,
          page,
          status: statusPill.label,
        })}
        onPress={() => onOpen(entry.surah, entry.ayah)}
        {...(preferredFocus ? { hasTVPreferredFocus: true } : {})}
        style={[styles.row, { backgroundColor: colors.muted }]}
      >
        <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
          <ThemedText type="caption" style={{ color: colors.accentText }}>
            {reference} · {t("quran.pageN", { n: page })}
          </ThemedText>
        </View>
        <View style={styles.rowBody}>
          <View style={styles.rowTitle}>
            <ThemedText type="small" numberOfLines={1} style={styles.rowName}>
              {name}
            </ThemedText>
            <Pill
              label={statusPill.label}
              color={statusPill.color}
              background={statusPill.background}
            />
          </View>
          <ThemedText
            type="arabic"
            accessibilityLanguage="ar"
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
      {/* Sibling, not nested: rows can change status here, not only open (G-23). */}
      <IconButton
        name={{ ios: "ellipsis.circle", android: "more_horiz", web: "more_horiz" }}
        accessibilityLabel={t("quran.study.hifzStatusA11y", { ref: reference })}
        tintColor={colors.mutedForeground}
        haptic={false}
        onPress={() => onStatus(entry)}
      />
    </View>
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
  const ready = useStore(hifzStore, (s) => s.isReady);
  const { setStatus } = useHifzActions();
  const undoToast = useUndoToast();
  useEnsureCompanionPrefsLoaded();
  useEnsureMemorizationLoaded();
  const dueCount = useDueQueue().length;
  const practice = isPracticeAvailable();
  const [statusEntry, setStatusEntry] = useState<HifzEntry | null>(null);

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

  const changeStatus = (entry: HifzEntry, next: HifzStatus) => {
    setStatusEntry(null);
    if (next === entry.status) return;
    triggerHaptic("selection");
    void setStatus(entry.surah, entry.ayah, next);
  };

  // Single-item removal: act now, offer Undo (restores the previous status).
  const removeEntry = (entry: HifzEntry) => {
    setStatusEntry(null);
    void undoToast.run({
      do: () => setStatus(entry.surah, entry.ayah, null),
      undo: () => setStatus(entry.surah, entry.ayah, entry.status),
      messageKey: "hifz.toastClearedTitle",
    });
  };

  const totalsCard = (
    <Card>
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

  const header = (
    <View style={styles.header}>
      {tv && undoToast.undoAvailable ? (
        <Button
          label={t("uiFeedback.undo")}
          variant="secondary"
          onPress={() => undoToast.undo()}
          icon={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
        />
      ) : null}
      {practice && (dueCount > 0 || entries.length > 0) ? (
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
      ) : null}
      {entries.length > 0 ? totalsCard : null}
    </View>
  );

  return (
    <ScreenLayout
      scrollable={false}
      eyebrow={t("quran.eyebrow")}
      title={t("hifz.title")}
      subtitle={t("hifz.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/hifz" />
      {!ready ? (
        <SkeletonPlaceholder preset="rows" count={5} accessibilityLabel={t("hifz.title")} />
      ) : (
        // Virtualised on every platform (G-23): hundreds of saved ayahs never mount at once.
        // TV: two columns use the landscape width; the first entry takes D-pad focus.
        <TvFlatList
          key={tv ? "tv" : "list"}
          data={entries}
          keyExtractor={(entry) => entry.key}
          numColumns={tv ? TV_COLUMNS : 1}
          columnWrapperStyle={tv ? styles.gridRowTv : undefined}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <EmptyState
              icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
              title={t("hifz.emptyTitle")}
              description={tTv(t, "hifz.emptyDesc", "hifz.emptyDescTv")}
              actionLabel={t("quran.surahList")}
              onAction={() => router.push("/quran")}
            />
          }
          renderItem={({ item, index }) => (
            <HifzEntryRow
              entry={item}
              preferredFocus={tv && index === 0}
              onOpen={openAyah}
              onStatus={setStatusEntry}
            />
          )}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: contentBottomInset }]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={12}
          maxToRenderPerBatch={8}
          windowSize={7}
        />
      )}
      <Sheet
        visible={statusEntry != null}
        onClose={() => setStatusEntry(null)}
        variant="bottom"
        title={
          statusEntry
            ? t("hifz.toastRef", {
                surah:
                  getSurahByNumber(statusEntry.surah)?.nameTransliteration ??
                  String(statusEntry.surah),
                ayah: statusEntry.ayah,
              })
            : t("hifz.title")
        }
      >
        {statusEntry ? (
          <View style={styles.sheetBody}>
            {/* Only the choice + one removal: selecting closes the sheet (P6-06). */}
            <ChoiceList<HifzStatus>
              items={[
                { value: "memorized", label: t("hifz.markMemorized") },
                { value: "review", label: t("hifz.markReview") },
              ]}
              value={statusEntry.status}
              onChange={(next) => changeStatus(statusEntry, next)}
            />
            <NavRow
              tone="danger"
              icon={{ ios: "trash", android: "delete", web: "delete" }}
              label={t("hifz.clear")}
              onPress={() => removeEntry(statusEntry)}
            />
          </View>
        ) : null}
      </Sheet>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: { gap: Spacing.two, marginBottom: Spacing.two },
  totals: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  totalPills: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  rowWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  row: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
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
  list: { flex: 1, width: "100%", minHeight: 0 },
  listContent: { gap: Spacing.two },
  gridRowTv: { gap: Spacing.three },
  rowBody: { flex: 1, gap: Spacing.half, minWidth: 0 },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowName: { flex: 1, minWidth: 0 },
  sheetBody: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/hifz");
