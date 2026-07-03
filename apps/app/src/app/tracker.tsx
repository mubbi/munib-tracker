import { PRAYER_NAMES } from "@munib-tracker/shared/constants";
import type { TrackerCategory } from "@munib-tracker/shared/types";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Stagger } from "@/components/ui/stagger";
import { TrackerRow } from "@/components/ui/tracker-row";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";

type TrackerItem = {
  id: string;
  label: string;
  sublabel?: string;
  time?: string;
  icon?: SymbolViewProps["name"];
};

type TrackerSection = {
  category: TrackerCategory;
  title: string;
  icon: SymbolViewProps["name"];
  items: TrackerItem[];
};

const PRAYER_META: Record<string, { time: string; icon: SymbolViewProps["name"] }> = {
  Fajr: { time: "4:50", icon: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" } },
  Dhuhr: { time: "11:48", icon: { ios: "sun.max.fill", android: "light_mode", web: "light_mode" } },
  Asr: { time: "15:05", icon: { ios: "cloud.sun.fill", android: "wb_cloudy", web: "wb_cloudy" } },
  Maghrib: {
    time: "17:06",
    icon: { ios: "sunset.fill", android: "wb_twilight", web: "wb_twilight" },
  },
  Isha: {
    time: "18:28",
    icon: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
  },
};

const SECTIONS: TrackerSection[] = [
  {
    category: "salah",
    title: "Salah",
    icon: { ios: "moon.stars.fill", android: "mosque", web: "mosque" },
    items: PRAYER_NAMES.map((name) => ({
      id: `salah-${name}`,
      label: name,
      time: PRAYER_META[name]?.time,
      icon: PRAYER_META[name]?.icon,
    })),
  },
  {
    category: "dhikr",
    title: "Dhikr",
    icon: { ios: "heart.fill", android: "favorite", web: "favorite" },
    items: [
      {
        id: "dhikr-morning",
        label: "Morning adhkar",
        sublabel: "After Fajr",
        icon: { ios: "sunrise.fill", android: "wb_twilight", web: "wb_twilight" },
      },
      {
        id: "dhikr-evening",
        label: "Evening adhkar",
        sublabel: "After Asr",
        icon: { ios: "sunset.fill", android: "wb_twilight", web: "wb_twilight" },
      },
      {
        id: "dhikr-istighfar",
        label: "Istighfar",
        sublabel: "Target 100",
        icon: { ios: "sparkles", android: "auto_awesome", web: "auto_awesome" },
      },
    ],
  },
  {
    category: "qadha",
    title: "Qaza",
    icon: { ios: "clock.arrow.circlepath", android: "history", web: "history" },
    items: [
      { id: "qadha-fajr", label: "Fajr", sublabel: "12 remaining" },
      { id: "qadha-dhuhr", label: "Dhuhr", sublabel: "8 remaining" },
      { id: "qadha-asr", label: "Asr", sublabel: "9 remaining" },
    ],
  },
];

function getEncouragement(progress: number): string {
  if (progress >= 1) return "MashaAllah — all done";
  if (progress === 0) return "A fresh start";
  if (progress < 0.5) return "Keep going";
  return "Almost there";
}

export default function TrackerScreen() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({ "salah-Fajr": true });

  const toggle = (id: string) => setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));

  const { totalDone, totalItems, overall } = useMemo(() => {
    const items = SECTIONS.flatMap((section) => section.items);
    const done = items.filter((item) => completed[item.id]).length;
    return {
      totalDone: done,
      totalItems: items.length,
      overall: items.length ? done / items.length : 0,
    };
  }, [completed]);

  return (
    <ScreenLayout
      eyebrow="Track & log"
      title="Tracker"
      subtitle="Tap items to mark them complete — saved on this device."
      notificationCount={1}
    >
      <Stagger>
        <TrackerSummaryCard totalDone={totalDone} totalItems={totalItems} overall={overall} />
        {SECTIONS.map((section) => (
          <TrackerSectionCard
            key={section.category}
            section={section}
            completed={completed}
            onToggle={toggle}
          />
        ))}
      </Stagger>
    </ScreenLayout>
  );
}

function TrackerSummaryCard({
  totalDone,
  totalItems,
  overall,
}: {
  totalDone: number;
  totalItems: number;
  overall: number;
}) {
  return (
    <Card>
      <View style={styles.summaryRow}>
        <ProgressRing progress={overall} size={100} stroke={11} caption="today" />
        <View style={styles.summaryCopy}>
          <ThemedText type="subtitle">{getEncouragement(overall)}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {totalDone} of {totalItems} acts of worship logged today. Every small step counts.
          </ThemedText>
        </View>
      </View>
    </Card>
  );
}

function TrackerSectionCard({
  section,
  completed,
  onToggle,
}: {
  section: TrackerSection;
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
}) {
  const { colors, tokens } = useThemeTokens();

  const doneCount = useMemo(
    () => section.items.filter((item) => completed[item.id]).length,
    [section.items, completed],
  );
  const progress = section.items.length ? doneCount / section.items.length : 0;
  const complete = doneCount === section.items.length;

  return (
    <Card padding="three">
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={[styles.iconWell, { backgroundColor: tokens.accentSoft }]}>
            <SymbolView name={section.icon} size={18} tintColor={colors.accent} />
          </View>
          <View>
            <ThemedText type="subtitle">{section.title}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {doneCount} of {section.items.length} done
            </ThemedText>
          </View>
        </View>
        <Pill
          label={complete ? "Done" : `${Math.round(progress * 100)}%`}
          color={complete ? tokens.status.success.color : colors.accent}
          background={complete ? tokens.status.success.soft : tokens.accentSoft}
        />
      </View>

      <ProgressBar
        value={progress}
        color={complete ? tokens.status.success.color : colors.accent}
        style={styles.progress}
      />

      {section.items.length === 0 ? (
        <EmptyState
          icon={section.icon}
          title="Nothing to track yet"
          description={`Your ${section.title.toLowerCase()} items will appear here once added.`}
        />
      ) : (
        <View style={styles.items}>
          {section.items.map((item) => (
            <TrackerRow
              key={item.id}
              label={item.label}
              sublabel={item.sublabel}
              icon={item.icon}
              time={item.time}
              completed={!!completed[item.id]}
              onPress={() => onToggle(item.id)}
            />
          ))}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.four,
  },
  summaryCopy: {
    flex: 1,
    gap: Spacing.one + 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two + 2,
  },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderCurve: "continuous",
    alignItems: "center",
    justifyContent: "center",
  },
  progress: {
    marginTop: Spacing.three,
    marginBottom: Spacing.three,
  },
  items: {
    gap: Spacing.two,
  },
});
