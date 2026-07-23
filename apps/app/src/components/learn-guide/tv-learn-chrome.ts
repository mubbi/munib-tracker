import { MaxContentWidth } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";

/**
 * Shared 10-foot chrome for learn-template rows (nav rows, quiz rows, topic
 * lists). Keeps focusable rows on TV at or above `TvLayout.minFocusTarget`
 * without touching phone sizing.
 */
export const tvLearnRowStyle = {
  minHeight: TvLayout.minFocusTarget,
} as const;

/** Extra horizontal breathing room for learn-template content on TV. */
export const tvLearnContentPaddingX = {
  paddingHorizontal: TvLayout.contentPaddingX,
} as const;

/**
 * Comfortable reading column on TV so learn timelines / prose do not stretch
 * edge-to-edge across a 1080p living-room display. Left-aligned with the
 * ScreenLayout title rather than centered in the wide TV column.
 */
export const tvLearnReadingMaxWidth = MaxContentWidth;

export const tvLearnReadingColumnStyle = {
  width: "100%" as const,
  maxWidth: tvLearnReadingMaxWidth,
  alignSelf: "flex-start" as const,
};
