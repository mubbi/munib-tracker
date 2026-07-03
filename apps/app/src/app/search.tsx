import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { type ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  InteractionManager,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  SEARCH_CATEGORY_ORDER,
  type SearchCategory,
  type SearchGroup,
  type SearchResult,
  searchLight,
  searchQuranAyahs,
  tokenize,
} from "@/lib/search";
import { clearRecentSearches, loadRecentSearches, pushRecentSearch } from "@/lib/search-history";

const DEBOUNCE_MS = 180;
/** Matches fetched per light group; ample for a filtered view, cheap for tiny corpora. */
const LIGHT_FETCH_LIMIT = 50;
const AYAH_FETCH_LIMIT = 30;
/** Rows shown per group in the combined "All" view before "see all". */
const PREVIEW_LIMIT = 4;

/** Seed prompts shown when the field is empty — tap to search. */
const SUGGESTIONS = [
  "Ayat al-Kursi",
  "Forgiveness",
  "Morning",
  "Patience",
  "Rizq",
  "Rahman",
  "Sleep",
  "Istighfar",
];

type CategoryVisual = {
  icon: SymbolViewProps["name"];
  tint: string;
  soft: string;
};

type FilterKey = SearchCategory | "all";

export default function SearchScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();

  const [query, setQuery] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [recent, setRecent] = useState<string[]>([]);
  const [ayah, setAyah] = useState<SearchGroup | null>(null);
  const [ayahLoading, setAyahLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryVisual = useMemo<Record<SearchCategory, CategoryVisual>>(
    () => ({
      quran: {
        icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
        tint: colors.accent,
        soft: tokens.accentSoft,
      },
      hadith: {
        icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
        tint: tokens.status.info.color,
        soft: tokens.status.info.soft,
      },
      dua: {
        icon: {
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        },
        tint: tokens.status.success.color,
        soft: tokens.status.success.soft,
      },
      zikr: {
        icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
        tint: tokens.status.danger.color,
        soft: tokens.status.danger.soft,
      },
      name: {
        icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
        tint: tokens.status.warning.color,
        soft: tokens.status.warning.soft,
      },
      durood: {
        icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
        tint: colors.accent,
        soft: tokens.accentSoft,
      },
    }),
    [colors.accent, tokens],
  );

  // Load persisted recent searches once.
  useEffect(() => {
    let active = true;
    void loadRecentSearches().then((list) => {
      if (active) setRecent(list);
    });
    return () => {
      active = false;
    };
  }, []);

  // Debounce the raw query before searching.
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(query.trim()), DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query]);

  // Light (instant) search over everything except Qur'an ayah full-text.
  const lightGroups = useMemo(() => searchLight(debounced, LIGHT_FETCH_LIMIT), [debounced]);
  const hasQuery = tokenize(debounced).length > 0;

  // Qur'an ayah full-text is heavy — build/scan it off the interaction thread so
  // the lighter results paint first and typing stays smooth.
  useEffect(() => {
    if ((filter !== "all" && filter !== "quran") || tokenize(debounced).length === 0) {
      setAyah(null);
      setAyahLoading(false);
      return;
    }
    setAyahLoading(true);
    let cancelled = false;
    const handle = InteractionManager.runAfterInteractions(() => {
      if (cancelled) return;
      const group = searchQuranAyahs(debounced, AYAH_FETCH_LIMIT);
      if (cancelled) return;
      setAyah(group);
      setAyahLoading(false);
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced, filter]);

  // Merge ayah matches into the Qur'an group (surah matches first), keeping order.
  const groups = useMemo<SearchGroup[]>(() => {
    if (!ayah || ayah.total === 0) return lightGroups;
    const hasQuran = lightGroups.some((g) => g.category === "quran");
    const merged: SearchGroup[] = hasQuran
      ? lightGroups.map((g) =>
          g.category === "quran"
            ? {
                category: "quran",
                results: [...g.results, ...ayah.results],
                total: g.total + ayah.total,
              }
            : g,
        )
      : [ayah, ...lightGroups];
    return SEARCH_CATEGORY_ORDER.map((c) => merged.find((g) => g.category === c)).filter(
      (g): g is SearchGroup => Boolean(g),
    );
  }, [lightGroups, ayah]);

  const presentCategories = useMemo<SearchCategory[]>(
    () =>
      SEARCH_CATEGORY_ORDER.filter(
        (c) => groups.some((g) => g.category === c) || (c === "quran" && ayahLoading),
      ),
    [groups, ayahLoading],
  );

  const totalCount = useMemo(() => groups.reduce((sum, g) => sum + g.total, 0), [groups]);

  const visibleGroups = useMemo(
    () => (filter === "all" ? groups : groups.filter((g) => g.category === filter)),
    [groups, filter],
  );

  const remember = useCallback((raw: string) => {
    void pushRecentSearch(raw).then(setRecent);
  }, []);

  const openResult = useCallback(
    (result: SearchResult) => {
      remember(query.trim() || result.title);
      switch (result.href) {
        case "/quran/[surah]":
          router.push({
            pathname: result.href,
            params: {
              surah: result.params?.surah ?? "1",
              ...(result.params?.ayah ? { ayah: result.params.ayah } : {}),
            },
          });
          break;
        case "/hadith/[collection]":
          router.push({
            pathname: result.href,
            params: { collection: result.params?.collection ?? "", q: query.trim() },
          });
          break;
        case "/dua/detail/[id]":
          router.push({ pathname: result.href, params: { id: result.params?.id ?? "" } });
          break;
        case "/zikr/detail/[id]":
          router.push({ pathname: result.href, params: { id: result.params?.id ?? "" } });
          break;
        default:
          router.push(result.href);
      }
    },
    [router, query, remember],
  );

  const runSuggestion = (term: string) => {
    setQuery(term);
    setFilter("all");
  };

  const clearRecent = () => {
    void clearRecentSearches();
    setRecent([]);
  };

  const showIdle = !hasQuery;
  const showEmpty = hasQuery && visibleGroups.length === 0 && !ayahLoading;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Search bar */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.goBack")}
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: tokens.accentSoft, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <SymbolView
            name={{ ios: "chevron.left", android: "arrow_back", web: "arrow_back" }}
            size={19}
            tintColor={colors.accent}
          />
        </Pressable>

        <View style={[styles.field, { backgroundColor: colors.muted }]}>
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={18}
            tintColor={colors.mutedForeground}
          />
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => query.trim() && remember(query.trim())}
            placeholder={t("search.placeholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("search.placeholder")}
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.input, { color: colors.foreground }]}
          />
          {query.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("search.clear")}
              hitSlop={8}
              onPress={() => setQuery("")}
            >
              <SymbolView
                name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
                size={18}
                tintColor={colors.mutedForeground}
              />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Filter chips */}
      {hasQuery && presentCategories.length > 0 ? (
        <View style={styles.filterWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.filterRow}
          >
            <FilterChip
              label={t("search.all")}
              count={totalCount}
              active={filter === "all"}
              onPress={() => setFilter("all")}
            />
            {presentCategories.map((category) => {
              const group = groups.find((g) => g.category === category);
              return (
                <FilterChip
                  key={category}
                  label={t(`search.cat.${category}`)}
                  count={group?.total ?? 0}
                  active={filter === category}
                  onPress={() => setFilter(category)}
                />
              );
            })}
          </ScrollView>
        </View>
      ) : null}

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        {showIdle ? (
          <IdleState
            recent={recent}
            suggestions={SUGGESTIONS}
            onPick={runSuggestion}
            onClearRecent={clearRecent}
          />
        ) : showEmpty ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("search.noResultsTitle")}
            description={t("search.noResultsDesc")}
          />
        ) : (
          <Animated.View entering={FadeIn.duration(160)} style={styles.results}>
            {visibleGroups.map((group) => {
              const preview =
                filter === "all" ? group.results.slice(0, PREVIEW_LIMIT) : group.results;
              const canSeeAll = filter === "all" && group.total > preview.length;
              const visual = categoryVisual[group.category];
              return (
                <View key={group.category} style={styles.group}>
                  <View style={styles.groupHeader}>
                    <IconWell
                      icon={visual.icon}
                      size={15}
                      well={30}
                      tint={visual.tint}
                      background={visual.soft}
                    />
                    <ThemedText type="subtitle" style={styles.groupTitle}>
                      {t(`search.cat.${group.category}`)}
                    </ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("search.resultsCount", { count: group.total })}
                    </ThemedText>
                  </View>

                  <View style={styles.rows}>
                    {preview.map((result) => (
                      <ResultRow
                        key={result.key}
                        result={result}
                        query={query}
                        visual={visual}
                        onPress={() => openResult(result)}
                      />
                    ))}
                  </View>

                  {canSeeAll ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setFilter(group.category)}
                      style={({ pressed }) => [styles.seeAll, pressed && styles.pressed]}
                    >
                      <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                        {t("search.seeAllCount", { count: group.total })}
                      </ThemedText>
                      <SymbolView
                        name={{
                          ios: "chevron.right",
                          android: "chevron_right",
                          web: "chevron_right",
                        }}
                        size={13}
                        tintColor={colors.accentText}
                      />
                    </Pressable>
                  ) : null}
                </View>
              );
            })}

            {ayahLoading && (filter === "all" || filter === "quran") ? (
              <View style={styles.searchingRow}>
                <ActivityIndicator size="small" color={colors.accent} />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("search.searchingQuran")}
                </ThemedText>
              </View>
            ) : null}
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

