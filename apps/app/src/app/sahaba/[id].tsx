import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  ContentInlineLink,
  ContentInlineLinkGroup,
} from "@/components/content/content-inline-link";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentLoading } from "@/components/learn-content-loading";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { goBackOrReplace } from "@/lib/navigation";
import {
  ensureSahabaContent,
  getBattlesFigureIdForSahaba,
  getSahabaProfile,
  getSahabaProfiles,
  isSahabaContentReady,
} from "@/lib/sahaba";
import { articleSchema } from "@/lib/seo/structured-data";

export function generateStaticParams(): Array<{ id: string }> {
  // Prefer cached English ids; fall back to known set when content not yet loaded.
  const profiles = getSahabaProfiles();
  if (profiles.length > 0) return profiles.map((profile) => ({ id: profile.id }));
  return [
    "abu-bakr",
    "umar",
    "uthman",
    "ali",
    "talha",
    "zubayr",
    "abd-al-rahman-ibn-awf",
    "saad-ibn-abi-waqqas",
    "saeed-ibn-zayd",
    "abu-ubaydah",
    "hamza",
    "zayd-ibn-haritha",
    "jafar-ibn-abi-talib",
    "abbas-ibn-abd-al-muttalib",
    "hasan-ibn-ali",
    "husayn-ibn-ali",
    "khadijah",
    "aisha",
    "fatimah",
    "hafsa",
    "umm-salama",
    "sumayyah",
    "nusaybah",
    "bilal",
    "salman-al-farisi",
    "abu-dharr",
    "musab-ibn-umayr",
    "abdullah-ibn-masud",
    "abu-hurayrah",
    "khalid-ibn-al-walid",
  ].map((id) => ({ id }));
}

export default function SahabaProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { ready: contentReady } = useEnsureContent(ensureSahabaContent, isSahabaContentReady);

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize on language/content
  const profile = useMemo(
    () => (contentReady ? getSahabaProfile(id) : undefined),
    [id, i18n.language, contentReady],
  );
  const battlesFigureId = profile ? getBattlesFigureIdForSahaba(profile.id) : undefined;
  const paragraphs = profile?.body.split("\n\n") ?? [];

  const detailPath = profile ? `/sahaba/${profile.id}` : "/sahaba";
  const crumbs = profile
    ? [
        { name: t("tabs.home"), path: "/" },
        { name: t("sahaba.title"), path: "/sahaba" },
        { name: profile.name, path: detailPath },
      ]
    : undefined;

  if (contentReady && !profile) {
    return (
      <ScreenLayout
        eyebrow={t("sahaba.eyebrow")}
        title={t("sahaba.title")}
        onBack={() => goBackOrReplace(router, "/sahaba" as Href)}
      >
        <EmptyState
          icon={{ ios: "person", android: "person", web: "person" }}
          title={t("sahaba.notFound")}
        />
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("sahaba.eyebrow")}
      title={profile?.name ?? t("sahaba.title")}
      subtitle={profile?.epithet}
      onBack={() => goBackOrReplace(router, "/sahaba" as Href)}
    >
      <Seo
        path={detailPath}
        title={profile?.name}
        description={profile?.summary}
        breadcrumbs={crumbs}
        jsonLd={
          profile
            ? articleSchema({
                headline: profile.name,
                description: profile.summary,
                path: detailPath,
              })
            : undefined
        }
      />
      {!contentReady ? (
        <LearnContentLoading />
      ) : profile ? (
        <LearnReadingChrome
          surface="battles"
          listenText={[profile.summary, profile.body].filter(Boolean).join("\n\n")}
        >
          <Stagger>
            <Card padding="three">
              <View style={styles.header}>
                <View style={styles.titleBlock}>
                  {profile.arabicName ? (
                    <ThemedText type="arabic" style={styles.arabicName}>
                      {profile.arabicName}
                    </ThemedText>
                  ) : null}
                  <ThemedText type="smallBold">{profile.name}</ThemedText>
                  {profile.epithet ? (
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {profile.epithet}
                    </ThemedText>
                  ) : null}
                </View>
                {profile.lifespan ? (
                  <Pill
                    label={profile.lifespan}
                    compact
                    color={colors.mutedForeground}
                    background={colors.muted}
                  />
                ) : null}
              </View>

              <View style={styles.tags}>
                {profile.categories.map((category) => (
                  <Pill
                    key={category}
                    label={t(`sahaba.category.${category}`)}
                    compact
                    color={colors.accentText}
                    background={tokens.accentSoft}
                  />
                ))}
              </View>

              <JannahCallout tone="info">{profile.summary}</JannahCallout>
            </Card>

            <Card padding="three">
              <SectionHeader
                title={t("sahaba.profileBodyTitle")}
                icon={{ ios: "text.book.closed", android: "article", web: "article" }}
              />
              <View style={styles.body}>
                {paragraphs.map((paragraph) => (
                  <ThemedText key={paragraph.slice(0, 24)} type="small" style={styles.paragraph}>
                    {paragraph}
                  </ThemedText>
                ))}
              </View>
            </Card>

            <Card padding="three">
              <SectionHeader
                title={t("sahaba.relatedTitle")}
                icon={{ ios: "link", android: "link", web: "link" }}
              />
              <ContentInlineLinkGroup>
                {battlesFigureId ? (
                  <ContentInlineLink
                    label={t("sahaba.linkBattlesFigures")}
                    onPress={() => router.push(`/battles/figures?focus=${battlesFigureId}` as Href)}
                  />
                ) : null}
                <ContentInlineLink
                  label={t("sahaba.linkSeerah")}
                  onPress={() => router.push("/seerah" as Href)}
                />
                <ContentInlineLink
                  label={t("sahaba.linkHistory")}
                  onPress={() => router.push("/history" as Href)}
                />
              </ContentInlineLinkGroup>
            </Card>

            <JannahDisclaimer textKey="sahaba.disclaimer" />
          </Stagger>
        </LearnReadingChrome>
      ) : null}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  titleBlock: { flex: 1, gap: Spacing.one },
  arabicName: { fontSize: 22, lineHeight: 34 },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  body: { gap: Spacing.three, marginTop: Spacing.two },
  paragraph: { lineHeight: 22 },
});
