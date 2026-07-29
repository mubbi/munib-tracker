import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, I18nManager, StyleSheet, TextInput, View } from "react-native";

import { CurrencyGlyph } from "@/components/money/currency-glyph";
import { MoneyText } from "@/components/money/money-text";
import { ThemedText } from "@/components/themed-text";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { NumberFormatPickerSheet } from "@/components/zakat/number-format-picker-sheet";
import { ZakatFormSection } from "@/components/zakat/zakat-form-section";
import { ZakatSectionInfoSheet } from "@/components/zakat/zakat-section-info-sheet";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { ZakatCalculatorState } from "@/hooks/use-zakat-calculator";
import { ZAKAT_ASSET_GROUPS } from "@/hooks/use-zakat-calculator";
import {
  formatNumberForInput,
  formatNumberInput,
  NUMBER_FORMAT_OPTIONS,
  type NumberFormatStyle,
  parseNumberInput,
} from "@/lib/format-currency";
import {
  GOLD_KARATS,
  type GoldKarat,
  goldPureGrams,
  METAL_WEIGHT_UNITS,
  type MetalWeightUnit,
  SILVER_PURITIES,
  type SilverPurity,
  silverFineGrams,
} from "@/lib/zakat";
import type { ZakatCalcSectionId } from "@/lib/zakat-section-info";

type ZakatCalculatorProps = ZakatCalculatorState & {
  currencyPickerOpen?: boolean;
  onCurrencyPickerOpenChange?: (open: boolean) => void;
  numberFormatPickerOpen?: boolean;
  onNumberFormatPickerOpenChange?: (open: boolean) => void;
};

const FIELD_ICONS: Record<string, SymbolViewProps["name"]> = {
  cash: { ios: "banknote.fill", android: "payments", web: "payments" },
  gold: { ios: "circle.fill", android: "circle", web: "circle" },
  silver: { ios: "circle.fill", android: "circle", web: "circle" },
  stocks: { ios: "chart.line.uptrend.xyaxis", android: "show_chart", web: "show_chart" },
  business: { ios: "storefront.fill", android: "storefront", web: "storefront" },
  receivables: { ios: "arrow.down.left", android: "south_west", web: "south_west" },
  rentalIncome: { ios: "house.fill", android: "home", web: "home" },
  otherAssets: { ios: "shippingbox.fill", android: "inventory_2", web: "inventory_2" },
  crypto: { ios: "bitcoinsign.circle.fill", android: "currency_bitcoin", web: "currency_bitcoin" },
  investmentPlots: { ios: "map.fill", android: "map", web: "map" },
  installmentPlotsPaid: { ios: "calendar", android: "calendar_month", web: "calendar_month" },
  investmentProperty: { ios: "building.2.fill", android: "apartment", web: "apartment" },
  tradeVehicles: { ios: "car.fill", android: "directions_car", web: "directions_car" },
  debts: { ios: "creditcard.fill", android: "credit_card", web: "credit_card" },
  livingExpenses: { ios: "cart.fill", android: "shopping_cart", web: "shopping_cart" },
  nisab: { ios: "slider.horizontal.3", android: "tune", web: "tune" },
  nisabGoldPrice: { ios: "circle.fill", android: "circle", web: "circle" },
  nisabSilverPrice: { ios: "circle.fill", android: "circle", web: "circle" },
};

const FIELD_ICON_TINT: Record<string, string | undefined> = {
  gold: "#D4A017",
  silver: "#A8B0B8",
  nisabGoldPrice: "#D4A017",
  nisabSilverPrice: "#A8B0B8",
};

const GROUP_ICONS = {
  liquid: { ios: "banknote.fill", android: "payments", web: "payments" },
  investments: { ios: "chart.line.uptrend.xyaxis", android: "show_chart", web: "show_chart" },
  property: { ios: "building.2.fill", android: "apartment", web: "apartment" },
} as const;

