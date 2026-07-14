import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureQuranGuideContent,
  getQuranGuideStructureLevels,
  isQuranGuideContentReady,
} from "@/lib/quran-guide";

export default function LearnQuranStructureScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { ready: contentReady } = useEnsureContent(
    ensureQuranGuideContent,
    isQuranGuideContentReady,
  );
  const levels = getQuranGuideStructureLevels();

  return (
    <ScreenLayout
      readingProgress
      reportKind="learn_quran"
      eyebrow={t("learnQuran.eyebrow")}
      title={t("learnQuran.structureTitle")}
      subtitle={t("learnQuran.structureSubtitle")}
      onBack={() => goBackOrReplace(router, "/learn-quran" as Href)}
    >
      <Seo path="/learn-quran/structure" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <JannahCallout tone="info">{t("learnQuran.structureIntro")}</JannahCallout>

          <LearnReadingChrome surface="learn_quran">
            <Card padding="three">
              <SectionHeader
                title={t("learnQuran.structurePyramid")}
                icon={{ ios: "square.stack.3d.up.fill", android: "layers", web: "layers" }}
              />
              <View style={styles.pyramid}>
                {levels.map((level, index) => (
                  <View key={level.id} style={styles.levelBlock}>
                    {index > 0 ? (
                      <ThemedText type="caption" themeColor="mutedForeground" style={styles.arrow}>
                        ↓
                      </ThemedText>
                    ) : null}
                    <View
                      style={[
                        styles.levelCard,
                        {
                          backgroundColor: tokens.accentSoft,
                          borderColor: colors.accent,
                          width: `${Math.max(55, 100 - index * 6)}%` as `${number}%`,
                        },
                      ]}
                    >
                      <ThemedText type="smallBold" style={{ color: colors.accent }}>
                        {level.label}
                      </ThemedText>
                      <ThemedText type="title" style={styles.count}>
                        {level.count}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground" style={styles.detail}>
                        {level.detail}
                      </ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          </LearnReadingChrome>

          <JannahDisclaimer textKey="learnQuran.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  pyramid: { marginTop: Spacing.three, alignItems: "center", gap: Spacing.one },
  levelBlock: { alignItems: "center", width: "100%" },
  arrow: { marginVertical: Spacing.one },
  levelCard: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    gap: Spacing.one,
  },
  count: { lineHeight: 32 },
  detail: { textAlign: "center", lineHeight: 18 },
});
