import type { CharacterDestroyerItem, CharacterTraitItem } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ReferenceLine } from "@/components/content/reference-line";
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

const TRAIT_ICONS: Record<string, AppIcon> = {
  truthfulness: { ios: "checkmark.seal.fill", android: "verified", web: "verified" },
  patience: { ios: "hourglass", android: "hourglass_empty", web: "hourglass_empty" },
  anger: { ios: "flame.fill", android: "local_fire_department", web: "local_fire_department" },
  forgiveness: { ios: "heart.fill", android: "favorite", web: "favorite" },
  humility: { ios: "person.fill", android: "person", web: "person" },
  trustworthiness: { ios: "lock.shield.fill", android: "verified_user", web: "verified_user" },
  parents: { ios: "house.fill", android: "home", web: "home" },
  speech: { ios: "text.bubble.fill", android: "chat", web: "chat" },
  smiling: { ios: "face.smiling.fill", android: "sentiment_satisfied", web: "sentiment_satisfied" },
  justice: { ios: "scalemass.fill", android: "balance", web: "balance" },
};

const FALLBACK_ICON: AppIcon = {
  ios: "star.fill",
  android: "star",
  web: "star",
};

function traitReference(trait: CharacterTraitItem): string | undefined {
  if (trait.quran?.label) return trait.quran.label;
  if (trait.hadith) return `${trait.hadith.collection} ${trait.hadith.citation}`;
  return undefined;
}

/** Virtue mosaic + guardrails list for Jannah character. */
export function VirtueMosaicBlock({
  traits,
  destroyers,
}: {
  traits: CharacterTraitItem[];
  destroyers: CharacterDestroyerItem[];
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const danger = tokens.status.danger;

  return (
    <View style={styles.stack}>
      <JannahCallout tone="accent">{t("jannah.mizan.weightCallout")}</JannahCallout>

      <Card padding="three">
        <SectionHeader
          title={t("jannah.mizan.traitsTitle")}
          subtitle={t("jannah.mizan.buildsHint")}
          icon={{ ios: "person.fill.checkmark", android: "verified_user", web: "verified_user" }}
        />
        <View style={styles.mosaic}>
          {traits.map((trait, index) => {
            const tint = index % 2 === 0 ? colors.accent : tokens.status.success.color;
            const soft = index % 2 === 0 ? tokens.accentSoft : tokens.status.success.soft;
            const ref = traitReference(trait);
            return (
              <View
                key={trait.id}
                accessibilityLabel={ref ? `${trait.title}. ${ref}` : trait.title}
                style={[styles.tile, { backgroundColor: soft, borderColor: withAlpha(tint, 0.25) }]}
              >
                <IconWell
                  icon={TRAIT_ICONS[trait.iconKey] ?? FALLBACK_ICON}
                  tint={tint}
                  background={withAlpha(tint, 0.12)}
                  well={36}
                  size={16}
                />
                <ThemedText type="smallBold" numberOfLines={2}>
                  {trait.title}
                </ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={4}>
                  {trait.summary}
                </ThemedText>
                {ref ? <ReferenceLine reference={ref} /> : null}
              </View>
            );
          })}
        </View>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("jannah.mizan.destroysTitle")}
          subtitle={t("jannah.mizan.destroysHint")}
          icon={{
            ios: "exclamationmark.shield.fill",
            android: "gpp_bad",
            web: "gpp_bad",
          }}
        />
        <View style={styles.destroyGrid}>
          {destroyers.map((item) => {
            const tile = (
              <View
                style={[
                  styles.destroyTile,
                  {
                    backgroundColor: danger.soft,
                    borderColor: withAlpha(danger.color, 0.28),
                  },
                ]}
              >
                <View style={[styles.destroyAccent, { backgroundColor: danger.color }]} />
                <ThemedText type="smallBold" numberOfLines={2} style={styles.destroyTitle}>
                  {item.title}
                </ThemedText>
                {item.route ? (
                  <IconWell
                    icon={chevronForward}
                    tint={danger.color}
                    background={withAlpha(danger.color, 0.12)}
                    well={28}
                    size={12}
                  />
                ) : null}
              </View>
            );

            if (!item.route) {
              return (
                <View key={item.id} style={styles.destroyCell}>
                  {tile}
                </View>
              );
            }

            return (
              <PressableScale
                key={item.id}
                onPress={() => router.push(item.route as never)}
                accessibilityRole="button"
                accessibilityLabel={item.title}
                style={styles.destroyCell}
              >
                {tile}
              </PressableScale>
            );
          })}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  mosaic: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  tile: {
    width: "48%",
    flexGrow: 1,
    minWidth: 148,
    padding: Spacing.three,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
    gap: Spacing.two,
  },
  destroyGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  destroyCell: {
    width: "48%",
    flexGrow: 1,
    minWidth: 148,
  },
  destroyTile: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    paddingVertical: Spacing.two,
    paddingInlineEnd: Spacing.two,
    paddingInlineStart: 0,
    borderRadius: Radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderCurve: "continuous",
    overflow: "hidden",
    minHeight: 48,
  },
  destroyAccent: {
    width: 3,
    alignSelf: "stretch",
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2,
  },
  destroyTitle: {
    flex: 1,
    paddingInlineStart: Spacing.one,
  },
});
