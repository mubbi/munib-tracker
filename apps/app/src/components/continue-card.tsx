import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { ContextMenu, type ContextMenuAction } from "@/components/ui/context-menu";
import { IconButton } from "@/components/ui/icon-button";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useDefaultCalendar } from "@/hooks/use-calendar-format";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type ContinueActivity,
  type ContinueKind,
  navigateToContinue,
} from "@/lib/continue-activity";
import { type AppIcon, NAMES_OF_ALLAH_ICON } from "@/lib/names-of-allah-ui";
import { arabicReadingLayout } from "@/lib/reading-typography";
import { formatRelativeWhen } from "@/lib/relative-time";
import { chevronForward, containsArabicScript } from "@/lib/rtl";
import { continueStore, useContinueActivity } from "@/stores/continue-store";

type KindVisual = {
  icon: AppIcon;
  palette: "accent" | "info" | "danger" | "success" | "warning";
  labelKey: string;
  actionKey: string;
};

const KIND_VISUALS: Record<ContinueKind, KindVisual> = {
  quran: {
    icon: { ios: "book.fill", android: "menu_book", web: "menu_book" },
    palette: "accent",
    labelKey: "home.continueKind.quran",
    actionKey: "home.continueAction.quran",
  },
  hadith: {
    icon: { ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" },
    palette: "info",
    labelKey: "home.continueKind.hadith",
    actionKey: "home.continueAction.hadith",
  },
  dua: {
    icon: {
      ios: "hands.and.sparkles.fill",
      android: "volunteer_activism",
      web: "volunteer_activism",
    },
    palette: "danger",
    labelKey: "home.continueKind.dua",
    actionKey: "home.continueAction.dua",
  },
  zikr: {
    icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
    palette: "danger",
    labelKey: "home.continueKind.zikr",
    actionKey: "home.continueAction.zikr",
  },
  durood: {
    icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
    palette: "accent",
    labelKey: "home.continueKind.durood",
    actionKey: "home.continueAction.durood",
  },
  names: {
    icon: NAMES_OF_ALLAH_ICON,
    palette: "warning",
    labelKey: "home.continueKind.names",
    actionKey: "home.continueAction.names",
  },
  audio: {
    icon: { ios: "waveform", android: "graphic_eq", web: "graphic_eq" },
    palette: "accent",
    labelKey: "home.continueKind.audio",
    actionKey: "home.continueAction.audio",
  },
};

function getPalette(
  colors: ReturnType<typeof useThemeTokens>["colors"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
  key: KindVisual["palette"],
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

function ContinueCardBody({ activity }: { activity: ContinueActivity }) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();

  const visual = KIND_VISUALS[activity.kind];
  const palette = getPalette(colors, tokens, visual.palette);
  const actionKey = activity.isAudio ? "home.continueAction.listening" : visual.actionKey;
  const defaultCalendar = useDefaultCalendar();
  const locale = i18n.language?.split("-")[0];
  const when = formatRelativeWhen(activity.updatedAt, locale, t, defaultCalendar);

  const onPress = () => navigateToContinue(router, activity);
  const onDismiss = () => void continueStore.getState().clear();

  const a11y = [
    t("home.continueTitle"),
    t("home.continueSubtitle"),
    t(visual.labelKey),
    activity.title,
    activity.subtitle,
    activity.preview,
    t("home.continueLastOpened", { time: when }),
    t(actionKey),
  ]
    .filter(Boolean)
    .join(". ");

  const quranSurahMatch = activity.kind === "quran" ? activity.href.match(/^\/quran\/(\d+)/) : null;
  const quranSurahNumber = quranSurahMatch?.[1];
  const previewIsArabic = activity.preview ? containsArabicScript(activity.preview) : false;

  const menuActions: ContextMenuAction[] = [
    { id: "open", title: t(actionKey), systemIcon: "arrow.forward" },
    {
      id: "clear",
      title: t("home.continueDismissA11y"),
      systemIcon: "xmark",
      destructive: true,
    },
  ];
  const onMenuAction = (id: string) => {
    if (id === "open") onPress();
    else if (id === "clear") onDismiss();
  };

  return (
    <ContextMenu actions={menuActions} onAction={onMenuAction}>
      <Card
        padding="three"
        style={[styles.card, { backgroundColor: palette.soft, borderColor: palette.border }]}
      >
        <View style={styles.header}>
          <IconWell
            icon={{ ios: "arrow.uturn.backward", android: "undo", web: "undo" }}
            tint={palette.color}
            background={colors.background}
            well={40}
            size={18}
          />
          <View style={styles.headerCopy}>
            <ThemedText type="smallBold">{t("home.continueTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("home.continueSubtitle")}
            </ThemedText>
          </View>
          <IconButton
            name={{ ios: "xmark", android: "close", web: "close" }}
            accessibilityLabel={t("home.continueDismissA11y")}
            onPress={onDismiss}
            size={16}
            tintColor={colors.mutedForeground}
            hitTarget={36}
            haptic="light"
          />
        </View>

        <PressableScale
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={a11y}
          scaleTo={0.98}
          haptic="light"
          style={[
            styles.preview,
            { backgroundColor: colors.background, borderColor: palette.border },
          ]}
        >
          <View style={styles.previewTop}>
            {quranSurahNumber ? (
              <View style={[styles.quranBadge, { backgroundColor: palette.soft }]}>
                <ThemedText type="subtitle" style={{ color: palette.text }}>
                  {quranSurahNumber}
                </ThemedText>
              </View>
            ) : (
              <IconWell
                icon={visual.icon}
                tint={palette.color}
                background={palette.soft}
                well={48}
                size={22}
                radius={Radius.md}
              />
            )}

            <View style={styles.previewCopy}>
              <View style={styles.metaRow}>
                <Pill label={t(visual.labelKey)} color={palette.text} background={palette.soft} />
                {activity.isAudio ? (
                  <View style={[styles.audioBadge, { backgroundColor: palette.soft }]}>
                    <SymbolView
                      name={{ ios: "play.fill", android: "play_arrow", web: "play_arrow" }}
                      size={10}
                      tintColor={palette.color}
                    />
                    <ThemedText type="caption" style={{ color: palette.text }}>
                      {t("home.continueListening")}
                    </ThemedText>
                  </View>
                ) : null}
              </View>
              <ThemedText type="smallBold" numberOfLines={2}>
                {activity.title}
              </ThemedText>
              {activity.subtitle ? (
                <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
                  {activity.subtitle}
                </ThemedText>
              ) : null}
              {activity.preview ? (
                <ThemedText
                  type={previewIsArabic ? "arabic" : "small"}
                  style={[
                    previewIsArabic ? styles.arabic : null,
                    { color: palette.text },
                    previewIsArabic
                      ? arabicReadingLayout(activity.kind === "hadith" ? 14 : 22)
                      : null,
                  ]}
                  numberOfLines={activity.kind === "hadith" ? 2 : 1}
                >
                  {activity.preview}
                </ThemedText>
              ) : null}
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("home.continueLastOpened", { time: when })}
              </ThemedText>
            </View>
          </View>

          <View style={[styles.footer, { borderTopColor: tokens.hairline }]}>
            <ThemedText type="smallBold" style={{ color: palette.text }}>
              {t(actionKey)}
            </ThemedText>
            <SymbolView name={chevronForward()} size={14} tintColor={palette.color} />
          </View>
        </PressableScale>
      </Card>
    </ContextMenu>
  );
}

export function ContinueCard() {
  const activity = useContinueActivity();
  if (!activity) return null;
  return <ContinueCardBody activity={activity} />;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    gap: Spacing.three,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.two,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
    paddingTop: 2,
  },
  preview: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  previewTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: Spacing.three,
    padding: Spacing.three,
  },
  previewCopy: {
    flex: 1,
    gap: Spacing.one,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.one,
  },
  audioBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: Spacing.two,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  quranBadge: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  arabic: {},
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
