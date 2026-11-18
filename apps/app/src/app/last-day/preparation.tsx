import { getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
  useLearnTileStyle,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import { ensureLastDayContent, getLastDayLessonCount, isLastDayContentReady } from "@/lib/last-day";
import type { LastDayPreparationRowId } from "@/lib/last-day-preparation";
import { buildLastDayPreparation } from "@/lib/last-day-preparation";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useEnsureLastDayProgressLoaded,
  useLastDayCharacterChecked,
  useLastDayCompletedCount,
  useLastDayProgressActions,
  useLastDayRepentanceChecked,
} from "@/stores/last-day-progress-store";
import { useDailySummary } from "@/stores/tracker-store";

const ROW_ICONS: Record<LastDayPreparationRowId, AppIcon> = {
  salah: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  quran: { ios: "book.fill", android: "menu_book", web: "menu_book" },
  dhikr: { ios: "heart.fill", android: "favorite", web: "favorite" },
  charity: { ios: "banknote.fill", android: "payments", web: "payments" },
  repentance: { ios: "arrow.uturn.backward.circle.fill", android: "undo", web: "undo" },
  rights: { ios: "person.2.fill", android: "people", web: "people" },
  character: { ios: "person.fill.checkmark", android: "verified_user", web: "verified_user" },
  reflection: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
  learning: { ios: "graduationcap.fill", android: "school", web: "school" },
};

const TOGGLE_ROWS: LastDayPreparationRowId[] = ["repentance", "character"];

function PreparationRow({
  row,
  today,
  onPress,
  tiled,
}: {
  row: ReturnType<typeof buildLastDayPreparation>["rows"][number];
  today: string;
  onPress: () => void;
  /** Wide grid cell: tile chrome instead of the hairline separator. */
  tiled: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const isToggle = TOGGLE_ROWS.includes(row.id);
  const tileStyle = useLearnTileStyle();
  const tile = tiled ? [tileStyle, styles.rowTile] : null;
  const repentance = useLastDayRepentanceChecked(today);
  const character = useLastDayCharacterChecked(today);
  const checked = row.id === "repentance" ? repentance : row.id === "character" ? character : false;

  if (isToggle) {
    return (
      <PressableScale
        accessibilityRole="checkbox"
        accessibilityState={{ checked }}
        accessibilityLabel={t(row.labelKey)}
        onPress={onPress}
        haptic="selection"
        style={[styles.row, isTV() && styles.rowTv, { borderTopColor: tokens.hairline }, tile]}
      >
        <IconWell
          icon={ROW_ICONS[row.id]}
          tint={checked ? tokens.status.success.color : colors.mutedForeground}
          background={checked ? tokens.status.success.soft : colors.muted}
          well={40}
          size={18}
        />
        <View style={styles.copy}>
          <ThemedText type="smallBold">{t(row.labelKey)}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {tTv(t, row.hintKey, `${row.hintKey}Tv`)}
          </ThemedText>
        </View>
        <SymbolView
          name={
            checked
              ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
              : { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" }
          }
          size={22}
          tintColor={checked ? tokens.status.success.color : colors.mutedForeground}
        />
      </PressableScale>
    );
  }

  return (
    <PressableScale
      onPress={onPress}
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={`${t(row.labelKey)}. ${row.value}`}
      style={[styles.row, isTV() && styles.rowTv, { borderTopColor: tokens.hairline }, tile]}
    >
      <IconWell icon={ROW_ICONS[row.id]} tint={colors.accent} well={40} size={18} />
      <View style={styles.copy}>
        <View style={styles.head}>
          <ThemedText type="smallBold">{t(row.labelKey)}</ThemedText>
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {row.value}
          </ThemedText>
        </View>
        <ThemedText type="caption" themeColor="mutedForeground">
          {tTv(t, row.hintKey, `${row.hintKey}Tv`)}
        </ThemedText>
        {row.progress != null && row.progress > 0 ? <ProgressBar value={row.progress} /> : null}
      </View>
      <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
    </PressableScale>
  );
}

export default function LastDayPreparationScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const summary = useDailySummary();
  useEnsureLastDayProgressLoaded();
  const completedCount = useLastDayCompletedCount();
  const { toggleRepentance, toggleCharacter } = useLastDayProgressActions();
  const { version: contentVersion, ready: contentReady } = useEnsureContent(
    ensureLastDayContent,
    isLastDayContentReady,
  );
  const today = getLocalDateString();
  const wide = useLearnHubLayout();
  // Wide web / tablets: habit rows lay out two per row.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 320, max: 2 });

  // biome-ignore lint/correctness/useExhaustiveDependencies: recompute when content finishes loading
  const snapshot = useMemo(
    () =>
      buildLastDayPreparation({
        summary,
        lessonsCompleted: completedCount,
        lessonsTotal: getLastDayLessonCount(),
        repentanceChecked: false,
        characterChecked: false,
        formatCount: (n) => n.toLocaleString(i18n.language),
      }),
    [summary, completedCount, i18n.language, contentVersion],
  );

  const handleRowPress = (id: LastDayPreparationRowId, route: Href) => {
    if (id === "repentance") {
      void toggleRepentance(today);
      return;
    }
    if (id === "character") {
      void toggleCharacter(today);
      return;
    }
    router.push(route);
  };

  return (
    <ScreenLayout
      eyebrow={t("lastDay.eyebrow")}
      title={t("lastDay.preparationTitle")}
      subtitle={t("lastDay.preparationSubtitle")}
      onBack={() => goBackOrReplace(router, "/last-day" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/last-day/preparation" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("lastDay.preparationIntro")}</JannahCallout>

          <Card padding="three">
            <SectionHeader
              title={t("lastDay.preparationHabitsTitle")}
              icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
              {tTv(t, "lastDay.preparationHabitsHint", "lastDay.preparationHabitsHintTv")}
            </ThemedText>
            <LearnColumnsGrid columns={columns} stackGap={0} style={styles.list}>
              {snapshot.rows.map((row) => (
                <PreparationRow
                  key={row.id}
                  row={row}
                  today={today}
                  tiled={columns > 1}
                  onPress={() => handleRowPress(row.id, row.route)}
                />
              ))}
            </LearnColumnsGrid>
          </Card>

          <JannahDisclaimer textKey="lastDay.preparationDisclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  list: { marginTop: Spacing.three },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  rowTile: { borderTopWidth: 0 },
  // TV: 10-foot target + inset so the focus ring clears the icon / value.
  rowTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  copy: { flex: 1, gap: Spacing.one },
  head: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/last-day/preparation");
