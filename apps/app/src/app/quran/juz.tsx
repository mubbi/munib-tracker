import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { getJuzList, juzForAyah } from "@/lib/quran";
import { useChevronForward } from "@/lib/rtl";
import { useLastRead } from "@/stores/quran-store";

const JUZ_LIST = getJuzList();

/**
 * Juz browser: the 30 canonical Hafs juz, each opening the reader at the ayah it
 * begins with. The reader deep-links to & highlights that ayah via its `ayah`
 * param, so tapping a juz scrolls straight to its start.
 */
export default function JuzBrowserScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const lastRead = useLastRead();

  const continueJuz = useMemo(() => {
    if (!lastRead) return null;
    return juzForAyah(lastRead.surah, lastRead.ayah);
  }, [lastRead]);

  const openJuz = (surah: number, ayah: number) =>
    router.push({
      pathname: "/quran/[surah]",
      params: { surah: String(surah), ayah: String(ayah) },
    });

  return (
    <ScreenLayout
      eyebrow={t("quran.eyebrow")}
      title={t("quran.juz")}
      subtitle={t("quran.juzSubtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/juz" />
      <Stagger>
        <Card padding="two">
          <View style={styles.list}>
            {JUZ_LIST.map((entry) => {
              const isContinue = entry.juz === continueJuz;
              return (
                <PressableScale
                  key={entry.juz}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={
                    isContinue
                      ? `${t("quran.juzN", { n: entry.juz })}, ${t("quran.continueReading")}`
                      : t("quran.juzN", { n: entry.juz })
                  }
                  onPress={() => openJuz(entry.surah, entry.ayah)}
                  style={[
                    styles.row,
                    {
                      backgroundColor: isContinue ? tokens.accentSoft : colors.muted,
                      borderColor: isContinue
                        ? withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28)
                        : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: isContinue ? colors.background : tokens.accentSoft },
                    ]}
                  >
                    <ThemedText type="smallBold" style={{ color: colors.accent }}>
                      {entry.juz}
                    </ThemedText>
                  </View>
                  <View style={styles.rowBody}>
                    <View style={styles.rowTitle}>
                      <ThemedText type="small" numberOfLines={1} style={styles.rowName}>
                        {t("quran.juzN", { n: entry.juz })}
                      </ThemedText>
                      {isContinue ? (
                        <Pill
                          compact
                          label={t("quran.continueReading")}
                          color={colors.accentText}
                          background={withAlpha(colors.accent, tokens.isDark ? 0.28 : 0.16)}
                        />
                      ) : null}
                    </View>
                    <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                      {entry.surahNameTransliteration} · {entry.surah}:{entry.ayah}
                    </ThemedText>
                  </View>
                  <ThemedText type="arabic" style={styles.rowArabic} numberOfLines={1}>
                    {entry.surahNameArabic}
                  </ThemedText>
                  <SymbolView
                    name={chevronForwardIcon}
                    size={14}
                    tintColor={colors.mutedForeground}
                  />
                </PressableScale>
              );
            })}
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  badge: {
    width: 34,
    height: 34,
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
    minWidth: 0,
  },
  rowName: { flexShrink: 1, minWidth: 0 },
  rowArabic: { fontSize: 18, writingDirection: "rtl" },
});
