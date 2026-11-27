import type { MadhhabId } from "@munib-tracker/shared/fiqh";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Pill } from "@/components/ui/pill";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type FoodMeasureRuling, formatKgRange, schoolsToShow } from "@/lib/fasting-fiqh";

type FoodMeasureRulingViewProps = {
  /** School governing the fasting domain; `null` = all views (one row per school). */
  school: MadhhabId | null;
  /** Ruling for one school (fidyah or sadaqat al-fitr measure). */
  rulingFor: (school: MadhhabId) => FoodMeasureRuling;
  /** Optional per-school footnote (e.g. the Maliki elderly note). */
  noteFor?: (school: MadhhabId) => string | null;
};

const CASH_ICON = { ios: "banknote", android: "payments", web: "payments" } as const;
const FOOD_ICON = {
  ios: "basket.fill",
  android: "shopping_basket",
  web: "shopping_basket",
} as const;

/** One school's food measure: alternatives with approximate weights + cash / food-only label. */
function MeasureBlock({
  ruling,
  note,
  showSchool,
}: {
  ruling: FoodMeasureRuling;
  note: string | null;
  showSchool: boolean;
}) {
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  const lines = ruling.options.map((option) =>
    t("fidyah.fiqh.measureLine", {
      unit: t(`fidyah.fiqh.unit.${option.unit}`),
      food: t(`fidyah.fiqh.food.${option.food}`),
      kg: formatKgRange(option.kgRange, i18n.language),
    }),
  );
  const cashLabel = ruling.cashAllowed ? t("fidyah.fiqh.cashAllowed") : t("fidyah.fiqh.foodOnly");
  const tone = ruling.cashAllowed ? tokens.status.success : tokens.status.info;

  return (
    <View style={styles.block}>
      {showSchool ? (
        <ThemedText type="label">{t(`fiqh.school.${ruling.school}`)}</ThemedText>
      ) : null}
      {lines.map((line, index) => (
        <ThemedText key={line} type="small">
          {index > 0 ? `${t("fidyah.fiqh.or")} ` : ""}
          {line}
        </ThemedText>
      ))}
      <View style={styles.pillRow}>
        <Pill
          label={cashLabel}
          icon={ruling.cashAllowed ? CASH_ICON : FOOD_ICON}
          color={tone.color}
          background={tone.soft}
          compact
        />
      </View>
      {note ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {note}
        </ThemedText>
      ) : null}
    </View>
  );
}

/**
 * Per-school food measure (fidyah, kaffarah feeding, sadaqat al-fitr). With a
 * school: that school only. All views: one block per school, never a silent pick.
 */
export function FoodMeasureRulingView({ school, rulingFor, noteFor }: FoodMeasureRulingViewProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const schools = schoolsToShow(school);

  return (
    <View style={styles.root}>
      {schools.map((s) => (
        <View
          key={s}
          style={[
            styles.row,
            school == null && { borderStartWidth: BorderWidth.thick, borderColor: colors.border },
          ]}
        >
          <MeasureBlock ruling={rulingFor(s)} note={noteFor?.(s) ?? null} showSchool={!school} />
        </View>
      ))}
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("fidyah.fiqh.approxNote")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  row: { paddingStart: Spacing.two, borderRadius: Radius.sm },
  block: { gap: Spacing.one },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one, marginTop: Spacing.half },
});
