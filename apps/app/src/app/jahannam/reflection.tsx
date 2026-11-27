import type { JahannamReflectionEntry } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { useCategoryHue } from "@/components/ui/use-category-hue";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { tTv } from "@/lib/i18n/t-tv";
import {
  ensureJahannamContent,
  getJahannamReflections,
  isJahannamContentReady,
} from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";
import { useChevronForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";

function ReflectionRow({ entry }: { entry: JahannamReflectionEntry }) {
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const rose = useCategoryHue("rose");
  const chevronForwardIcon = useChevronForward();

  const appLink = entry.appLink;
  const body = (
    <>
      <IconWell
        icon={{ ios: "questionmark.circle.fill", android: "help", web: "help" }}
        tint={rose.icon}
        background={rose.soft}
        well={40}
        size={18}
      />
      <View style={styles.copy}>
        <LearnProseText>{entry.question}</LearnProseText>
        {appLink ? (
          <ThemedText type="caption" style={{ color: tokens.accentOnSoft }}>
            {appLink.label}
          </ThemedText>
        ) : null}
      </View>
      {appLink ? (
        <SymbolView name={chevronForwardIcon} size={14} tintColor={colors.mutedForeground} />
      ) : null}
    </>
  );

  // A prompt without a link is reading, not a control (no dead button, G-40);
  // TV still gets a D-pad stop through TvReadableBlock.
  if (!appLink) {
    return (
      <TvReadableBlock>
        <View style={[styles.row, styles.rowFill, { backgroundColor: colors.muted }]}>{body}</View>
      </TvReadableBlock>
    );
  }
  return (
    <PressableScale
      haptic="light"
      accessibilityRole="link"
      accessibilityLabel={`${entry.question}. ${appLink.label}`}
      onPress={() => router.push(appLink.route as never)}
      style={[styles.row, styles.rowFill, { backgroundColor: colors.muted }]}
    >
      {body}
    </PressableScale>
  );
}

export default function JahannamReflectionScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const {
    ready: contentReady,
    error: contentError,
    retry: retryContent,
  } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const reflections = getJahannamReflections();
  const wide = useLearnHubLayout();
  // Wide web / tablets: reflection prompts flow into 2 columns.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 340, max: 2 });

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.reflectionTitle")}
      subtitle={t("jahannam.reflectionSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jahannam/reflection" />
      <LearnContentGate ready={contentReady} error={contentError} onRetry={retryContent}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JannahCallout tone="accent">
              {tTv(t, "jahannam.reflectionLead", "jahannam.reflectionLeadTv")}
            </JannahCallout>
            <Card>
              <SectionHeader
                title={t("jahannam.reflectionListTitle")}
                icon={{ ios: "heart.text.square.fill", android: "favorite", web: "favorite" }}
              />
              <LearnColumnsGrid columns={columns} style={styles.list}>
                {reflections.map((entry) => (
                  <ReflectionRow key={entry.id} entry={entry} />
                ))}
              </LearnColumnsGrid>
            </Card>
          </LearnReadingChrome>
          <JannahDisclaimer textKey="jahannam.disclaimer" />
        </Stagger>
      </LearnContentGate>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.three },
  // Grid cells: fill the row height (inert in the phone stack).
  rowFill: { flexGrow: 1 },
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

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/jahannam/reflection");
