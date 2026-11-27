import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ChecklistDetailsChip, ChecklistRow } from "@/components/tracker/checklist-row";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Control, IconSize, Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isFridayDateString } from "@/lib/friday";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import {
  useEnsureFridayChecklistLoaded,
  useFridayChecklistActions,
  useFridayChecklistForDate,
} from "@/stores/friday-checklist-store";

type FridayTrackerSectionProps = {
  date: string;
};

/**
 * Friday-only Jumu'ah checklist on the Tracker day view. Renders nothing when
 * `date` is not a Friday.
 *
 * Rows are the shared `ChecklistRow` (whole row toggles) + an optional sibling
 * details chip — never a nested `<button>` on web.
 */
export function FridayTrackerSection({ date }: FridayTrackerSectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const chevronForward = useChevronForward();
  useEnsureFridayChecklistLoaded();
  const done = useFridayChecklistForDate(date);
  const { toggle } = useFridayChecklistActions();

  if (!isFridayDateString(date)) return null;

  const completed = FRIDAY_CHECKLIST.filter((item) => done[item.id]).length;
  const total = FRIDAY_CHECKLIST.length;

  return (
    <Card>
      <SectionHeader
        title={t("tracker.friday.title")}
        icon={{ ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("tracker.friday.subtitle")} · {t("tracker.friday.progress", { completed, total })}
      </ThemedText>
      <View style={styles.rows}>
        {FRIDAY_CHECKLIST.map((item) => {
          const title = t(`tracker.friday.items.${item.id}.title`);
          const hint = t(`tracker.friday.items.${item.id}.hint`);
          return (
            <ChecklistRow
              key={item.id}
              checked={!!done[item.id]}
              onToggle={() => void toggle(item.id, date)}
              title={title}
              subtitle={item.reference ? `${hint} · ${item.reference}` : hint}
              trailing={
                item.route ? (
                  <ChecklistDetailsChip
                    label={t("tracker.friday.details")}
                    accessibilityLabel={t("tracker.friday.detailsFor", { title })}
                    onPress={() => router.push(item.route as Href)}
                  />
                ) : null
              }
            />
          );
        })}
      </View>
      <PressableScale
        accessibilityRole="link"
        onPress={() => router.push("/friday" as Href)}
        href="/friday"
        scaleTo={0.98}
        style={[styles.learnLink, isTV() ? styles.learnLinkTv : null]}
      >
        <ThemedText type="smallBold" style={{ color: colors.accentText }}>
          {t("tracker.friday.learnMore")}
        </ThemedText>
        <AppIcon icon={chevronForward} size={IconSize.sm} tintColor={colors.accentText} />
      </PressableScale>
    </Card>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, marginBottom: Spacing.two },
  rows: { gap: Spacing.two },
  learnLink: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Spacing.one,
    minHeight: Control.md,
    marginTop: Spacing.two,
  },
  learnLinkTv: {
    alignSelf: "flex-start",
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
});
