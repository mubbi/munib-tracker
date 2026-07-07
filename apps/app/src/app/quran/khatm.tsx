import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ayahsRemaining,
  dailyAyahTarget,
  dailyPageTarget,
  dailyTargetForPlan,
  daysElapsed,
  expectedAyahsByToday,
  KHATM_MAX_PLAN_DAYS,
  KHATM_MIN_PLAN_DAYS,
  type KhatmPace,
  type KhatmPlan,
  khatmPace,
  khatmPercentComplete,
  khatmTotalForUnit,
  pagesRemaining,
  parseKhatmLogAmount,
  parseKhatmLogPages,
  parseKhatmPlanDays,
  parseKhatmTotalAyahs,
  parseKhatmTotalPages,
  QURAN_TOTAL_PAGES,
  scheduleGap,
} from "@/lib/khatm";
import { dayMotivationSeed, pickKhatmMotivation } from "@/lib/khatm-motivation";
import { goBackOrReplace } from "@/lib/navigation";
import { pageToStartAyah } from "@/lib/quran";
import { chevronForward } from "@/lib/rtl";
import { useEnsureKhatmLoaded, useKhatm, useKhatmActions } from "@/stores/khatm-store";

const PLAN_PRESETS = [
  { days: 30, tone: "intensive" as const },
  { days: 60, tone: "balanced" as const },
  { days: 90, tone: "steady" as const },
];

const PACE_ICON: Record<KhatmPace, SymbolViewProps["name"]> = {
  done: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  ahead: { ios: "arrow.up.circle.fill", android: "trending_up", web: "trending_up" },
  onTrack: { ios: "circle.fill", android: "circle", web: "circle" },
  behind: { ios: "exclamationmark.circle.fill", android: "error", web: "error" },
};

function paceTone(pace: KhatmPace, tokens: ReturnType<typeof useThemeTokens>["tokens"]) {
  if (pace === "behind") return tokens.status.warning;
  if (pace === "onTrack") return tokens.status.info;
  if (pace === "ahead") return tokens.status.success;
  return tokens.status.success;
}

function KhatmMotivationCard({ seed, onShuffle }: { seed: number; onShuffle: () => void }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const motivation = useMemo(() => pickKhatmMotivation(seed, t), [seed, t]);

  const kindLabel =
    motivation.kind === "hadith"
      ? t("khatm.motivationKind.hadith")
      : motivation.kind === "quran"
        ? t("khatm.motivationKind.quran")
        : t("khatm.motivationKind.reminder");

  return (
    <Card
      padding="three"
      style={{
        backgroundColor: tokens.status.info.soft,
        borderColor: withAlpha(tokens.status.info.color, tokens.isDark ? 0.45 : 0.28),
        borderWidth: StyleSheet.hairlineWidth,
      }}
    >
      <View style={styles.motivationHeader}>
        <IconWell
          icon={{ ios: "quote.opening", android: "format_quote", web: "format_quote" }}
          tint={tokens.status.info.color}
          background={colors.background}
          well={36}
          size={16}
        />
        <View style={styles.motivationHeaderCopy}>
          <ThemedText type="smallBold" style={{ color: tokens.status.info.text }}>
            {t("khatm.motivationTitle")}
          </ThemedText>
          <Pill
            label={kindLabel}
            color={tokens.status.info.text}
            background={withAlpha(tokens.status.info.color, tokens.isDark ? 0.22 : 0.12)}
          />
        </View>
        <IconButton
          name={{ ios: "arrow.triangle.2.circlepath", android: "autorenew", web: "autorenew" }}
          accessibilityLabel={t("khatm.motivationShuffle")}
          onPress={onShuffle}
          size={18}
          tintColor={tokens.status.info.color}
          hitTarget={40}
          haptic="light"
        />
      </View>

      {motivation.arabic ? (
        <ThemedText
          type="arabic"
          style={[styles.motivationArabic, { color: tokens.status.info.text }]}
        >
          {motivation.arabic}
        </ThemedText>
      ) : null}
      <ThemedText type="small" themeColor="foreground" style={styles.motivationBody}>
        {motivation.body}
      </ThemedText>
      {motivation.reference ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {motivation.reference}
        </ThemedText>
      ) : null}
    </Card>
  );
}

