import { type Href, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { NavRow } from "@/components/ui/nav-row";
import { QuickActionGrid, type QuickActionItem } from "@/components/ui/quick-action";
import { SectionHeader } from "@/components/ui/section-header";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { Spacing } from "@/constants/theme";
import { reciteToFindHref } from "@/lib/recite-to-find/links";

/** `/quran/search` opened straight on the Root tab (NF-3.22). */
const ROOT_SEARCH_HREF = { pathname: "/quran/search", params: { mode: "root" } } as Href;

/**
 * Every Qur'an destination on one screen, no sideways scroll (C-23): a 4-up
 * grid of the everyday ways in (Pages, Juz, Find an ayah, Saved) and a
 * "Study tools" group of full-width rows for the rest. Tiles use the browse
 * hues (C-09) — status colours stay reserved for status.
 */
export function QuranHubTools({
  practiceAvailable,
  reciteToFindAvailable,
  dueCount,
  bookmarkCount,
}: {
  practiceAvailable: boolean;
  reciteToFindAvailable: boolean;
  /** Memorised ayahs due for revision (practice). */
  dueCount: number;
  bookmarkCount: number;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const sky = useCategoryHue("sky").icon;
  const accent = useCategoryHue("accent").icon;
  const violet = useCategoryHue("violet").icon;
  const dawn = useCategoryHue("dawn").icon;

  const primary = useMemo<QuickActionItem[]>(
    () => [
      {
        id: "pages",
        label: t("quran.pages"),
        icon: { ios: "book.pages.fill", android: "menu_book", web: "menu_book" },
        tint: sky,
        onPress: () => router.push("/quran/pages"),
        href: "/quran/pages",
      },
      {
        id: "juz",
        label: t("quran.juz"),
        icon: { ios: "square.grid.3x3.fill", android: "grid_view", web: "grid_view" },
        tint: accent,
        onPress: () => router.push("/quran/juz"),
        href: "/quran/juz",
      },
      {
        id: "find",
        // Ayah full-text search — named for its scope so it isn't confused with
        // the surah filter field.
        label: t("quran.find.title"),
        icon: { ios: "text.magnifyingglass", android: "manage_search", web: "manage_search" },
        tint: violet,
        onPress: () => router.push("/quran/search"),
        href: "/quran/search",
      },
      {
        id: "saved",
        label:
          bookmarkCount > 0
            ? t("quran.hub.savedCount", { n: bookmarkCount })
            : t("quran.hub.saved"),
        icon: { ios: "bookmark.fill", android: "bookmark", web: "bookmark" },
        tint: dawn,
        onPress: () => router.push("/quran/bookmarks"),
        href: "/quran/bookmarks",
      },
    ],
    [accent, bookmarkCount, dawn, router, sky, t, violet],
  );

  return (
    <View style={styles.root}>
      <QuickActionGrid items={primary} columns={4} />
      <SectionHeader
        title={t("quran.hub.studyTools")}
        icon={{ ios: "graduationcap.fill", android: "school", web: "school" }}
      />
      <View style={styles.rows}>
        <NavRow
          icon={{ ios: "book.closed.fill", android: "auto_stories", web: "auto_stories" }}
          label={t("learnQuran.title")}
          onPress={() => router.push("/learn-quran")}
          href="/learn-quran"
        />
        <NavRow
          icon={{ ios: "chart.line.uptrend.xyaxis", android: "trending_up", web: "trending_up" }}
          label={t("khatm.short")}
          onPress={() => router.push("/quran/khatm")}
          href="/quran/khatm"
        />
        {/* NF-3.18: finish the Qur'an together, one part each. */}
        <NavRow
          icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
          label={t("khatmGroups.title")}
          onPress={() => router.push("/khatm-groups" as Href)}
          href="/khatm-groups"
        />
        <NavRow
          icon={{ ios: "brain.head.profile", android: "psychology", web: "psychology" }}
          label={t("hifz.short")}
          onPress={() => router.push("/quran/hifz")}
          href="/quran/hifz"
        />
        {practiceAvailable ? (
          <NavRow
            icon={{ ios: "mic.fill", android: "mic", web: "mic" }}
            label={t("quranCompanion.entry.practise")}
            onPress={() => router.push("/quran/practice" as Href)}
            href="/quran/practice"
          />
        ) : null}
        {practiceAvailable && dueCount > 0 ? (
          <NavRow
            icon={{ ios: "arrow.triangle.2.circlepath", android: "sync", web: "sync" }}
            label={t("quranCompanion.entry.toRevise", { count: dueCount })}
            onPress={() => router.push("/quran/revision" as Href)}
            href="/quran/revision"
          />
        ) : null}
        {/* D68: recite a few words and the on-device listener finds the ayah. */}
        {reciteToFindAvailable ? (
          <NavRow
            icon={{ ios: "waveform", android: "graphic_eq", web: "graphic_eq" }}
            label={t("reciteToFind.shortcut.title")}
            onPress={() => router.push(reciteToFindHref())}
          />
        ) : null}
        <NavRow
          icon={{ ios: "note.text", android: "sticky_note_2", web: "sticky_note_2" }}
          label={t("quranNotes.title")}
          onPress={() => router.push("/quran/notes")}
          href="/quran/notes"
        />
        <NavRow
          icon={{ ios: "character.book.closed", android: "spellcheck", web: "spellcheck" }}
          label={t("quranRoots.title")}
          onPress={() => router.push(ROOT_SEARCH_HREF)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three, width: "100%" },
  rows: { gap: Spacing.two },
});
