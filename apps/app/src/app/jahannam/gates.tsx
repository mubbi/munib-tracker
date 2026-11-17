import type { JahannamGateEntry } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  LearnColumnsGrid,
  LearnTile,
  learnColumnsFor,
  useLearnHubLayout,
} from "@/components/jannah/hub-layout";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnContentGate } from "@/components/learn-content-loading";
import { LearnProseText, LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Spacing } from "@/constants/theme";
import { useEnsureContent } from "@/hooks/use-ensure-content";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { ensureJahannamContent, getJahannamGates, isJahannamContentReady } from "@/lib/jahannam";
import { goBackOrReplace } from "@/lib/navigation";

function GateRow({ gate, isLast }: { gate: JahannamGateEntry; isLast: boolean }) {
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
      <TvReadableBlock>
        <View style={styles.head}>
          <IconWell
            icon={{ ios: "door.left.hand.open", android: "door_front", web: "door_front" }}
            tint={tokens.status.warning.color}
            well={44}
            size={20}
          />
          <View style={styles.copy}>
            <LearnProseText proseRole="title">{gate.label}</LearnProseText>
            <LearnProseText>{gate.quranNote}</LearnProseText>
            {gate.scholarlyNote ? (
              <LearnProseText
                proseRole="caption"
                themeColor="mutedForeground"
                style={styles.scholarly}
              >
                {gate.scholarlyNote}
              </LearnProseText>
            ) : null}
          </View>
        </View>
      </TvReadableBlock>
    </View>
  );
}

export default function JahannamGatesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { ready: contentReady } = useEnsureContent(ensureJahannamContent, isJahannamContentReady);
  const wide = useLearnHubLayout();
  // Wide web / tablets: gate cards flow into 2–3 columns.
  const columns = learnColumnsFor(wide.contentWidth - Spacing.three * 2, { minCell: 340, max: 3 });
  const gates = getJahannamGates();

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.gatesTitle")}
      subtitle={t("jahannam.gatesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jahannam" as Href)}
      maxContentWidth={wide.maxContentWidth}
    >
      <Seo path="/jahannam/gates" />
      <LearnContentGate ready={contentReady}>
        <Stagger>
          <LearnReadingChrome surface="jahannam">
            <JannahCallout tone="warning">{t("jahannam.gatesLead")}</JannahCallout>
            <Card padding="three">
              <SectionHeader
                title={t("jahannam.gatesListTitle")}
                icon={{ ios: "door.left.hand.open", android: "door_front", web: "door_front" }}
              />
              <LearnColumnsGrid
                columns={columns}
                gap={Spacing.three}
                stackGap={0}
                style={styles.list}
              >
                {gates.map((gate, index) => (
                  <LearnTile key={gate.id} tiled={columns > 1}>
                    <GateRow gate={gate} isLast={columns > 1 || index === gates.length - 1} />
                  </LearnTile>
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
  list: { marginTop: Spacing.two },
  row: { paddingVertical: Spacing.three },
  head: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  copy: { flex: 1, gap: Spacing.two },
  scholarly: { fontStyle: "italic" },
});
