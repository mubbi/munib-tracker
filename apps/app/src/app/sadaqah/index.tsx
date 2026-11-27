import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { CurrencyField } from "@/components/money/currency-field";
import { useMoneyNumberFormat } from "@/components/money/use-number-format";
import { ScreenLayout } from "@/components/screen-layout";
import { ToolSeo } from "@/components/seo/tool-seo";
import { ThemedText } from "@/components/themed-text";
import { TvNumberStepper } from "@/components/tv-number-stepper";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { NumberField } from "@/components/ui/number-field";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { TextField } from "@/components/ui/text-field";
import { Breakpoints, Spacing } from "@/constants/theme";
import { useUndoToast } from "@/hooks/use-undo-toast";
import { formatMoneyAmount } from "@/lib/format-currency";
import { defaultCurrencyCode } from "@/lib/money-defaults";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { formatDisplayDateTime } from "@/lib/time";
import { useToast } from "@/providers/toast-provider";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";
import {
  type SadaqahLogEntry,
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

const LOG_PAGE = 20;

export default function SadaqahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const toast = useToast();
  const undoToast = useUndoToast();
  const numberFormat = useMoneyNumberFormat();
  const prefs = usePreferences();
  const location = useLocation();
  useEnsureSadaqahLoaded();
  const goal = useSadaqahGoal();
  const log = useSadaqahLog();
  const actions = useSadaqahActions();

  const [period, setPeriod] = useState<SadaqahPeriod>(goal?.period ?? "daily");
  const [target, setTarget] = useState<number | undefined>(goal?.amount);
  const [currencyCode, setCurrencyCode] = useState(goal?.currencyCode ?? defaultCurrency());
  const [logAmount, setLogAmount] = useState<number | undefined>(undefined);
  const [logNote, setLogNote] = useState("");
  const [shown, setShown] = useState(LOG_PAGE);
  const [confirmClear, setConfirmClear] = useState(false);
  const tv = isTV();
  const { width } = useWindowDimensions();
  /** Desktop / wide web: intention + log form on the start side, giving history aside. */
  const twoPane = !tv && width >= Breakpoints.wide;
  const visibleCount = twoPane ? Math.max(50, shown) : shown;

  const periodOptions = useMemo(
    () => [
      { id: "daily" as const, label: t("sadaqah.period.daily") },
      { id: "weekly" as const, label: t("sadaqah.period.weekly") },
    ],
    [t],
  );

  const progressAmount = goal ? sumSadaqahInPeriod(log, goal.period) : 0;
  const progressRatio = goal && goal.amount > 0 ? Math.min(1, progressAmount / goal.amount) : 0;
  const periodTotal = sumSadaqahInPeriod(log, period);

  const money = (n: number, code = currencyCode) => formatMoneyAmount(n, code, numberFormat);

  const saveGoal = () => {
    if (target == null || target <= 0) return;
    void actions
      .setGoal({
        period,
        amount: target,
        currencyCode,
        startDate: new Date().toISOString().slice(0, 10),
      })
      .then(
        () => toast.success(t("sadaqah.goalSaved")),
        () => toast.error(t("common.saveFailed")),
      );
  };

  const addLog = () => {
    if (logAmount == null || logAmount <= 0) return;
    const note = logNote;
    void actions.addEntry(logAmount, note).then(
      () => toast.success(t("sadaqah.entryAdded")),
      () => toast.error(t("common.saveFailed")),
    );
    setLogAmount(undefined);
    setLogNote("");
  };

  const removeEntry = (entry: SadaqahLogEntry) =>
    void undoToast.run({
      do: () => actions.removeEntry(entry.id),
      undo: () => actions.restoreEntry(entry),
      messageKey: "sadaqah.entryRemoved",
    });

  const amountField = (
    label: string,
    value: number | undefined,
    onChange: (n: number | undefined) => void,
    onSubmit: () => void,
  ) =>
    tv ? (
      <View style={styles.tvField}>
        <ThemedText type="smallBold">{label}</ThemedText>
        <TvNumberStepper
          value={value ?? 0}
          onChange={(next) => onChange(next > 0 ? next : undefined)}
          label={label}
          max={9_999_999}
          steps={[1, 10, 100, 1000]}
        />
      </View>
    ) : (
      <NumberField
        label={label}
        value={value}
        onChangeValue={onChange}
        numberFormat={numberFormat}
        maxFractionDigits={2}
        suffix={currencyCode}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
    );

  const intentionCard = (
    <Card>
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

      <View style={styles.fieldBlock}>
        <CurrencyField
          label={t("sadaqah.currency")}
          value={currencyCode}
          onChange={setCurrencyCode}
        />
        {amountField(t("sadaqah.targetLabel"), target, setTarget, saveGoal)}
        <Button
          label={t("sadaqah.saveGoal")}
          disabled={target == null || target <= 0}
          onPress={saveGoal}
        />
      </View>

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
          <ProgressBar value={progressRatio} accessibilityLabel={t("sadaqah.progressA11y")} />
          <Button
            variant="ghost"
            size="sm"
            label={t("sadaqah.clearGoal")}
            onPress={() => setConfirmClear(true)}
          />
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
    <View style={styles.fieldBlock}>
      {amountField(t("sadaqah.logAmount"), logAmount, setLogAmount, addLog)}
      {/* The note is optional free text — skipped on TV to avoid keyboard entry. */}
      {tv ? null : (
        <TextField
          label={t("sadaqah.logNote")}
          optional
          value={logNote}
          onChangeText={setLogNote}
          onSubmitEditing={addLog}
          placeholder={t("sadaqah.logNotePlaceholder")}
        />
      )}
      <Button
        label={t("sadaqah.addEntry")}
        disabled={logAmount == null || logAmount <= 0}
        onPress={addLog}
      />
    </View>
  );

  const logList = (
    <View style={styles.logList}>
      {log.length === 0 ? (
        <EmptyState
          icon={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
          title={t("sadaqah.logEmpty")}
        />
      ) : (
        <>
          <ThemedText type="smallBold">
            {t("sadaqah.periodTotal", {
              period: t(`sadaqah.period.${period}`),
              amount: money(periodTotal),
            })}
          </ThemedText>
          {log.slice(0, visibleCount).map((entry) => (
            <View key={entry.id} style={styles.logRow}>
              <View style={styles.logText}>
                <ThemedText type="smallBold">
                  {money(entry.amount, goal?.currencyCode ?? currencyCode)}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {formatDisplayDateTime(
                    new Date(entry.at),
                    prefs.timeFormat,
                    prefs.locale,
                    location.timeZone,
                    prefs.defaultCalendar,
                  )}
                  {entry.note ? ` · ${entry.note}` : ""}
                </ThemedText>
              </View>
              <IconButton
                name={{ ios: "trash", android: "delete", web: "delete" }}
                accessibilityLabel={t("sadaqah.removeEntry")}
                onPress={() => removeEntry(entry)}
              />
            </View>
          ))}
          {log.length > visibleCount ? (
            <Button
              variant="secondary"
              label={t("sadaqah.loadMore")}
              onPress={() => setShown((n) => n + LOG_PAGE)}
            />
          ) : null}
          {tv && undoToast.undoAvailable ? (
            <Button
              variant="secondary"
              label={t("uiFeedback.undo")}
              onPress={() => undoToast.undo()}
            />
          ) : null}
        </>
      )}
    </View>
  );

  const learnCard = (
    <Card>
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
          href="/zakat"
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
          href="/finance/sadaqah-voluntary-giving"
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
      <ToolSeo path="/sadaqah" name={t("sadaqah.title")} />
      <Stagger>
        <Callout tone="info">{t("sadaqah.intro")}</Callout>

        {twoPane ? (
          <View style={styles.split}>
            <View style={styles.pane}>
              {intentionCard}
              <Card>
                {logHeader}
                {logForm}
              </Card>
            </View>
            <View style={styles.pane}>
              <Card>
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
          <Card>
            {logHeader}
            {logForm}
            {logList}
          </Card>
        )}
        {twoPane ? null : learnCard}
        {twoPane ? null : <JannahDisclaimer textKey="sadaqah.disclaimer" />}
      </Stagger>

      <ConfirmDialog
        visible={confirmClear}
        destructive
        title={t("sadaqah.clearGoalTitle")}
        message={t("sadaqah.clearGoalBody")}
        confirmLabel={t("sadaqah.clearGoal")}
        onConfirm={async () => {
          await actions.clearGoal();
          setConfirmClear(false);
          toast.success(t("sadaqah.goalCleared"));
        }}
        onClose={() => setConfirmClear(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  split: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  pane: { flex: 1, minWidth: 0, gap: Spacing.three },
  hint: { marginTop: Spacing.two, lineHeight: 20 },
  block: { marginTop: Spacing.three },
  fieldBlock: { marginTop: Spacing.three, gap: Spacing.three },
  tvField: { gap: Spacing.two },
  progressBlock: { marginTop: Spacing.three, gap: Spacing.two },
  logList: { marginTop: Spacing.three, gap: Spacing.two },
  logRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  logText: { flex: 1, gap: Spacing.half },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/sadaqah");
