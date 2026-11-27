import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ReciteAlongButton } from "@/components/quran/recite-along-button";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { NavRow } from "@/components/ui/nav-row";
import { NumberField } from "@/components/ui/number-field";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { triggerHaptic } from "@/lib/haptics";
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
import {
  dayMotivationSeed,
  pickKhatmMotivation,
  type ResolvedKhatmMotivation,
} from "@/lib/khatm-motivation";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import type { Passage } from "@/lib/quran-companion/types";
import { pageToStartAyah } from "@/lib/quran-meta";
import { khatmPortionPassage } from "@/lib/quran-ref-parse";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useEnsureKhatmLoaded, useKhatm, useKhatmActions } from "@/stores/khatm-store";

const PLAN_PRESETS = [
  { days: 30, tone: "intensive" as const },
  { days: 60, tone: "balanced" as const },
  { days: 90, tone: "steady" as const },
];

/** TV custom-plan stepper starting value (between the 30 / 60 day presets). */
const TV_CUSTOM_DAYS_SEED = 45;

/** NumberField reports numbers; the khatm parsers validate the typed text. */
const numberText = (value: number | undefined) => (value == null ? "" : String(value));

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
  const [motivation, setMotivation] = useState<ResolvedKhatmMotivation>(() => ({
    key: "loading",
    kind: "quote",
    body: t("khatm.motivationQuote.steady.text"),
    reference: t("khatm.motivationQuote.steady.source"),
  }));

  useEffect(() => {
    let cancelled = false;
    void pickKhatmMotivation(seed, t).then((resolved) => {
      if (!cancelled) setMotivation(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, [seed, t]);

  const kindLabel =
    motivation.kind === "hadith"
      ? t("khatm.motivationKind.hadith")
      : motivation.kind === "quran"
        ? t("khatm.motivationKind.quran")
        : t("khatm.motivationKind.reminder");

  return (
    <Card
      style={{
        backgroundColor: tokens.status.info.soft,
        borderColor: withAlpha(tokens.status.info.color, tokens.isDark ? 0.45 : 0.28),
        borderWidth: BorderWidth.hairline,
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
          hitTarget={isTV() ? TvLayout.minFocusTargetDp : 40}
          haptic="light"
        />
      </View>

      {motivation.arabic ? (
        <ThemedText
          type="arabic"
          accessibilityLanguage="ar"
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
  preferredFocus,
  onPress,
}: {
  days: number;
  tone: "intensive" | "balanced" | "steady";
  unit: "ayah" | "page";
  /** TV: first preset takes initial D-pad focus when no plan is running. */
  preferredFocus?: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();
  const target = unit === "page" ? dailyPageTarget(days) : dailyAyahTarget(days);
  const targetLabel =
    unit === "page"
      ? t("khatm.dailyTargetPages", { count: target })
      : t("khatm.dailyTarget", { count: target });

  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={t("khatm.dayPlan", { count: days })}
      preferredFocus={preferredFocus}
    >
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
        <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
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
  const tv = isTV();
  // TV: -/+ stepper instead of typing (seeded between the 30/60 presets).
  const [daysInput, setDaysInput] = useState(() => (tv ? String(TV_CUSTOM_DAYS_SEED) : ""));
  const customDays = parseKhatmPlanDays(daysInput);
  const stepDays = (direction: 1 | -1) => {
    const current = customDays ?? TV_CUSTOM_DAYS_SEED;
    // Fine steps for short plans, coarser beyond a month so 365 stays reachable.
    const step = current < 30 || (direction < 0 && current <= 30) ? 1 : 5;
    const next = Math.min(
      KHATM_MAX_PLAN_DAYS,
      Math.max(KHATM_MIN_PLAN_DAYS, current + direction * step),
    );
    setDaysInput(String(next));
  };
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
      style={{
        backgroundColor: colors.card,
        borderColor: tokens.hairline,
        borderWidth: BorderWidth.hairline,
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
          {tv ? (
            <View style={styles.tvDaysRow}>
              <IconButton
                name={{ ios: "minus", android: "remove", web: "remove" }}
                size={18}
                tintColor={colors.foreground}
                background={colors.muted}
                accessibilityLabel={t("common.decrease", { label: t("khatm.customPlan") })}
                onPress={() => stepDays(-1)}
                hitTarget={TvLayout.minFocusTargetDp}
                haptic="light"
              />
              <ThemedText type="smallBold" style={styles.tvDaysValue}>
                {t("khatm.dayPlan", { count: customDays ?? TV_CUSTOM_DAYS_SEED })}
              </ThemedText>
              <IconButton
                name={{ ios: "plus", android: "add", web: "add" }}
                size={18}
                tintColor={colors.foreground}
                background={colors.muted}
                accessibilityLabel={t("common.increase", { label: t("khatm.customPlan") })}
                onPress={() => stepDays(1)}
                hitTarget={TvLayout.minFocusTargetDp}
                haptic="light"
              />
            </View>
          ) : (
            <NumberField
              label={t("khatm.customDaysA11y")}
              value={daysInput.trim() ? Number(daysInput) : undefined}
              onChangeValue={(value) => setDaysInput(numberText(value))}
              maxFractionDigits={0}
              allowZero
              placeholder={t("khatm.customDaysPlaceholder")}
              helperText={
                customDays && dailyTargetLabel
                  ? dailyTargetLabel
                  : t("khatm.customHint", { min: KHATM_MIN_PLAN_DAYS, max: KHATM_MAX_PLAN_DAYS })
              }
              error={
                showInvalid
                  ? t("khatm.customInvalid", { min: KHATM_MIN_PLAN_DAYS, max: KHATM_MAX_PLAN_DAYS })
                  : undefined
              }
            />
          )}
          {tv ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {customDays && dailyTargetLabel
                ? dailyTargetLabel
                : t("khatm.customHint", { min: KHATM_MIN_PLAN_DAYS, max: KHATM_MAX_PLAN_DAYS })}
            </ThemedText>
          ) : null}
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

/** Quick amounts set (not add) the amount to log, so they read "10 / 25 / 50" (G-25). */
const LOG_QUICK_AMOUNTS = [10, 25, 50] as const;

function UnitToggle({
  unit,
  onChange,
}: {
  unit: "ayah" | "page";
  onChange: (unit: "ayah" | "page") => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.unitToggle}>
      <SegmentedControl
        accessibilityLabel={t("quran.study.khatmUnit")}
        value={unit}
        onChange={onChange}
        options={[
          { id: "ayah", label: t("khatm.unitAyah") },
          { id: "page", label: t("khatm.unitPage") },
        ]}
      />
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
  recitePassage,
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
  /** Today's portion as a recite-along passage (D68); its first surah only. */
  recitePassage?: Passage | null;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [logAmountInput, setLogAmountInput] = useState(String(target));
  const [totalInput, setTotalInput] = useState(String(ayahsRead));
  const [showCorrectTotal, setShowCorrectTotal] = useState(false);
  const totalUnits = khatmTotalForUnit(unit);
  const isPageUnit = unit === "page";
  const tv = isTV();

  useEffect(() => {
    setLogAmountInput(String(target));
    setTotalInput(String(ayahsRead));
    setShowCorrectTotal(false);
  }, [target, ayahsRead]);

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
      style={[
        styles.activeCard,
        {
          backgroundColor: tokens.accentSoft,
          borderColor: withAlpha(colors.accent, tokens.isDark ? 0.45 : 0.28),
          borderWidth: BorderWidth.thin,
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

      <ProgressBar
        value={progress}
        accessibilityLabel={t("a11yProgress.khatm")}
        height={12}
        color={tone.color}
      />

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
          preferredFocus
          icon={{ ios: "book.pages.fill", android: "menu_book", web: "menu_book" }}
          fullWidth
        />
      ) : null}

      {/* Follow along by default; a long portion offers ten-ayah sections first. */}
      {pace !== "done" && recitePassage ? (
        <ReciteAlongButton
          passage={recitePassage}
          label={t("reciteAlong.khatmToday")}
          variant={isPageUnit && onContinue ? "secondary" : "primary"}
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

          <NumberField
            label={logA11y}
            value={logAmountInput.trim() ? Number(logAmountInput) : undefined}
            onChangeValue={(value) => setLogAmountInput(numberText(value))}
            maxFractionDigits={0}
            allowZero
            step={isPageUnit ? 1 : 10}
            placeholder={logPlaceholder}
            error={logInvalid ? logInvalidMsg : undefined}
            inputStyle={styles.logInput}
            // Phone / web: −/+ around the digits. TV: NumberField brings its own stepper.
            leading={
              tv ? undefined : (
                <IconButton
                  name={{ ios: "minus", android: "remove", web: "remove" }}
                  size={18}
                  tintColor={colors.foreground}
                  background={colors.muted}
                  accessibilityLabel={lessA11y}
                  onPress={() => bumpLogAmount(isPageUnit ? -1 : -10)}
                  haptic="selection"
                />
              )
            }
            trailing={
              tv ? undefined : (
                <IconButton
                  name={{ ios: "plus", android: "add", web: "add" }}
                  size={18}
                  tintColor={colors.foreground}
                  background={colors.muted}
                  accessibilityLabel={moreA11y}
                  onPress={() => bumpLogAmount(isPageUnit ? 1 : 10)}
                  haptic="selection"
                />
              )
            }
          />

          <View
            accessibilityRole="radiogroup"
            accessibilityLabel={t("quran.study.khatmQuickAmounts")}
            style={styles.logChipRow}
          >
            <Chip
              role="radio"
              label={t("khatm.logQuickDaily", { count: target })}
              selected={logAmount === target}
              onPress={() => setLogAmountInput(String(target))}
            />
            {LOG_QUICK_AMOUNTS.map((amount) => (
              <Chip
                key={amount}
                role="radio"
                label={format(amount)}
                accessibilityLabel={
                  isPageUnit
                    ? t("quran.study.pagesAmount", { count: amount })
                    : t("quran.study.ayahsAmount", { count: amount })
                }
                selected={logAmount === amount && amount !== target}
                onPress={() => setLogAmountInput(String(Math.min(maxLog, amount)))}
              />
            ))}
          </View>

          <Button
            label={logAddLabel}
            disabled={logAmount == null}
            onPress={() => {
              if (logAmount != null) onLog(logAmount);
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
              <NumberField
                label={correctTotalA11y}
                value={totalInput.trim() ? Number(totalInput) : undefined}
                onChangeValue={(value) => setTotalInput(numberText(value))}
                maxFractionDigits={0}
                allowZero
                step={isPageUnit ? 1 : 10}
                placeholder={correctTotalA11y}
                error={totalInvalid ? correctTotalInvalidMsg : undefined}
              />
              <Button
                label={t("khatm.correctTotalApply")}
                variant="secondary"
                disabled={totalAmount == null || totalAmount === ayahsRead}
                onPress={() => {
                  if (totalAmount != null) onSetTotal(totalAmount);
                }}
              />
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
          {/* Destructive trigger: danger row; the dialog it opens repeats the verb. */}
          <NavRow
            tone="danger"
            icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
            label={t("khatm.reset")}
            onPress={onReset}
          />
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
  preferredFocus,
}: {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel: string;
  style?: object;
  preferredFocus?: boolean;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <Card
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      preferredFocus={Boolean(preferredFocus && isTV())}
      style={[
        {
          backgroundColor: colors.card,
          borderColor: tokens.hairline,
          borderWidth: BorderWidth.hairline,
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
  const undoToast = useUndoToast();
  const [startUnit, setStartUnit] = useState<"ayah" | "page">("ayah");
  const { width: windowWidth } = useWindowDimensions();
  const tv = isTV();
  // Desktop: the motivation card moves to a side column beside the plan.
  const wideAside = !tv && windowWidth >= WIDE_ASIDE_MIN_WIDTH;

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
  // G-06: logging and correcting the total are the screen's everyday, reversible
  // actions — write at once and offer Undo. Only Start and Reset confirm.
  const writeTotal = (next: number, messageKey: string) => {
    const previous = ayahsRead;
    triggerHaptic("success");
    void undoToast.run({
      do: () => setAyahsRead(next),
      undo: () => setAyahsRead(previous),
      messageKey,
    });
  };
  const logReading = (amount: number) => writeTotal(ayahsRead + amount, "quran.study.khatmLogged");
  const correctTotal = (total: number) => writeTotal(total, "quran.study.khatmTotalUpdated");

  // TV toasts take no focus: the Undo window is an in-page button instead.
  const tvUndo =
    tv && undoToast.undoAvailable ? (
      <Button
        label={t("uiFeedback.undo")}
        variant="secondary"
        onPress={() => undoToast.undo()}
        icon={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
      />
    ) : null;
  const motivation = (
    <KhatmMotivationCard
      seed={motivationSeed}
      onShuffle={() => setMotivationSeed((seed) => seed + 1)}
    />
  );
  const main = !plan ? (
    <Card>
      <SectionHeader
        title={t("khatm.startTitle")}
        icon={{ ios: "flag.checkered", android: "flag", web: "flag" }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {startUnit === "page" ? t("khatm.startHintPages") : t("khatm.startHint")}
      </ThemedText>
      <UnitToggle unit={startUnit} onChange={setStartUnit} />
      <View style={styles.presetList}>
        {/* TV: one focus column. Tablet / desktop: presets side by side. */}
        <ResponsiveGrid gap={Spacing.two} maxColumns={3} columns={tv ? 1 : undefined}>
          {PLAN_PRESETS.map((preset, index) => (
            <PlanPresetCard
              key={preset.days}
              days={preset.days}
              tone={preset.tone}
              unit={startUnit}
              preferredFocus={index === 0}
              onPress={() => setPendingStartDays(preset.days)}
            />
          ))}
        </ResponsiveGrid>
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
      onLog={logReading}
      onSetTotal={correctTotal}
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
      recitePassage={khatmPortionPassage(activeUnit, ayahsRead, target)}
    />
  ) : null;

  return (
    <ScreenLayout
      eyebrow={t("khatm.eyebrow")}
      title={t("khatm.title")}
      subtitle={t("khatm.subtitle")}
      onBack={() => goBackOrReplace(router, "/quran")}
    >
      <Seo path="/quran/khatm" />
      {wideAside ? (
        <View style={styles.wideRow}>
          <View style={styles.wideMain}>
            <Stagger>
              {main}
              {tvUndo}
            </Stagger>
          </View>
          <View style={styles.wideAside}>
            <Stagger>{motivation}</Stagger>
          </View>
        </View>
      ) : (
        <Stagger>
          {main}
          {tvUndo}
          {motivation}
        </Stagger>
      )}

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

/** Window width at which the motivation card becomes a side column. */
const WIDE_ASIDE_MIN_WIDTH = 1200;

const styles = StyleSheet.create({
  wideRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four, width: "100%" },
  wideMain: { flex: 1, minWidth: 0 },
  wideAside: { width: 340, flexShrink: 0 },
  hint: { marginTop: Spacing.two, marginBottom: Spacing.three },
  presetList: { gap: Spacing.two },
  unitToggle: { marginBottom: Spacing.three },
  presetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
  },
  presetCopy: { flex: 1, gap: Spacing.half },
  tvDaysRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    marginTop: Spacing.one,
  },
  tvDaysValue: {
    minWidth: 120,
    textAlign: "center",
    fontSize: TvLayout.bodyFontSize,
  },
  activeCard: { gap: Spacing.three },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  headerCopy: { flex: 1, gap: Spacing.half, paddingTop: Spacing.half },
  paceBadge: { flexDirection: "row", alignItems: "center", gap: Spacing.one },
  percentRow: { gap: Spacing.one },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  stat: { flex: 1, alignItems: "center", gap: Spacing.half, paddingVertical: Spacing.two },
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
    borderTopWidth: BorderWidth.hairline,
  },
  logInput: {
    fontVariant: ["tabular-nums"],
    textAlign: "center",
  },
  logChipRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  correctSection: { gap: Spacing.two },
  correctToggle: {
    alignSelf: "center",
    paddingVertical: Spacing.one,
  },
  cardFooter: {
    marginTop: Spacing.one,
    paddingTop: Spacing.three,
    borderTopWidth: BorderWidth.hairline,
  },
  motivationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  motivationHeaderCopy: { flex: 1, gap: Spacing.one, paddingTop: Spacing.half },
  motivationArabic: {
    writingDirection: "rtl",
    marginBottom: Spacing.two,
  },
  motivationBody: { marginBottom: Spacing.one },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/quran/khatm");
