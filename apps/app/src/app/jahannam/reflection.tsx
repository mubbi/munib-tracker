import type { JahannamReflectionEntry } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  ensureJahannamContent,
  getJahannamReflections,
  isJahannamContentReady,
} from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronForward } from "@/lib/rtl";

function ReflectionRow({ entry }: { entry: JahannamReflectionEntry }) {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevronForwardIcon = useChevronForward();

  return (
    <PressableScale
      haptic="light"
      accessibilityRole="button"
      accessibilityLabel={entry.question}
      onPress={() => {
        if (entry.appLink) router.push(entry.appLink.route as never);
      }}
      style={[styles.row, { backgroundColor: colors.muted }]}
    >
      <IconWell
        icon={{ ios: "questionmark.circle.fill", android: "help", web: "help" }}
        tint={tokens.status.warning.color}
        well={40}
        size={18}
      />
      <View style={styles.copy}>
        <ThemedText type="small" style={{ lineHeight: 22 }}>
          {entry.question}
        </ThemedText>
        {entry.appLink ? (
          <ThemedText type="caption" style={{ color: colors.accent }}>
            {entry.appLink.label}
          </ThemedText>
        ) : null}
      </View>
      {entry.appLink ? (
        <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
      ) : null}
    </PressableScale>
  );
}

export default function JahannamReflectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const reflections = getJahannamReflections();

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.reflectionTitle")}
      subtitle={t("jahannam.reflectionSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
    >
      <Seo path="/jahannam/reflection" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JannahCallout tone="accent">{t("jahannam.reflectionLead")}</JannahCallout>
            <Card padding="three">
              <SectionHeader
                title={t("jahannam.reflectionListTitle")}
                icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
              />
              <View style={styles.list}>
                {reflections.map((entry) => (
                  <ReflectionRow key={entry.id} entry={entry} />
                ))}
              </View>
            </Card>
          </LearnReadingChrome>
          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three, gap: Spacing.two },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  copy: { flex: 1, gap: Spacing.half },
});
