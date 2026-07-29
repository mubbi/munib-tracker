import { FRIDAY_CHECKLIST } from "@munib-tracker/shared/content/friday-checklist";
import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isFridayDateString } from "@/lib/friday";
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
 * Row = toggle pressable (SymbolView, not IconButton) + optional sibling details
 * chip — avoids nested `<button>` on web and makes related content obvious.
 */
export function FridayTrackerSection({ date }: FridayTrackerSectionProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  useEnsureFridayChecklistLoaded();
  const done = useFridayChecklistForDate(date);
  const { toggle } = useFridayChecklistActions();

  if (!isFridayDateString(date)) return null;

  const completed = FRIDAY_CHECKLIST.filter((item) => done[item.id]).length;
  const total = FRIDAY_CHECKLIST.length;

  return (
    <Card padding="three">
      <SectionHeader
        title={t("tracker.friday.title")}
        icon={{ ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("tracker.friday.subtitle")} · {t("tracker.friday.progress", { completed, total })}
      </ThemedText>
      <View style={styles.rows}>
        {FRIDAY_CHECKLIST.map((item) => {
          const checked = !!done[item.id];
          return (
            <View key={item.id} style={styles.row}>
              <PressableScale
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
                accessibilityLabel={t(`tracker.friday.items.${item.id}.title`)}
                onPress={() => void toggle(item.id, date)}
                scaleTo={0.98}
                haptic="selection"
                style={styles.rowMain}
              >
                <SymbolView
                  name={
                    checked
                      ? {
                          ios: "checkmark.circle.fill",
                          android: "check_circle",
                          web: "check_circle",
                        }
                      : {
                          ios: "circle",
                          android: "radio_button_unchecked",
                          web: "radio_button_unchecked",
                        }
                  }
                  size={24}
                  tintColor={checked ? tokens.status.success.color : colors.mutedForeground}
                />
                <View style={styles.rowText}>
                  <ThemedText type="smallBold">
                    {t(`tracker.friday.items.${item.id}.title`)}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t(`tracker.friday.items.${item.id}.hint`)}
                    {item.reference ? ` · ${item.reference}` : ""}
                  </ThemedText>
                </View>
              </PressableScale>
              {item.route ? (
                <PressableScale
                  accessibilityRole="button"
                  accessibilityLabel={t("tracker.friday.openRelated")}
                  onPress={() => router.push(item.route as Href)}
                  haptic="selection"
                  scaleTo={0.96}
                  style={[
                    styles.detailsChip,
                    {
                      backgroundColor: tokens.accentSoft,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <ThemedText type="caption" style={{ color: colors.accent }}>
                    {t("tracker.friday.details")}
                  </ThemedText>
                  <AppIcon icon={chevronForward} size={14} tintColor={colors.accent} />
                </PressableScale>
              ) : null}
            </View>
          );
        })}
      </View>
      <PressableScale
        accessibilityRole="link"
        onPress={() => router.push("/friday" as Href)}
        scaleTo={0.98}
        style={styles.learnLink}
      >
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          {t("tracker.friday.learnMore")}
        </ThemedText>
        <AppIcon icon={chevronForward} size={14} tintColor={colors.accent} />
      </PressableScale>
    </Card>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, marginBottom: Spacing.two },
  rows: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.one,
    minWidth: 0,
  },
  rowText: { flex: 1, gap: 2, minWidth: 0 },
  detailsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: Spacing.one + 2,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  learnLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    marginTop: Spacing.three,
  },
});
