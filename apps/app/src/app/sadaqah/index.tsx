import * as Localization from "expo-localization";
import { type Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { JannahCallout, JannahDisclaimer, JannahNavRow } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { getCurrencyInfo } from "@/constants/currencies";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  DEFAULT_NUMBER_FORMAT,
  formatMoneyAmount,
  formatNumberInput,
  parseNumberInput,
} from "@/lib/format-currency";
import { goBackOrReplace } from "@/lib/navigation";
import {
  type SadaqahPeriod,
  sumSadaqahInPeriod,
  useEnsureSadaqahLoaded,
  useSadaqahActions,
  useSadaqahGoal,
  useSadaqahLog,
} from "@/stores/sadaqah-store";

function defaultCurrency(): string {
  const device = Localization.getLocales()[0]?.currencyCode?.toUpperCase();
  if (device && getCurrencyInfo(device)) return device;
  return "USD";
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

  return (
    <ScreenLayout
      eyebrow={t("sadaqah.eyebrow")}
      title={t("sadaqah.title")}
      subtitle={t("sadaqah.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
    >
      <Seo path="/sadaqah" />
      <Stagger>
        <JannahCallout tone="info">{t("sadaqah.intro")}</JannahCallout>

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
            <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
              <TextInput
                value={targetInput}
                onChangeText={(text) =>
                  setTargetInput(formatNumberInput(text, 2, DEFAULT_NUMBER_FORMAT))
                }
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                accessibilityLabel={t("sadaqah.targetLabel")}
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
          </View>

          <PressableScale
            onPress={saveGoal}
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
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
              >
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("sadaqah.clearGoal")}
                </ThemedText>
              </PressableScale>
            </View>
          ) : null}
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("sadaqah.logTitle")}
            icon={{ ios: "plus.circle.fill", android: "add_circle", web: "add_circle" }}
          />
          <View style={styles.fieldBlock}>
            <ThemedText type="smallBold">{t("sadaqah.logAmount")}</ThemedText>
            <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
              <TextInput
                value={logAmount}
                onChangeText={(text) =>
                  setLogAmount(formatNumberInput(text, 2, DEFAULT_NUMBER_FORMAT))
                }
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
          </View>
          <View style={styles.fieldBlock}>
            <ThemedText type="smallBold">{t("sadaqah.logNote")}</ThemedText>
            <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
              <TextInput
                value={logNote}
                onChangeText={setLogNote}
                placeholder={t("sadaqah.logNotePlaceholder")}
                placeholderTextColor={colors.mutedForeground}
                style={[styles.input, { color: colors.foreground }]}
              />
            </View>
          </View>
          <PressableScale
            onPress={addLog}
            style={[styles.primaryBtn, { backgroundColor: colors.accent }]}
            accessibilityRole="button"
            accessibilityLabel={t("sadaqah.addEntry")}
          >
            <ThemedText type="smallBold" style={{ color: colors.accentForeground }}>
              {t("sadaqah.addEntry")}
            </ThemedText>
          </PressableScale>

          <View style={styles.logList}>
            {log.length === 0 ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("sadaqah.logEmpty")}
              </ThemedText>
            ) : (
              log.slice(0, 20).map((entry) => (
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
                  >
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("common.remove")}
                    </ThemedText>
                  </PressableScale>
                </View>
              ))
            )}
          </View>
        </Card>

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

        <JannahDisclaimer textKey="sadaqah.disclaimer" />
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
