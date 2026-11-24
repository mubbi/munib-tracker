import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TextInput, useWindowDimensions, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { TvNumberStepper } from "@/components/tv-number-stepper";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  DEFAULT_NUMBER_FORMAT,
  formatMoneyAmount,
  formatNumberInput,
  parseNumberInput,
} from "@/lib/format-currency";
import { defaultCurrencyCode } from "@/lib/money-defaults";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  type SadaqahPeriod,
  sumSadaqahInPeriod,
  useEnsureSadaqahLoaded,
  useSadaqahActions,
  useSadaqahGoal,
  useSadaqahLog,
} from "@/stores/sadaqah-store";

/** Settings default currency (seeds a new goal), else the device region. */
function defaultCurrency(): string {
  return defaultCurrencyCode();
}

export default function SadaqahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  useEnsureSadaqahLoaded();
  const goal = useSadaqahGoal();
  const log = useSadaqahLog();
  const actions = useSadaqahActions();

  const [period, setPeriod] = useState<SadaqahPeriod>(goal?.period ?? "daily");
  const [targetInput, setTargetInput] = useState(goal ? String(goal.amount) : "");
  const [currencyCode, setCurrencyCode] = useState(goal?.currencyCode ?? defaultCurrency());
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [logAmount, setLogAmount] = useState("");
  const [logNote, setLogNote] = useState("");
  const tv = isTV();
  const { width } = useWindowDimensions();
  /** Desktop / wide web: intention + log form on the start side, giving history aside. */
  const twoPane = !tv && width >= 1024;
  /** TV amounts are whole units stepped with the D-pad (no decimal keyboard). */
  const tvAmount = (input: string) =>
    Math.max(0, Math.round(parseNumberInput(input, DEFAULT_NUMBER_FORMAT)) || 0);

  const periodOptions = useMemo(
    () => [
      { id: "daily" as const, label: t("sadaqah.period.daily") },
      { id: "weekly" as const, label: t("sadaqah.period.weekly") },
    ],
    [t],
  );

  const progressAmount = goal ? sumSadaqahInPeriod(log, goal.period) : 0;
  const progressRatio = goal && goal.amount > 0 ? Math.min(1, progressAmount / goal.amount) : 0;

  const money = (n: number, code = currencyCode) =>
    formatMoneyAmount(n, code, DEFAULT_NUMBER_FORMAT);

  const saveGoal = () => {
    const amount = parseNumberInput(targetInput, DEFAULT_NUMBER_FORMAT);
    if (amount <= 0) return;
    void actions.setGoal({
      period,
      amount,
      currencyCode,
      startDate: new Date().toISOString().slice(0, 10),
    });
  };

  const addLog = () => {
    const amount = parseNumberInput(logAmount, DEFAULT_NUMBER_FORMAT);
    if (amount <= 0) return;
    void actions.addEntry(amount, logNote);
    setLogAmount("");
    setLogNote("");
  };

  const intentionCard = (
    <Card padding="three">
      <SectionHeader
        title={t("sadaqah.intentionTitle")}
        icon={{
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        }}
      />
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
        {t("sadaqah.intentionHint")}
      </ThemedText>

      <View style={styles.block}>
        <SegmentedControl<SadaqahPeriod>
          options={periodOptions}
          value={period}
          onChange={setPeriod}
        />
      </View>

      <JannahNavRow
        icon={{ ios: "coloncurrencysign.circle", android: "payments", web: "payments" }}
        title={t("sadaqah.currency")}
        subtitle={currencyCode}
        onPress={() => setCurrencyOpen(true)}
      />

      <View style={styles.fieldBlock}>
        <ThemedText type="smallBold">{t("sadaqah.targetLabel")}</ThemedText>
        {tv ? (
          <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
            <TvNumberStepper
              value={tvAmount(targetInput)}
              onChange={(next) => setTargetInput(next > 0 ? String(next) : "")}
              label={t("sadaqah.targetLabel")}
              max={9_999_999}
              steps={[1, 10, 100, 1000]}
            />
          </View>
        ) : (
          <View style={[styles.inputRow, tokens.inputSurface]}>
            <TextInput
              value={targetInput}
              onChangeText={(text) =>
                setTargetInput(formatNumberInput(text, 2, DEFAULT_NUMBER_FORMAT))
              }
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel={t("sadaqah.targetLabel")}
              onSubmitEditing={Platform.OS === "web" ? saveGoal : undefined}
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
        )}
      </View>

      <PressableScale
        onPress={saveGoal}
        style={[styles.primaryBtn, tv && styles.primaryBtnTv, { backgroundColor: colors.accent }]}
        accessibilityRole="button"
        accessibilityLabel={t("sadaqah.saveGoal")}
      >
        <ThemedText type="smallBold" style={{ color: colors.accentForeground }}>
          {t("sadaqah.saveGoal")}
        </ThemedText>
      </PressableScale>

      {goal ? (
        <View style={styles.progressBlock}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("sadaqah.progressLabel", {
              period: t(`sadaqah.period.${goal.period}`),
            })}
          </ThemedText>
          <ThemedText type="subtitle">
            {money(progressAmount, goal.currencyCode)} / {money(goal.amount, goal.currencyCode)}
          </ThemedText>
          <View style={[styles.track, { backgroundColor: colors.muted }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.round(progressRatio * 100)}%`,
                  backgroundColor: tokens.status.success.color,
                },
              ]}
            />
          </View>
          <PressableScale
            onPress={() => void actions.clearGoal()}
            accessibilityRole="button"
            accessibilityLabel={t("sadaqah.clearGoal")}
            style={tv ? [styles.textActionTv, styles.clearGoalTv] : undefined}
          >
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("sadaqah.clearGoal")}
            </ThemedText>
          </PressableScale>
        </View>
      ) : null}
    </Card>
  );

  const logHeader = (
    <SectionHeader
      title={t("sadaqah.logTitle")}
      icon={{ ios: "plus.circle.fill", android: "add_circle", web: "add_circle" }}
    />
  );

  const logForm = (
    <>
      <View style={styles.fieldBlock}>
        <ThemedText type="smallBold">{t("sadaqah.logAmount")}</ThemedText>
        {tv ? (
          <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
            <TvNumberStepper
              value={tvAmount(logAmount)}
              onChange={(next) => setLogAmount(next > 0 ? String(next) : "")}
              label={t("sadaqah.logAmount")}
              max={9_999_999}
              steps={[1, 10, 100, 1000]}
            />
          </View>
        ) : (
          <View style={[styles.inputRow, tokens.inputSurface]}>
            <TextInput
              value={logAmount}
              onChangeText={(text) =>
                setLogAmount(formatNumberInput(text, 2, DEFAULT_NUMBER_FORMAT))
              }
              keyboardType="decimal-pad"
              onSubmitEditing={Platform.OS === "web" ? addLog : undefined}
              accessibilityLabel={t("sadaqah.logAmount")}
              placeholder="0"
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
        )}
      </View>
      {/* The note is optional free text — skipped on TV to avoid keyboard entry. */}
      {tv ? null : (
        <View style={styles.fieldBlock}>
          <ThemedText type="smallBold">{t("sadaqah.logNote")}</ThemedText>
          <View style={[styles.inputRow, tokens.inputSurface]}>
            <TextInput
              value={logNote}
              onChangeText={setLogNote}
              onSubmitEditing={Platform.OS === "web" ? addLog : undefined}
              accessibilityLabel={t("sadaqah.logNote")}
              placeholder={t("sadaqah.logNotePlaceholder")}
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground }]}
            />
          </View>
        </View>
      )}
      <PressableScale
        onPress={addLog}
        style={[styles.primaryBtn, tv && styles.primaryBtnTv, { backgroundColor: colors.accent }]}
        accessibilityRole="button"
        accessibilityLabel={t("sadaqah.addEntry")}
      >
        <ThemedText type="smallBold" style={{ color: colors.accentForeground }}>
          {t("sadaqah.addEntry")}
        </ThemedText>
      </PressableScale>
    </>
  );

  const logList = (
    <View style={styles.logList}>
      {log.length === 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("sadaqah.logEmpty")}
        </ThemedText>
      ) : (
        log.slice(0, twoPane ? 50 : 20).map((entry) => (
          <View key={entry.id} style={styles.logRow}>
            <View style={styles.logText}>
              <ThemedText type="smallBold">
                {money(entry.amount, goal?.currencyCode ?? currencyCode)}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {new Date(entry.at).toLocaleString()}
                {entry.note ? ` · ${entry.note}` : ""}
              </ThemedText>
            </View>
            <PressableScale
              onPress={() => void actions.removeEntry(entry.id)}
              accessibilityRole="button"
              accessibilityLabel={t("common.remove")}
              style={tv ? styles.textActionTv : undefined}
            >
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("common.remove")}
              </ThemedText>
            </PressableScale>
          </View>
        ))
      )}
    </View>
  );

  const learnCard = (
    <Card padding="three">
      <SectionHeader
        title={t("sadaqah.learnMoreTitle")}
        icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
      />
      <View style={styles.rows}>
        <JannahNavRow
          icon={{ ios: "banknote.fill", android: "payments", web: "payments" }}
          title={t("sadaqah.linkZakat")}
          subtitle={t("sadaqah.linkZakatHint")}
          onPress={() => router.push("/zakat" as Href)}
        />
        <JannahNavRow
          icon={{ ios: "text.book.closed", android: "article", web: "article" }}
          title={t("sadaqah.linkFinance")}
          subtitle={t("sadaqah.linkFinanceHint")}
          onPress={() =>
            router.push({
              pathname: "/finance/[topic]",
              params: { topic: "sadaqah-voluntary-giving" },
            } as Href)
          }
        />
      </View>
    </Card>
  );

  return (
    <ScreenLayout
      maxContentWidth={twoPane ? 1320 : undefined}
      eyebrow={t("sadaqah.eyebrow")}
      title={t("sadaqah.title")}
      subtitle={t("sadaqah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/sadaqah" />
      <Stagger>
        <JannahCallout tone="info">{t("sadaqah.intro")}</JannahCallout>

        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.pane}>
              {intentionCard}
              <Card padding="three">
                {logHeader}
                {logForm}
              </Card>
            </View>
            <View style={styles.pane}>
              <Card padding="three">
                <SectionHeader
                  title={t("calDay.history")}
                  icon={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
                />
                {logList}
              </Card>
              {learnCard}
              <JannahDisclaimer textKey="sadaqah.disclaimer" />
            </View>
          </View>
        ) : null}
        {twoPane ? null : intentionCard}
        {twoPane ? null : (
          <Card padding="three">
            {logHeader}
            {logForm}
            {logList}
          </Card>
        )}
        {twoPane ? null : learnCard}
        {twoPane ? null : <JannahDisclaimer textKey="sadaqah.disclaimer" />}
      </Stagger>

      <CurrencyPickerSheet
        visible={currencyOpen}
        selectedCode={currencyCode}
        onSelect={(code) => {
          setCurrencyCode(code);
          setCurrencyOpen(false);
        }}
        onClose={() => setCurrencyOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  split: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  pane: { flex: 1, minWidth: 0, gap: Spacing.three },
  hint: { marginTop: Spacing.two, lineHeight: 20 },
  block: { marginTop: Spacing.three },
  fieldBlock: { marginTop: Spacing.three, gap: Spacing.two },
  inputRow: {
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  input: { fontSize: 16, paddingVertical: Spacing.one },
  primaryBtn: {
    marginTop: Spacing.three,
    borderRadius: 12,
    paddingVertical: Spacing.three,
    alignItems: "center",
  },
  primaryBtnTv: { minHeight: TvLayout.minFocusTarget, justifyContent: "center" },
  /** TV: text-only actions need a real focus target, not a caption-sized hit box. */
  textActionTv: {
    minHeight: TvLayout.chipMinHeight,
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
  },
  clearGoalTv: { alignSelf: "flex-start" },
  progressBlock: { marginTop: Spacing.three, gap: Spacing.two },
  track: { height: 8, borderRadius: 999, overflow: "hidden" },
  fill: { height: "100%", borderRadius: 999 },
  logList: { marginTop: Spacing.three, gap: Spacing.two },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  logText: { flex: 1, gap: 2 },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/sadaqah");
