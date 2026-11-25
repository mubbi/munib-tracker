import type { CircleNudgeKind } from "@munib-tracker/shared/circles";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { InvitePanel } from "@/components/circles/invite-panel";
import { MyMembershipCard } from "@/components/circles/my-membership-card";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { EvidenceLinks, type EvidenceRef } from "@/components/self-review/evidence-links";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { clearSignal, putGoalDone, sendNudge } from "@/lib/circles/api";
import { signalWindow } from "@/lib/circles/family";
import {
  useCircle,
  useCircleMutation,
  useCircleNudges,
  useCircleSignals,
} from "@/lib/circles/hooks";
import {
  buildPartnerRows,
  duasToday,
  goalLooksMet,
  nudgeOutcomeFromError,
  nudgeOutcomeKey,
  nudgeSlotKey,
  PARTNER_DOT_DAYS,
  partnerRoomLeft,
  sharedDoneOn,
  visibleNudges,
} from "@/lib/circles/partner";
import {
  setPartnerGoal,
  useEnsurePartnerGoalsLoaded,
  usePartnerGoal,
} from "@/lib/circles/partner-goal-store";
import { isTV } from "@/lib/platform/is-tv";
import { useToast } from "@/providers/toast-provider";
import { usePreferences } from "@/stores/preferences-store";
import { useDayExcused, useTodayPrayers } from "@/stores/tracker-store";

import { PartnerDots } from "./partner-dots";
import { PartnerGoalCard } from "./partner-goal-card";
import { PartnerReceivedCard } from "./partner-received-card";
import { useIshaToday } from "./use-isha-today";

/**
 * Evidence by reference (docs/proofs/accountability-partner.md). Plan "Muslim
 * 2733" (Abd al-Baqi) is corpus `muslim:6930` — the corpus labels it
 * `arabicnumber` 2732.03; its companion narration (Abd al-Baqi 2732) is
 * corpus `muslim:6927`.
 */
export const PARTNER_EVIDENCE: readonly EvidenceRef[] = [
  {
    kind: "hadith",
    collection: "muslim",
    number: "6930",
    labelKey: "partnerCircle.evidence.m2733",
  },
  {
    kind: "hadith",
    collection: "muslim",
    number: "6927",
    labelKey: "partnerCircle.evidence.m2732",
  },
];

/** NF-3.17: one partner circle — private goal, today's share, dots, nudges, settings. */
export function PartnerCircleView({ circleId, onLeft }: { circleId: string; onLeft: () => void }) {
  const { t } = useTranslation();
  const toast = useToast();
  const tv = isTV();
  const circle = useCircle(circleId);
  const { now, isha } = useIshaToday();
  const today = getLocalDateString(now);
  const window = signalWindow(today, PARTNER_DOT_DAYS);
  const signals = useCircleSignals(circleId, window.from, window.to);
  const nudges = useCircleNudges(circleId);
  useEnsurePartnerGoalsLoaded();
  const goal = usePartnerGoal(circleId);
  const prefs = usePreferences();
  const dayExcused = useDayExcused();
  const excused = prefs.activeExcusedReason != null || dayExcused != null;
  const { status } = useTodayPrayers();
  const [sentSlots, setSentSlots] = useState<ReadonlySet<string>>(() => new Set());

  const share = useCircleMutation((token, date: string) => putGoalDone(token, circleId, date));
  const unshare = useCircleMutation((token, date: string) =>
    clearSignal(token, circleId, "goal_done", date),
  );
  const nudge = useCircleMutation((token, vars: { to: string; kind: CircleNudgeKind }) =>
    sendNudge(token, circleId, vars.to, vars.kind),
  );

  const detail = circle.data;
  const me = detail?.members.find((m) => m.isMe);
  const rows = useMemo(
    () => buildPartnerRows(detail?.members ?? [], signals.data ?? [], today),
    [detail?.members, signals.data, today],
  );
  const received = useMemo(
    () => visibleNudges(nudges.data ?? [], { now, isha, excused }),
    [nudges.data, now, isha, excused],
  );
  const sharedToday = me ? sharedDoneOn(signals.data ?? [], me.memberId, today) : false;

  if (circle.isLoading) return <CircleLoading label={t("partnerCircle.loading")} />;
  if (circle.isError || !detail) {
    return (
      <CircleRetryCard
        message={t("partnerCircle.loadError")}
        retryLabel={t("partnerCircle.retry")}
        onRetry={() => void circle.refetch()}
      />
    );
  }

  const onShare = async () => {
    try {
      await share.mutateAsync(today);
      toast.success(t("partnerCircle.today.sharedToast"));
    } catch {
      toast.error(t("partnerCircle.today.error"));
    }
  };
  const onUnshare = async () => {
    try {
      await unshare.mutateAsync(today);
    } catch {
      toast.error(t("partnerCircle.today.error"));
    }
  };
  const onNudge = async (to: string, kind: CircleNudgeKind) => {
    try {
      await nudge.mutateAsync({ to, kind });
      toast.success(t(nudgeOutcomeKey(kind, "sent")));
      setSentSlots((prev) => new Set(prev).add(nudgeSlotKey(to, kind)));
    } catch (error) {
      const outcome = nudgeOutcomeFromError(error);
      if (outcome === "alreadySent") {
        setSentSlots((prev) => new Set(prev).add(nudgeSlotKey(to, kind)));
        toast.info(t(nudgeOutcomeKey(kind, outcome)));
      } else {
        toast.error(t(nudgeOutcomeKey(kind, outcome)));
      }
    }
  };

  const others = detail.members.filter((m) => !m.isMe && m.memberKind === "user");

  return (
    <View style={styles.stack}>
      <PartnerReceivedCard nudges={received} duasToday={duasToday(received.duas, now)} />

      <PartnerGoalCard
        goal={goal}
        onSaveGoal={(next) => void setPartnerGoal(circleId, next)}
        sharedToday={sharedToday}
        paused={me?.paused ?? false}
        looksMet={goalLooksMet(goal, status)}
        excused={excused}
        busy={share.isPending || unshare.isPending}
        readOnly={tv}
        onShare={() => void onShare()}
        onUnshare={() => void onUnshare()}
      />

      {others.length === 0 ? (
        <Card style={styles.gap}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("partnerCircle.waitingForPartner")}
          </ThemedText>
        </Card>
      ) : null}

      <PartnerDots
        rows={rows}
        readOnly={tv}
        sentSlots={sentSlots}
        onNudge={(to, kind) => void onNudge(to, kind)}
      />

      {!tv && partnerRoomLeft(detail.memberCount) > 0 ? (
        <InvitePanel
          circleId={circleId}
          inviteRole="member"
          title={t("partnerCircle.invite.title")}
          hint={t("partnerCircle.invite.hint")}
        />
      ) : null}

      <Card style={styles.gap}>
        <ThemedText type="smallBold">{t("partnerCircle.privacy.title")}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("partnerCircle.privacy.body")}
        </ThemedText>
      </Card>

      <EvidenceLinks
        titleKey="partnerCircle.evidence.title"
        introKey="partnerCircle.evidence.intro"
        refs={PARTNER_EVIDENCE}
      />

      {!tv ? <MyMembershipCard circleId={circleId} me={me} showPause onLeft={onLeft} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});
