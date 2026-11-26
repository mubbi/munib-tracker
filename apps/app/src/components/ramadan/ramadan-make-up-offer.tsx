import { type Href, useRouter } from "expo-router";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
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
import { getFidyahGuideTopic } from "@/lib/fidyah-guide";
import { isDestinationHidden, useDestinationScope } from "@/lib/library-menu";
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

/** Sourced fidyah-guide topics the offer quotes (packages/shared/src/content/fidyah-guide.ts). */
const OVERVIEW_TOPIC = "when-fidyah-or-qaza";
const WHO_PAYS_FIDYAH_TOPIC = "who-pays-fidyah";
const KAFFARAH_TOPIC = "kaffarah-ramadan";

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
 * Splits the make-up days by why they are owed: logged "missed" (the only case
 * where kaffarah can be in question), logged "exempt" (travel, illness …), and
 * hayd / nifas from the salah tracker (made up by fasting — never fidyah here).
 */
function makeUpBreakdown(
  dates: readonly string[],
  fastStatus: Readonly<Record<string, string | undefined>>,
): { missed: number; exempt: number; noFast: number } {
  let missed = 0;
  let exempt = 0;
  for (const date of dates) {
    if (fastStatus[date] === "missed") missed += 1;
    else if (fastStatus[date] === "exempt") exempt += 1;
  }
  return { missed, exempt, noFast: dates.length - missed - exempt };
}

/** One settlement choice: a title, when it applies (sourced guide wording), and its actions. */
function SettleOption({
  title,
  when,
  children,
}: {
  title: string;
  when?: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.option}>
      <ThemedText type="smallBold" heading={3}>
        {title}
      </ThemedText>
      {when ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {when}
        </ThemedText>
      ) : null}
      {children ? <View style={styles.actions}>{children}</View> : null}
    </View>
  );
}

/**
 * Offers — never applies automatically — how to settle this Ramadan's missed /
 * exempt days (and hayd / nifas days from the salah tracker): make them up as
 * fasting Qaza (the default), pay fidyah instead (permanent inability), or —
 * only when a day was logged "missed" — look at kaffarah for a fast broken
 * deliberately. The "when this applies" lines and topic links come from the
 * sourced fidyah guide; the helper itself shows the madhhab-aware panel. A
 * hayd / nifas-only total offers Qaza alone. The answer (add or "already
 * handled") is remembered per Hijri year in the synced tours list, so the card
 * returns only when more days are logged later. Opening the fidyah helper does
 * not dismiss it. On-screen only; never in notifications.
 */
