import type { JahannamGateEntry } from "@munib-tracker/shared/types";
import { goBackOrReplace } from "@/lib/navigation";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getJahannamGates } from "@/lib/jahannam";

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
      <View style={styles.head}>
        <IconWell
          icon={{ ios: "door.left.hand.open", android: "door_front", web: "door_front" }}
          tint={tokens.status.warning.color}
          well={44}
          size={20}
        />
        <View style={styles.copy}>
          <ThemedText type="smallBold">{gate.label}</ThemedText>
          <ThemedText type="small" style={{ lineHeight: 22 }}>
            {gate.quranNote}
          </ThemedText>
          {gate.scholarlyNote ? (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.scholarly}>
              {gate.scholarlyNote}
            </ThemedText>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default function JahannamGatesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const gates = getJahannamGates();

  return (
    <ScreenLayout
      eyebrow={t("jahannam.eyebrow")}
      title={t("jahannam.gatesTitle")}
      subtitle={t("jahannam.gatesSubtitle")}
      onBack={() => (goBackOrReplace(router, "/jahannam" as Href))}
    >
      <Seo path="/jahannam/gates" />
      <Stagger>
        <LearnReadingChrome surface="jahannam">
          <JannahCallout tone="warning">{t("jahannam.gatesLead")}</JannahCallout>
          <Card padding="three">
            <SectionHeader
              title={t("jahannam.gatesListTitle")}
              icon={{ ios: "door.left.hand.open", android: "door_front", web: "door_front" }}
            />
            <View style={styles.list}>
              {gates.map((gate, index) => (
                <GateRow key={gate.id} gate={gate} isLast={index === gates.length - 1} />
              ))}
            </View>
          </Card>
        </LearnReadingChrome>
        <JannahDisclaimer textKey="jahannam.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.two },
  row: { paddingVertical: Spacing.three },
  head: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  copy: { flex: 1, gap: Spacing.two },
  scholarly: { lineHeight: 18, fontStyle: "italic" },
});
