import { useTranslation } from "react-i18next";
import { I18nManager, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ZakatCalculatorState } from "@/hooks/use-zakat-calculator";
import { ZAKAT_ASSET_GROUPS } from "@/hooks/use-zakat-calculator";

type ZakatCalculatorProps = ZakatCalculatorState;

function MoneyField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors } = useThemeTokens();

  return (
    <View style={styles.fieldBlock}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={colors.mutedForeground}
        accessibilityLabel={label}
        style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
      />
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldHint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

function WeightCalculator({
  metal,
  grams,
  setGrams,
  price,
  setPrice,
  computed,
  money,
}: {
  metal: "gold" | "silver";
  grams: string;
  setGrams: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  computed: number;
  money: (n: number) => string;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();

  return (
    <View style={styles.weightBody}>
      <View style={styles.weightRow}>
        <View style={styles.weightField}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(`zakat.weight.${metal}.grams`)}
          </ThemedText>
          <TextInput
            value={grams}
            onChangeText={setGrams}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
        </View>
        <View style={styles.weightField}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(`zakat.weight.${metal}.pricePerGram`)}
          </ThemedText>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
        </View>
      </View>
      {computed > 0 ? (
        <ThemedText type="caption" style={{ color: colors.accent }}>
          {t("zakat.weight.computed", { value: money(computed) })}
        </ThemedText>
      ) : null}
    </View>
  );
}

export function ZakatCalculator(props: ZakatCalculatorProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <>
      <Card padding="three">
        <SectionHeader
          title={t("zakat.assetsTitle")}
          icon={{ ios: "banknote.fill", android: "payments", web: "payments" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
          {t("zakat.assetsHint")}
        </ThemedText>

        {ZAKAT_ASSET_GROUPS.map((group) => (
          <View key={group.id} style={styles.group}>
            <ThemedText type="caption" style={[styles.groupLabel, { color: colors.accent }]}>
              {t(`zakat.group.${group.id}`)}
            </ThemedText>
            <View style={styles.groupFields}>
              {group.fieldKeys.map((key) => (
                <MoneyField
                  key={key}
                  label={t(`zakat.field.${key}`)}
                  hint={t(`zakat.fieldHint.${key}`)}
                  value={props.values[key] ?? ""}
                  onChange={(v) => props.setField(key, v)}
                />
              ))}
            </View>
          </View>
        ))}

        <CollapsibleSection
          title={t("zakat.weightSectionTitle")}
          icon={{ ios: "scalemass", android: "scale", web: "scale" }}
        >
          <WeightCalculator
            metal="gold"
            grams={props.goldGrams}
            setGrams={props.setGoldGrams}
            price={props.goldPrice}
            setPrice={props.setGoldPrice}
            computed={props.goldFromWeight}
            money={props.money}
          />
          <WeightCalculator
            metal="silver"
            grams={props.silverGrams}
            setGrams={props.setSilverGrams}
            price={props.silverPrice}
            setPrice={props.setSilverPrice}
            computed={props.silverFromWeight}
            money={props.money}
          />
        </CollapsibleSection>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("zakat.deductionsTitle")}
          icon={{ ios: "minus.circle.fill", android: "remove_circle", web: "remove_circle" }}
        />
        <View style={styles.groupFields}>
          <MoneyField
            label={t("zakat.field.debts")}
            hint={t("zakat.fieldHint.debts")}
            value={props.values.debts ?? ""}
            onChange={(v) => props.setField("debts", v)}
          />
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("zakat.nisabTitle")}
          icon={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
          {t("zakat.nisabHint")}
        </ThemedText>

        <View style={styles.groupFields}>
          <MoneyField
            label={t("zakat.field.nisabGoldPrice")}
            value={props.nisabGoldPrice}
            onChange={props.setNisabGoldPrice}
          />
          <MoneyField
            label={t("zakat.field.nisabSilverPrice")}
            value={props.nisabSilverPrice}
            onChange={props.setNisabSilverPrice}
          />
        </View>

        {props.goldNisab > 0 || props.silverNisab > 0 ? (
          <View style={[styles.nisabSummary, { borderTopColor: tokens.hairline }]}>
            {props.goldNisab > 0 ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("zakat.nisabGoldValue", { value: props.money(props.goldNisab) })}
              </ThemedText>
            ) : null}
            {props.silverNisab > 0 ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("zakat.nisabSilverValue", { value: props.money(props.silverNisab) })}
              </ThemedText>
            ) : null}
            {props.suggestedNisab > 0 && !props.nisabManual ? (
              <ThemedText type="smallBold" style={{ color: colors.accent }}>
                {t("zakat.nisabUsingLower", { value: props.money(props.suggestedNisab) })}
              </ThemedText>
            ) : null}
          </View>
        ) : null}

        <CollapsibleSection
          title={t("zakat.nisabOverrideTitle")}
          icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
        >
          <MoneyField
            label={t("zakat.field.nisab")}
            hint={t("zakat.fieldHint.nisab")}
            value={
              props.nisabManual
                ? props.nisab
                : props.suggestedNisab > 0
                  ? String(props.suggestedNisab)
                  : props.nisab
            }
            onChange={(v) => {
              props.setNisabManual(true);
              props.setNisab(v);
            }}
          />
        </CollapsibleSection>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  sectionHint: { marginTop: Spacing.two, lineHeight: 20 },
  group: { marginTop: Spacing.three, gap: Spacing.two },
  groupLabel: { fontWeight: "600", letterSpacing: 0.3, textTransform: "uppercase" },
  groupFields: { gap: Spacing.three },
  fieldBlock: { gap: Spacing.one + 2 },
  fieldHint: { lineHeight: 18 },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    fontSize: 16,
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  weightBody: { gap: Spacing.three, marginTop: Spacing.two },
  weightRow: { flexDirection: "row", gap: Spacing.two },
  weightField: { flex: 1, gap: Spacing.one },
  nisabSummary: {
    gap: Spacing.one,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
