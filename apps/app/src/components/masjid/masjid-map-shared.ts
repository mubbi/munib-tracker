import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildMasjidMapHtml, type MasjidMapPoint } from "@/lib/masjid/map-html";

/** Shared by the native (WebView) and web (iframe) masjid maps. */
export type MasjidMapProps = {
  /** Search origin — the user's position (or saved location). */
  me: { lat: number; lon: number };
  /** Nearest first. */
  masjids: readonly MasjidMapPoint[];
  /** A pin was tapped (key) or the map background was (null). */
  onSelect: (key: string | null) => void;
  height: number;
};

/** The themed map document; rebuilt only when the points, theme or language change. */
export function useMasjidMapHtml(
  me: MasjidMapProps["me"],
  masjids: MasjidMapProps["masjids"],
): string {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  return useMemo(
    () =>
      buildMasjidMapHtml({
        me,
        masjids,
        dark: tokens.isDark,
        colors: {
          background: colors.background,
          pin: colors.accent,
          pinBorder: colors.accentForeground,
          home: tokens.status.warning.color,
          me: tokens.status.info.color,
        },
        youLabel: t("masjids.mapYou"),
      }),
    [me, masjids, tokens, colors, t],
  );
}
