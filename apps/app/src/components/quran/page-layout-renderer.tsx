import type { Ayah } from "@munib-tracker/shared/types";
import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, View } from "react-native";

import { type PageAyahHint, usePageAyahHints } from "@/components/quran/ayah-annotations";
import { MushafPageFrame } from "@/components/quran/mushaf-page-frame";
import {
  noteHintHandlers,
  noteUnderlineStyle,
  TvNoteFocusPreview,
  webHintProps,
} from "@/components/quran/note-hints";
import { SurahBanner } from "@/components/quran/surah-banner";
import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useArabicFontFamily } from "@/hooks/use-arabic-font-family";
import { useFinePointerHover } from "@/hooks/use-fine-pointer-hover";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isTV } from "@/lib/platform/is-tv";
import { getSurahByNumber } from "@/lib/quran";
import {
  arabicReadingLayout,
  iosInlineAyahMarker,
  toArabicIndicDigits,
} from "@/lib/reading-typography";

type PageLayoutRendererProps = {
  ayahs: Ayah[];
  arabicSize: number;
  transliterationSize?: number;
  translationSize?: number;
  page?: number;
  transliteration?: Record<string, string>;
  translation?: Record<string, string>;
  secondTranslation?: Record<string, string>;
  showTransliteration: boolean;
  showTranslation: boolean;
  translationDir: "ltr" | "rtl";
  secondTranslationDir: "ltr" | "rtl";
  highlightAyah?: { surah: number; ayah: number };
  onAyahPress?: (surah: number, ayah: number) => void;
  /**
   * TV: request D-pad focus on mount — the block holding this ayah, or the
   * first focusable block when `"first"` / not on the page.
   */
  tvFocusTarget?: { surah: number; ayah: number } | "first";
  /** TV: lets the reader know focus is inside the page body (D-pad Left/Right turns pages). */
  onItemFocus?: () => void;
  onItemBlur?: () => void;
  /** NF-3.21: tint the user's highlighted ayahs (off for previews / practice). */
  showAnnotations?: boolean;
};

const BISMILLAH = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
/** Unicode ARABIC END OF AYAH (۝) — Android/web overlay ornament only; never send this to iOS TextKit. */
const END_OF_AYAH = "\u06DD";

/**
 * Metrics for the gilt end-of-ayah rosette. Numbers are sized to the *inner*
 * diameter of U+06DD (~half the glyph) so 1–3 digits stay inside the ornament
 * instead of spilling over the rim — especially at large reading sizes.
 */
function ayahMarkerMetrics(fontSize: number, digitCount: number) {
  const box = Math.round(fontSize * (digitCount >= 3 ? 1.28 : digitCount === 2 ? 1.12 : 1.02));
  const rosetteSize = box;
  // Usable inner area is ~50% of the glyph; leave a slim rim margin.
  const numberSize = Math.max(
    10,
    Math.round(box * (digitCount >= 3 ? 0.36 : digitCount === 2 ? 0.42 : 0.48)),
  );
  const gutter = Math.max(3, Math.round(fontSize * 0.08));
  return { box, rosetteSize, numberSize, gutter };
}

/**
 * Gilt end-of-ayah rosette with the verse number (Android/web).
 *
 * iOS never uses this: U+06DD is an enclosing mark, and nesting a smaller
 * digit `Text` inside a justified RTL page hangs TextKit when the default
 * `ui-serif` face lacks the glyph. Callers inline {@link iosInlineAyahMarker}
 * into the ayah string instead (same run, no mixed-size nested Text).
 */
function AyahEndMarker({
  ayah,
  fontSize,
  color,
  fontFamily,
}: {
  ayah: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
}) {
  const digits = toArabicIndicDigits(ayah);
  const { box, rosetteSize, numberSize, gutter } = ayahMarkerMetrics(fontSize, digits.length);

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      collapsable={false}
      style={[
        styles.marker,
        {
          width: box,
          height: box,
          marginHorizontal: gutter,
        },
      ]}
    >
      <Text
        style={[
          styles.markerRosette,
          {
            fontSize: rosetteSize,
            lineHeight: box,
            color,
            width: box,
            height: box,
            fontFamily,
            pointerEvents: "none",
          },
        ]}
      >
        {END_OF_AYAH}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.55}
        style={[
          styles.markerNumber,
          {
            fontSize: numberSize,
            lineHeight: numberSize,
            color,
            fontFamily,
            includeFontPadding: false,
            textAlignVertical: "center",
            maxWidth: Math.round(box * 0.7),
          },
        ]}
      >
        {digits}
      </Text>
    </View>
  );
}