function ChipSelect<T extends string | number>({
  options,
  value,
  onChange,
  labelFor,
}: {
  options: readonly T[];
  value: T;
  onChange: (next: T) => void;
  labelFor: (option: T) => string;
}) {
  const { colors, tokens } = useThemeTokens();

  return (
    <View style={styles.chipRow}>
      {options.map((option) => {
        const selected = option === value;
        return (
          <PressableScale
            key={String(option)}
            haptic="selection"
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(option)}
            style={[
              styles.chip,
              {
                backgroundColor: selected ? tokens.accentSoft : colors.muted,
                borderColor: selected ? withAlpha(colors.accent, 0.35) : "transparent",
              },
            ]}
          >
            <ThemedText
              type="caption"
              style={{
                color: selected ? colors.accent : colors.mutedForeground,
                fontWeight: "700",
              }}
            >
              {labelFor(option)}
            </ThemedText>
          </PressableScale>
        );
      })}
    </View>
  );
}

function MoneyField({
  label,
  hint,
  value,
  onChange,
  currencySymbol,
  currencyGlyph,
  icon,
  iconTint,
  maxFractionDigits = 2,
  numberFormat,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  currencySymbol?: string;
  currencyGlyph?: "AED" | "SAR";
  icon?: SymbolViewProps["name"];
  iconTint?: string;
  maxFractionDigits?: number;
  numberFormat: NumberFormatStyle;
}) {
  const { colors } = useThemeTokens();
  const tint = iconTint ?? colors.accent;

  return (
    <View style={styles.fieldBlock}>
      <View style={styles.fieldLabelRow}>
        {icon ? <SymbolView name={icon} size={14} tintColor={tint} /> : null}
        <ThemedText type="smallBold" style={styles.fieldLabel}>
          {label}
        </ThemedText>
      </View>
      <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
        {currencyGlyph ? (
          <CurrencyGlyph glyph={currencyGlyph} size={16} color={colors.mutedForeground} />
        ) : currencySymbol ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.affix}>
            {currencySymbol}
          </ThemedText>
        ) : null}
        <TextInput
          value={value}
          onChangeText={(text) =>
            onChange(formatNumberInput(text, maxFractionDigits, numberFormat))
          }
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={label}
          style={[styles.input, { color: colors.foreground }]}
        />
      </View>
      {hint ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldHint}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}