function PlanPresetCard({
  days,
  tone,
  unit,
  onPress,
}: {
  days: number;
  tone: "intensive" | "balanced" | "steady";
  unit: "ayah" | "page";
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const target = unit === "page" ? dailyPageTarget(days) : dailyAyahTarget(days);
  const targetLabel =
    unit === "page"
      ? t("khatm.dailyTargetPages", { count: target })
      : t("khatm.dailyTarget", { count: target });

  return (
    <PressableCard onPress={onPress} accessibilityLabel={t("khatm.dayPlan", { count: days })}>
      <View style={styles.presetRow}>
        <IconWell
          icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          tint={colors.accent}
          background={tokens.accentSoft}
          well={44}
          size={20}
        />
        <View style={styles.presetCopy}>
          <ThemedText type="smallBold">{t("khatm.dayPlan", { count: days })}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {targetLabel}
          </ThemedText>
        </View>
        <Pill
          label={t(`khatm.preset.${tone}`)}
          color={colors.accentText}
          background={tokens.accentSoft}
        />
        <SymbolView name={chevronForward()} size={14} tintColor={colors.mutedForeground} />
      </View>
    </PressableCard>
  );
}

function CustomPlanCard({
  unit,
  onStart,
}: {
  unit: "ayah" | "page";
  onStart: (days: number) => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [daysInput, setDaysInput] = useState("");
  const customDays = parseKhatmPlanDays(daysInput);
  const showInvalid = daysInput.trim().length > 0 && customDays == null;
  const dailyTarget = customDays
    ? unit === "page"
      ? dailyPageTarget(customDays)
      : dailyAyahTarget(customDays)
    : null;
  const dailyTargetLabel =
    dailyTarget != null
      ? unit === "page"
        ? t("khatm.dailyTargetPages", { count: dailyTarget })
        : t("khatm.dailyTarget", { count: dailyTarget })
      : null;

  return (
    <Card
      padding="three"
      style={{
        backgroundColor: colors.card,
        borderColor: tokens.hairline,
        borderWidth: StyleSheet.hairlineWidth,
        gap: Spacing.three,
      }}
    >
      <View style={styles.presetRow}>
        <IconWell
          icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
          tint={colors.accent}
          background={tokens.accentSoft}
          well={44}
          size={20}
        />
        <View style={styles.presetCopy}>
          <ThemedText type="smallBold">{t("khatm.customPlan")}</ThemedText>
          <TextInput
            value={daysInput}
            onChangeText={(text) =>
              setDaysInput(text.replace(/[^0-9]/g, "").slice(0, String(KHATM_MAX_PLAN_DAYS).length))
            }
            keyboardType="number-pad"
            placeholder={t("khatm.customDaysPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("khatm.customDaysA11y")}
            style={[
              styles.customInput,
              {
                color: colors.foreground,
                backgroundColor: colors.muted,
                borderColor: showInvalid ? tokens.status.warning.color : colors.border,
              },
            ]}
          />
          {customDays && dailyTargetLabel ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {dailyTargetLabel}
            </ThemedText>
          ) : showInvalid ? (
            <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
              {t("khatm.customInvalid", {
                min: KHATM_MIN_PLAN_DAYS,
                max: KHATM_MAX_PLAN_DAYS,
              })}
            </ThemedText>
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("khatm.customHint", { min: KHATM_MIN_PLAN_DAYS, max: KHATM_MAX_PLAN_DAYS })}
            </ThemedText>
          )}
        </View>
        <Pill
          label={t("khatm.preset.custom")}
          color={colors.accentText}
          background={tokens.accentSoft}
        />
      </View>
      <Button
        label={t("khatm.customStart")}
        disabled={customDays == null}
        onPress={() => {
          if (customDays != null) onStart(customDays);
        }}
        icon={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
        fullWidth
      />
    </Card>
  );
}

const LOG_QUICK_AMOUNTS = [10, 25, 50] as const;

function LogAmountChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ selected: !!active }}
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.95}
      style={[
        styles.logChip,
        {
          backgroundColor: active ? colors.accent : colors.background,
          borderColor: active ? colors.accent : colors.border,
        },
      ]}
    >
      <ThemedText
        type="smallBold"
        style={{ color: active ? colors.accentForeground : colors.mutedForeground }}
      >
        {label}
      </ThemedText>
    </PressableScale>
  );
}

