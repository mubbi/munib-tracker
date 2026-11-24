import { MADHHAB_IDS, rulesForSchool } from "@munib-tracker/shared/fiqh";
import type { ObligatoryPrayer, PrayerLog } from "@munib-tracker/shared/types";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabBadge } from "@/components/fiqh/madhhab-badge";
import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Radius, Spacing } from "@/constants/theme";
import { PrayerRepository } from "@/db";
import { useMadhhab } from "@/hooks/use-madhhab";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  type BloodReason,
  type HaydPrompt,
  haydStatus,
  shortPeriodPromptId,
} from "@/lib/hayd-period";
import { useStore } from "@/stores/create-store";
import { toursStore, useEnsureToursLoaded } from "@/stores/tours-store";
import {
  useDayExcused,
  useQazaCounters,
  useTrackerActions,
  useTrackerDate,
} from "@/stores/tracker-store";

/** Range of a maximum across the four schools, e.g. hayd "10–15", nifas "40–60". */
function schoolRange(reason: BloodReason): { min: number; max: number } {
  const values = MADHHAB_IDS.map((id) => {
    const { hayd } = rulesForSchool(id);
    return reason === "nifas" ? hayd.nifasMaxDays : hayd.maxDays;
  });
  return { min: Math.min(...values), max: Math.max(...values) };
}

/** Loads every prayer log; reloads when the tracked day or the excused reason changes. */
function useAllPrayerLogs(today: string, reason: string | null): PrayerLog[] | null {
  const [logs, setLogs] = useState<PrayerLog[] | null>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: today/reason are reload keys (the logs they flag live in storage).
  useEffect(() => {
    let cancelled = false;
    void PrayerRepository.getAll().then((all) => {
      if (!cancelled) setLogs(all);
    });
    return () => {
      cancelled = true;
    };
  }, [today, reason]);
  return logs;
}

/**
 * Hayd / nifas day counter and the three gentle prompts (NF-3.0a retrofit):
 * beyond the maximum (istihada — Resume), a Hanafi-style short period ("Add N
 * to qaza"), and a new period before the minimum purity (info). Prompts only —
 * nothing is changed until the user taps. Private, on-screen only; never used
 * in notifications.
 */
export function BloodPeriodStatus() {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { resolve } = useMadhhab();
  const fiqh = resolve("taharah");
  const today = useTrackerDate();
  const activeReason = useDayExcused();
  const counters = useQazaCounters();
  const { setDayExcused, setQazaCounters } = useTrackerActions();
  useEnsureToursLoaded();
  const toursReady = useStore(toursStore, (s) => s.isReady);
  const seen = useStore(toursStore, (s) => s.seen);
  const [added, setAdded] = useState(false);
  const logs = useAllPrayerLogs(today, activeReason);

  const status = useMemo(
    () =>
      logs
        ? haydStatus({ logs, today, activeReason, school: fiqh.school, rules: fiqh.rules })
        : null,
    [logs, today, activeReason, fiqh.school, fiqh.rules],
  );

  if (added) {
    return (
      <ThemedText
        type="caption"
        accessibilityLiveRegion="polite"
        style={{ color: tokens.status.success.color }}
      >
        {t("excusedFiqh.short.added")}
      </ThemedText>
    );
  }
  if (!status) return null;

  const school = fiqh.school;
  const schoolName = school ? t(`fiqh.school.${school}`) : "";
  const custom =
    fiqh.customKeys.includes("haydMaxDays") || fiqh.customKeys.includes("nifasMaxDays");
  const prompts = status.prompts.filter(
    (p) =>
      p.kind !== "shortPeriod" || (toursReady && !seen.includes(shortPeriodPromptId(p.period))),
  );
  if (!status.counter && prompts.length === 0) return null;

  const addToQaza = async (prompt: Extract<HaydPrompt, { kind: "shortPeriod" }>) => {
    const updates: Partial<Record<ObligatoryPrayer, { remaining: number; completed: number }>> = {};
    for (const [prayerId, n] of Object.entries(prompt.perPrayer) as [ObligatoryPrayer, number][]) {
      if (n <= 0) continue;
      const current = counters.find((c) => c.prayerId === prayerId);
      updates[prayerId] = {
        remaining: (current?.remaining ?? 0) + n,
        completed: current?.completed ?? 0,
      };
    }
    await setQazaCounters(updates);
    await toursStore.getState().markSeen(shortPeriodPromptId(prompt.period));
    setAdded(true);
  };

  const counter = status.counter;
  const counterText = counter
    ? school
      ? t("excusedFiqh.counter", {
          day: counter.day,
          max: counter.maxDays,
          school: custom ? t("fiqh.custom") : schoolName,
        })
      : t("excusedFiqh.counterAllViews", {
          day: counter.day,
          ...schoolRange(counter.reason),
        })
    : null;

  return (
    <View style={styles.stack}>
      {counterText ? (
        <View style={styles.counterRow}>
          <ThemedText type="smallBold" style={styles.counterText}>
            {counterText}
          </ThemedText>
          <MadhhabBadge school={school} custom={school != null && custom} />
        </View>
      ) : null}

      {prompts.map((prompt) => {
        const tone = prompt.kind === "purityGap" ? tokens.status.info : tokens.status.warning;
        const key = prompt.kind;
        let body: string;
        let noteId: "hayd.max" | "nifas.max" | "hayd.min" | "hayd.minPurity";
        if (prompt.kind === "beyondMax") {
          noteId = prompt.reason === "nifas" ? "nifas.max" : "hayd.max";
          body = school
            ? t("excusedFiqh.beyondMax.body", { max: prompt.maxDays })
            : t("excusedFiqh.beyondMax.bodyAllViews", { day: prompt.day, max: prompt.maxDays });
        } else if (prompt.kind === "shortPeriod") {
          noteId = "hayd.min";
          body = school
            ? t("excusedFiqh.short.body", { days: prompt.period.days, min: prompt.minDays })
            : t("excusedFiqh.short.bodyAllViews", { days: prompt.period.days });
        } else {
          noteId = "hayd.minPurity";
          body = school
            ? t("excusedFiqh.purity.body", { days: prompt.gapDays, min: prompt.minPurityDays })
            : t("excusedFiqh.purity.bodyAllViews", { days: prompt.gapDays });
        }
        return (
          <View
            key={key}
            style={[styles.prompt, { backgroundColor: tone.soft, borderColor: tone.border }]}
          >
            <ThemedText type="small" style={{ color: colors.foreground }}>
              {body}
            </ThemedText>
            {school == null ? <MadhhabNote id={noteId} /> : null}
            {/* Beyond the maximum: what the extra bleeding is (istihada) per school. */}
            {prompt.kind === "beyondMax" ? <MadhhabNote id="hayd.beyondMax" /> : null}
            {prompt.kind === "beyondMax" ? (
              <Button
                label={t("excusedFiqh.beyondMax.resume")}
                size="sm"
                onPress={() => void setDayExcused(null)}
              />
            ) : null}
            {prompt.kind === "shortPeriod" ? (
              <View style={styles.actions}>
                <Button
                  label={t("excusedFiqh.short.add", { total: prompt.total })}
                  size="sm"
                  onPress={() => void addToQaza(prompt)}
                />
                <Button
                  label={t("excusedFiqh.short.dismiss")}
                  size="sm"
                  variant="ghost"
                  onPress={() =>
                    void toursStore.getState().markSeen(shortPeriodPromptId(prompt.period))
                  }
                />
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.two, marginTop: Spacing.two },
  counterRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: Spacing.two },
  counterText: { flexShrink: 1 },
  prompt: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
    borderWidth: 1,
  },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
