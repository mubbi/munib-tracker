import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { PrayerRepository, QazaRepository } from "@/db";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import {
  handledRozaOfferCount,
  isNoFastExcuse,
  pendingRozaOffer,
  ramadanMakeUpDates,
  rozaOfferSeenId,
} from "@/lib/fasting-fiqh";
import { useStore } from "@/stores/create-store";
import { toursStore, useEnsureToursLoaded } from "@/stores/tours-store";
import { useTrackerActions } from "@/stores/tracker-store";

type RamadanMakeUpOfferProps = {
  /** Hijri year of the Ramadan shown in the fasting log. */
  hijriYear: number;
  /** Gregorian ISO dates of that Ramadan, in order. */
  ramadanDates: readonly string[];
  /** Fasting log (date → fasted / missed / exempt). */
  fastStatus: Readonly<Record<string, string | undefined>>;
  today: string;
};

/** Ramadan dates whose salah logs are excused for hayd / nifas (read-only). */
function useNoFastExcusedDates(ramadanDates: readonly string[]): ReadonlySet<string> {
  const [dates, setDates] = useState<ReadonlySet<string>>(() => new Set());
  const first = ramadanDates[0];
  const last = ramadanDates[ramadanDates.length - 1];

  useEffect(() => {
    if (!first || !last) return;
    let cancelled = false;
    void PrayerRepository.getAll()
      .then((logs) => {
        if (cancelled) return;
        const next = new Set<string>();
        for (const log of logs) {
          if (log.date < first || log.date > last) continue;
          if (log.isExcused && isNoFastExcuse(log.excusedReason)) next.add(log.date);
        }
        setDates(next);
      })
      .catch(() => {
        // Offer falls back to the fasting log alone.
      });
    return () => {
      cancelled = true;
    };
  }, [first, last]);

  return dates;
}

/**
 * Offers — never applies automatically — to add this Ramadan's missed / exempt
 * days (and hayd / nifas days from the salah tracker) to the fasting qaza
 * counter. The answer is remembered per Hijri year in the synced tours list, so
 * the card returns only when more days are logged later. On-screen only; never
 * in notifications.
 */
export function RamadanMakeUpOffer({
  hijriYear,
  ramadanDates,
  fastStatus,
  today,
}: RamadanMakeUpOfferProps) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const { setRoza } = useTrackerActions();
  useEnsureToursLoaded();
  const toursReady = useStore(toursStore, (s) => s.isReady);
  const seen = useStore(toursStore, (s) => s.seen);
  const excused = useNoFastExcusedDates(ramadanDates);
  const [justAdded, setJustAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  const total = useMemo(
    () => ramadanMakeUpDates(ramadanDates, fastStatus, excused, today).length,
    [ramadanDates, fastStatus, excused, today],
  );
  const pending = pendingRozaOffer(total, handledRozaOfferCount(seen, hijriYear));

  if (justAdded) {
    return (
      <Card padding="three">
        <ThemedText
          type="small"
          accessibilityLiveRegion="polite"
          style={{ color: tokens.status.success.color }}
        >
          {t("ramadan.fiqh.makeUp.added")}
        </ThemedText>
      </Card>
    );
  }
  if (!toursReady || pending === 0) return null;

  const answer = async (add: boolean) => {
    setBusy(true);
    try {
      if (add) {
        const current = await QazaRepository.getRoza();
        await setRoza({ ...current, remaining: current.remaining + pending, updatedAt: undefined });
      }
      await toursStore.getState().markSeen(rozaOfferSeenId(hijriYear, total));
      if (add) setJustAdded(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card padding="three">
      <SectionHeader
        title={t("ramadan.fiqh.makeUp.title")}
        icon={{ ios: "calendar.badge.plus", android: "event_available", web: "event_available" }}
      />
      <View style={styles.body}>
        <ThemedText type="small">{t("ramadan.fiqh.makeUp.body", { days: pending })}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("ramadan.fiqh.makeUp.question")}
        </ThemedText>
        <View style={styles.actions}>
          <Button
            label={t("ramadan.fiqh.makeUp.add", { days: pending })}
            size="sm"
            disabled={busy}
            onPress={() => void answer(true)}
          />
          <Button
            label={t("ramadan.fiqh.makeUp.dismiss")}
            variant="ghost"
            size="sm"
            disabled={busy}
            onPress={() => void answer(false)}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.one },
});
