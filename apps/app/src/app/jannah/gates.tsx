import type { JannahGate } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { HadithCitationBookmarkButton } from "@/components/jannah/bookmark-button";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { LearnReadingChrome, useReadingTypography } from "@/components/reading-typography-context";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getJannahGates } from "@/lib/jannah";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { goBackOrReplace } from "@/lib/navigation";

const GATE_ICONS: Record<string, AppIcon> = {
  salah: { ios: "figure.stand", android: "self_improvement", web: "self_improvement" },
  charity: { ios: "banknote.fill", android: "payments", web: "payments" },
  rayyan: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  jihad: { ios: "shield.fill", android: "shield", web: "shield" },
  hajj: { ios: "building.2.fill", android: "mosque", web: "mosque" },
  multiple: { ios: "door.left.hand.open", android: "door_front", web: "door_front" },
};

function GateRow({ gate, isLast }: { gate: JannahGate; isLast: boolean }) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { sizes } = useReadingTypography();
  const icon = GATE_ICONS[gate.id] ?? {
    ios: "door.left.hand.open",
    android: "door_front",
    web: "door_front",
  };

  return (
    <View
      style={[
        styles.gateRow,
        !isLast && {
          borderBottomColor: tokens.hairline,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
    >
      <View style={styles.gateHead}>
        <IconWell icon={icon} tint={colors.accent} well={44} size={20} />
        <View style={styles.gateCopy}>
          <ThemedText type="smallBold">{gate.name}</ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.deedSummary}>
            {gate.deedSummary}
          </ThemedText>
        </View>
      </View>
      {gate.hadith.map((ref) => (
        <View
          key={`${gate.id}-${ref.citation}`}
          style={[styles.quote, { backgroundColor: tokens.accentSoft }]}
        >
          <View style={styles.quoteMeta}>
            <ThemedText type="caption" style={{ color: colors.accent, flex: 1 }}>
              {ref.collection} · {ref.citation}
            </ThemedText>
            <View style={styles.quoteMetaActions}>
              {ref.grade ? (
                <Pill
                  label={t(`jannah.grade.${ref.grade}`)}
                  compact
                  color={tokens.status.success.color}
                  background={tokens.status.success.soft}
                />
              ) : null}
              <HadithCitationBookmarkButton collection={ref.collection} citation={ref.citation} />
            </View>
          </View>
          <ThemedText
            type="small"
            themeColor="mutedForeground"
            style={[
              styles.quoteText,
              { fontSize: sizes.translation, lineHeight: sizes.translation * 1.45 },
            ]}
          >
            “{ref.excerpt}”
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

export default function JannahGatesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const gates = getJannahGates();

  return (
    <ScreenLayout
      eyebrow={t("jannah.eyebrow")}
      title={t("jannah.gatesTitle")}
      subtitle={t("jannah.gatesSubtitle")}
      onBack={() => goBackOrReplace(router, "/jannah")}
    >
      <Seo path="/jannah/gates" />
      <Stagger>
        <LearnReadingChrome surface="jannah">
          <JannahCallout tone="accent">{t("jannah.gatesLead")}</JannahCallout>

          <Card padding="three">
            <SectionHeader
              title={t("jannah.gatesListTitle")}
              icon={{ ios: "door.left.hand.open", android: "door_front", web: "door_front" }}
            />
            <View style={styles.list}>
              {gates.map((gate, index) => (
                <GateRow key={gate.id} gate={gate} isLast={index === gates.length - 1} />
              ))}
            </View>
          </Card>
        </LearnReadingChrome>

        <JannahDisclaimer />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: { marginTop: Spacing.two },
  gateRow: { paddingVertical: Spacing.three, gap: Spacing.three },
  gateHead: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  gateCopy: { flex: 1, gap: Spacing.one },
  deedSummary: { lineHeight: 18 },
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
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  quoteMetaActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  quoteText: { lineHeight: 22, fontStyle: "italic" },
});
