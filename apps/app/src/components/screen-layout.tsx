import type { ReactNode } from "react";
import { ScrollView, StyleSheet, View, type ViewStyle } from "react-native";

import { AppHeader } from "@/components/app-header";
import { BottomTabInset, MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type ScreenLayoutProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  notificationCount?: number;
  onNotificationsPress?: () => void;
  onBack?: () => void;
  scrollable?: boolean;
  children: ReactNode;
  contentStyle?: ViewStyle;
};

export function ScreenLayout({
  title,
  subtitle,
  eyebrow,
  notificationCount,
  onNotificationsPress,
  onBack,
  scrollable = true,
  children,
  contentStyle,
}: ScreenLayoutProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.content, contentStyle]}>
      <View style={styles.inner}>{children}</View>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <AppHeader
        title={title}
        subtitle={subtitle}
        eyebrow={eyebrow}
        notificationCount={notificationCount}
        onNotificationsPress={onNotificationsPress}
        onBack={onBack}
      />
      {scrollable ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.one,
  },
  inner: {
    width: "100%",
    maxWidth: MaxContentWidth,
    gap: Spacing.four,
  },
});
