import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { Pill } from "@/components/ui/pill";
import { Spacing } from "@/constants/theme";

const SCHOOL_ICON = { ios: "book.closed", android: "menu_book", web: "menu_book" } as const;
const ALL_VIEWS_ICON = { ios: "square.grid.2x2", android: "grid_view", web: "grid_view" } as const;
const CUSTOM_ICON = { ios: "slider.horizontal.3", android: "tune", web: "tune" } as const;

type MadhhabBadgeProps = {
  /** The school a ruling/result follows; `null` = all views. */
  school: MadhhabId | null;
  /** A scholar-given custom value is in effect (shown as a second "Custom" chip). */
  custom?: boolean;
};

/** Small "Hanafi" / "All views" chip for calculators, results and fiqh notes (NF-3.0a). */
export function MadhhabBadge({ school, custom = false }: MadhhabBadgeProps) {
  const { t } = useTranslation();
  const label = school ? t(`fiqh.school.${school}`) : t("fiqh.allViews");
  const a11y = school
    ? t("fiqh.badge.schoolA11y", { school: label })
    : t("fiqh.badge.allViewsA11y");

  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={custom ? `${a11y}. ${t("fiqh.badge.customA11y")}` : a11y}
      style={styles.row}
    >
      <Pill label={label} icon={school ? SCHOOL_ICON : ALL_VIEWS_ICON} compact />
      {custom ? <Pill label={t("fiqh.custom")} icon={CUSTOM_ICON} compact /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one },
});
