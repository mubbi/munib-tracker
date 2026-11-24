import { DHUL_HIJJAH_ZIKR, type DhulHijjahDeedId } from "@munib-tracker/shared/content/dhul-hijjah";
import type { ExcusedReason } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/card";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { dailyCheckKey, deedsForDay, excusedStopsFasting } from "@/lib/dhul-hijjah";
import { isTV } from "@/lib/platform/is-tv";
import { useChevronForward } from "@/lib/rtl";
import {
  clearFast,
  isPilgrimForHijriYear,
  markFast,
  voluntaryFastingHref,
} from "@/lib/voluntary-fasting";
import { useDhulHijjahActions, useDhulHijjahYear } from "@/stores/dhul-hijjah-store";
import { usePreferences } from "@/stores/preferences-store";
import { useZikrCounts } from "@/stores/tracker-store";
import {
  useEnsureVoluntaryFastingLoaded,
  useVoluntaryFastEntry,
} from "@/stores/voluntary-fasting-store";

const CHECKED = {
  ios: "checkmark.circle.fill",
  android: "check_circle",
  web: "check_circle",
} as const;
const UNCHECKED = {
  ios: "circle",
  android: "radio_button_unchecked",
  web: "radio_button_unchecked",
} as const;

type Props = {
  year: number;
  date: string;
  hijriDay: number;
  excusedReason: ExcusedReason | null;
};

/**
 * Today's deeds on the Dhul-Hijjah dashboard (NF-3.3). The fast (days 1–9) is
 * the NF-3.2 voluntary-fasting entry for that date — not stored twice; zikr is
 * derived from the three tasbeeh counters; Qur'an, sadaqah and qiyam are ticks.
 * The fast goes through `markFast` (same Eid / Tashriq / hayd / nifas gate as
 * `/fasting`); a refusal shows its gentle reason. Only a kept fast counts as done.
 * A pilgrim (this year) is not offered the Arafah fast — the pilgrim note shows.
 */
