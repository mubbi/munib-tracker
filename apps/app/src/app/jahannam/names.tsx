import type { JahannamNameEntry } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
import { QuranAyahBookmarkButton } from "@/components/jannah/bookmark-button";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureJahannamContent, getJahannamNames, isJahannamContentReady } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";

function NameRow({ entry, isLast }: { entry: JahannamNameEntry; isLast: boolean }) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();

  return (
    <View
      style={[
        styles.row,
        !isLast && {
          borderBottomColor: tokens.hairline,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.head}>
        <IconWell
          icon={{
            ios: "flame.fill",
            android: "local_fire_department",
            web: "local_fire_department",
          }}
          tint={tokens.status.warning.color}
          well={44}
          size={20}
        />
        <View style={styles.copy}>
          <LearnProseText proseRole="title">
            {entry.name} ({entry.transliteration})
          </LearnProseText>
          <LearnProseText proseRole="caption" themeColor="mutedForeground">
            {entry.meaning}
          </LearnProseText>
        </View>
      </View>
      <View style={[styles.quote, { backgroundColor: tokens.accentSoft }]}>
        <View style={styles.quoteMeta}>
          <ReferenceLine reference={entry.quran.label} />
          <QuranAyahBookmarkButton surah={entry.quran.surah} ayah={entry.quran.ayahFrom} />
        </View>
        <LearnProseText themeColor="mutedForeground">{entry.quran.excerpt}</LearnProseText>
      </View>
      <LearnProseText>{entry.context}</LearnProseText>
      <LearnProseText proseRole="caption" themeColor="mutedForeground" style={styles.tafsir}>
        {t("jahannam.tafsirNote")}: {entry.tafsirNote}
      </LearnProseText>
      {entry.scholarlyNote ? (
        <LearnProseText proseRole="caption" themeColor="mutedForeground">
          {entry.scholarlyNote}
        </LearnProseText>
      ) : null}
    </View>
  );
}

export default function JahannamNamesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const names = getJahannamNames();

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.namesTitle")}
      subtitle={t("jahannam.namesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
    >
      <Seo path="/jahannam/names" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JannahCallout tone="warning">{t("jahannam.namesLead")}</JannahCallout>
            <Card padding="three">
              <SectionHeader
                title={t("jahannam.namesListTitle")}
                icon={{
                  ios: "flame.fill",
                  android: "local_fire_department",
                  web: "local_fire_department",
                }}
              />
              <View style={styles.list}>
                {names.map((entry, index) => (
                  <NameRow key={entry.id} entry={entry} isLast={index === names.length - 1} />
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
  list: { marginTop: Spacing.two },
  row: { paddingVertical: Spacing.three, gap: Spacing.three },
  head: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  copy: { flex: 1, gap: Spacing.one },
  quote: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  quoteMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  tafsir: { fontStyle: "italic" },
});
