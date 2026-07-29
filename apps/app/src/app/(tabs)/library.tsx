import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import {
  createLibraryMenuSearch,
  groupLibraryMenuBySection,
  LIBRARY_MENU_META,
  LIBRARY_SECTIONS,
} from "@/lib/library-menu";
import { isTV } from "@/lib/platform/is-tv";
import { TV_HIDDEN_QUICK_ACTION_IDS } from "@/lib/quick-actions";

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const tv = isTV();
  const [query, setQuery] = useState("");
  const searching = query.trim().length > 0;

  const menu = useMemo(
    () =>
      tv
        ? LIBRARY_MENU_META.filter((entry) => !TV_HIDDEN_QUICK_ACTION_IDS.has(entry.id))
        : LIBRARY_MENU_META,
    [tv],
  );

  const searchableMenu = useMemo(
    () => menu.map((entry) => ({ ...entry, label: t(entry.labelKey) })),
    [menu, t],
  );

  const searchIndex = useMemo(() => createLibraryMenuSearch(searchableMenu), [searchableMenu]);

  const visibleMenu = useMemo(
    () => (searching ? searchIndex.search(query) : searchableMenu),
    [query, searchIndex, searchableMenu, searching],
  );

  const grouped = useMemo(() => groupLibraryMenuBySection(visibleMenu), [visibleMenu]);

  const sections = useMemo(
    () => LIBRARY_SECTIONS.filter((section) => grouped[section.id].length > 0),
    [grouped],
  );

  return (
    <ScreenLayout
      eyebrow={t("library.eyebrow")}
      title={t("library.title")}
      subtitle={tTv(t, "library.subtitle", "library.tvSubtitle")}
    >
      <Seo path="/library" />
      <Stagger>
        <Card padding="three">
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t("library.searchPlaceholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("library.searchPlaceholder")}
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.input, { backgroundColor: colors.muted, color: colors.foreground }]}
          />
        </Card>

        {searching && sections.length === 0 ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("library.noResults")}
            description={t("search.noResultsDesc")}
          />
        ) : (
          sections.map((section, sectionIndex) => (
            <Card key={section.id} padding="three">
              <SectionHeader title={t(section.titleKey)} icon={section.icon} />
              <View style={styles.rows}>
                {grouped[section.id].map((entry, entryIndex) => (
                  <NavRow
                    key={entry.id}
                    icon={entry.icon}
                    label={t(entry.labelKey)}
                    preferredFocus={tv && sectionIndex === 0 && entryIndex === 0}
                    onPress={() => router.push(entry.route)}
                  />
                ))}
              </View>
            </Card>
          ))
        )}
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: Radius.md,
    borderCurve: "continuous",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 15,
  },
  rows: { gap: Spacing.two, marginTop: Spacing.three },
});
