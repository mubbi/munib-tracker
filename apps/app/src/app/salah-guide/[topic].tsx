import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getSalahGuideTopic } from "@/lib/salah-guide";

export default function SalahGuideTopicScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { topic: topicId } = useLocalSearchParams<{ topic: string }>();
  const topic = getSalahGuideTopic(topicId);

  return (
    <ScreenLayout
      eyebrow={t("salahGuide.eyebrow")}
      title={topic?.title ?? t("salahGuide.title")}
      subtitle={topic?.summary ?? ""}
      onBack={() => (router.canGoBack() ? router.back() : router.replace("/salah-guide"))}
    >
      <Seo path="/salah-guide" />
      {!topic ? (
        <EmptyState
          icon={{ ios: "questionmark.circle", android: "help", web: "help" }}
          title={t("salahGuide.notFound")}
          actionLabel={t("salahGuide.title")}
          onAction={() => router.replace("/salah-guide")}
        />
      ) : (
        <Stagger>
          {topic.steps.map((step, index) => (
            <Card key={step.title} padding="three">
              <View style={styles.stepRow}>
                <View style={[styles.badge, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="smallBold" style={{ color: colors.accent }}>
                    {index + 1}
                  </ThemedText>
                </View>
                <View style={styles.stepBody}>
                  <ThemedText type="smallBold">{step.title}</ThemedText>
                  <ThemedText type="small" themeColor="mutedForeground" style={styles.stepText}>
                    {step.body}
                  </ThemedText>
                </View>
              </View>
            </Card>
          ))}

          <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
            {t("salahGuide.disclaimer")}
          </ThemedText>
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stepRow: { flexDirection: "row", gap: Spacing.three },
  badge: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  stepBody: { flex: 1, gap: Spacing.one },
  stepText: { lineHeight: 22 },
  disclaimer: { textAlign: "center", paddingHorizontal: Spacing.two },
});
