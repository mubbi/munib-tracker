import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useReciteAlongAvailable } from "@/hooks/use-recite-along-available";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { getJuzList, juzForAyah } from "@/lib/quran-meta";
import { juzPassage } from "@/lib/quran-ref-parse";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
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
  const tv = isTV();
  const reciteAvailable = useReciteAlongAvailable();

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
          {/* TV: two-column grid so the 30 juz fit the landscape screen.
              Tablet / desktop: width-based 2–3 column grid. */}
          <JuzGridHost tv={tv}>
            {JUZ_LIST.map((entry) => {
              const isContinue = entry.juz === continueJuz;
              const landFocus = tv && entry.juz === (continueJuz ?? 1);
              const rowColors = {
                backgroundColor: isContinue ? tokens.accentSoft : colors.muted,
                borderColor: isContinue
                  ? withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28)
                  : "transparent",
              };
              const rowA11y = isContinue
                ? `${t("quran.juzN", { n: entry.juz })}, ${t("quran.continueReading")}`
                : t("quran.juzN", { n: entry.juz });
              const body = (
                <>
                  <View
                    style={[
                      styles.badge,
                      { backgroundColor: isContinue ? colors.background : tokens.accentSoft },
                    ]}
                  >
                    <ThemedText type="smallBold" style={{ color: colors.accentText }}>
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
                  {!tv ? (
                    <SymbolView
                      name={chevronForwardIcon}
                      size={14}
                      tintColor={colors.mutedForeground}
                    />
                  ) : null}
                </>
              );
              const recitePassage = reciteAvailable ? juzPassage(entry.juz) : null;
              // Recite along (D68) sits beside the row button, never inside it (web <button>).
              if (recitePassage) {
                return (
                  <View key={entry.juz} style={[styles.rowShell, rowColors]}>
                    <PressableScale
                      haptic="light"
                      accessibilityRole="button"
                      accessibilityLabel={rowA11y}
                      onPress={() => openJuz(entry.surah, entry.ayah)}
                      style={[styles.rowContent, styles.rowPress]}
                    >
                      {body}
                    </PressableScale>
                    <ReciteAlongButton passage={recitePassage} appearance="icon" />
                  </View>
                );
              }
              return (
                <PressableScale
                  key={entry.juz}
                  haptic="light"
                  accessibilityRole="button"
                  accessibilityLabel={rowA11y}
                  onPress={() => openJuz(entry.surah, entry.ayah)}
                  {...(landFocus ? { hasTVPreferredFocus: true } : {})}
                  style={[styles.row, tv && styles.rowTv, rowColors]}
                >
                  {body}
                </PressableScale>
              );
            })}
          </JuzGridHost>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

/** TV keeps its fixed two-up wrap; everywhere else uses the shared responsive grid. */
function JuzGridHost({ tv, children }: { tv: boolean; children: ReactNode }) {
  if (tv) return <View style={[styles.list, styles.listTv]}>{children}</View>;
  return (
    <ResponsiveGrid gap={Spacing.two} maxColumns={3}>
      {children}
    </ResponsiveGrid>
  );
}

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
  listTv: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.three },
  rowTv: {
    width: "48.5%",
    minHeight: TvLayout.minFocusTarget + 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  rowShell: {
    flexDirection: "row",
    alignItems: "center",
    paddingEnd: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
  },
  rowPress: { flex: 1, minWidth: 0 },
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/juz");
