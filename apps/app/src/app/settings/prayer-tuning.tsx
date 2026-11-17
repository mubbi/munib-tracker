import { OBLIGATORY_PRAYERS } from "@munib-tracker/shared/constants";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useLargeScreenLayout } from "@/hooks/use-large-screen-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  DEFAULT_HIGH_LATITUDE_RULE,
  HIGH_LATITUDE_RULE_KEYS,
  type HighLatitudeRuleKey,
  type PrayerSlotId,
} from "@/lib/prayer-times";
import { rescheduleAll } from "@/notifications/scheduler";
import { locationStore, useLocation, useLocationActions } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";

const STEP = 1;
const MIN = -20;
const MAX = 20;

function reschedule() {
  return rescheduleAll(preferencesStore.getState().prefs, locationStore.getState().location);
}

export default function PrayerTuningScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const location = useLocation();
  const { setHighLatitudeRule, setPrayerAdjustment } = useLocationActions();

  const tv = isTV();
  const { isListDetail } = useLargeScreenLayout();
  const twoColumn = tv || isListDetail;
  /**
   * TV: never disable a focused stepper at its limit — a disabled Pressable drops
   * D-pad focus. Dim instead; onAdjust already clamps to MIN/MAX.
   */
  const stepperProps = (atLimit: boolean) =>
    tv
      ? {
          accessibilityState: { disabled: atLimit },
          style: atLimit ? styles.dimmedTv : undefined,
        }
      : { disabled: atLimit };

  const currentRule: HighLatitudeRuleKey = location.highLatitudeRule ?? DEFAULT_HIGH_LATITUDE_RULE;

  const onSelectRule = async (rule: HighLatitudeRuleKey) => {
    if (rule === currentRule) return;
    await setHighLatitudeRule(rule);
    await reschedule();
  };

  const onAdjust = async (prayerId: PrayerSlotId, next: number) => {
    const clamped = Math.max(MIN, Math.min(MAX, next));
    await setPrayerAdjustment(prayerId, clamped);
    await reschedule();
  };

  const formatOffset = (value: number) => {
    if (value === 0) return t("prayerTuning.onTime");
    return value < 0
      ? t("prayerTuning.earlierMin", { count: Math.abs(value) })
      : t("prayerTuning.laterMin", { count: value });
  };

  const offsetsCard = (
    <Card padding="three" style={twoColumn ? styles.tvColumn : undefined}>
      <SectionHeader
        title={t("prayerTuning.offsetTitle")}
        icon={{ ios: "building.2", android: "mosque", web: "mosque" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("prayerTuning.offsetHint")}
      </ThemedText>
      <View style={styles.rows}>
        {OBLIGATORY_PRAYERS.map((prayerId) => {
          const value = location.prayerAdjustments?.[prayerId] ?? 0;
          return (
            <View
              key={prayerId}
              style={[styles.row, tv && styles.rowTv, { backgroundColor: colors.muted }]}
            >
              <ThemedText type="small" style={styles.prayer}>
                {t(`prayers.${prayerId}`)}
              </ThemedText>
              <IconButton
                name={{ ios: "minus", android: "remove", web: "remove" }}
                size={18}
                tintColor={colors.foreground}
                accessibilityLabel={t("prayerTuning.earlier")}
                {...stepperProps(value <= MIN)}
                onPress={() => void onAdjust(prayerId, value - STEP)}
              />
              <ThemedText type="smallBold" style={[styles.value, tv && styles.valueTv]}>
                {formatOffset(value)}
              </ThemedText>
              <IconButton
                name={{ ios: "plus", android: "add", web: "add" }}
                size={18}
                tintColor={colors.foreground}
                accessibilityLabel={t("prayerTuning.later")}
                {...stepperProps(value >= MAX)}
                onPress={() => void onAdjust(prayerId, value + STEP)}
              />
            </View>
          );
        })}
      </View>
    </Card>
  );

  const rulesCard = (
    <Card padding="three" style={twoColumn ? styles.tvColumn : undefined}>
      <SectionHeader
        title={t("prayerTuning.highLatTitle")}
        icon={{ ios: "globe.europe.africa", android: "public", web: "public" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("prayerTuning.highLatHint")}
      </ThemedText>
      <View style={styles.rows}>
        {HIGH_LATITUDE_RULE_KEYS.map((rule) => {
          const selected = currentRule === rule;
          return (
            <PressableScale
              key={rule}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={t(`prayerTuning.rule.${rule}`)}
              onPress={() => void onSelectRule(rule)}
              scaleTo={0.98}
              haptic="selection"
              style={[
                styles.ruleRow,
                tv
                  ? {
                      // TV: selected = soft fill + hairline; the accent ring is focus.
                      minHeight: TvLayout.minFocusTarget,
                      backgroundColor: selected ? tokens.accentSoft : colors.muted,
                      borderColor: selected ? tokens.accentBorder : tokens.hairline,
                      borderWidth: StyleSheet.hairlineWidth,
                    }
                  : {
                      backgroundColor: colors.muted,
                      borderColor: selected ? colors.accent : tokens.hairline,
                      borderWidth: selected ? 2 : StyleSheet.hairlineWidth,
                    },
              ]}
            >
              <View style={styles.ruleCopy}>
                <ThemedText type="smallBold">{t(`prayerTuning.rule.${rule}`)}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t(`prayerTuning.ruleDesc.${rule}`)}
                </ThemedText>
              </View>
              {selected ? (
                <SymbolView
                  name={{
                    ios: "checkmark.circle.fill",
                    android: "check_circle",
                    web: "check_circle",
                  }}
                  size={20}
                  tintColor={colors.accent}
                />
              ) : null}
            </PressableScale>
          );
        })}
      </View>
    </Card>
  );

  return (
    <ScreenLayout
      eyebrow={t("settings.title")}
      title={t("prayerTuning.title")}
      subtitle={t("prayerTuning.subtitle")}
      onBack={() => goBackOrReplace(router, "/location")}
    >
      <Seo path="/settings/prayer-tuning" />
      {twoColumn ? (
        // TV: per-Salah offsets beside the high-latitude rules (landscape width).
        // Wide web / tablets reuse the same two columns.
        <View style={styles.tvColumns}>
          {offsetsCard}
          {rulesCard}
        </View>
      ) : (
        <Stagger>
          {offsetsCard}
          {rulesCard}
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, marginBottom: Spacing.three },
  rows: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  prayer: { flex: 1 },
  value: { minWidth: 96, textAlign: "center" },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  ruleCopy: { flex: 1, gap: 2 },
  rowTv: { minHeight: TvLayout.minFocusTarget },
  valueTv: { minWidth: tvDp(140) },
  dimmedTv: { opacity: 0.35 },
  tvColumns: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  tvColumn: { flex: 1, minWidth: 0 },
});
