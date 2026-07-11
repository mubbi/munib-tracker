import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useHorizontalWheelScroll } from "@/hooks/use-horizontal-wheel-scroll";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type AppIcon, NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { chevronBack, chevronForward } from "@/lib/rtl";
import { runWhenIdle } from "@/lib/run-when-idle";
import {
  ensureAyahFuse,
  preloadSearchCorpora,
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

/**
 * Seed prompts shown when the field is empty — tap to search. `key` selects the
 * localized chip label (`search.suggestion.*`); `query` is the language-neutral
 * transliteration the offline index matches, so results are consistent in every
 * locale.
 */
const SUGGESTIONS: { key: string; query: string }[] = [
  { key: "kursi", query: "Ayat al-Kursi" },
  { key: "forgiveness", query: "Forgiveness" },
  { key: "morning", query: "Morning" },
  { key: "patience", query: "Patience" },
  { key: "rizq", query: "Rizq" },
  { key: "rahman", query: "Rahman" },
  { key: "sleep", query: "Sleep" },
  { key: "istighfar", query: "Istighfar" },
];

type CategoryVisual = {
  icon: AppIcon;
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
  const [pending, setPending] = useState(false);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [recent, setRecent] = useState<string[]>([]);
  const [lightGroups, setLightGroups] = useState<SearchGroup[]>([]);
  const [lightSearching, setLightSearching] = useState(false);
  const [ayah, setAyah] = useState<SearchGroup | null>(null);
  const [ayahLoading, setAyahLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const filterScrollRef = useHorizontalWheelScroll();

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
        icon: NAMES_OF_ALLAH_ICON,
        tint: tokens.status.warning.color,
        soft: tokens.status.warning.soft,
      },
      durood: {
        icon: { ios: "heart.text.square.fill", android: "favorite", web: "favorite" },
        tint: colors.accent,
        soft: tokens.accentSoft,
      },
      jannah: {
        icon: { ios: "leaf.fill", android: "park", web: "park" },
        tint: tokens.status.success.color,
        soft: tokens.status.success.soft,
      },
      jahannam: {
        icon: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
        tint: tokens.status.danger.color,
        soft: tokens.status.danger.soft,
      },
      lastDay: {
        icon: { ios: "scalemass.fill", android: "balance", web: "balance" },
        tint: tokens.status.info.color,
        soft: tokens.status.info.soft,
      },
      salahGuide: {
        icon: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
        tint: tokens.status.info.color,
        soft: tokens.status.info.soft,
      },
      battles: {
        icon: { ios: "scroll.fill", android: "history_edu", web: "history_edu" },
        tint: tokens.status.warning.color,
        soft: tokens.status.warning.soft,
      },
      learnQuran: {
        icon: { ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" },
        tint: colors.accent,
        soft: tokens.accentSoft,
      },
      taharah: {
        icon: { ios: "drop.fill", android: "water_drop", web: "water_drop" },
        tint: tokens.status.info.color,
        soft: tokens.status.info.soft,
      },
      prophets: {
        icon: { ios: "person.3.fill", android: "groups", web: "groups" },
        tint: colors.accent,
        soft: tokens.accentSoft,
      },
      aqeedah: {
        icon: { ios: "book.closed.fill", android: "menu_book", web: "menu_book" },
        tint: tokens.status.success.color,
        soft: tokens.status.success.soft,
      },
      learnDua: {
        icon: {
          ios: "hands.and.sparkles.fill",
          android: "volunteer_activism",
          web: "volunteer_activism",
        },
        tint: tokens.status.danger.color,
        soft: tokens.status.danger.soft,
      },
    }),
    [colors.accent, tokens],
  );

  // Load persisted recent searches once; warm corpora off the critical path.
  useEffect(() => {
    let active = true;
    void loadRecentSearches().then((list) => {
      if (active) setRecent(list);
    });
    void preloadSearchCorpora();
    return () => {
      active = false;
    };
  }, []);

  // Debounce the raw query before searching.
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed === debounced) {
      setPending(false);
      return;
    }
    setPending(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setDebounced(trimmed);
      setPending(false);
    }, DEBOUNCE_MS);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [query, debounced]);

  const rawHasQuery = tokenize(query.trim()).length > 0;
  const hasQuery = tokenize(debounced).length > 0;

  // Light search over everything except Qur'an ayah full-text — deferred so the
  // loading state can paint before the first (potentially heavy) index build.
  useEffect(() => {
    if (!hasQuery) {
      setLightGroups([]);
      setLightSearching(false);
      return;
    }
    setLightGroups([]);
    setLightSearching(true);
    let cancelled = false;
    const handle = runWhenIdle(() => {
      if (cancelled) return;
      const groups = searchLight(debounced, LIGHT_FETCH_LIMIT);
      if (cancelled) return;
      setLightGroups(groups);
      setLightSearching(false);
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced, hasQuery]);

  // Qur'an ayah full-text is heavy — defer build/scan until idle so
  // the lighter results paint first and typing stays smooth.
  useEffect(() => {
    if ((filter !== "all" && filter !== "quran") || tokenize(debounced).length === 0) {
      setAyah(null);
      setAyahLoading(false);
      return;
    }
    setAyah(null);
    setAyahLoading(true);
    let cancelled = false;
    const handle = runWhenIdle(() => {
      if (cancelled) return;
      void ensureAyahFuse().then(() => {
        if (cancelled) return;
        const group = searchQuranAyahs(debounced, AYAH_FETCH_LIMIT);
        if (cancelled) return;
        setAyah(group);
        setAyahLoading(false);
      });
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
        case "/jannah/[topic]":
          router.push({
            pathname: result.href,
            params: { topic: result.params?.topic ?? "about" },
          });
          break;
        case "/jahannam/[topic]":
          router.push({
            pathname: result.href,
            params: { topic: result.params?.topic ?? "introduction" },
          });
          break;
        case "/salah-guide/[topic]":
        case "/battles/[topic]":
        case "/last-day/[topic]":
        case "/taharah/[topic]":
        case "/prophets/[topic]":
        case "/aqeedah/[topic]":
        case "/learn-dua/[topic]":
        case "/learn-quran/[topic]":
          router.push({
            pathname: result.href,
            params: { topic: result.params?.topic ?? "" },
          });
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

  const busy = pending || lightSearching || ayahLoading;
  const showIdle = !rawHasQuery;
  const showLoading = rawHasQuery && busy && visibleGroups.length === 0;
  const showEmpty = hasQuery && !busy && visibleGroups.length === 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Seo path="/search" />
      {/* Search bar */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>
        <IconButton
          accessibilityLabel={t("common.goBack")}
          onPress={() => goBackOrReplace(router, "/")}
          name={chevronBack()}
          size={19}
          tintColor={colors.accent}
          background={tokens.accentSoft}
          style={styles.backButton}
        />

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
            <IconButton
              accessibilityLabel={t("search.clear")}
              onPress={() => setQuery("")}
              name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
              size={18}
              tintColor={colors.mutedForeground}
            />
          ) : null}
        </View>
      </View>

      {/* Filter chips */}
      {hasQuery && presentCategories.length > 0 ? (
        <View style={styles.filterWrap}>
          <ScrollView
            ref={filterScrollRef}
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
        ) : visibleGroups.length > 0 ? (
          <View style={styles.results}>
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
                    <PressableScale
                      haptic="light"
                      accessibilityRole="button"
                      onPress={() => setFilter(group.category)}
                      style={styles.seeAll}
                    >
                      <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                        {t("search.seeAllCount", { count: group.total })}
                      </ThemedText>
                      <SymbolView name={chevronForward()} size={13} tintColor={colors.accentText} />
                    </PressableScale>
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
          </View>
        ) : showLoading ? (
          <SearchLoading />
        ) : showEmpty ? (
          <EmptyState
            icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
            title={t("search.noResultsTitle")}
            description={t("search.noResultsDesc")}
          />
        ) : null}
      </ScrollView>
    </View>
  );
}

function SearchLoading() {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="small" color={colors.accent} />
      <ThemedText type="small" themeColor="mutedForeground">
        {t("search.searching")}
      </ThemedText>
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
            numberOfLines={2}
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
  suggestions: { key: string; query: string }[];
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
            <PressableScale accessibilityRole="button" onPress={onClearRecent} hitSlop={8}>
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {t("search.clearRecent")}
              </ThemedText>
            </PressableScale>
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
          {suggestions.map((item) => (
            <TermChip
              key={item.key}
              label={t(`search.suggestion.${item.key}`)}
              onPress={() => onPick(item.query)}
            />
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
    paddingStart: Spacing.three,
    paddingEnd: Spacing.two,
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
  loading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    paddingTop: Spacing.six,
  },
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
