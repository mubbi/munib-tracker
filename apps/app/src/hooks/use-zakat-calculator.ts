import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  computeZakat,
  lowerNisab,
  metalValue,
  nisabFromGoldPrice,
  nisabFromSilverPrice,
  type ZakatAssets,
} from "@/lib/zakat";

type AssetFieldKey = keyof ZakatAssets;

const ASSET_FIELDS: AssetFieldKey[] = [
  "cash",
  "gold",
  "silver",
  "stocks",
  "business",
  "receivables",
  "rentalIncome",
  "otherAssets",
];

const DEDUCTION_FIELDS: AssetFieldKey[] = ["debts"];

export const ZAKAT_ASSET_GROUPS = [
  { id: "liquid", fieldKeys: ["cash", "gold", "silver"] as AssetFieldKey[] },
  {
    id: "investments",
    fieldKeys: [
      "stocks",
      "business",
      "receivables",
      "rentalIncome",
      "otherAssets",
    ] as AssetFieldKey[],
  },
] as const;

function num(v: string): number {
  const n = Number.parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
}

export function useZakatCalculator() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.split("-")[0];

  const [values, setValues] = useState<Record<string, string>>({});
  const [nisab, setNisab] = useState("");
  const [nisabManual, setNisabManual] = useState(false);
  const [goldGrams, setGoldGrams] = useState("");
  const [goldPrice, setGoldPrice] = useState("");
  const [silverGrams, setSilverGrams] = useState("");
  const [silverPrice, setSilverPrice] = useState("");
  const [nisabGoldPrice, setNisabGoldPrice] = useState("");
  const [nisabSilverPrice, setNisabSilverPrice] = useState("");

  const goldFromWeight = useMemo(
    () => metalValue(num(goldGrams), num(goldPrice)),
    [goldGrams, goldPrice],
  );
  const silverFromWeight = useMemo(
    () => metalValue(num(silverGrams), num(silverPrice)),
    [silverGrams, silverPrice],
  );

  const goldNisab = useMemo(() => nisabFromGoldPrice(num(nisabGoldPrice)), [nisabGoldPrice]);
  const silverNisab = useMemo(
    () => nisabFromSilverPrice(num(nisabSilverPrice)),
    [nisabSilverPrice],
  );
  const suggestedNisab = useMemo(
    () => lowerNisab(goldNisab, silverNisab),
    [goldNisab, silverNisab],
  );

  const effectiveNisab = nisabManual
    ? num(nisab)
    : suggestedNisab > 0
      ? suggestedNisab
      : num(nisab);

  const result = useMemo(() => {
    const assets: ZakatAssets = {};
    for (const field of [...ASSET_FIELDS, ...DEDUCTION_FIELDS]) {
      assets[field] = num(values[field] ?? "");
    }
    assets.gold = num(values.gold ?? "") + goldFromWeight;
    assets.silver = num(values.silver ?? "") + silverFromWeight;
    return computeZakat(assets, effectiveNisab);
  }, [values, effectiveNisab, goldFromWeight, silverFromWeight]);

  const money = (n: number) => n.toLocaleString(locale, { maximumFractionDigits: 2 });

  const setField = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const hasInput = useMemo(() => {
    const hasValues = Object.values(values).some((v) => num(v) > 0);
    const hasWeights = goldFromWeight > 0 || silverFromWeight > 0;
    const hasNisab = effectiveNisab > 0;
    return hasValues || hasWeights || hasNisab;
  }, [values, goldFromWeight, silverFromWeight, effectiveNisab]);

  return {
    values,
    setField,
    nisab,
    setNisab,
    nisabManual,
    setNisabManual,
    goldGrams,
    setGoldGrams,
    goldPrice,
    setGoldPrice,
    silverGrams,
    setSilverGrams,
    silverPrice,
    setSilverPrice,
    nisabGoldPrice,
    setNisabGoldPrice,
    nisabSilverPrice,
    setNisabSilverPrice,
    goldFromWeight,
    silverFromWeight,
    goldNisab,
    silverNisab,
    suggestedNisab,
    effectiveNisab,
    result,
    money,
    hasInput,
  };
}

export type ZakatCalculatorState = ReturnType<typeof useZakatCalculator>;
