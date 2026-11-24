import type { FiqhContentRef } from "@munib-tracker/shared/fiqh";
import { type Href, useRouter } from "expo-router";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

/** A ref the evidence line can show: corpus refs, a whole dataset, or an outside-corpus citation. */
export type EvidenceRef =
  | FiqhContentRef
  | { kind: "dataset"; dataset: "duroods" | "adhkar" }
  | { kind: "citation"; collection: "ahmad"; number: number; grade: "disputed" };

/** Printed number: Muslim refs show the Abd al-Baqi number, everything else the corpus number. */
function printedNumber(ref: Extract<EvidenceRef, { kind: "hadith" }>): string {
  if (ref.collection === "muslim" && ref.arabicNumber) return ref.arabicNumber.split(".")[0] ?? "";
  return String(ref.number);
}

/**
 * Compact evidence line (NF-3.3 / NF-3.5): "Bukhari 887 · Qur'an 24:61 ·
 * Tirmidhi 3585 (gradings differ)". Qur'an refs open the reader at the ayah;
 * hadith refs stay plain text (the reader's numbering differs from print — see
 * `lib/reference-link.ts`). Never renders scripture text itself.
 */
export function EvidenceLine({ refs }: { refs: readonly EvidenceRef[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors } = useThemeTokens();
  const visible = refs.filter((ref) => ref.kind !== "book");
  if (visible.length === 0) return null;

  return (
    <View style={styles.row} accessibilityRole="text">
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("seasonalEvidence.label")}
      </ThemedText>
      {visible.map((ref, index) => {
        const sep = index > 0 ? " · " : " ";
        if (ref.kind === "quran") {
          const label = t("seasonalEvidence.quran", {
            ref: ref.ayahTo
              ? `${ref.surah}:${ref.ayahFrom}–${ref.ayahTo}`
              : `${ref.surah}:${ref.ayahFrom}`,
          });
          return (
            <Fragment key={`q${ref.surah}:${ref.ayahFrom}`}>
              <ThemedText type="caption" themeColor="mutedForeground">
                {sep}
              </ThemedText>
              <PressableScale
                accessibilityRole="link"
                accessibilityLabel={label}
                haptic="selection"
                onPress={() =>
                  router.push({
                    pathname: "/quran/[surah]",
                    params: { surah: String(ref.surah), ayah: String(ref.ayahFrom) },
                  } as Href)
                }
              >
                <ThemedText type="caption" style={{ color: colors.accent }}>
                  {label}
                </ThemedText>
              </PressableScale>
            </Fragment>
          );
        }
        let label: string;
        if (ref.kind === "hadith") {
          label = t("seasonalEvidence.hadith", {
            collection: t(`seasonalEvidence.collection.${ref.collection}`),
            number: printedNumber(ref),
          });
          if (ref.grade === "disputed") label += ` (${t("seasonalEvidence.gradingsDiffer")})`;
          else if (ref.grade === "hasan") label += ` (${t("seasonalEvidence.hasan")})`;
        } else if (ref.kind === "citation") {
          label = `${t("seasonalEvidence.hadith", {
            collection: t(`seasonalEvidence.collection.${ref.collection}`),
            number: String(ref.number),
          })} (${t("seasonalEvidence.gradingsDiffer")})`;
        } else if (ref.kind === "dataset") {
          label = t(`seasonalEvidence.dataset.${ref.dataset}`);
        } else {
          label = "";
        }
        return (
          <ThemedText key={`${ref.kind}-${label}`} type="caption" themeColor="mutedForeground">
            {sep}
            {label}
          </ThemedText>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginTop: Spacing.one },
});
