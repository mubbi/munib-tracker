import type { DestructiveSinItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { JannahCallout } from "@/components/jannah/primitives";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconWell } from "@/components/ui/icon-well";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { useChevronForward } from "@/lib/rtl";

const LADDER_STEPS = [
  { key: "gravest" as const, tone: "danger" as const },
  { key: "seven" as const, tone: "warning" as const },
  { key: "consumes" as const, tone: "info" as const },
];

const SEAL_ICON: AppIcon = {
  ios: "exclamationmark.shield.fill",
  android: "gpp_bad",
  web: "gpp_bad",
};

/** Warning ladder + seven seals + bankrupt/hope for Jahannam destructive-sins. */
export function WarningLadderBlock({ items }: { items: DestructiveSinItem[] }) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();

  const seals = items
    .filter((item) => item.kind !== "bankrupt")
    .slice()
    .sort((a, b) => a.order - b.order);
  const bankrupt = items.find((item) => item.kind === "bankrupt");

  return (
    <View style={styles.stack}>
      <JannahCallout tone="warning">{t("jahannam.mizan.warningCallout")}</JannahCallout>

      <View style={styles.ladder}>
        {LADDER_STEPS.map((step) => {
          const palette = tokens.status[step.tone];
          return (
            <View
              key={step.key}
              style={[
                styles.ladderStep,
                { backgroundColor: palette.soft, borderColor: withAlpha(palette.color, 0.3) },
              ]}
            >
              <ThemedText type="caption" style={{ color: palette.color, fontWeight: "700" }}>
                {t(`jahannam.mizan.ladder.${step.key}`)}
              </ThemedText>
            </View>
          );
        })}
      </View>

      <Card padding="three">
        <SectionHeader
          title={t("jahannam.mizan.sevenTitle")}
          icon={{ ios: "shield.lefthalf.filled", android: "security", web: "security" }}
        />
        <View style={styles.list}>
          {seals.map((item) => {
            const row = (
              <View
                style={[
                  styles.sealRow,
                  { backgroundColor: tokens.status.danger.soft, borderColor: tokens.hairline },
                ]}
              >
                <View style={styles.sealNumber}>
                  <ThemedText type="smallBold" style={{ color: tokens.status.danger.color }}>
                    {item.order}
                  </ThemedText>
                </View>
                <IconWell
                  icon={SEAL_ICON}
                  tint={tokens.status.danger.color}
                  background={withAlpha(tokens.status.danger.color, 0.12)}
                  well={36}
                  size={16}
                />
                <View style={styles.sealText}>
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" style={styles.summary}>
                    {item.summary}
                  </ThemedText>
                </View>
                {item.route ? (
                  <IconWell
                    icon={chevronForward}
                    tint={colors.mutedForeground}
                    background="transparent"
                    well={28}
                    size={14}
                  />
                ) : null}
              </View>
            );

            if (!item.route) return <View key={item.id}>{row}</View>;

            return (
              <PressableScale
                key={item.id}
                onPress={() => router.push(item.route as never)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
              >
                {row}
              </PressableScale>
            );
          })}
        </View>
      </Card>

      {bankrupt ? (
        <View
          style={[
            styles.bankrupt,
            {
              backgroundColor: tokens.status.danger.soft,
              borderColor: tokens.status.danger.color,
            },
          ]}
        >
          <SectionHeader
            title={t("jahannam.mizan.bankruptTitle")}
            icon={{
              ios: "creditcard.trianglebadge.exclamationmark",
              android: "money_off",
              web: "money_off",
            }}
          />
          <ThemedText type="small" style={{ color: colors.foreground, marginTop: Spacing.two }}>
            {bankrupt.summary}
          </ThemedText>
          {bankrupt.route ? (
            <PressableScale
              onPress={() => router.push(bankrupt.route as never)}
              accessibilityRole="button"
              accessibilityLabel={t("jahannam.mizan.bankruptLink")}
              style={styles.bankruptLink}
            >
              <ThemedText type="smallBold" style={{ color: tokens.status.danger.color }}>
                {t("jahannam.mizan.bankruptLink")}
              </ThemedText>
            </PressableScale>
          ) : null}
        </View>
      ) : null}

      <JannahCallout tone="success">{t("jahannam.mizan.hopeCallout")}</JannahCallout>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  ladder: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  ladderStep: {
    flexGrow: 1,
    flexBasis: "30%",
    minWidth: 96,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
  },
  list: { gap: Spacing.two, marginTop: Spacing.three },
  sealRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
  },
  sealNumber: {
    width: 22,
    alignItems: "center",
  },
  sealText: { flex: 1, gap: 2 },
  summary: { lineHeight: 16 },
  bankrupt: {
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  bankruptLink: { marginTop: Spacing.three },
});
