import type { ReactNode } from "react";
import type { StyleProp, TextStyle } from "react-native";

import { EnglishMeaningLabel } from "@/components/content/english-meaning-label";
import { useScriptureMeaning } from "@/hooks/use-scripture-meaning";
import type { QuranMeaningRef } from "@/lib/scripture-meaning";

/**
 * D45 render helper for a Qur'an / hadith meaning excerpt authored in English.
 * `children` renders the resolved text in the caller's own style; the "English meaning" label is
 * appended when a non-English UI has no dataset translation for it.
 *
 * ```tsx
 * <ScriptureMeaning english={verse.excerpt} quranRef={verse}>
 *   {(text) => <LearnProseText>{text}</LearnProseText>}
 * </ScriptureMeaning>
 * ```
 */
export function ScriptureMeaning({
  english,
  quranRef,
  labelStyle,
  children,
}: {
  english: string | undefined | null;
  /** Ayah span for a Qur'an excerpt; omit for hadith / dua text. */
  quranRef?: QuranMeaningRef | null;
  /** Override for the "English meaning" label (e.g. on brand-coloured heroes). */
  labelStyle?: StyleProp<TextStyle>;
  children: (text: string) => ReactNode;
}) {
  const meaning = useScriptureMeaning(english, quranRef);
  if (!english?.trim()) return null;
  return (
    <>
      {children(meaning.text)}
      <EnglishMeaningLabel visible={meaning.englishFallback} style={labelStyle} />
    </>
  );
}
