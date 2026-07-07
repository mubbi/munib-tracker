import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  IN_APP_NOTIFICATION_BODY_LINES,
  IN_APP_NOTIFICATION_TITLE_LINES,
} from "@/lib/in-app-notifications/content";
import type { InAppNotificationKind } from "@/lib/in-app-notifications/storage";
import {
  extractReminderKey,
  type NotificationCategory,
  resolveNotificationVisual,
} from "@/lib/notifications/notification-visuals";
import { chevronForward } from "@/lib/rtl";

export type NotificationListItem = {
  id: string;
  title: string;
  body: string;
  at: string;
  readAt: string | null;
  inboxId?: string;
  kind?: InAppNotificationKind;
  reminderKey?: string;
  /** Deep link to open on tap (used by upcoming/scheduled rows). */
  route?: string;
};

type NotificationListRowProps = {
  item: NotificationListItem;
  formattedWhen: string;
  onPress?: () => void;
};

function categoryPalette(
  category: NotificationCategory,
  colors: ReturnType<typeof useThemeTokens>["colors"],
  tokens: ReturnType<typeof useThemeTokens>["tokens"],
) {
  switch (category) {
    case "milestone":
      return {
        iconTint: tokens.status.success.color,
        iconBg: tokens.status.success.soft,
        pillColor: tokens.status.success.color,
        pillBg: tokens.status.success.soft,
      };
    case "qaza":
      return {
        iconTint: tokens.status.info.color,
        iconBg: tokens.status.info.soft,
        pillColor: tokens.status.info.color,
        pillBg: tokens.status.info.soft,
      };
    case "zikr":
      return {
        iconTint: tokens.status.warning.color,
        iconBg: tokens.status.warning.soft,
        pillColor: tokens.status.warning.color,
        pillBg: tokens.status.warning.soft,
      };
    case "system":
      return {
        iconTint: colors.mutedForeground,
        iconBg: colors.muted,
        pillColor: colors.mutedForeground,
        pillBg: colors.muted,
      };
    default:
      return {
        iconTint: colors.accent,
        iconBg: tokens.accentSoft,
        pillColor: colors.accent,
        pillBg: tokens.accentSoft,
      };
  }
}

const CATEGORY_LABEL_KEY: Record<NotificationCategory, string> = {
  salah: "notifCenter.categorySalah",
  zikr: "notifCenter.categoryZikr",
  qaza: "notifCenter.categoryQaza",
  milestone: "notifCenter.categoryMilestone",
  system: "notifCenter.categorySystem",
};

export function NotificationListRow({ item, formattedWhen, onPress }: NotificationListRowProps) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();

  const reminderKey = item.reminderKey ?? extractReminderKey(item.id, item.inboxId);
  const visual = resolveNotificationVisual({ kind: item.kind, reminderKey });
  const palette = categoryPalette(visual.category, colors, tokens);

  const isUnread = item.inboxId != null && item.readAt == null;
  const isUpcoming = item.inboxId == null && new Date(item.at).getTime() > Date.now();
  const isPressable = onPress != null;

  const rowStyle = [
    styles.row,
    {
      backgroundColor: isUnread ? tokens.accentSoft : isUpcoming ? palette.iconBg : colors.muted,
      borderColor: isUnread ? colors.accent : "transparent",
      opacity: item.readAt ? 0.88 : 1,
    },
  ];

  const content = (
    <>
      <View style={styles.lead}>
        <IconWell
          icon={visual.icon}
          size={18}
          well={40}
          radius={Radius.sm}
          tint={palette.iconTint}
          background={isUnread ? colors.background : palette.iconBg}
        />
        {isUnread ? <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} /> : null}
      </View>

      <View style={styles.body}>
        <ThemedText type="smallBold" numberOfLines={IN_APP_NOTIFICATION_TITLE_LINES}>
          {item.title}
        </ThemedText>
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          numberOfLines={IN_APP_NOTIFICATION_BODY_LINES}
        >
          {item.body}
        </ThemedText>
        <View style={styles.metaRow}>
          <SymbolView
            name={{ ios: "clock", android: "schedule", web: "schedule" }}
            size={11}
            tintColor={colors.mutedForeground}
          />
          <ThemedText type="caption" themeColor="mutedForeground" numberOfLines={1}>
            {formattedWhen}
          </ThemedText>
          <Pill
            label={t(CATEGORY_LABEL_KEY[visual.category])}
            color={palette.pillColor}
            background={isUnread ? colors.background : palette.pillBg}
            compact
          />
          {isUpcoming ? (
            <Pill
              label={t("notifCenter.upcoming")}
              color={palette.pillColor}
              background={colors.background}
              icon={{
                ios: "bell.badge",
                android: "notifications_active",
                web: "notifications_active",
              }}
              compact
            />
          ) : null}
        </View>
      </View>

      {isPressable ? (
        <SymbolView name={chevronForward()} size={14} tintColor={colors.mutedForeground} />
      ) : null}
    </>
  );

  if (isPressable) {
    return (
      <PressableScale
        haptic="light"
        accessibilityRole="button"
        accessibilityLabel={item.title}
        onPress={onPress}
        style={rowStyle}
      >
        {content}
      </PressableScale>
    );
  }

  return <View style={rowStyle}>{content}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
    minHeight: 76,
  },
  lead: {
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  body: {
    flex: 1,
    gap: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    flexWrap: "wrap",
  },
});