/** Groups consecutive ayahs on the page by surah so each surah gets its own header. */
function groupBySurah(ayahs: Ayah[]): Array<{ surah: number; ayahs: Ayah[] }> {
  const groups: Array<{ surah: number; ayahs: Ayah[] }> = [];
  for (const ayah of ayahs) {
    const last = groups[groups.length - 1];
    if (last && last.surah === ayah.surah) last.ayahs.push(ayah);
    else groups.push({ surah: ayah.surah, ayahs: [ayah] });
  }
  return groups;
}

function ayahMatchesHighlight(
  ayah: Ayah,
  highlightAyah?: { surah: number; ayah: number },
): boolean {
  return highlightAyah?.surah === ayah.surah && highlightAyah?.ayah === ayah.ayah;
}

/** iOS: one string run. Android/web: ayah + layered U+06DD rosette. */
function ayahTextWithMarker(ayah: Ayah, marker: ReactNode): ReactNode {
  if (Platform.OS === "ios") {
    return `${ayah.arabic}${iosInlineAyahMarker(ayah.ayah)}`;
  }
  return (
    <>
      {ayah.arabic}
      {marker}
    </>
  );
}

/**
 * Level A — a mushaf page. With translations/transliteration off it renders as
 * one continuous justified RTL paragraph per surah (a printed page, verses joined
 * by a gilt end-of-ayah rosette). With either on, it switches to the familiar
 * translated-mushaf layout: each ayah is a stacked block — Arabic, then
 * transliteration, then translation(s) — read top to bottom, verse by verse.
 */