function CountField({
  label,
  hint,
  value,
  onChange,
  numberFormat,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  numberFormat: NumberFormatStyle;
}) {
  const { colors } = useThemeTokens();
  return (
    <View style={styles.fieldBlock}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={[styles.inputRow, { backgroundColor: colors.muted }]}>
        <TextInput
          value={value}
          onChangeText={(text) => onChange(formatNumberInput(text, 0, numberFormat))}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.mutedForeground}
          accessibilityLabel={label}
          style={[styles.input, { color: colors.foreground }]}
        />
      </View>
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
  weight,
  setWeight,
  unit,
  setUnit,
  goldKarat,
  setGoldKarat,
  silverPurity,
  setSilverPurity,
  price,
  setPrice,
  computed,
  money,
  livePrefill,
  numberFormat,
}: {
  metal: "gold" | "silver";
  weight: string;
  setWeight: (v: string) => void;
  unit: MetalWeightUnit;
  setUnit: (v: MetalWeightUnit) => void;
  goldKarat?: GoldKarat;
  setGoldKarat?: (v: GoldKarat) => void;
  silverPurity?: SilverPurity;
  setSilverPurity?: (v: SilverPurity) => void;
  price: string;
  setPrice: (v: string) => void;
  computed: number;
  money: (n: number) => string;
  livePrefill: boolean;
  numberFormat: NumberFormatStyle;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tint = metal === "gold" ? "#D4A017" : "#A8B0B8";
  const weightNum = parseNumberInput(weight, numberFormat);
  const pureGrams =
    metal === "gold" && goldKarat
      ? goldPureGrams(weightNum, unit, goldKarat)
      : metal === "silver" && silverPurity
        ? silverFineGrams(weightNum, unit, silverPurity)
        : 0;

  return (
    <View style={styles.weightBody}>
      <View style={styles.weightHeader}>
        <View style={styles.fieldLabelRow}>
          <SymbolView
            name={{ ios: "circle.fill", android: "circle", web: "circle" }}
            size={12}
            tintColor={tint}
          />
          <ThemedText type="smallBold">{t(`zakat.weight.${metal}.titleShort`)}</ThemedText>
        </View>
        {livePrefill ? (
          <View style={[styles.livePill, { backgroundColor: withAlpha(colors.accent, 0.12) }]}>
            <ThemedText type="caption" style={{ color: colors.accent }}>
              {t("zakat.market.livePrice")}
            </ThemedText>
          </View>
        ) : null}
      </View>

      <ThemedText type="caption" themeColor="mutedForeground">
        {t("zakat.weight.unit")}
      </ThemedText>
      <ChipSelect
        options={METAL_WEIGHT_UNITS}
        value={unit}
        onChange={setUnit}
        labelFor={(u) => t(`zakat.weight.units.${u}`)}
      />

      {metal === "gold" && goldKarat != null && setGoldKarat ? (
        <>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("zakat.weight.karat")}
          </ThemedText>
          <ChipSelect
            options={GOLD_KARATS}
            value={goldKarat}
            onChange={setGoldKarat}
            labelFor={(k) => t("zakat.weight.karatLabel", { karat: k })}
          />
        </>
      ) : null}

      {metal === "silver" && silverPurity != null && setSilverPurity ? (
        <>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("zakat.weight.purity")}
          </ThemedText>
          <ChipSelect
            options={SILVER_PURITIES}
            value={silverPurity}
            onChange={setSilverPurity}
            labelFor={(p) => t("zakat.weight.purityLabel", { purity: p })}
          />
        </>
      ) : null}

      <View style={styles.weightRow}>
        <View style={styles.weightField}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t(`zakat.weight.${metal}.amount`)}
          </ThemedText>
          <TextInput
            value={weight}
            onChangeText={(text) => setWeight(formatNumberInput(text, 4, numberFormat))}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.bareInput, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
        </View>
        <View style={styles.weightField}>
          <ThemedText type="caption" themeColor="mutedForeground">
            {metal === "gold"
              ? t("zakat.weight.gold.pricePerGram24k")
              : t("zakat.weight.silver.pricePerGramFine")}
          </ThemedText>
          <TextInput
            value={price}
            onChangeText={(text) => setPrice(formatNumberInput(text, 4, numberFormat))}
            keyboardType="decimal-pad"
            placeholder="0"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.bareInput, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
        </View>
      </View>

      {pureGrams > 0 ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("zakat.weight.pureGrams", { grams: pureGrams.toFixed(3) })}
        </ThemedText>
      ) : null}
      {computed > 0 ? (
        <MoneyText style={[styles.computed, { color: colors.accent }]}>
          {t("zakat.weight.computed", { value: money(computed) })}
        </MoneyText>
      ) : null}
    </View>
  );
}

function livestockSummaryLines(
  t: (key: string, opts?: Record<string, unknown>) => string,
  animals: ZakatCalculatorState["result"]["livestockAnimals"],
): string[] {
  const lines: string[] = [];
  if (animals.sheep > 0) lines.push(t("zakat.livestock.due.sheep", { count: animals.sheep }));
  if (animals.cattleTabi > 0)
    lines.push(t("zakat.livestock.due.cattleTabi", { count: animals.cattleTabi }));
  if (animals.cattleMusinnah > 0)
    lines.push(t("zakat.livestock.due.cattleMusinnah", { count: animals.cattleMusinnah }));
  if (animals.camelBintMakhad > 0)
    lines.push(t("zakat.livestock.due.bintMakhad", { count: animals.camelBintMakhad }));
  if (animals.camelBintLabun > 0)
    lines.push(t("zakat.livestock.due.bintLabun", { count: animals.camelBintLabun }));
  if (animals.camelHiqqah > 0)
    lines.push(t("zakat.livestock.due.hiqqah", { count: animals.camelHiqqah }));
  if (animals.camelJadhah > 0)
    lines.push(t("zakat.livestock.due.jadhah", { count: animals.camelJadhah }));
  return lines;
}