function FilterChip({
  label,
  count,
  active,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label} ${count}`}
      onPress={onPress}
      scaleTo={0.95}
      style={[styles.chip, { backgroundColor: active ? colors.accent : colors.muted }]}
    >
      <ThemedText
        type="smallBold"
        style={{ color: active ? colors.accentForeground : colors.mutedForeground }}
      >
        {label}
      </ThemedText>
      <View
        style={[styles.chipCount, { backgroundColor: active ? tokens.scrim : tokens.hairline }]}
      >
        <ThemedText
          type="caption"
          style={{ color: active ? colors.accentForeground : colors.mutedForeground }}
        >
          {count}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

function ResultRow({
  result,
  query,
  visual,
  onPress,
}: {
  result: SearchResult;
  query: string;
  visual: CategoryVisual;
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={result.title}
      onPress={onPress}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <IconWell
        icon={visual.icon}
        size={16}
        well={38}
        tint={visual.tint}
        background={visual.soft}
      />
      <View style={styles.rowBody}>
        <View style={styles.rowTitleLine}>
          <Highlight
            text={result.title}
            query={query}
            type="small"
            numberOfLines={1}
            style={styles.rowTitle}
          />
          {result.badge ? (
            <View style={[styles.badge, { backgroundColor: colors.card }]}>
              <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                {result.badge}
              </ThemedText>
            </View>
          ) : null}
        </View>
        {result.arabic ? (
          <ThemedText
            type="arabic"
            themeColor="mutedForeground"
            numberOfLines={1}
            style={styles.rowArabic}
          >
            {result.arabic}
          </ThemedText>
        ) : null}
        {result.subtitle ? (
          <Highlight
            text={result.subtitle}
            query={query}
            type="caption"
            themeColor="mutedForeground"
            numberOfLines={1}
          />
        ) : null}
      </View>
    </PressableScale>
  );
}

function IdleState({
  recent,
  suggestions,
  onPick,
  onClearRecent,
}: {
  recent: string[];
  suggestions: string[];
  onPick: (term: string) => void;
  onClearRecent: () => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View style={styles.idle}>
      {recent.length > 0 ? (
        <View style={styles.idleSection}>
          <View style={styles.idleHeader}>
            <ThemedText type="smallBold" themeColor="mutedForeground">
              {t("search.recent")}
            </ThemedText>
            <Pressable
              accessibilityRole="button"
              onPress={onClearRecent}
              hitSlop={8}
              style={({ pressed }) => pressed && styles.pressed}
            >
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {t("search.clearRecent")}
              </ThemedText>
            </Pressable>
          </View>
          <View style={styles.tagRow}>
            {recent.map((term) => (
              <TermChip key={term} label={term} icon="clock" onPress={() => onPick(term)} />
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.idleSection}>
        <ThemedText type="smallBold" themeColor="mutedForeground">
          {t("search.suggestions")}
        </ThemedText>
        <View style={styles.tagRow}>
          {suggestions.map((term) => (
            <TermChip key={term} label={term} onPress={() => onPick(term)} />
          ))}
        </View>
      </View>
    </View>
  );
}

function TermChip({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon?: "clock";
  onPress: () => void;
}) {
  const { colors } = useThemeTokens();
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      scaleTo={0.95}
      style={[styles.termChip, { backgroundColor: colors.muted }]}
    >
      {icon === "clock" ? (
        <SymbolView
          name={{ ios: "clock.arrow.circlepath", android: "history", web: "history" }}
          size={13}
          tintColor={colors.mutedForeground}
        />
      ) : null}
      <ThemedText type="small" themeColor="foreground">
        {label}
      </ThemedText>
    </PressableScale>
  );
}

/** Escapes a token for safe use inside a RegExp. */
function escapeRegExp(token: string): string {
  return token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Bolds/accents the raw query tokens where they literally occur in `text`. */
function Highlight({
  text,
  query,
  ...textProps
}: {
  text: string;
  query: string;
} & ComponentProps<typeof ThemedText>) {
  const { colors } = useThemeTokens();
  const segments = useMemo(() => {
    const tokens = query
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .map(escapeRegExp)
      .filter((tk) => tk.length >= 2);
    if (tokens.length === 0) return [{ text, match: false }];
    const re = new RegExp(`(${tokens.join("|")})`, "ig");
    const parts: Array<{ text: string; match: boolean }> = [];
    let last = 0;
    let m = re.exec(text);
    while (m !== null) {
      if (m.index > last) parts.push({ text: text.slice(last, m.index), match: false });
      parts.push({ text: m[0], match: true });
      last = m.index + m[0].length;
      if (m.index === re.lastIndex) re.lastIndex++;
      m = re.exec(text);
    }
    if (last < text.length) parts.push({ text: text.slice(last), match: false });
    return parts;
  }, [text, query]);

  return (
    <ThemedText {...textProps}>
      {segments.map((part, i) =>
        part.match ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: static split, index is stable
          <ThemedText key={i} style={{ color: colors.accentText, fontWeight: "700" }}>
            {part.text}
          </ThemedText>
        ) : (
          part.text
        ),
      )}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  field: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    height: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  filterWrap: { paddingBottom: Spacing.two },
  filterRow: {
    flexDirection: "row",
    gap: Spacing.two,
    paddingHorizontal: Spacing.four,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingLeft: Spacing.three,
    paddingRight: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  chipCount: {
    minWidth: 20,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  bodyContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
  },
  results: { gap: Spacing.four },
  group: { gap: Spacing.two },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  groupTitle: { flex: 1 },
  rows: { gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  rowBody: { flex: 1, gap: 2 },
  rowTitleLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  rowTitle: { flex: 1 },
  badge: {
    maxWidth: 132,
    paddingHorizontal: Spacing.two,
    paddingVertical: 1,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
  },
  rowArabic: {
    fontSize: 15,
    lineHeight: 26,
    textAlign: "right",
    writingDirection: "rtl",
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    alignSelf: "flex-start",
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.one,
  },
  pressed: { opacity: 0.6 },
  searchingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
  },
  idle: { gap: Spacing.five, paddingTop: Spacing.two },
  idleSection: { gap: Spacing.three },
  idleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  termChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
});
