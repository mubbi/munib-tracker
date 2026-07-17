import { ZAKAT_HADITH_REFS, ZAKAT_QURAN_REFS } from "@munib-tracker/shared/content/zakat-guide";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/ui/pill";
import { Sheet } from "@/components/ui/sheet";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ZAKAT_CALC_SECTIONS, type ZakatCalcSectionId } from "@/lib/zakat-section-info";

type ZakatSectionInfoSheetProps = {
  sectionId: ZakatCalcSectionId | null;
  visible: boolean;
  onClose: () => void;
};

/**
 * Bottom sheet with a short Islamic ruling summary + Qur'an/hadith excerpts for
 * a calculator section. Educational only — links to the longer topic guides.
 */
export function ZakatSectionInfoSheet({ sectionId, visible, onClose }: ZakatSectionInfoSheetProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const router = useRouter();
  const meta = sectionId ? ZAKAT_CALC_SECTIONS[sectionId] : null;

  const refs = useMemo(() => {
    if (!meta)
      return {
        quran: [] as { label: string; excerpt: string }[],
        hadith: [] as {
          label: string;
          excerpt: string;
          grade?: string;
        }[],
      };

    const quran: { label: string; excerpt: string }[] = [];
    const hadith: { label: string; excerpt: string; grade?: string }[] = [];

    for (const ref of meta.refs) {
      if (ref.kind === "quran" && ref.sharedIndex != null) {
        const base = ZAKAT_QURAN_REFS[ref.sharedIndex];
        if (!base) continue;
        quran.push({
          label: base.label,
          excerpt: t(`zakat.quran.${ref.sharedIndex}.excerpt`),
        });
      }
      if (ref.kind === "hadith" && ref.sharedIndex != null) {
        const base = ZAKAT_HADITH_REFS[ref.sharedIndex];
        if (!base) continue;
        hadith.push({
          label: `${base.collection} · ${base.citation}`,
          excerpt: t(`zakat.hadith.${ref.sharedIndex}.excerpt`),
          grade: base.grade,
        });
      }
    }

    const localLabel = t(`zakat.sectionInfo.${sectionId}.localRefLabel`, {
      defaultValue: "",
    });
    const localExcerpt = t(`zakat.sectionInfo.${sectionId}.localRefExcerpt`, {
      defaultValue: "",
    });
    if (localLabel && localExcerpt) {
      quran.push({ label: localLabel, excerpt: localExcerpt });
    }

    return { quran, hadith };
  }, [meta, sectionId, t]);

  if (!sectionId || !meta) return null;

  const openGuide = () => {
    if (!meta.guideTopic) return;
    onClose();
    router.push({ pathname: "/zakat/[topic]", params: { topic: meta.guideTopic } });
  };

  return (
    <Sheet visible={visible} onClose={onClose} variant="bottom" solid>
      <ThemedText type="subtitle">{t(`zakat.sectionInfo.${sectionId}.title`)}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.lede}>
        {t("zakat.sectionInfo.educational")}
      </ThemedText>

      <ThemedText type="small" style={[styles.body, { color: colors.foreground }]}>
        {t(`zakat.sectionInfo.${sectionId}.body`)}
      </ThemedText>

      {refs.quran.length > 0 ? (
        <View style={styles.block}>
          <ThemedText type="smallBold">{t("jannah.quranTitle")}</ThemedText>
          {refs.quran.map((item) => (
            <View
              key={item.label}
              style={[
                styles.quote,
                { backgroundColor: tokens.accentSoft, borderLeftColor: colors.accent },
              ]}
            >
              <ThemedText type="caption" style={{ color: colors.accent, fontWeight: "700" }}>
                {item.label}
              </ThemedText>
              <ThemedText type="small" style={{ color: colors.foreground, lineHeight: 20 }}>
                {item.excerpt}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      {refs.hadith.length > 0 ? (
        <View style={styles.block}>
          <ThemedText type="smallBold">{t("jannah.hadithTitle")}</ThemedText>
          {refs.hadith.map((item) => (
            <View key={item.label} style={[styles.quoteMuted, { backgroundColor: colors.muted }]}>
              <View style={styles.hadithTop}>
                <ThemedText type="caption" style={{ color: colors.accent, flex: 1 }}>
                  {item.label}
                </ThemedText>
                {item.grade ? (
                  <Pill
                    label={t(`jannah.grade.${item.grade}`)}
                    compact
                    color={tokens.status.success.color}
                    background={tokens.status.success.soft}
                  />
                ) : null}
              </View>
              <ThemedText type="small" themeColor="mutedForeground" style={{ lineHeight: 20 }}>
                {item.excerpt}
              </ThemedText>
            </View>
          ))}
        </View>
      ) : null}

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.footnote}>
        {t("zakat.sectionInfo.footnote")}
      </ThemedText>

      {meta.guideTopic ? (
        <Button
          label={t("zakat.sectionInfo.openGuide")}
          variant="secondary"
          onPress={openGuide}
          fullWidth
          style={styles.guideBtn}
        />
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  lede: { marginTop: Spacing.one, marginBottom: Spacing.three, lineHeight: 18 },
  body: { lineHeight: 22, marginBottom: Spacing.three },
  block: { gap: Spacing.two, marginBottom: Spacing.three },
  quote: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderStartWidth: 3,
  },
  quoteMuted: {
    gap: Spacing.one,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  hadithTop: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  footnote: { lineHeight: 18, marginBottom: Spacing.three },
  guideBtn: { marginBottom: Spacing.two },
});
