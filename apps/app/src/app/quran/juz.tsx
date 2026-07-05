import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getJuzList } from "@/lib/quran";
import { chevronForward } from "@/lib/rtl";

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
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/quran"))}
    >
      <Seo path="/quran/juz" />
      <Stagger>
        <Card padding="two">
          <View style={styles.list}>
            {JUZ_LIST.map((entry) => (
              <PressableScale
                key={entry.juz}
                haptic="light"
                accessibilityRole="button"
                accessibilityLabel={t("quran.juzN", { n: entry.juz })}
                onPress={() => openJuz(entry.surah, entry.ayah)}
                style={[styles.row, { backgroundColor: colors.muted }]}
              >
                <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="smallBold" style={{ color: colors.accent }}>
                    {entry.juz}
                  </ThemedText>
                </View>
                <View style={styles.rowBody}>
                  <ThemedText type="small" numberOfLines={1}>
                    {t("quran.juzN", { n: entry.juz })}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                    {entry.surahNameTransliteration} · {entry.surah}:{entry.ayah}
                  </ThemedText>
                </View>
                <ThemedText type="arabic" style={styles.rowArabic} numberOfLines={1}>
                  {entry.surahNameArabic}
                </ThemedText>
                <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
              </PressableScale>
            ))}
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
  },
  badge: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: { flex: 1, gap: 2 },
  rowArabic: { fontSize: 18, writingDirection: "rtl" },
});