export function ZakatCalculator(props: ZakatCalculatorProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const [internalPickerOpen, setInternalPickerOpen] = useState(false);
  const [internalFormatPickerOpen, setInternalFormatPickerOpen] = useState(false);
  const [infoSection, setInfoSection] = useState<ZakatCalcSectionId | null>(null);
  const currencyControlled = props.onCurrencyPickerOpenChange != null;
  const formatControlled = props.onNumberFormatPickerOpenChange != null;
  const pickerOpen = currencyControlled ? Boolean(props.currencyPickerOpen) : internalPickerOpen;
  const setPickerOpen = (open: boolean) => {
    if (currencyControlled) props.onCurrencyPickerOpenChange?.(open);
    else setInternalPickerOpen(open);
  };
  const formatPickerOpen = formatControlled
    ? Boolean(props.numberFormatPickerOpen)
    : internalFormatPickerOpen;
  const setFormatPickerOpen = (open: boolean) => {
    if (formatControlled) props.onNumberFormatPickerOpenChange?.(open);
    else setInternalFormatPickerOpen(open);
  };

  const symbol = props.currency?.symbol;
  const glyph = props.currency?.glyph;
  const marketLoading = props.market.isLoading || props.market.isFetching;
  const marketReady = Boolean(props.market.data);
  const livePrefill = marketReady && !props.pricesManual;
  const numberFormatExample =
    NUMBER_FORMAT_OPTIONS.find((o) => o.id === props.numberFormat)?.example ?? "22,000.03";

  const livestockLines = useMemo(
    () => livestockSummaryLines(t, props.result.livestockAnimals),
    [t, props.result.livestockAnimals],
  );

  const openInfo = (sectionId: ZakatCalcSectionId) => setInfoSection(sectionId);

  return (
    <View style={styles.stack}>
      <ZakatFormSection
        sectionId="currency"
        title={t("zakat.currency.title")}
        icon={{
          ios: "dollarsign.circle.fill",
          android: "currency_exchange",
          web: "currency_exchange",
        }}
        hint={t("zakat.currency.hint")}
        onLearnMore={openInfo}
      >
        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("zakat.currency.changeA11y")}
          onPress={() => setPickerOpen(true)}
          style={[styles.currencyTrigger, { backgroundColor: colors.muted, marginTop: 0 }]}
        >
          <View style={[styles.currencyBadge, { backgroundColor: tokens.accentSoft }]}>
            {glyph ? (
              <CurrencyGlyph glyph={glyph} size={18} color={colors.accent} />
            ) : (
              <ThemedText type="smallBold" style={{ color: colors.accent }}>
                {symbol ?? props.currencyCode}
              </ThemedText>
            )}
          </View>
          <View style={styles.currencyMeta}>
            <ThemedText type="smallBold">{props.currencyCode}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {props.currency?.name ?? props.currencyCode}
            </ThemedText>
          </View>
          <SymbolView
            name={{ ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" }}
            size={18}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>

        <PressableScale
          haptic="light"
          accessibilityRole="button"
          accessibilityLabel={t("zakat.numberFormat.changeA11y")}
          onPress={() => setFormatPickerOpen(true)}
          style={[styles.currencyTrigger, { backgroundColor: colors.muted, marginTop: 0 }]}
        >
          <View style={[styles.currencyBadge, { backgroundColor: tokens.accentSoft }]}>
            <SymbolView
              name={{ ios: "textformat.123", android: "dialpad", web: "dialpad" }}
              size={18}
              tintColor={colors.accent}
            />
          </View>
          <View style={styles.currencyMeta}>
            <ThemedText type="smallBold">{t("zakat.numberFormat.title")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
              {numberFormatExample}
            </ThemedText>
          </View>
          <SymbolView
            name={{ ios: "chevron.up.chevron.down", android: "unfold_more", web: "unfold_more" }}
            size={18}
            tintColor={colors.mutedForeground}
          />
        </PressableScale>

        <View
          style={[
            styles.marketCard,
            { borderColor: tokens.hairline, backgroundColor: colors.muted, marginTop: 0 },
          ]}
        >
          <View style={styles.marketTop}>
            <View style={styles.fieldLabelRow}>
              <SymbolView
                name={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
                size={14}
                tintColor={colors.accent}
              />
              <ThemedText type="smallBold">{t("zakat.market.title")}</ThemedText>
            </View>
            <PressableScale
              haptic="selection"
              accessibilityRole="button"
              accessibilityLabel={t("zakat.market.refreshA11y")}
              onPress={props.applyLivePrices}
              disabled={marketLoading}
              style={styles.refreshBtn}
            >
              {marketLoading ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <SymbolView
                  name={{ ios: "arrow.clockwise", android: "refresh", web: "refresh" }}
                  size={16}
                  tintColor={colors.accent}
                />
              )}
            </PressableScale>
          </View>

          {marketReady ? (
            <>
              <View style={styles.marketRow}>
                <View style={styles.fieldLabelRow}>
                  <SymbolView
                    name={{ ios: "circle.fill", android: "circle", web: "circle" }}
                    size={10}
                    tintColor="#D4A017"
                  />
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("zakat.market.goldPerGram")}
                  </ThemedText>
                </View>
                <MoneyText style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>
                  {props.money(props.market.data?.goldPerGram ?? 0)}
                </MoneyText>
              </View>
              <View style={styles.marketRow}>
                <View style={styles.fieldLabelRow}>
                  <SymbolView
                    name={{ ios: "circle.fill", android: "circle", web: "circle" }}
                    size={10}
                    tintColor="#A8B0B8"
                  />
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("zakat.market.silverPerGram")}
                  </ThemedText>
                </View>
                <MoneyText style={{ color: colors.foreground, fontSize: 13, fontWeight: "600" }}>
                  {props.money(props.market.data?.silverPerGram ?? 0)}
                </MoneyText>
              </View>
              <ThemedText type="caption" themeColor="mutedForeground" style={styles.marketSource}>
                {t("zakat.market.source", {
                  source: props.market.data?.metals.attribution ?? "",
                  date: props.market.data?.fxDate ?? "",
                })}
              </ThemedText>
              {props.pricesManual ? (
                <PressableScale
                  haptic="selection"
                  onPress={props.applyLivePrices}
                  accessibilityRole="button"
                  accessibilityLabel={t("zakat.market.useLiveA11y")}
                  style={[styles.useLiveBtn, { backgroundColor: tokens.accentSoft }]}
                >
                  <ThemedText type="caption" style={{ color: colors.accent, fontWeight: "600" }}>
                    {t("zakat.market.useLive")}
                  </ThemedText>
                </PressableScale>
              ) : (
                <ThemedText type="caption" style={{ color: colors.accent }}>
                  {t("zakat.market.prefilled")}
                </ThemedText>
              )}
            </>
          ) : props.market.isError ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.market.error")}
            </ThemedText>
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("zakat.market.loading")}
            </ThemedText>
          )}
        </View>
      </ZakatFormSection>

      {ZAKAT_ASSET_GROUPS.map((group) => (
        <ZakatFormSection
          key={group.id}
          sectionId={group.id}
          title={t(`zakat.group.${group.id}`)}
          icon={GROUP_ICONS[group.id]}
          hint={t(`zakat.groupHint.${group.id}`)}
          onLearnMore={openInfo}
        >
          {group.fieldKeys.map((key) => (
            <MoneyField
              key={key}
              label={t(`zakat.field.${key}`)}
              hint={t(`zakat.fieldHint.${key}`)}
              value={props.values[key] ?? ""}
              onChange={(v) => props.setField(key, v)}
              currencySymbol={symbol}
              currencyGlyph={glyph}
              icon={FIELD_ICONS[key]}
              iconTint={FIELD_ICON_TINT[key]}
              numberFormat={props.numberFormat}
            />
          ))}
        </ZakatFormSection>
      ))}

      <ZakatFormSection
        sectionId="metals"
        title={t("zakat.weightSectionTitle")}
        icon={{ ios: "scalemass", android: "scale", web: "scale" }}
        hint={t("zakat.weight.cardHint")}
        onLearnMore={openInfo}
      >
        <WeightCalculator
          metal="gold"
          weight={props.goldWeight}
          setWeight={props.setGoldWeight}
          unit={props.goldUnit}
          setUnit={props.setGoldUnit}
          goldKarat={props.goldKarat}
          setGoldKarat={props.setGoldKarat}
          price={props.goldPrice}
          setPrice={props.setGoldPrice}
          computed={props.goldFromWeight}
          money={props.money}
          livePrefill={livePrefill}
          numberFormat={props.numberFormat}
        />
        <WeightCalculator
          metal="silver"
          weight={props.silverWeight}
          setWeight={props.setSilverWeight}
          unit={props.silverUnit}
          setUnit={props.setSilverUnit}
          silverPurity={props.silverPurity}
          setSilverPurity={props.setSilverPurity}
          price={props.silverPrice}
          setPrice={props.setSilverPrice}
          computed={props.silverFromWeight}
          money={props.money}
          livePrefill={livePrefill}
          numberFormat={props.numberFormat}
        />
      </ZakatFormSection>

      <ZakatFormSection
        sectionId="livestock"
        title={t("zakat.livestock.title")}
        icon={{ ios: "pawprint.fill", android: "pets", web: "pets" }}
        hint={t("zakat.livestock.cardHint")}
        onLearnMore={openInfo}
        footer={
          livestockLines.length > 0 ? (
            <View style={[styles.nisabSummary, { borderTopColor: tokens.hairline }]}>
              <ThemedText type="smallBold">{t("zakat.livestock.dueTitle")}</ThemedText>
              {livestockLines.map((line) => (
                <ThemedText key={line} type="caption" themeColor="mutedForeground">
                  {line}
                </ThemedText>
              ))}
              {props.result.livestockCashEstimate > 0 ? (
                <MoneyText style={{ color: colors.accent, fontSize: 13, fontWeight: "700" }}>
                  {t("zakat.livestock.cashEstimate", {
                    value: props.money(props.result.livestockCashEstimate),
                  })}
                </MoneyText>
              ) : null}
            </View>
          ) : null
        }
      >
        <CountField
          label={t("zakat.livestock.sheep")}
          hint={t("zakat.livestock.sheepHint")}
          value={props.sheepCount}
          onChange={props.setSheepCount}
          numberFormat={props.numberFormat}
        />
        <CountField
          label={t("zakat.livestock.cattle")}
          hint={t("zakat.livestock.cattleHint")}
          value={props.cattleCount}
          onChange={props.setCattleCount}
          numberFormat={props.numberFormat}
        />
        <CountField
          label={t("zakat.livestock.camels")}
          hint={t("zakat.livestock.camelsHint")}
          value={props.camelCount}
          onChange={props.setCamelCount}
          numberFormat={props.numberFormat}
        />

        <CollapsibleSection
          title={t("zakat.livestock.valueTitle")}
          icon={{ ios: "dollarsign.circle", android: "payments", web: "payments" }}
        >
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.sectionHint}>
            {t("zakat.livestock.valueHint")}
          </ThemedText>
          <View style={styles.groupFields}>
            <MoneyField
              label={t("zakat.livestock.sheepValue")}
              value={props.sheepValue}
              onChange={props.setSheepValue}
              currencySymbol={symbol}
              currencyGlyph={glyph}
              numberFormat={props.numberFormat}
            />
            <MoneyField
              label={t("zakat.livestock.cattleValue")}
              value={props.cattleValue}
              onChange={props.setCattleValue}
              currencySymbol={symbol}
              currencyGlyph={glyph}
              numberFormat={props.numberFormat}
            />
            <MoneyField
              label={t("zakat.livestock.camelValue")}
              value={props.camelValue}
              onChange={props.setCamelValue}
              currencySymbol={symbol}
              currencyGlyph={glyph}
              numberFormat={props.numberFormat}
            />
          </View>
        </CollapsibleSection>
      </ZakatFormSection>

      <ZakatFormSection
        sectionId="agriculture"
        title={t("zakat.agriculture.title")}
        icon={{ ios: "leaf.fill", android: "eco", web: "eco" }}
        hint={t("zakat.agriculture.cardHint")}
        onLearnMore={openInfo}
        footer={
          props.result.agricultureDue > 0 ? (
            <MoneyText style={[styles.computed, { color: colors.accent, marginTop: Spacing.two }]}>
              {t("zakat.agriculture.due", { value: props.money(props.result.agricultureDue) })}
            </MoneyText>
          ) : null
        }
      >
        <MoneyField
          label={t("zakat.agriculture.harvest")}
          hint={t("zakat.agriculture.harvestHint")}
          value={props.harvestValue}
          onChange={props.setHarvestValue}
          currencySymbol={symbol}
          currencyGlyph={glyph}
          icon={{ ios: "leaf.fill", android: "eco", web: "eco" }}
          numberFormat={props.numberFormat}
        />
        <View style={styles.irrigationBlock}>
          <ThemedText type="smallBold">{t("zakat.agriculture.irrigation")}</ThemedText>
          <SegmentedControl
            options={[
              { id: "natural", label: t("zakat.agriculture.natural") },
              { id: "irrigated", label: t("zakat.agriculture.irrigated") },
            ]}
            value={props.irrigation}
            onChange={props.setIrrigation}
          />
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.fieldHint}>
            {props.irrigation === "irrigated"
              ? t("zakat.agriculture.irrigatedHint")
              : t("zakat.agriculture.naturalHint")}
          </ThemedText>
        </View>
      </ZakatFormSection>

      <ZakatFormSection
        sectionId="deductions"
        title={t("zakat.deductionsTitle")}
        icon={{ ios: "minus.circle.fill", android: "remove_circle", web: "remove_circle" }}
        hint={t("zakat.deductionsCardHint")}
        onLearnMore={openInfo}
      >
        <MoneyField
          label={t("zakat.field.debts")}
          hint={t("zakat.fieldHint.debts")}
          value={props.values.debts ?? ""}
          onChange={(v) => props.setField("debts", v)}
          currencySymbol={symbol}
          currencyGlyph={glyph}
          icon={FIELD_ICONS.debts}
          numberFormat={props.numberFormat}
        />
        <MoneyField
          label={t("zakat.field.livingExpenses")}
          hint={t("zakat.fieldHint.livingExpenses")}
          value={props.values.livingExpenses ?? ""}
          onChange={(v) => props.setField("livingExpenses", v)}
          currencySymbol={symbol}
          currencyGlyph={glyph}
          icon={FIELD_ICONS.livingExpenses}
          numberFormat={props.numberFormat}
        />
      </ZakatFormSection>

      <ZakatFormSection
        sectionId="nisab"
        title={t("zakat.nisabTitle")}
        icon={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
        hint={livePrefill ? t("zakat.nisabHintLive") : t("zakat.nisabHint")}
        onLearnMore={openInfo}
      >
        <MoneyField
          label={t("zakat.field.nisabGoldPrice")}
          value={props.nisabGoldPrice}
          onChange={props.setNisabGoldPrice}
          currencySymbol={symbol}
          currencyGlyph={glyph}
          icon={FIELD_ICONS.nisabGoldPrice}
          iconTint={FIELD_ICON_TINT.nisabGoldPrice}
          maxFractionDigits={4}
          numberFormat={props.numberFormat}
        />
        <MoneyField
          label={t("zakat.field.nisabSilverPrice")}
          value={props.nisabSilverPrice}
          onChange={props.setNisabSilverPrice}
          currencySymbol={symbol}
          currencyGlyph={glyph}
          icon={FIELD_ICONS.nisabSilverPrice}
          iconTint={FIELD_ICON_TINT.nisabSilverPrice}
          maxFractionDigits={4}
          numberFormat={props.numberFormat}
        />

        {props.goldNisab > 0 || props.silverNisab > 0 ? (
          <View style={[styles.nisabSummary, { borderTopColor: tokens.hairline, marginTop: 0 }]}>
            {props.goldNisab > 0 ? (
              <MoneyText style={{ color: colors.mutedForeground, fontSize: 12 }}>
                {t("zakat.nisabGoldValue", { value: props.money(props.goldNisab) })}
              </MoneyText>
            ) : null}
            {props.silverNisab > 0 ? (
              <MoneyText style={{ color: colors.mutedForeground, fontSize: 12 }}>
                {t("zakat.nisabSilverValue", { value: props.money(props.silverNisab) })}
              </MoneyText>
            ) : null}
            {props.suggestedNisab > 0 && !props.nisabManual ? (
              <MoneyText style={{ color: colors.accent, fontSize: 13, fontWeight: "700" }}>
                {t("zakat.nisabUsingLower", { value: props.money(props.suggestedNisab) })}
              </MoneyText>
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
                  ? formatNumberForInput(props.suggestedNisab, 2, props.numberFormat)
                  : props.nisab
            }
            onChange={(v) => {
              props.setNisabManual(true);
              props.setNisab(v);
            }}
            currencySymbol={symbol}
            currencyGlyph={glyph}
            icon={FIELD_ICONS.nisab}
            numberFormat={props.numberFormat}
          />
        </CollapsibleSection>
      </ZakatFormSection>

      <CurrencyPickerSheet
        visible={pickerOpen}
        selectedCode={props.currencyCode}
        onSelect={props.setCurrencyCode}
        onClose={() => setPickerOpen(false)}
      />
      <NumberFormatPickerSheet
        visible={formatPickerOpen}
        selected={props.numberFormat}
        currencySymbol={symbol}
        currencyGlyph={glyph}
        onSelect={props.setNumberFormat}
        onClose={() => setFormatPickerOpen(false)}
      />
      <ZakatSectionInfoSheet
        sectionId={infoSection}
        visible={infoSection != null}
        onClose={() => setInfoSection(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { width: "100%", gap: Spacing.four },
  sectionHint: { marginTop: Spacing.two, lineHeight: 20 },
  group: { marginTop: Spacing.three, gap: Spacing.two },
  groupLabel: { fontWeight: "600", letterSpacing: 0.3, textTransform: "uppercase" },
  groupFields: { gap: Spacing.three },
  fieldBlock: { gap: Spacing.one + 2 },
  fieldLabelRow: { flexDirection: "row", alignItems: "center", gap: Spacing.one + 2 },
  fieldLabel: { flex: 1 },
  fieldHint: { lineHeight: 18 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  affix: { fontWeight: "600" },
  input: {
    flex: 1,
    paddingVertical: Spacing.two + 2,
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  bareInput: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    fontSize: 16,
    fontVariant: ["tabular-nums"],
    textAlign: I18nManager.isRTL ? "left" : "right",
  },
  weightBody: { gap: Spacing.two },
  weightHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  livePill: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  weightRow: { flexDirection: "row", gap: Spacing.two },
  weightField: { flex: 1, gap: Spacing.one },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.one + 2 },
  chip: {
    paddingHorizontal: Spacing.two + 2,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  computed: { fontSize: 12, fontWeight: "600" },
  irrigationBlock: { gap: Spacing.two },
  nisabSummary: {
    gap: Spacing.one,
    marginTop: Spacing.three,
    paddingTop: Spacing.three,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  currencyTrigger: {
    marginTop: Spacing.three,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  currencyBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  currencyMeta: { flex: 1, gap: 2, minWidth: 0 },
  marketCard: {
    marginTop: Spacing.three,
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  marketTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  refreshBtn: { padding: Spacing.one },
  marketRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  marketSource: { lineHeight: 16 },
  useLiveBtn: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
});
