import { APP_TAGLINE, PRAYER_NAMES } from "@munib-tracker/shared/constants";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { StatCard } from "@/components/ui/stat-card";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <ScreenLayout title="Home" subtitle="Your spiritual journey today" notificationCount={2}>
      <ThemedView
        style={[styles.heroCard, { borderColor: colors.border, backgroundColor: colors.card }]}
      >
        <View style={[styles.glow, { backgroundColor: colors.accent, opacity: 0.08 }]} />
        <Image
          source={require("@/assets/images/munib-logo.png")}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText type="small" themeColor="mutedForeground" style={styles.tagline}>
          {APP_TAGLINE}
        </ThemedText>
      </ThemedView>

      <View style={styles.statsRow}>
        <StatCard
          label="Prayers"
          value={`0/${PRAYER_NAMES.length}`}
          icon={{ ios: "moon.stars.fill", android: "nightlight", web: "nightlight" }}
        />
        <StatCard
          label="Dhikr"
          value="0/3"
          icon={{ ios: "heart.fill", android: "favorite", web: "favorite" }}
        />
        <StatCard
          label="Streak"
          value="1 day"
          icon={{
            ios: "flame.fill",
            android: "local_fire_department",
            web: "local_fire_department",
          }}
        />
      </View>

      <ThemedView type="card" style={[styles.summaryCard, { borderColor: colors.border }]}>
        <ThemedText type="smallBold">Today&apos;s focus</ThemedText>
        <ThemedText themeColor="mutedForeground">
          Complete your five daily prayers and evening adhkar to stay consistent on your path.
        </ThemedText>
        <ThemedView type="muted" style={[styles.accentPill, { backgroundColor: colors.accent }]}>
          <ThemedText style={{ color: colors.accentForeground }} type="smallBold">
            Stay consistent · منيب
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView type="card" style={[styles.tipCard, { borderColor: colors.border }]}>
        <ThemedText type="smallBold" style={{ color: colors.accent }}>
          Gentle reminder
        </ThemedText>
        <ThemedText themeColor="mutedForeground">
          Small, steady steps matter more than perfection. Log what you complete and return
          tomorrow.
        </ThemedText>
      </ThemedView>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: "center",
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: 1,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  glow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -60,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: Spacing.three,
  },
  tagline: {
    textAlign: "center",
    maxWidth: 320,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.two,
    flexWrap: "wrap",
  },
  summaryCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderCurve: "continuous",
  },
  accentPill: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.three,
    borderCurve: "continuous",
  },
  tipCard: {
    gap: Spacing.two,
    padding: Spacing.four,
    borderRadius: Spacing.four,
    borderWidth: 1,
    borderCurve: "continuous",
  },
});