export function RamadanMakeUpOffer({
  hijriYear,
  ramadanDates,
  fastStatus,
  today,
}: RamadanMakeUpOfferProps) {
  const { t, i18n } = useTranslation();
  const { tokens } = useThemeTokens();
  const router = useRouter();
  const scope = useDestinationScope();
  const { setRoza } = useTrackerActions();
  useEnsureToursLoaded();
  const toursReady = useStore(toursStore, (s) => s.isReady);
  const seen = useStore(toursStore, (s) => s.seen);
  const excused = useNoFastExcusedDates(ramadanDates);
  const [justAdded, setJustAdded] = useState(false);
  const [busy, setBusy] = useState(false);

  const dates = useMemo(
    () => ramadanMakeUpDates(ramadanDates, fastStatus, excused, today),
    [ramadanDates, fastStatus, excused, today],
  );
  const total = dates.length;
  const breakdown = useMemo(() => makeUpBreakdown(dates, fastStatus), [dates, fastStatus]);
  const pending = pendingRozaOffer(total, handledRozaOfferCount(seen, hijriYear));

  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize the guide when the language changes
  const guide = useMemo(
    () => ({
      overview: getFidyahGuideTopic(OVERVIEW_TOPIC),
      whoPays: getFidyahGuideTopic(WHO_PAYS_FIDYAH_TOPIC),
      kaffarah: getFidyahGuideTopic(KAFFARAH_TOPIC),
    }),
    [i18n.language],
  );

  if (justAdded) {
    return (
      <Card>
        <ThemedText
          type="small"
          accessibilityLiveRegion="polite"
          style={{ color: tokens.status.success.text }}
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

  // Fidyah never covers hayd / nifas days, which are always made up by fasting.
  const fidyahDays = Math.min(pending, breakdown.missed + breakdown.exempt);
  const showFidyah = fidyahDays > 0;
  const showKaffarah = breakdown.missed > 0;
  // TV lean-back scope (D-UX5): the calculators hide unless "Show finance tools"
  // is on; the guide topics stay reachable as learning content.
  const fidyahToolHidden = isDestinationHidden("fidyah", scope);
  const sadaqahHidden = isDestinationHidden("sadaqah", scope);
  const whenLines = guide.overview?.actions ?? [];

  const openTopic = (topic: string) =>
    router.push({ pathname: "/fidyah/[topic]", params: { topic } } as Href);

  return (
    <Card>
      <SectionHeader
        title={t("ramadan.fiqh.makeUp.title")}
        icon={{ ios: "calendar.badge.plus", android: "event_available", web: "event_available" }}
      />
      <View style={styles.body}>
        <ThemedText type="small">{t("ramadan.fiqh.makeUp.body", { days: pending })}</ThemedText>
        <ThemedText type="smallBold" heading={3} accessibilityRole="header">
          {t("ramadan.fiqh.makeUp.settle")}
        </ThemedText>

        <SettleOption title={t("ramadan.fiqh.makeUp.optionQaza")} when={whenLines[0]}>
          <Button
            label={t("ramadan.fiqh.makeUp.add", { days: pending })}
            size="sm"
            disabled={busy}
            onPress={() => void answer(true)}
          />
        </SettleOption>

        {showFidyah ? (
          <>
            <Divider />
            <SettleOption title={t("ramadan.fiqh.makeUp.optionFidyah")} when={whenLines[1]}>
              {fidyahToolHidden ? null : (
                <Button
                  label={t("ramadan.fiqh.makeUp.openFidyah")}
                  variant="secondary"
                  size="sm"
                  disabled={busy}
                  onPress={() =>
                    router.push({
                      pathname: "/fidyah",
                      params: { scenario: "fidyah", days: String(fidyahDays) },
                    } as Href)
                  }
                />
              )}
              {guide.whoPays ? (
                <Button
                  label={guide.whoPays.title}
                  variant="ghost"
                  size="sm"
                  trailingIcon={{ ios: "book", android: "menu_book", web: "menu_book" }}
                  onPress={() => openTopic(WHO_PAYS_FIDYAH_TOPIC)}
                />
              ) : null}
            </SettleOption>
          </>
        ) : null}

        {showKaffarah ? (
          <>
            <Divider />
            <SettleOption title={t("ramadan.fiqh.makeUp.optionKaffarah")} when={whenLines[2]}>
              {fidyahToolHidden ? null : (
                <Button
                  label={t("ramadan.fiqh.makeUp.openKaffarah")}
                  variant="secondary"
                  size="sm"
                  disabled={busy}
                  onPress={() =>
                    router.push({
                      pathname: "/fidyah",
                      params: { scenario: "kaffarah" },
                    } as Href)
                  }
                />
              )}
              {guide.kaffarah ? (
                <Button
                  label={guide.kaffarah.title}
                  variant="ghost"
                  size="sm"
                  trailingIcon={{ ios: "book", android: "menu_book", web: "menu_book" }}
                  onPress={() => openTopic(KAFFARAH_TOPIC)}
                />
              ) : null}
            </SettleOption>
          </>
        ) : null}

        <Divider />
        <View style={styles.actions}>
          <Button
            label={t("ramadan.fiqh.makeUp.alreadyHandled")}
            variant="ghost"
            size="sm"
            disabled={busy}
            onPress={() => void answer(false)}
          />
        </View>

        {sadaqahHidden ? null : (
          <Button
            label={t("ramadan.fiqh.makeUp.sadaqahLink")}
            accessibilityHint={t("ramadan.fiqh.makeUp.sadaqahHint")}
            variant="ghost"
            size="sm"
            icon={{ ios: "heart", android: "favorite_border", web: "favorite_border" }}
            onPress={() => router.push("/sadaqah" as Href)}
            style={styles.sadaqah}
          />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
  option: { gap: Spacing.one, paddingVertical: Spacing.one },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.one },
  sadaqah: { alignSelf: "flex-start" },
});