export function PageLayoutRenderer({
  ayahs,
  arabicSize,
  transliterationSize,
  translationSize,
  page,
  transliteration,
  translation,
  secondTranslation,
  showTransliteration,
  showTranslation,
  translationDir,
  secondTranslationDir,
  highlightAyah,
  onAyahPress,
  tvFocusTarget,
  onItemFocus,
  onItemBlur,
  showAnnotations = false,
}: PageLayoutRendererProps) {
  const { t } = useTranslation();
  const tv = isTV();
  const { colors, tokens } = useThemeTokens();
  const { mushaf } = tokens;
  const arabicFontFamily = useArabicFontFamily();
  const groups = useMemo(() => groupBySurah(ayahs), [ayahs]);
  const interleaved = showTransliteration || showTranslation;
  const annotationHints = usePageAyahHints(ayahs, showAnnotations);
  const hintFor = (ayah: Ayah): PageAyahHint | null =>
    annotationHints?.get(`${ayah.surah}:${ayah.ayah}`) ?? null;
  const tintFor = (ayah: Ayah) => hintFor(ayah)?.tint ?? null;
  const fineHover = useFinePointerHover();
  const [tvFocusedAyah, setTvFocusedAyah] = useState<string | null>(null);
  // NF-3.21 note hint for a noted ayah: a11y "has my note", dotted underline and,
  // on desktop web, the hover / focus preview card. Tap keeps opening the
  // ayah's action sheet, which shows the note with "Open note".
  const ayahLabel = (ayah: Ayah) => {
    const base = t("quran.ayahRef", { surah: ayah.surah, ayah: ayah.ayah });
    return hintFor(ayah)?.noteId ? `${base}, ${t("quranNotes.hasNote")}` : base;
  };
  const noteUnderline = (ayah: Ayah) => {
    const color = hintFor(ayah)?.underline;
    return color ? noteUnderlineStyle(color) : null;
  };
  const noteWebProps = (ayah: Ayah) => {
    const noteId = hintFor(ayah)?.noteId;
    if (!noteId || !fineHover) return {};
    const handlers = noteHintHandlers({ surah: ayah.surah, ayah: ayah.ayah, noteId }, true);
    // Hover / focus only — a click still opens the ayah's action sheet.
    return webHintProps(handlers);
  };

  // TV: key of the block (interleaved: ayah, flow: surah group) that takes
  // initial D-pad focus.
  let tvFocusKey: string | null = null;
  if (tv && tvFocusTarget) {
    const target =
      tvFocusTarget === "first"
        ? undefined
        : ayahs.find((a) => a.surah === tvFocusTarget.surah && a.ayah === tvFocusTarget.ayah);
    const anchor = target ?? ayahs[0];
    if (anchor) {
      tvFocusKey = interleaved ? `${anchor.surah}:${anchor.ayah}` : `surah-${anchor.surah}`;
    }
  }

  // Gilt end-of-ayah rosette with the verse number centered inside, sized to
  // the running Arabic so it sits on the baseline like a printed mushaf.
  const renderMarker = (ayah: Ayah) => (
    <AyahEndMarker
      ayah={ayah.ayah}
      fontSize={arabicSize}
      color={mushaf.ink}
      fontFamily={arabicFontFamily}
    />
  );

  return (
    <MushafPageFrame page={page}>
      {groups.map((group) => {
        const meta = getSurahByNumber(group.surah);
        const startsSurah = group.ayahs[0]?.ayah === 1;
        return (
          <View key={`surah-${group.surah}`} style={styles.surahGroup}>
            {startsSurah && meta ? (
              <SurahBanner
                nameArabic={meta.nameArabic}
                nameEnglish={meta.nameEnglish}
                revelationPlace={meta.revelationPlace}
                ayahCount={meta.ayahCount}
              />
            ) : null}
            {startsSurah && meta?.bismillahPre ? (
              <ThemedText
                type="arabic"
                style={[arabicReadingLayout(arabicSize - 4, "center"), styles.bismillah]}
              >
                {BISMILLAH}
              </ThemedText>
            ) : null}

            {interleaved ? (
              group.ayahs.map((ayah) => {
                const compositeKey = `${ayah.surah}:${ayah.ayah}`;
                const ayahKey = String(ayah.ayah);
                const translit = showTransliteration
                  ? (transliteration?.[compositeKey] ?? transliteration?.[ayahKey])
                  : undefined;
                const trans = showTranslation
                  ? (translation?.[compositeKey] ?? translation?.[ayahKey])
                  : undefined;
                const second = showTranslation
                  ? (secondTranslation?.[compositeKey] ?? secondTranslation?.[ayahKey])
                  : undefined;
                const highlighted = ayahMatchesHighlight(ayah, highlightAyah);
                return (
                  <PressableScale
                    key={`${ayah.surah}:${ayah.ayah}`}
                    haptic="light"
                    scaleTo={0.995}
                    accessibilityRole="button"
                    accessibilityLabel={ayahLabel(ayah)}
                    onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
                    onFocus={() => {
                      onItemFocus?.();
                      if (tv) setTvFocusedAyah(`${ayah.surah}:${ayah.ayah}`);
                    }}
                    onBlur={() => {
                      onItemBlur?.();
                      if (tv) setTvFocusedAyah(null);
                    }}
                    {...(tvFocusKey === `${ayah.surah}:${ayah.ayah}`
                      ? { hasTVPreferredFocus: true }
                      : {})}
                    {...noteWebProps(ayah)}
                    style={[
                      styles.ayahBlock,
                      { borderBottomColor: mushaf.bandBorder },
                      highlighted
                        ? { backgroundColor: mushaf.highlight, borderRadius: Radius.sm }
                        : tintFor(ayah)
                          ? { backgroundColor: tintFor(ayah) ?? undefined, borderRadius: Radius.sm }
                          : null,
                    ]}
                  >
                    <ThemedText
                      key={`ar-${ayah.surah}-${ayah.ayah}-${arabicSize}`}
                      type="arabic"
                      style={[styles.blockArabic, { fontSize: arabicSize }, noteUnderline(ayah)]}
                    >
                      {ayahTextWithMarker(ayah, renderMarker(ayah))}
                    </ThemedText>
                    {translit ? (
                      <ThemedText
                        type="small"
                        style={[
                          styles.translit,
                          { color: colors.accentText },
                          transliterationSize ? { fontSize: transliterationSize } : null,
                        ]}
                      >
                        {translit}
                      </ThemedText>
                    ) : null}
                    {trans ? (
                      <ThemedText
                        type="small"
                        style={[
                          translationSize
                            ? { fontSize: translationSize, lineHeight: translationSize * 1.5 }
                            : null,
                          translationDir === "rtl" ? styles.rtl : null,
                        ]}
                      >
                        {trans}
                      </ThemedText>
                    ) : null}
                    {second ? (
                      <ThemedText
                        type="small"
                        themeColor="mutedForeground"
                        style={[
                          translationSize
                            ? { fontSize: translationSize, lineHeight: translationSize * 1.5 }
                            : null,
                          secondTranslationDir === "rtl" ? styles.rtl : null,
                        ]}
                      >
                        {second}
                      </ThemedText>
                    ) : null}
                    {tv &&
                    tvFocusedAyah === `${ayah.surah}:${ayah.ayah}` &&
                    hintFor(ayah)?.noteId ? (
                      <TvNoteFocusPreview surah={ayah.surah} ayah={ayah.ayah} />
                    ) : null}
                  </PressableScale>
                );
              })
            ) : tv ? (
              // TV: inline Text presses are not D-pad focusable, so the whole
              // justified paragraph is one focus stop. Select opens the playing /
              // highlighted ayah in this group, else its first ayah.
              <PressableScale
                scaleTo={0.995}
                accessibilityRole="button"
                accessibilityLabel={t("quran.ayahRef", {
                  surah: group.surah,
                  ayah: group.ayahs[0]?.ayah ?? 1,
                })}
                onPress={() => {
                  const target =
                    group.ayahs.find((a) => ayahMatchesHighlight(a, highlightAyah)) ??
                    group.ayahs[0];
                  if (target) onAyahPress?.(target.surah, target.ayah);
                }}
                onFocus={onItemFocus}
                onBlur={onItemBlur}
                {...(tvFocusKey === `surah-${group.surah}` ? { hasTVPreferredFocus: true } : {})}
                style={styles.flowTv}
              >
                <ThemedText
                  key={`flow-${group.surah}-${arabicSize}`}
                  type="arabic"
                  style={[styles.flow, { fontSize: arabicSize }]}
                >
                  {group.ayahs.map((ayah) => (
                    <ThemedText
                      key={`${ayah.surah}:${ayah.ayah}`}
                      type="arabic"
                      style={[
                        { fontSize: arabicSize },
                        ayahMatchesHighlight(ayah, highlightAyah)
                          ? { backgroundColor: mushaf.highlight }
                          : tintFor(ayah)
                            ? { backgroundColor: tintFor(ayah) ?? undefined }
                            : null,
                        noteUnderline(ayah),
                      ]}
                    >
                      {ayahTextWithMarker(ayah, renderMarker(ayah))}
                    </ThemedText>
                  ))}
                </ThemedText>
              </PressableScale>
            ) : (
              // Remount when reading size changes so justified RTL layout
              // recomputes glyph advances (avoids stale inline runs after A±).
              <ThemedText
                key={`flow-${group.surah}-${arabicSize}`}
                type="arabic"
                style={[styles.flow, { fontSize: arabicSize }]}
              >
                {group.ayahs.map((ayah) => {
                  const highlighted = ayahMatchesHighlight(ayah, highlightAyah);
                  return (
                    <ThemedText
                      key={`${ayah.surah}:${ayah.ayah}`}
                      type="arabic"
                      accessibilityRole="button"
                      accessibilityLabel={ayahLabel(ayah)}
                      onPress={() => onAyahPress?.(ayah.surah, ayah.ayah)}
                      {...noteWebProps(ayah)}
                      style={[
                        { fontSize: arabicSize },
                        highlighted
                          ? { backgroundColor: mushaf.highlight }
                          : tintFor(ayah)
                            ? { backgroundColor: tintFor(ayah) ?? undefined }
                            : null,
                        noteUnderline(ayah),
                      ]}
                    >
                      {ayahTextWithMarker(ayah, renderMarker(ayah))}
                    </ThemedText>
                  );
                })}
              </ThemedText>
            )}
          </View>
        );
      })}
    </MushafPageFrame>
  );
}

const styles = StyleSheet.create({
  surahGroup: {
    gap: Spacing.three,
    marginBottom: Spacing.two,
  },
  bismillah: {
    marginTop: Spacing.one,
    marginBottom: Spacing.one,
  },
  flow: {
    textAlign: "justify",
    writingDirection: "rtl",
  },
  flowTv: {
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  ayahBlock: {
    gap: Spacing.two,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  blockArabic: {
    writingDirection: "rtl",
  },
  translit: { fontStyle: "italic" },
  rtl: { writingDirection: "rtl" },
  marker: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerRosette: {
    position: "absolute",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
  markerNumber: {
    textAlign: "center",
    zIndex: 1,
  },
});
