import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { Spacing } from "@/constants/theme";
import { getPlatformCtx } from "@/lib/settings/platform";
import {
  buildSettingsEntries,
  createSettingsIndex,
  type SettingSearchEntry,
} from "@/lib/settings/search";
import { useSetting } from "@/lib/settings/use-setting";

import { SettingsRow, ToggleRow } from "./settings-rows";

const RESULT_LIMIT = 30;

/** Memoised settings index for the current locale (+ English), rebuilt on language change. */
export function useSettingsSearch(query: string): SettingSearchEntry[] {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const active = query.trim().length >= 2;
  // biome-ignore lint/correctness/useExhaustiveDependencies: rebuild per UI language.
  const index = useMemo(() => {
    if (!active) return null;
    return createSettingsIndex(buildSettingsEntries(t, i18n.getFixedT("en"), getPlatformCtx()));
  }, [active, language]);
  return useMemo(() => (index ? index.search(query, RESULT_LIMIT) : []), [index, query]);
}

/**
 * Settings search results (§4.5.6): the setting, its group path and current
 * value. Toggles switch straight from the result; anything else opens its group
 * focused on the row.
 */
export function SettingsSearchResults({
  results,
  onOpen,
}: {
  results: SettingSearchEntry[];
  onOpen: (entry: SettingSearchEntry) => void;
}) {
  const { t } = useTranslation();
  if (results.length === 0) {
    return (
      <EmptyState
        icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
        title={t("settingsPanel.searchEmpty")}
        description={t("settingsPanel.searchEmptySub")}
      />
    );
  }
  return (
    <View style={styles.list} accessibilityRole="list">
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("settingsPanel.searchCount", { count: results.length })}
      </ThemedText>
      {results.map((entry) => (
        <ResultRow key={entry.def.id} entry={entry} onOpen={onOpen} />
      ))}
    </View>
  );
}

const ResultRow = memo(function ResultRow({
  entry,
  onOpen,
}: {
  entry: SettingSearchEntry;
  onOpen: (entry: SettingSearchEntry) => void;
}) {
  const { t } = useTranslation();
  const { value, setValue, def, enabled } = useSetting<unknown>(entry.def.id);
  if (def.control.kind === "toggle") {
    return (
      <ToggleRow
        icon={def.icon}
        title={entry.title}
        subtitle={entry.path}
        value={value === true}
        disabled={!enabled}
        onValueChange={(next) => void setValue(next)}
      />
    );
  }
  return (
    <SettingsRow
      icon={def.icon}
      title={entry.title}
      subtitle={entry.path}
      value={def.summary ? def.summary(value, t) : undefined}
      onPress={() => onOpen(entry)}
    />
  );
});

const styles = StyleSheet.create({
  list: { gap: Spacing.two },
});
