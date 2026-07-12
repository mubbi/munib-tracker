import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { getPageForAyah, getSurahAyahs, getSurahByNumber } from "@/lib/quran";
import { compactArabicTextStyle } from "@/lib/reading-typography";
import { useChevronForward } from "@/lib/rtl";
import { listHifzEntries, useEnsureHifzLoaded, useHifzMap } from "@/stores/hifz-store";

export default function HifzScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  useEnsureHifzLoaded();
  const statuses = useHifzMap();

  const entries = useMemo(() => listHifzEntries(statuses), [statuses]);
  const totalMemorized = entries.filter((entry) => entry.status === "memorized").length;
  const totalReview = entries.filter((entry) => entry.status === "review").length;

  const openAyah = (surah: number, ayah: number) =>
    router.push({
      pathname: "/quran/[surah]",
      params: { surah: String(surah), ayah: String(ayah) },
    });

  return (
    <ScreenLayout
      eyebrow={t("quran.eyebrow")}
      title={t("hifz.title")}
      subtitle={t("hifz.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/hifz" />
      {entries.length === 0 ? (
        <EmptyState
          icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
          title={t("hifz.emptyTitle")}
          description={t("hifz.emptyDesc")}
        />
      ) : (
        <View style={styles.list}>
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

          <Card padding="three">
            <Stagger>
              <View style={styles.entryList}>
                {entries.map((entry) => {
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
                      key={entry.key}
                      haptic="light"
                      accessibilityRole="button"
                      accessibilityLabel={`${meta?.nameTransliteration ?? `Surah ${entry.surah}`} ${entry.ayah}`}
                      onPress={() => openAyah(entry.surah, entry.ayah)}
                      style={[styles.row, { backgroundColor: colors.muted }]}
                    >
                      <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                        <ThemedText type="caption" style={{ color: colors.accent }}>
                          {entry.surah}:{entry.ayah} · {t("quran.pageN", { n: page })}
                        </ThemedText>
                      </View>
                      <View style={styles.rowBody}>
                        <View style={styles.rowTitle}>
                          <ThemedText type="small" numberOfLines={1} style={styles.rowName}>
                            {meta?.nameTransliteration ?? `Surah ${entry.surah}`}
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
                          style={compactArabicTextStyle}
                        >
                          {arabic}
                        </ThemedText>
                      </View>
                      <SymbolView
                        name={chevronForwardIcon}
                        size={14}
                        tintColor={colors.mutedForeground}
                      />
                    </PressableScale>
                  );
                })}
              </View>
            </Stagger>
          </Card>
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  totals: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  totalPills: { flexDirection: "row", gap: Spacing.two },
  entryList: { gap: Spacing.two },
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
  rowBody: { flex: 1, gap: 2, minWidth: 0 },
  rowTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowName: { flex: 1, minWidth: 0 },
});
