import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { type ComponentProps, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  type TextInputInstance,
  useWindowDimensions,
  View,
  type ViewInstance,
} from "react-native";
import { useQuranRootsSearchGroup } from "@/components/quran/roots/use-roots-search-group";
import { Seo } from "@/components/seo/seo";
import { useSettingsSearch } from "@/components/settings/settings-search-results";
import { VoiceInputButton } from "@/components/stt/voice-input-button";
import { ThemedText } from "@/components/themed-text";
import { EmptyState } from "@/components/ui/empty-state";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ResponsiveGrid } from "@/components/ui/responsive-grid";
import { TvFocusGuide } from "@/components/ui/tv-focus-guide";
import { TvScrollView } from "@/components/ui/tv-scroll-view";
import { Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { TvLayout } from "@/constants/tv-layout";
import { useAppSafeAreaInsets } from "@/hooks/use-app-safe-area-insets";
import { useHorizontalWheelScroll } from "@/hooks/use-horizontal-wheel-scroll";
import { useSpeechToText } from "@/hooks/use-speech-to-text";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { type AppIcon, NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useQuranNotesSearchGroup } from "@/lib/quran-notes/use-notes-search-group";
import { useChevronBack, useChevronForward } from "@/lib/rtl";
import { runSearchLightWithGuides } from "@/lib/run-search-light-with-guides";
import { runWhenIdle } from "@/lib/run-when-idle";
import {
  ensureAyahFuse,
  preloadSearchCorpora,
  SEARCH_CATEGORY_ORDER,
  type SearchCategory,
  type SearchGroup,
  type SearchResult,
  searchQuranAyahs,
  tokenize,
} from "@/lib/search";
import { clearRecentSearches, loadRecentSearches, pushRecentSearch } from "@/lib/search-history";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { settingHref, settingsGroupPath } from "@/lib/settings/routes";
import type { SttErrorKind } from "@/lib/stt";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";
import { zikrListRowProgress } from "@/lib/zikr-list-progress";
import { pushZikrDetail } from "@/lib/zikr-quran";
import { useToast } from "@/providers/toast-provider";
import { useZikrCounts } from "@/stores/tracker-store";

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
/**
 * Wide-screen layout (never TV): centred column caps that match `ScreenLayout`,
 * side filter list at ≥1024, multi-column results.
 */
function searchColumnMaxWidth(width: number): number {
  if (width >= 1600) return 1320;
  if (width >= 1024) return 1120;
  return 880;
}

/** Focusable result/term controls inside the results body (RN-web Pressables). */
const WEB_FOCUSABLE_SELECTOR = '[role="button"], [tabindex="0"]';

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
  const { t, i18n } = useTranslation();
  const insets = useAppSafeAreaInsets();
  const { colors, tokens } = useThemeTokens();
  const toast = useToast();
  const chevronBackIcon = useChevronBack();
  const chevronForwardIcon = useChevronForward();

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
  const tv = isTV();
  const { width } = useWindowDimensions();
  // Tablet / desktop (window width): centred column; ≥1024 adds the side filter list.
  const wideColumn = !tv && width >= 768;
  const sideFilters = !tv && width >= 1024;
  const columnStyle = wideColumn
    ? {
        width: "100%" as const,
        maxWidth: searchColumnMaxWidth(width),
        alignSelf: "center" as const,
      }
    : null;
  const inputRef = useRef<TextInputInstance>(null);
  const resultsRef = useRef<ViewInstance>(null);

  const handleSttError = useCallback(
    (kind: SttErrorKind) => {
      switch (kind) {
        case "permission":
          toast.warning(t("search.stt.permissionDenied"));
          break;
        case "noSpeech":
          toast.info(t("search.stt.couldNotHear"));
          break;
        case "unavailable":
          toast.warning(t("search.stt.unavailable"));
          break;
        default:
          toast.error(t("search.stt.errorGeneric"));
      }
    },
    [t, toast],
  );

  const stt = useSpeechToText({
    uiLocale: i18n.language ?? "en",
    onTranscript: setQuery,
    onError: handleSttError,
  });

  const toggleVoiceSearch = () => {
    if (stt.listening) {
      stt.stop();
      return;
    }
    // Fresh dictate session replaces the query (typical voice-search UX).
    void stt.start("query", "", "other");
  };

  const setQueryFromInput = (value: string) => {
    if (stt.listening) stt.abort();
    setQuery(value);
  };
  const setQueryFromInputRef = useRef(setQueryFromInput);
  setQueryFromInputRef.current = setQueryFromInput;
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
      learn: {
        icon: { ios: "graduationcap.fill", android: "school", web: "school" },
        tint: tokens.status.info.color,
        soft: tokens.status.info.soft,
      },
      settings: {
        icon: { ios: "gearshape.fill", android: "settings", web: "settings" },
        tint: colors.accent,
        soft: tokens.hairline,
      },
      notes: {
        icon: { ios: "note.text", android: "sticky_note_2", web: "sticky_note_2" },
        tint: colors.accent,
        soft: tokens.accentSoft,
      },
      roots: {
        icon: { ios: "character.book.closed.fill", android: "translate", web: "translate" },
        tint: colors.accent,
        soft: tokens.accentSoft,
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
    void ensureZikrCorpus();
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
      void runSearchLightWithGuides(debounced, LIGHT_FETCH_LIMIT)
        .then((groups) => {
          if (cancelled) return;
          setLightGroups(groups);
          setLightSearching(false);
        })
        .catch(() => {
          if (cancelled) return;
          setLightGroups([]);
          setLightSearching(false);
        });
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced, hasQuery]);

  // Qur'an ayah full-text is heavy — defer build/scan until idle so the lighter
  // results paint first and typing stays smooth. This runs once per query and is
  // intentionally independent of `filter`: the result is cached in state, so
  // switching tabs only filters the already-fetched data (never re-searches) and
  // the Qur'an chip stays put instead of flickering away.
  useEffect(() => {
    if (!hasQuery) {
      setAyah(null);
      setAyahLoading(false);
      return;
    }
    setAyah(null);
    setAyahLoading(true);
    let cancelled = false;
    const handle = runWhenIdle(() => {
      if (cancelled) return;
      void ensureAyahFuse()
        .then(() => {
          if (cancelled) return;
          const group = searchQuranAyahs(debounced, AYAH_FETCH_LIMIT);
          if (cancelled) return;
          setAyah(group);
          setAyahLoading(false);
        })
        .catch(() => {
          if (cancelled) return;
          setAyah(null);
          setAyahLoading(false);
        });
    });
    return () => {
      cancelled = true;
      handle.cancel();
    };
  }, [debounced, hasQuery]);

  // Settings rows from the same index as the Settings hub (current locale + English).
  const settingsHits = useSettingsSearch(hasQuery ? debounced : "");
  const settingsGroup = useMemo<SearchGroup | null>(() => {
    if (settingsHits.length === 0) return null;
    return {
      category: "settings",
      total: settingsHits.length,
      results: settingsHits.map((entry) => ({
        key: `settings:${entry.def.id}`,
        category: "settings",
        title: entry.title,
        subtitle: entry.path,
        href: settingsGroupPath(entry.def.group),
        params: { focus: entry.def.id },
      })),
    };
  }, [settingsHits]);

  // NF-3.21 "My notes": the user's own notes, searched on-device only.
  const notesGroup = useQuranNotesSearchGroup(hasQuery ? debounced : "");
  // NF-3.22: Arabic 2–4 letter input that is a root → a "Root" group on top.
  const rootsGroup = useQuranRootsSearchGroup(hasQuery ? debounced : "");

  // Merge ayah matches into the Qur'an group (surah matches first), keeping order.
  const contentGroups = useMemo<SearchGroup[]>(() => {
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

  const groups = useMemo<SearchGroup[]>(
    () =>
      [rootsGroup, ...contentGroups, notesGroup, settingsGroup].filter((g): g is SearchGroup =>
        Boolean(g),
      ),
    [contentGroups, notesGroup, rootsGroup, settingsGroup],
  );

  const presentCategories = useMemo<SearchCategory[]>(
    () =>
      SEARCH_CATEGORY_ORDER.filter((c) => {
        const group = groups.find((g) => g.category === c);
        // Hide Qur'an while ayah search is still loading and there are no
        // surah hits yet — avoids a misleading "0" chip (loader still shows).
        if (c === "quran" && ayahLoading && (!group || group.total === 0)) {
          return false;
        }
        return Boolean(group && group.total > 0);
      }),
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
      if (result.category === "settings") {
        router.push(settingHref(result.params?.focus ?? "") as Href);
        return;
      }
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
          pushZikrDetail(router, result.params?.id ?? "");
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
        case "/ruqyah/[topic]":
        case "/eid/[topic]":
        case "/friday/[topic]":
        case "/new-muslim/[topic]":
        case "/laylat-al-qadr/[topic]":
        case "/finance/[topic]":
        case "/zakat/[topic]":
        case "/fidyah/[topic]":
        case "/janazah/[topic]":
          router.push({
            pathname: result.href,
            params: { topic: result.params?.topic ?? "" },
          });
          break;
        case "/quran/roots/[root]":
          router.push({ pathname: result.href, params: { root: result.params?.root ?? "" } });
          break;
        case "/sahaba/[id]":
        case "/fiqh/[id]":
          router.push({
            pathname: result.href,
            params: { id: result.params?.id ?? "" },
          });
          break;
        case "/seerah":
        case "/history":
        case "/travel":
        case "/hayd":
        case "/sick":
        case "/duroods":
        case "/names-of-allah":
        case "/prophets/tree":
        case "/sadaqah":
        case "/fidyah":
        case "/janazah":
          router.push(result.href);
          break;
        case "/hajj/[topic]":
          router.push({
            pathname: "/hajj/[topic]",
            params: { topic: result.params?.topic ?? "" },
          } as unknown as Href);
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

  /** Web: move keyboard focus to the first result / suggestion in the body. */
  const focusFirstResult = useCallback((): boolean => {
    if (Platform.OS !== "web") return false;
    const container = resultsRef.current as unknown as HTMLElement | null;
    const first = container?.querySelector<HTMLElement>(WEB_FOCUSABLE_SELECTOR);
    if (!first) return false;
    first.focus();
    return true;
  }, []);

  // Desktop web keyboard: ↓ from the field enters the results, ↑/↓ walk them
  // (↑ on the first returns to the field), Esc clears the query. Enter on a
  // focused result opens it (RN-web Pressable). Never on native / TV.
  useEffect(() => {
    if (Platform.OS !== "web" || tv || typeof window === "undefined") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;
      const input = inputRef.current as unknown as HTMLElement | null;
      const container = resultsRef.current as unknown as HTMLElement | null;
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target === input) {
        if (event.key === "ArrowDown" && focusFirstResult()) event.preventDefault();
        else if (event.key === "Escape" && query.length > 0) {
          event.preventDefault();
          setQueryFromInputRef.current("");
        }
        return;
      }
      if (!container?.contains(target)) return;
      if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
      const items = Array.from(container.querySelectorAll<HTMLElement>(WEB_FOCUSABLE_SELECTOR));
      const index = items.indexOf(target);
      if (index < 0) return;
      event.preventDefault();
      if (event.key === "ArrowDown") {
        items[Math.min(items.length - 1, index + 1)]?.focus();
      } else if (index === 0) {
        input?.focus();
      } else {
        items[index - 1]?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [focusFirstResult, query.length, tv]);

  const submitQuery = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    remember(trimmed);
    // Desktop web: Enter commits the query and hands focus to the results so
    // ↑/↓ + Enter can pick one without the mouse.
    if (Platform.OS === "web" && !tv) focusFirstResult();
  };

  const busy = pending || lightSearching || ayahLoading;
  const showIdle = !rawHasQuery;
  const showLoading = rawHasQuery && busy && visibleGroups.length === 0;
  const showEmpty = hasQuery && !busy && visibleGroups.length === 0;
  const showFilters = hasQuery && presentCategories.length > 0;
  // "All" on wide screens: category groups side by side. A single category:
  // its rows in a grid. TV keeps its two-column row grid.
  const groupColumns = sideFilters && filter === "all" && width >= 1200 ? 2 : 1;
  const rowColumns = tv
    ? 2
    : sideFilters && filter !== "all"
      ? width >= 1600
        ? 3
        : 2
      : wideColumn && filter !== "all"
        ? 2
        : 1;

  const filterChips = [
    <FilterChip
      key="all"
      label={t("search.all")}
      count={totalCount}
      active={filter === "all"}
      tv={tv}
      vertical={sideFilters}
      onPress={() => setFilter("all")}
    />,
    ...presentCategories.map((category) => {
      const group = groups.find((g) => g.category === category);
      return (
        <FilterChip
          key={category}
          label={t(`search.cat.${category}`)}
          count={group?.total ?? 0}
          active={filter === category}
          tv={tv}
          vertical={sideFilters}
          onPress={() => setFilter(category)}
        />
      );
    }),
  ];

  const resultsBody = (
    <TvFocusGuide autoFocus={tv} style={styles.body}>
      <TvScrollView
        style={styles.body}
        contentContainerStyle={[styles.bodyContent, tv ? styles.bodyContentTv : null]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View ref={resultsRef}>
          {showIdle ? (
            <IdleState
              recent={recent}
              suggestions={SUGGESTIONS}
              tv={tv}
              onPick={runSuggestion}
              onClearRecent={clearRecent}
            />
          ) : visibleGroups.length > 0 ? (
            <ResponsiveGrid columns={groupColumns} gap={Spacing.four}>
              {visibleGroups.map((group) => {
                const preview =
                  filter === "all" ? group.results.slice(0, PREVIEW_LIMIT) : group.results;
                const canSeeAll = filter === "all" && group.total > preview.length;
                const visual = categoryVisual[group.category];
                const showInlineQuranLoader =
                  group.category === "quran" &&
                  ayahLoading &&
                  (filter === "all" || filter === "quran");
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
                        {ayahLoading && group.category === "quran"
                          ? t("search.searchingQuran")
                          : t("search.resultsCount", { count: group.total })}
                      </ThemedText>
                    </View>

                    {/* TV + wide screens: multi-column result grid uses the landscape width. */}
                    <View style={rowColumns > 1 ? styles.rowsGrid : styles.rows}>
                      {preview.map((result) => {
                        const row = (
                          <ResultRow
                            key={result.key}
                            result={result}
                            query={query}
                            visual={visual}
                            category={group.category}
                            tv={tv}
                            onPress={() => openResult(result)}
                          />
                        );
                        return rowColumns > 1 ? (
                          <View
                            key={result.key}
                            style={[styles.rowsGridCell, { width: `${100 / rowColumns}%` }]}
                          >
                            {row}
                          </View>
                        ) : (
                          row
                        );
                      })}
                    </View>

                    {showInlineQuranLoader ? (
                      <View style={styles.searchingRow}>
                        <ActivityIndicator size="small" color={colors.accent} />
                        <ThemedText type="caption" themeColor="mutedForeground">
                          {t("search.searchingQuran")}
                        </ThemedText>
                      </View>
                    ) : null}

                    {canSeeAll ? (
                      <PressableScale
                        haptic="light"
                        accessibilityRole="button"
                        onPress={() => setFilter(group.category)}
                        style={[styles.seeAll, tv ? styles.seeAllTv : null]}
                      >
                        <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                          {t("search.seeAllCount", { count: group.total })}
                        </ThemedText>
                        <SymbolView
                          name={chevronForwardIcon}
                          size={13}
                          tintColor={colors.accentText}
                        />
                      </PressableScale>
                    ) : null}
                  </View>
                );
              })}

              {ayahLoading &&
              (filter === "all" || filter === "quran") &&
              !visibleGroups.some((g) => g.category === "quran") ? (
                <View style={styles.group}>
                  <View style={styles.groupHeader}>
                    <IconWell
                      icon={categoryVisual.quran.icon}
                      size={15}
                      well={30}
                      tint={categoryVisual.quran.tint}
                      background={categoryVisual.quran.soft}
                    />
                    <ThemedText type="subtitle" style={styles.groupTitle}>
                      {t("search.cat.quran")}
                    </ThemedText>
                  </View>
                  <View style={styles.searchingRow}>
                    <ActivityIndicator size="small" color={colors.accent} />
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t("search.searchingQuran")}
                    </ThemedText>
                  </View>
                </View>
              ) : null}
            </ResponsiveGrid>
          ) : showLoading ? (
            <SearchLoading />
          ) : showEmpty ? (
            <EmptyState
              icon={{ ios: "magnifyingglass", android: "search", web: "search" }}
              title={t("search.noResultsTitle")}
              description={t("search.noResultsDesc")}
            />
          ) : null}
        </View>
      </TvScrollView>
    </TvFocusGuide>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Seo path="/search" />
      {/* Search bar */}
      <View
        style={[
          styles.header,
          tv ? styles.headerTv : null,
          columnStyle,
          { paddingTop: tv ? TvLayout.contentPaddingY : insets.top + Spacing.two },
        ]}
      >
        {/* TV: the remote Back/Menu button pops this screen — no on-screen Back. */}
        {tv ? null : (
          <IconButton
            accessibilityLabel={t("common.goBack")}
            onPress={() => goBackOrReplace(router, "/")}
            name={chevronBackIcon}
            size={19}
            tintColor={colors.accent}
            background={tokens.accentSoft}
            style={styles.backButton}
          />
        )}

        <View
          style={[
            styles.field,
            tv ? styles.fieldTv : null,
            {
              backgroundColor: colors.input,
              borderWidth: stt.listening ? 1.5 : 1,
              borderColor: stt.listening ? colors.accent : colors.inputBorder,
            },
          ]}
        >
          <SymbolView
            name={{ ios: "magnifyingglass", android: "search", web: "search" }}
            size={18}
            tintColor={colors.mutedForeground}
          />
          <TextInput
            value={query}
            onChangeText={setQueryFromInput}
            ref={inputRef}
            onSubmitEditing={submitQuery}
            placeholder={t("search.placeholder")}
            placeholderTextColor={colors.mutedForeground}
            accessibilityLabel={t("search.placeholder")}
            autoFocus={!tv}
            autoCorrect={false}
            returnKeyType="search"
            style={[styles.input, tv ? styles.inputTv : null, { color: colors.foreground }]}
          />
          {/* No microphone dictation on TV remotes (phone-only capability). */}
          {stt.available && !tv ? (
            <VoiceInputButton
              size="sm"
              listening={stt.listening}
              level={stt.level}
              accessibilityLabel={
                stt.listening ? t("search.stt.stopDictate") : t("search.stt.dictate")
              }
              accessibilityHint={stt.listening ? t("search.stt.listening") : undefined}
              onPress={toggleVoiceSearch}
            />
          ) : null}
          {query.length > 0 ? (
            <IconButton
              accessibilityLabel={t("search.clear")}
              onPress={() => setQueryFromInput("")}
              name={{ ios: "xmark.circle.fill", android: "cancel", web: "cancel" }}
              size={18}
              tintColor={colors.mutedForeground}
            />
          ) : null}
        </View>
      </View>

      {/* Filter chips — horizontal strip on phones / TV; side list on wide screens. */}
      {showFilters && !sideFilters ? (
        <View style={[styles.filterWrap, columnStyle]}>
          {/* Horizontal chip strip: keep Left/Right inside the strip; Up/Down must
            stay free so the D-pad can reach the field above and results below. */}
          <TvFocusGuide autoFocus={tv} trapFocusLeft trapFocusRight>
            <TvScrollView
              ref={filterScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={[styles.filterRow, tv ? styles.filterRowTv : null]}
            >
              {filterChips}
            </TvScrollView>
          </TvFocusGuide>
        </View>
      ) : null}

      {sideFilters ? (
        <View style={[styles.wideBody, columnStyle]}>
          {showFilters ? <View style={styles.filterAside}>{filterChips}</View> : null}
          {resultsBody}
        </View>
      ) : wideColumn ? (
        <View style={[styles.body, columnStyle]}>{resultsBody}</View>
      ) : (
        resultsBody
      )}
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
  tv = false,
  vertical = false,
  onPress,
}: {
  label: string;
  count: number;
  active: boolean;
  tv?: boolean;
  /** Wide screens: full-width row in the side filter list. */
  vertical?: boolean;
  onPress: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  const chipFg = active
    ? tv
      ? colors.accentText
      : colors.accentForeground
    : colors.mutedForeground;
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`${label} ${count}`}
      onPress={onPress}
      scaleTo={0.95}
      style={[
        styles.chip,
        tv ? styles.chipTv : null,
        vertical ? styles.chipVertical : null,
        // TV: selected = soft accent fill + hairline; the solid accent ring is
        // reserved for D-pad focus so the two states never look identical.
        tv
          ? {
              backgroundColor: active ? tokens.accentSoft : colors.muted,
              borderColor: active ? tokens.accentBorder : "transparent",
            }
          : { backgroundColor: active ? colors.accent : colors.muted },
      ]}
    >
      <ThemedText type="smallBold" style={{ color: chipFg }}>
        {label}
      </ThemedText>
      <View
        style={[
          styles.chipCount,
          { backgroundColor: active && !tv ? tokens.scrim : tokens.hairline },
        ]}
      >
        <ThemedText type="caption" style={{ color: chipFg }}>
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
  category,
  tv = false,
  onPress,
}: {
  result: SearchResult;
  query: string;
  visual: CategoryVisual;
  category?: SearchCategory;
  tv?: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const zikrCounts = useZikrCounts();
  const zikrItem =
    result.category === "zikr" && result.params?.id ? getZikrById(result.params.id) : undefined;
  const zikrProgress = zikrItem ? zikrListRowProgress(zikrItem, zikrCounts) : null;
  const statusLabel = zikrProgress
    ? zikrProgress.completed
      ? (zikrProgress.progressLabel ?? t("zikr.done"))
      : zikrProgress.progressLabel
    : undefined;
  const badgeLabel = statusLabel ?? result.badge;
  const badgeCompleted = Boolean(zikrProgress?.completed);
  const accessibilityHint =
    tv && (category === "quran" || category === "hadith")
      ? t(`search.suggestion.${category}Tv`)
      : undefined;
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={statusLabel ? `${result.title}, ${statusLabel}` : result.title}
      accessibilityHint={accessibilityHint}
      onPress={onPress}
      style={[
        styles.row,
        tv ? { minHeight: TvLayout.minFocusTarget } : null,
        { backgroundColor: colors.muted },
      ]}
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
          {badgeLabel ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: badgeCompleted ? tokens.status.success.soft : colors.card,
                },
              ]}
            >
              <ThemedText
                type="caption"
                themeColor={badgeCompleted ? undefined : "mutedForeground"}
                numberOfLines={1}
                style={badgeCompleted ? { color: tokens.status.success.color } : undefined}
              >
                {badgeLabel}
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
  tv = false,
  onPick,
  onClearRecent,
}: {
  recent: string[];
  suggestions: { key: string; query: string }[];
  tv?: boolean;
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
            <PressableScale
              accessibilityRole="button"
              onPress={onClearRecent}
              hitSlop={8}
              style={tv ? styles.clearRecentTv : undefined}
            >
              <ThemedText type="smallBold" style={{ color: colors.accentText }}>
                {t("search.clearRecent")}
              </ThemedText>
            </PressableScale>
          </View>
          <View style={styles.tagRow}>
            {recent.map((term) => (
              <TermChip key={term} label={term} icon="clock" tv={tv} onPress={() => onPick(term)} />
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
              tv={tv}
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
  tv = false,
  onPress,
}: {
  label: string;
  icon?: "clock";
  tv?: boolean;
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
      style={[styles.termChip, tv ? styles.termChipTv : null, { backgroundColor: colors.muted }]}
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
  headerTv: {
    paddingHorizontal: TvLayout.contentPaddingX,
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
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    overflow: "visible",
  },
  fieldTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.four,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  inputTv: { fontSize: tvDp(TvLayout.bodyFontSize) },
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
  chipTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingStart: Spacing.four,
    paddingEnd: Spacing.three,
    borderWidth: StyleSheet.hairlineWidth,
  },
  filterRowTv: {
    paddingHorizontal: TvLayout.contentPaddingX,
    // Room for the focus ring + scale so the strip does not clip it.
    paddingVertical: Spacing.one,
  },
  chipCount: {
    minWidth: 20,
    paddingHorizontal: Spacing.one,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  body: { flex: 1 },
  wideBody: { flex: 1, flexDirection: "row" },
  /** ≥1024: category filters as a vertical list on the start side. */
  filterAside: {
    width: 220,
    gap: Spacing.one,
    paddingStart: Spacing.four,
    paddingTop: Spacing.two,
  },
  chipVertical: {
    justifyContent: "space-between",
    borderRadius: Radius.md,
  },
  bodyContent: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.two,
    paddingBottom: Spacing.six,
  },
  bodyContentTv: {
    paddingHorizontal: TvLayout.contentPaddingX,
    paddingBottom: TvLayout.contentPaddingY,
  },
  group: { gap: Spacing.two },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  groupTitle: { flex: 1 },
  rows: { gap: Spacing.two },
  // Padding gutters keep exact halves (percent widths + `gap` would overflow).
  rowsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -Spacing.one,
  },
  rowsGridCell: {
    paddingHorizontal: Spacing.one,
    paddingBottom: Spacing.two,
  },
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
  seeAllTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
  },
  clearRecentTv: {
    minHeight: TvLayout.chipMinHeight,
    justifyContent: "center",
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.md,
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
  termChipTv: {
    minHeight: TvLayout.chipMinHeight,
    paddingHorizontal: Spacing.four,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/search");
