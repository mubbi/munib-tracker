import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { IconButton } from "@/components/ui/icon-button";
import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import { useHadithCitationBookmark, useQuranAyahBookmark } from "@/hooks/use-jannah-bookmarks";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { resolveHadithBookmarkTarget } from "@/lib/jannah-bookmarks";

export function QuranAyahBookmarkButton({ surah, ayah }: { surah: number; ayah: number }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { bookmarked, toggle } = useQuranAyahBookmark(surah, ayah);
  const tint = bookmarked ? tokens.status.warning.color : colors.mutedForeground;

  return (
    <LabeledIconButton
      name={
        bookmarked
          ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
          : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
      }
      label={bookmarked ? t("quran.actionBookmarked") : t("quran.actionBookmark")}
      tintColor={tint}
      labelColor={tint}
      accessibilityLabel={bookmarked ? t("quran.bookmarkRemove") : t("quran.bookmarkAdd")}
      accessibilityState={{ selected: bookmarked }}
      haptic="selection"
      onPress={() => void toggle()}
    />
  );
}

export function HadithCitationBookmarkButton({
  collection,
  citation,
}: {
  collection: string;
  citation: string;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const target = useMemo(
    () => resolveHadithBookmarkTarget(collection, citation),
    [collection, citation],
  );
  const { bookmarked, toggle, canBookmark } = useHadithCitationBookmark(target);

  if (!canBookmark) return null;

  return (
    <IconButton
      name={
        bookmarked
          ? { ios: "bookmark.fill", android: "bookmark", web: "bookmark" }
          : { ios: "bookmark", android: "bookmark_border", web: "bookmark_border" }
      }
      size={18}
      tintColor={bookmarked ? tokens.status.warning.color : colors.mutedForeground}
      accessibilityLabel={bookmarked ? t("hadith.bookmarkRemove") : t("hadith.bookmarkAdd")}
      accessibilityState={{ selected: bookmarked }}
      haptic="selection"
      onPress={() => void toggle()}
    />
  );
}

export function DuaFavoriteButton({
  duaId: _duaId,
  isFavorite,
  onToggle,
}: {
  duaId: string;
  isFavorite: boolean;
  onToggle: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  return (
    <IconButton
      name={
        isFavorite
          ? { ios: "star.fill", android: "star", web: "star" }
          : { ios: "star", android: "star_border", web: "star_border" }
      }
      size={18}
      tintColor={isFavorite ? tokens.status.warning.color : colors.mutedForeground}
      accessibilityLabel={isFavorite ? t("dua.unfavorite") : t("dua.favorite")}
      accessibilityState={{ selected: isFavorite }}
      haptic="selection"
      onPress={onToggle}
    />
  );
}
