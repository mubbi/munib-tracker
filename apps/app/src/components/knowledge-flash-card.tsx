import type { Href } from "expo-router";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useKnowledgeCard } from "@/hooks/use-knowledge-card";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { KnowledgeCardPalette, ResolvedKnowledgeCard } from "@/lib/knowledge-card";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { useChevronForward } from "@/lib/rtl";

function getPalette(
  colors: ReturnType<typeof useThemeTokens>["colors"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
  key: KnowledgeCardPalette,
) {
  if (key === "accent") {
    return {
      color: colors.accent,
      soft: tokens.accentSoft,
      border: colors.accent,
      text: colors.accent,
    };
  }
  const status = tokens.status[key];
  return {
    color: status.color,
    soft: status.soft,
    border: status.border,
    text: status.text,
  };
}

function KnowledgeCardBody({
  card,
  onRefresh,
}: {
  card: ResolvedKnowledgeCard;
  onRefresh: () => void;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const router = useRouter();
  const chevronForward = useChevronForward();

  const palette = getPalette(colors, tokens, card.palette);

  const onPress = card.href
    ? () => {
        router.push(card.href as Href);
      }
    : undefined;

  const a11y = [
    t(card.titleKey),
    card.arabic,
    card.body,
    card.reference,
    card.actionKey ? t(card.actionKey) : undefined,
  ]
    .filter(Boolean)
    .join(". ");

  const cardStyle = [
    styles.card,
    {
      backgroundColor: palette.soft,
      borderColor: palette.border,
    },
  ];

  const content = (
    <View style={styles.contentRow}>
      <IconWell
        icon={card.icon}
        tint={palette.color}
        background={colors.background}
        well={52}
        size={24}
        radius={Radius.md}
      />
      <View style={styles.copy}>
        {card.arabic ? (
          <ThemedText type="arabic" style={[styles.arabic, { color: palette.text }]}>
            {card.arabic}
          </ThemedText>
        ) : null}
        <ThemedText type="small" themeColor="foreground" style={styles.body}>
          {card.body}
        </ThemedText>
        {card.reference ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.reference}>
            {card.reference}
          </ThemedText>
        ) : null}
        {card.actionKey ? (
          <View style={styles.actionRow}>
            <ThemedText type="caption" style={{ color: palette.text }}>
              {t(card.actionKey)}
            </ThemedText>
            <SymbolView name={chevronForward} size={12} tintColor={palette.color} />
          </View>
        ) : null}
      </View>
    </View>
  );

  return (
    <Card padding="three" style={cardStyle}>
      <View style={styles.topRow}>
        <Pill
          label={t(card.titleKey)}
          color={palette.text}
          background={colors.background}
          style={styles.pill}
        />
        <IconButton
          name={{ ios: "arrow.triangle.2.circlepath", android: "refresh", web: "refresh" }}
          accessibilityLabel={t("home.knowledgeShuffle")}
          onPress={onRefresh}
          size={18}
          tintColor={palette.color}
          hitTarget={36}
        />
      </View>
      {onPress ? (
        <PressableScale
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={a11y}
          scaleTo={0.985}
          haptic="light"
        >
          {content}
        </PressableScale>
      ) : (
        content
      )}
    </Card>
  );
}

export function KnowledgeFlashCard() {
  const { card, refresh } = useKnowledgeCard();
  return <KnowledgeCardBody key={card.key} card={card} onRefresh={refresh} />;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    gap: Spacing.two,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  pill: {
    alignSelf: "flex-start",
  },
  contentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
  },
  copy: {
    flex: 1,
    gap: Spacing.one + 2,
  },
  arabic: {
    ...arabicReadingLayout(22),
  },
  body: {
    lineHeight: 22,
  },
  reference: {
    marginTop: 2,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: Spacing.one,
  },
});
