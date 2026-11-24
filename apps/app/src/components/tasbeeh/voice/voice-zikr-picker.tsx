import type { ZikrItem } from "@munib-tracker/shared/types";
import { SymbolView } from "expo-symbols";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SearchField } from "@/components/ui/search-field";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { createCustomTasbeehSearch, createZikrSearch } from "@/lib/search";
import { PHRASE_KEYS, VOICE_PHRASES } from "@/lib/tasbeeh-voice/phrases";
import {
  SOMETHING_ELSE,
  type VoiceZikr,
  voiceZikrFromCustom,
  voiceZikrFromZikr,
} from "@/lib/tasbeeh-voice/voice-zikr";
import { ensureZikrCorpus } from "@/lib/zikr";
import {
  type CustomTasbeeh,
  useCustomTasbeehList,
  useEnsureCustomTasbeehLoaded,
} from "@/stores/custom-tasbeeh-store";
import { useTaughtZikrKeys } from "@/stores/tasbeeh-voice-templates-store";

const CHECK_ICON = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
} as const;
/** Common adhkar offered before searching: the dataset entries of the catalog phrases. */
const SUGGESTED_ZIKR_IDS = [...new Set(PHRASE_KEYS.map((key) => VOICE_PHRASES[key].display.id))];
const SEARCH_LIMIT = 12;
const CUSTOM_LIMIT = 6;

type Option = { id: string; zikr: VoiceZikr; arabic: string | null; taught: boolean };

type Props = {
  selected: VoiceZikr | null;
  onSelect: (zikr: VoiceZikr) => void;
};

/**
 * "Which zikr are you saying?" for the free counter (NF-3.20, D49): a search
 * over the whole adhkar library plus the user's custom tasbeehs, with taught
 * zikr first, then the user's tasbeehs and common adhkar, and "Something else".
 * A vertical list (wraps on every width; hover tint on web via PressableScale).
 * Arabic shown here is the dataset text, never typed.
 */
export function VoiceZikrPicker({ selected, onSelect }: Props) {
  const { t } = useTranslation();
  useEnsureCustomTasbeehLoaded();
  const custom = useCustomTasbeehList();
  const taughtKeys = useTaughtZikrKeys();
  const [zikrItems, setZikrItems] = useState<ZikrItem[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let alive = true;
    void ensureZikrCorpus().then((items) => {
      if (alive) setZikrItems(items);
    });
    return () => {
      alive = false;
    };
  }, []);

  const zikrIndex = useMemo(() => createZikrSearch(zikrItems), [zikrItems]);
  const customIndex = useMemo(() => createCustomTasbeehSearch(custom), [custom]);
  const byId = useMemo(() => new Map(zikrItems.map((item) => [item.id, item])), [zikrItems]);
  const taught = useMemo(() => new Set(taughtKeys), [taughtKeys]);

  const options = useMemo(() => {
    const fromZikr = (item: ZikrItem): Option => {
      const zikr = voiceZikrFromZikr(item);
      return {
        id: zikr.key ?? item.id,
        zikr,
        arabic: item.arabic,
        taught: taught.has(zikr.key ?? ""),
      };
    };
    const fromCustom = (item: CustomTasbeeh): Option => {
      const zikr = voiceZikrFromCustom(item);
      return { id: zikr.key ?? item.id, zikr, arabic: null, taught: taught.has(zikr.key ?? "") };
    };
    const trimmed = query.trim();
    let list: Option[];
    if (trimmed.length >= 2) {
      list = [
        ...customIndex.search(trimmed, CUSTOM_LIMIT).map(fromCustom),
        ...zikrIndex.search(trimmed, SEARCH_LIMIT).map(fromZikr),
      ];
    } else {
      const taughtFirst: Option[] = [];
      for (const key of taughtKeys) {
        const [kind, id] = [key.slice(0, key.indexOf(":")), key.slice(key.indexOf(":") + 1)];
        const item = kind === "zikr" ? byId.get(id) : undefined;
        const own = kind === "custom" ? custom.find((c) => c.id === id) : undefined;
        if (item) taughtFirst.push(fromZikr(item));
        else if (own) taughtFirst.push(fromCustom(own));
      }
      list = [
        ...taughtFirst,
        ...custom.slice(0, CUSTOM_LIMIT).map(fromCustom),
        ...SUGGESTED_ZIKR_IDS.map((id) => byId.get(id))
          .filter((item): item is ZikrItem => item != null)
          .map(fromZikr),
      ];
    }
    // The same zikr appears in several categories (morning and evening): list it once.
    const seen = new Set<string>();
    return list.filter((option) => {
      const keys = [option.id, option.arabic ? `ar:${option.arabic}` : null];
      if (keys.some((k) => k != null && seen.has(k))) return false;
      for (const k of keys) if (k) seen.add(k);
      return true;
    });
  }, [query, customIndex, zikrIndex, taughtKeys, taught, byId, custom]);

  const selectedId = selected ? (selected.key ?? "other") : null;

  return (
    <View style={styles.root}>
      <ThemedText type="smallBold">{t("tasbeehVoice.sheet.choosePhrase")}</ThemedText>
      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={t("tasbeehVoice.picker.search")}
      />
      <View accessibilityRole="radiogroup" style={styles.list}>
        {options.map((option) => (
          <PickerRow
            key={option.id}
            label={option.zikr.label ?? ""}
            arabic={option.arabic}
            taught={option.taught}
            selected={selectedId === option.id}
            onPress={() => onSelect(option.zikr)}
          />
        ))}
        {query.trim().length >= 2 && options.length === 0 ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("tasbeehVoice.picker.noResults")}
          </ThemedText>
        ) : null}
        <PickerRow
          label={t("tasbeehVoice.picker.somethingElse")}
          hint={t("tasbeehVoice.picker.somethingElseHint")}
          arabic={null}
          taught={false}
          selected={selectedId === "other"}
          onPress={() => onSelect(SOMETHING_ELSE)}
        />
      </View>
    </View>
  );
}

function PickerRow({
  label,
  hint,
  arabic,
  taught,
  selected,
  onPress,
}: {
  label: string;
  hint?: string;
  arabic: string | null;
  taught: boolean;
  selected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="radio"
      accessibilityState={{ selected, checked: selected }}
      accessibilityLabel={taught ? `${label}, ${t("tasbeehVoice.picker.taught")}` : label}
      accessibilityHint={hint}
      onPress={onPress}
      style={[
        styles.row,
        {
          backgroundColor: selected ? tokens.accentSoft : colors.muted,
          borderColor: selected ? colors.accent : tokens.hairline,
        },
      ]}
    >
      <View style={styles.rowText}>
        <ThemedText
          type="small"
          numberOfLines={1}
          style={{ color: selected ? colors.accentText : colors.foreground }}
        >
          {label}
        </ThemedText>
        {arabic ? (
          <ThemedText type="caption" numberOfLines={1} style={styles.arabic}>
            {arabic}
          </ThemedText>
        ) : hint ? (
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={2}>
            {hint}
          </ThemedText>
        ) : null}
      </View>
      {taught ? (
        <View style={[styles.badge, { backgroundColor: tokens.status.success.soft }]}>
          <ThemedText type="caption" style={{ color: tokens.status.success.color }}>
            {t("tasbeehVoice.picker.taught")}
          </ThemedText>
        </View>
      ) : null}
      {selected ? <SymbolView name={CHECK_ICON} size={20} tintColor={colors.accent} /> : null}
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: Spacing.two,
  },
  list: {
    gap: Spacing.two,
  },
  row: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  arabic: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  badge: {
    paddingHorizontal: Spacing.two,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
});