function UnitToggle({
  unit,
  onChange,
}: {
  unit: "ayah" | "page";
  onChange: (unit: "ayah" | "page") => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();

  return (
    <View style={styles.unitToggle}>
      {(["ayah", "page"] as const).map((value) => {
        const active = unit === value;
        return (
          <PressableScale
            key={value}
            haptic="light"
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={value === "page" ? t("khatm.unitPage") : t("khatm.unitAyah")}
            onPress={() => onChange(value)}
            style={[
              styles.unitChip,
              {
                backgroundColor: active ? colors.accent : colors.background,
                borderColor: active ? colors.accent : colors.border,
              },
            ]}
          >
            <ThemedText
              type="smallBold"
              style={{ color: active ? colors.accentForeground : colors.mutedForeground }}
            >
              {value === "page" ? t("khatm.unitPage") : t("khatm.unitAyah")}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

function KhatmActivePlanCard({
  plan,
  unit,
  ayahsRead,
  target,
  pace,
  tone,
  percent,
  progress,
  remaining,
  expected,
  gap,
  dayNumber,
  format,
  onLog,
  onSetTotal,
  onReset,
  onContinue,
}: {
  plan: KhatmPlan;
  unit: "ayah" | "page";
  ayahsRead: number;
  target: number;
  pace: KhatmPace;
  tone: ReturnType<typeof paceTone>;
  percent: number;
  progress: number;
  remaining: number;
  expected: number;
  gap: number;
  dayNumber: number;
  format: (n: number) => string;
  onLog: (amount: number) => void;
  onSetTotal: (total: number) => void;
  onReset: () => void;
  onContinue?: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [logAmountInput, setLogAmountInput] = useState(String(target));
  const [totalInput, setTotalInput] = useState(String(ayahsRead));
  const [showCorrectTotal, setShowCorrectTotal] = useState(false);
  const totalUnits = khatmTotalForUnit(unit);
  const isPageUnit = unit === "page";

  useEffect(() => {
    setLogAmountInput(String(target));
  }, [target]);

  useEffect(() => {
    setTotalInput(String(ayahsRead));
  }, [ayahsRead]);

  const logAmount = isPageUnit
    ? parseKhatmLogPages(logAmountInput, ayahsRead)
    : parseKhatmLogAmount(logAmountInput, ayahsRead);
  const totalAmount = isPageUnit
    ? parseKhatmTotalPages(totalInput)
    : parseKhatmTotalAyahs(totalInput);
  const logInvalid = logAmountInput.trim().length > 0 && logAmount == null;
  const totalInvalid = totalInput.trim().length > 0 && totalAmount == null;
  const maxLog = isPageUnit ? pagesRemaining(ayahsRead) : ayahsRemaining(ayahsRead);
  const dailyTargetLabel = isPageUnit
    ? t("khatm.dailyTargetPages", { count: target })
    : t("khatm.dailyTarget", { count: target });
  const progressLabel = isPageUnit
    ? t("khatm.progressPages", { read: format(ayahsRead), total: format(totalUnits) })
    : t("khatm.progress", { read: format(ayahsRead), total: format(totalUnits) });
  const remainingLabel = isPageUnit ? t("khatm.remainingPages") : t("khatm.remainingAyahs");
  const logPlaceholder = isPageUnit
    ? t("khatm.logAmountPlaceholderPages")
    : t("khatm.logAmountPlaceholder");
  const logA11y = isPageUnit ? t("khatm.logAmountA11yPages") : t("khatm.logAmountA11y");
  const logInvalidMsg = isPageUnit
    ? t("khatm.logInvalidPages", { max: format(maxLog) })
    : t("khatm.logInvalid", { max: format(maxLog) });
  const logAddLabel =
    logAmount != null
      ? isPageUnit
        ? t("khatm.logAddPages", { count: logAmount })
        : t("khatm.logAdd", { count: logAmount })
      : t("khatm.logToday");
  const catchUpLabel = isPageUnit
    ? t("khatm.catchUpPages", { count: Math.abs(gap) })
    : t("khatm.catchUp", { count: Math.abs(gap) });
  const aheadLabel = isPageUnit
    ? t("khatm.aheadByPages", { count: gap })
    : t("khatm.aheadBy", { count: gap });
  const logSectionHint = isPageUnit ? t("khatm.logSectionHintPages") : t("khatm.logSectionHint");
  const correctTotalHint = isPageUnit
    ? t("khatm.correctTotalHintPages")
    : t("khatm.correctTotalHint");
  const correctTotalA11y = isPageUnit
    ? t("khatm.correctTotalA11yPages")
    : t("khatm.correctTotalA11y");
  const correctTotalInvalidMsg = isPageUnit
    ? t("khatm.correctTotalInvalidPages", { max: format(totalUnits) })
    : t("khatm.correctTotalInvalid", { max: format(totalUnits) });
  const lessA11y = isPageUnit ? t("khatm.lessPages") : t("khatm.less");
  const moreA11y = isPageUnit ? t("khatm.morePages") : t("khatm.more");

  const bumpLogAmount = (delta: number) => {
    const current =
      (isPageUnit
        ? parseKhatmLogPages(logAmountInput, ayahsRead)
        : parseKhatmLogAmount(logAmountInput, ayahsRead)) ?? 0;
    const next = Math.max(1, Math.min(maxLog, current + delta));
    setLogAmountInput(String(next));
  };

  return (
    <Card
      padding="three"
      style={[
        styles.activeCard,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28),
          borderWidth: 1,
          overflow: "hidden",
        },
      ]}
    >
      <View style={styles.headerRow}>
        <IconWell
          icon={{ ios: "book.closed.fill", android: "menu_book", web: "menu_book" }}
          tint={colors.accent}
          background={colors.background}
          well={44}
          size={20}
        />
        <View style={styles.headerCopy}>
          <ThemedText type="smallBold">
            {pace === "done"
              ? t("khatm.completedTitle")
              : t("khatm.dayOf", { day: dayNumber, total: plan.days })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {dailyTargetLabel}
          </ThemedText>
        </View>
        <View style={styles.paceBadge}>
          <SymbolView name={PACE_ICON[pace]} size={12} tintColor={tone.color} />
          <Pill label={t(`khatm.pace.${pace}`)} color={tone.color} background={tone.soft} />
        </View>
      </View>

      <View style={styles.percentRow}>
        <ThemedText type="header" style={{ color: colors.accentText }}>
          {pace === "done" ? t("khatm.pace.done") : t("khatm.percentComplete", { percent })}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {progressLabel}
        </ThemedText>
      </View>

      <ProgressBar value={progress} height={12} color={tone.color} />

      <View style={[styles.statsRow, { backgroundColor: colors.background }]}>
        <View style={styles.stat}>
          <ThemedText type="smallBold">{format(remaining)}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {remainingLabel}
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: tokens.hairline }]} />
        <View style={styles.stat}>
          <ThemedText type="smallBold">{format(expected)}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("khatm.expectedLabel")}
          </ThemedText>
        </View>
        <View style={[styles.statDivider, { backgroundColor: tokens.hairline }]} />
        <View style={styles.stat}>
          <ThemedText type="smallBold">{format(target)}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("khatm.todayTarget")}
          </ThemedText>
        </View>
      </View>

      {pace === "behind" ? (
        <View style={[styles.gapBanner, { backgroundColor: tokens.status.warning.soft }]}>
          <SymbolView
            name={{ ios: "exclamationmark.triangle.fill", android: "warning", web: "warning" }}
            size={14}
            tintColor={tokens.status.warning.color}
          />
          <ThemedText type="caption" style={{ color: tokens.status.warning.text, flex: 1 }}>
            {catchUpLabel}
          </ThemedText>
        </View>
      ) : pace === "ahead" ? (
        <View style={[styles.gapBanner, { backgroundColor: tokens.status.success.soft }]}>
          <SymbolView
            name={{ ios: "hand.thumbsup.fill", android: "thumb_up", web: "thumb_up" }}
            size={14}
            tintColor={tokens.status.success.color}
          />
          <ThemedText type="caption" style={{ color: tokens.status.success.text, flex: 1 }}>
            {aheadLabel}
          </ThemedText>
        </View>
      ) : null}

      {isPageUnit && pace !== "done" && onContinue ? (
        <Button
          label={t("khatm.continueReading")}
          onPress={onContinue}
          icon={{ ios: "book.pages.fill", android: "menu_book", web: "menu_book" }}
          fullWidth
        />
      ) : null}

      {pace !== "done" ? (
        <View style={[styles.logSection, { borderColor: withAlpha(colors.accent, 0.22) }]}>
          <SectionHeader
            title={t("khatm.logSectionTitle")}
            icon={{ ios: "plus.circle.fill", android: "add_circle", web: "add_circle" }}
          />
          <ThemedText type="caption" themeColor="mutedForeground">
            {logSectionHint}
          </ThemedText>

          <View style={[styles.logInputRow, { backgroundColor: colors.background }]}>
            <IconButton
              name={{ ios: "minus", android: "remove", web: "remove" }}
              size={18}
              tintColor={colors.foreground}
              background={colors.muted}
              accessibilityLabel={lessA11y}
              onPress={() => bumpLogAmount(isPageUnit ? -1 : -10)}
              hitTarget={44}
              haptic="light"
            />
            <TextInput
              value={logAmountInput}
              onChangeText={(text) =>
                setLogAmountInput(text.replace(/[^0-9]/g, "").slice(0, String(maxLog).length))
              }
              keyboardType="number-pad"
              placeholder={logPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={logA11y}
              style={[
                styles.logInput,
                {
                  color: colors.foreground,
                  borderColor: logInvalid ? tokens.status.warning.color : colors.border,
                },
              ]}
            />
            <IconButton
              name={{ ios: "plus", android: "add", web: "add" }}
              size={18}
              tintColor={colors.foreground}
              background={colors.muted}
              accessibilityLabel={moreA11y}
              onPress={() => bumpLogAmount(isPageUnit ? 1 : 10)}
              hitTarget={44}
              haptic="light"
            />
          </View>

          {logInvalid ? (
            <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
              {logInvalidMsg}
            </ThemedText>
          ) : null}

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.logChipRow}
          >
            <LogAmountChip
              label={t("khatm.logQuickDaily", { count: target })}
              active={logAmount === target}
              onPress={() => setLogAmountInput(String(target))}
            />
            {LOG_QUICK_AMOUNTS.map((amount) => (
              <LogAmountChip
                key={amount}
                label={`+${amount}`}
                active={logAmount === amount}
                onPress={() => setLogAmountInput(String(Math.min(maxLog, amount)))}
              />
            ))}
          </ScrollView>

          <Button
            label={logAddLabel}
            disabled={logAmount == null}
            onPress={() => {
              if (logAmount != null) {
                onLog(logAmount);
                setLogAmountInput(String(target));
              }
            }}
            icon={{ ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }}
            fullWidth
          />

          {showCorrectTotal ? (
            <View style={styles.correctSection}>
              <ThemedText type="smallBold">{t("khatm.correctTotalTitle")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {correctTotalHint}
              </ThemedText>
              <View style={styles.correctRow}>
                <TextInput
                  value={totalInput}
                  onChangeText={(text) =>
                    setTotalInput(text.replace(/[^0-9]/g, "").slice(0, String(totalUnits).length))
                  }
                  keyboardType="number-pad"
                  placeholder={correctTotalA11y}
                  placeholderTextColor={colors.mutedForeground}
                  accessibilityLabel={correctTotalA11y}
                  style={[
                    styles.correctInput,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.background,
                      borderColor: totalInvalid ? tokens.status.warning.color : colors.border,
                    },
                  ]}
                />
                <Button
                  label={t("khatm.correctTotalApply")}
                  variant="secondary"
                  size="sm"
                  disabled={totalAmount == null || totalAmount === ayahsRead}
                  onPress={() => {
                    if (totalAmount != null) {
                      onSetTotal(totalAmount);
                      setShowCorrectTotal(false);
                    }
                  }}
                />
              </View>
              {totalInvalid ? (
                <ThemedText type="caption" style={{ color: tokens.status.warning.text }}>
                  {correctTotalInvalidMsg}
                </ThemedText>
              ) : null}
            </View>
          ) : (
            <PressableScale
              haptic="light"
              accessibilityRole="button"
              accessibilityLabel={t("khatm.correctTotalToggle")}
              onPress={() => setShowCorrectTotal(true)}
              style={styles.correctToggle}
            >
              <ThemedText type="caption" style={{ color: colors.accentText }}>
                {t("khatm.correctTotalToggle")}
              </ThemedText>
            </PressableScale>
          )}
        </View>
      ) : (
        <Button
          label={t("khatm.startNew")}
          variant="secondary"
          onPress={onReset}
          icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
          fullWidth
        />
      )}

      {pace !== "done" ? (
        <View style={[styles.cardFooter, { borderTopColor: withAlpha(colors.accent, 0.22) }]}>
          <PressableScale
            haptic="light"
            accessibilityRole="button"
            accessibilityLabel={t("khatm.reset")}
            onPress={onReset}
            style={styles.resetRow}
          >
            <SymbolView
              name={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
              size={14}
              tintColor={tokens.status.warning.color}
            />
            <ThemedText type="smallBold" style={{ color: tokens.status.warning.text }}>
              {t("khatm.reset")}
            </ThemedText>
          </PressableScale>
        </View>
      ) : null}
    </Card>
  );
}

function PressableCard({
  children,
  onPress,
  accessibilityLabel,
  style,
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  style?: object;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <Card
      padding="three"
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={[
        {
          backgroundColor: colors.card,
          borderColor: tokens.hairline,
          borderWidth: StyleSheet.hairlineWidth,
        },
        style,
      ]}
    >
      {children}
    </Card>
  );
}

export default function KhatmScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  useEnsureKhatmLoaded();
  const { plan, ayahsRead, unit: storedUnit } = useKhatm();
  const { start, setAyahsRead, clear } = useKhatmActions();
  const locale = i18n.language?.split("-")[0];
  const today = getLocalDateString();
  const [motivationSeed, setMotivationSeed] = useState(() => dayMotivationSeed(today));
  const [resetOpen, setResetOpen] = useState(false);
  const [pendingStartDays, setPendingStartDays] = useState<number | null>(null);
  const [startUnit, setStartUnit] = useState<"ayah" | "page">("ayah");

  const activeUnit = plan?.unit ?? storedUnit ?? "ayah";
  const pendingStartTarget =
    pendingStartDays != null
      ? startUnit === "page"
        ? dailyPageTarget(pendingStartDays)
        : dailyAyahTarget(pendingStartDays)
      : 0;

  const target = plan ? dailyTargetForPlan(plan) : 0;
  const totalUnits = khatmTotalForUnit(activeUnit);
  const pace = plan ? khatmPace(plan, ayahsRead, today) : "onTrack";
  const tone = paceTone(pace, tokens);
  const progress = ayahsRead / totalUnits;
  const percent = khatmPercentComplete(ayahsRead, activeUnit);
  const dayNumber = plan ? Math.min(plan.days, daysElapsed(plan, today) + 1) : 0;
  const expected = plan ? expectedAyahsByToday(plan, today) : 0;
  const remaining = activeUnit === "page" ? pagesRemaining(ayahsRead) : ayahsRemaining(ayahsRead);
  const gap = plan ? scheduleGap(plan, ayahsRead, today) : 0;
  const continuePage = Math.min(QURAN_TOTAL_PAGES, Math.max(1, ayahsRead + 1));
  const continueStart = pageToStartAyah(continuePage);

  const format = (n: number) => n.toLocaleString(locale);
  const pendingConfirmMsg =
    pendingStartDays != null
      ? startUnit === "page"
        ? t("khatm.startConfirmMsgPages", {
            days: pendingStartDays,
            count: pendingStartTarget,
          })
        : t("khatm.startConfirmMsg", {
            days: pendingStartDays,
            count: pendingStartTarget,
          })
      : undefined;

  return (
    <ScreenLayout
      eyebrow={t("khatm.eyebrow")}
      title={t("khatm.title")}
      subtitle={t("khatm.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/khatm" />
      <Stagger>
        <KhatmMotivationCard
          seed={motivationSeed}
          onShuffle={() => setMotivationSeed((seed) => seed + 1)}
        />

        {!plan ? (
          <Card padding="three">
            <SectionHeader
              title={t("khatm.startTitle")}
              icon={{ ios: "flag.checkered", android: "flag", web: "flag" }}
            />
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
              {startUnit === "page" ? t("khatm.startHintPages") : t("khatm.startHint")}
            </ThemedText>
            <UnitToggle unit={startUnit} onChange={setStartUnit} />
            <View style={styles.presetList}>
              {PLAN_PRESETS.map((preset) => (
                <PlanPresetCard
                  key={preset.days}
                  days={preset.days}
                  tone={preset.tone}
                  unit={startUnit}
                  onPress={() => setPendingStartDays(preset.days)}
                />
              ))}
              <CustomPlanCard unit={startUnit} onStart={setPendingStartDays} />
            </View>
          </Card>
        ) : plan ? (
          <KhatmActivePlanCard
            plan={plan}
            unit={activeUnit}
            ayahsRead={ayahsRead}
            target={target}
            pace={pace}
            tone={tone}
            percent={percent}
            progress={progress}
            remaining={remaining}
            expected={expected}
            gap={gap}
            dayNumber={dayNumber}
            format={format}
            onLog={(amount) => void setAyahsRead(ayahsRead + amount)}
            onSetTotal={(total) => void setAyahsRead(total)}
            onReset={() => setResetOpen(true)}
            onContinue={
              activeUnit === "page"
                ? () =>
                    router.push(
                      continueStart
                        ? `/quran/page/${continuePage}?surah=${continueStart.surah}&ayah=${continueStart.ayah}`
                        : `/quran/page/${continuePage}`,
                    )
                : undefined
            }
          />
        ) : null}
      </Stagger>

      <ConfirmDialog
        visible={pendingStartDays != null}
        title={t("khatm.startConfirmTitle")}
        message={pendingConfirmMsg}
        confirmLabel={t("khatm.startConfirmAction")}
        cancelLabel={t("common.cancel")}
        onConfirm={() => {
          if (pendingStartDays != null) void start(pendingStartDays, startUnit);
          setPendingStartDays(null);
        }}
        onCancel={() => setPendingStartDays(null)}
        onClose={() => setPendingStartDays(null)}
      />

      <ConfirmDialog
        visible={resetOpen}
        title={t("khatm.resetConfirmTitle")}
        message={t("khatm.resetConfirmMsg")}
        confirmLabel={t("khatm.reset")}
        cancelLabel={t("common.cancel")}
        destructive
        onConfirm={() => {
          setResetOpen(false);
          void clear();
        }}
        onCancel={() => setResetOpen(false)}
        onClose={() => setResetOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hint: { marginTop: Spacing.two, marginBottom: Spacing.three },
  presetList: { gap: Spacing.two },
  unitToggle: { flexDirection: "row", gap: Spacing.two, marginBottom: Spacing.three },
  unitChip: {
    flex: 1,
    alignItems: "center",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  presetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  presetCopy: { flex: 1, gap: 2 },
  customInput: {
    marginTop: Spacing.one,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 15,
  },
  activeCard: { gap: Spacing.three },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  headerCopy: { flex: 1, gap: 2, paddingTop: 2 },
  paceBadge: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  percentRow: { gap: Spacing.one },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  stat: { flex: 1, alignItems: "center", gap: 2, paddingVertical: Spacing.two },
  statDivider: { width: StyleSheet.hairlineWidth, alignSelf: "stretch" },
  gapBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  logSection: {
    gap: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  logInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  logInput: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 18,
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
  logChipRow: { gap: Spacing.two },
  logChip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  correctSection: { gap: Spacing.two },
  correctRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  correctInput: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    fontSize: 15,
    fontVariant: ["tabular-nums"],
  },
  correctToggle: {
    alignSelf: "center",
    paddingVertical: Spacing.one,
  },
  cardFooter: {
    marginTop: Spacing.one,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
  },
  resetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
  },
  motivationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  motivationHeaderCopy: { flex: 1, gap: Spacing.one, paddingTop: 2 },
  motivationArabic: {
    writingDirection: "rtl",
    textAlign: "right",
    marginBottom: Spacing.two,
  },
  motivationBody: { marginBottom: Spacing.one },
});