export function DhulHijjahDeedsChecklist({ year, date, hijriDay, excusedReason }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  useEnsureVoluntaryFastingLoaded();
  const fastEntry = useVoluntaryFastEntry(date);
  const state = useDhulHijjahYear(year);
  const { toggleDaily } = useDhulHijjahActions();
  const counts = useZikrCounts();
  const { voluntaryFasting } = usePreferences();
  const pilgrim = isPilgrimForHijriYear(voluntaryFasting, year);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const deeds = deedsForDay(hijriDay, {
    fastingExcused: excusedStopsFasting(excusedReason),
    pilgrim,
  });

  const zikrDone = DHUL_HIJJAH_ZIKR.every((z) => (counts[z.id] ?? 0) >= z.target);
  const isDone = (deed: DhulHijjahDeedId): boolean => {
    if (deed === "fast") return fastEntry?.status === "fasted";
    if (deed === "zikr") return zikrDone;
    return state?.dailyChecks[dailyCheckKey(deed, date)] === true;
  };
  const doneCount = deeds.filter(isDone).length;

  const onPress = (deed: DhulHijjahDeedId) => {
    if (deed === "fast") {
      setBlockedMessage(null);
      if (isDone("fast")) {
        void clearFast(date);
        return;
      }
      void markFast(date, "fasted").then((result) => {
        if (!result.ok) setBlockedMessage(t(`voluntaryFasting.blocked.${result.reason}`));
      });
      return;
    }
    if (deed === "zikr") return;
    void toggleDaily(year, deed, date);
  };

  const linkFor = (deed: DhulHijjahDeedId): Href | null => {
    if (deed === "fast") return voluntaryFastingHref(date) as Href;
    if (deed === "sadaqah") return "/sadaqah" as Href;
    if (deed === "quran") return "/quran" as Href;
    return null;
  };

  return (
    <Card padding="three">
      <SectionHeader
        title={t("dhulHijjah.deeds.title")}
        icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
        badge={
          <Pill
            label={t("tracker.sectionProgress", { completed: doneCount, total: deeds.length })}
            compact
          />
        }
      />
      <View style={styles.rows}>
        {deeds.map((deed) => {
          const done = isDone(deed);
          const link = linkFor(deed);
          const title = t(`dhulHijjah.deeds.${deed}.title`);
          return (
            <View key={deed} style={styles.deed}>
              <View style={styles.row}>
                <PressableScale
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: done, disabled: deed === "zikr" }}
                  accessibilityLabel={title}
                  disabled={deed === "zikr"}
                  onPress={() => onPress(deed)}
                  haptic="selection"
                  style={[styles.main, isTV() ? styles.mainTv : null]}
                >
                  <SymbolView
                    name={done ? CHECKED : UNCHECKED}
                    size={24}
                    tintColor={done ? tokens.status.success.color : colors.mutedForeground}
                  />
                  <View style={styles.text}>
                    <ThemedText type="smallBold">{title}</ThemedText>
                    <ThemedText type="caption" themeColor="mutedForeground">
                      {t(`dhulHijjah.deeds.${deed}.hint`)}
                    </ThemedText>
                  </View>
                </PressableScale>
                {link ? (
                  <PressableScale
                    accessibilityRole="link"
                    accessibilityLabel={t("dhulHijjah.deeds.openA11y", { title })}
                    onPress={() => router.push(link)}
                    style={styles.open}
                  >
                    <AppIcon icon={chevronForward} size={16} tintColor={colors.accent} />
                  </PressableScale>
                ) : null}
              </View>
              {deed === "zikr" ? (
                <View style={styles.counters}>
                  {DHUL_HIJJAH_ZIKR.map((z) => {
                    const count = Math.min(counts[z.id] ?? 0, z.target);
                    const label = t(`dhulHijjah.zikr.${z.id.split("-")[1]}`);
                    return (
                      <PressableScale
                        key={z.id}
                        accessibilityRole="button"
                        accessibilityLabel={t("dhulHijjah.zikr.counterA11y", {
                          label,
                          value: count,
                          target: z.target,
                        })}
                        onPress={() =>
                          router.push({
                            pathname: "/tasbeeh/[zikrId]",
                            params: { zikrId: z.id },
                          } as Href)
                        }
                        haptic="light"
                        style={[
                          styles.counter,
                          isTV() ? styles.mainTv : null,
                          { borderColor: tokens.hairline, backgroundColor: colors.muted },
                        ]}
                      >
                        <ThemedText type="caption">{label}</ThemedText>
                        <ThemedText type="smallBold">
                          {t("dhulHijjah.zikr.progress", { value: count, target: z.target })}
                        </ThemedText>
                      </PressableScale>
                    );
                  })}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
      {blockedMessage ? (
        <ThemedText
          type="caption"
          themeColor="mutedForeground"
          style={styles.note}
          accessibilityLiveRegion="polite"
        >
          {blockedMessage}
        </ThemedText>
      ) : null}
      {pilgrim && hijriDay === 9 ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {t("voluntaryFasting.reason.pilgrimArafah")}
        </ThemedText>
      ) : null}
      {excusedReason ? (
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.note}>
          {t("dhulHijjah.deeds.excusedNote")}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  rows: { gap: Spacing.two, marginTop: Spacing.three },
  deed: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  main: { flex: 1, flexDirection: "row", alignItems: "center", gap: Spacing.two, minWidth: 0 },
  mainTv: {
    minHeight: TvLayout.minFocusTarget,
    paddingHorizontal: Spacing.two,
    borderRadius: Radius.md,
  },
  text: { flex: 1, minWidth: 0, gap: 2 },
  open: { padding: Spacing.one },
  counters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.two,
    paddingStart: Spacing.five,
  },
  counter: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    alignItems: "center",
    gap: 2,
  },
  note: { marginTop: Spacing.two },
});
