import { addDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, type ViewInstance } from "react-native";
import { InvitePanel } from "@/components/circles/invite-panel";
import { MyMembershipCard } from "@/components/circles/my-membership-card";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import {
  type CircleMember,
  type KhatmPart,
  startKhatmRound,
  type UpdateKhatmInput,
  updateKhatm,
} from "@/lib/circles/api";
import {
  useCircle,
  useCircleAction,
  useCircleMutation,
  useKhatm,
  useKhatms,
} from "@/lib/circles/hooks";
import {
  assignmentModeHintKey,
  currentKhatm,
  deadlineState,
  isKhatmManager,
  type KhatmUiAction,
  khatmDealState,
  khatmErrorKey,
  khatmProgress,
  myParts,
  needsDeadlineDecision,
  partStartAyah,
} from "@/lib/circles/khatm";
import { useKhatmDealMutation, useKhatmPartMutation } from "@/lib/circles/khatm-hooks";
import { isTV } from "@/lib/platform/is-tv";
import { JUZ_STARTS } from "@/lib/quran-meta";
import { shareViewSnapshot } from "@/lib/share/shareViewSnapshot";
import { useToast } from "@/providers/toast-provider";

import { KhatmGrid } from "./khatm-grid";
import { khatmPartTitle, khatmStatusLabel } from "./khatm-labels";
import { KhatmPartSheet } from "./khatm-part-sheet";

/** The completion dua is shown BY REFERENCE: the dataset's Qur'anic dua 2:127 (docs/proofs/group-khatm.md). */
export const KHATM_COMPLETION_DUA_ID = "quranic-taqabbal";

const EXTEND_DAYS = 7;
const NO_MEMBERS: readonly CircleMember[] = [];

/** NF-3.18 one khatm group: summary, my parts, the grid, rounds, deadline and settings. */
export function KhatmGroupView({
  circleId,
  khatmId: requestedKhatmId,
  onLeft,
}: {
  circleId: string;
  khatmId?: string;
  onLeft: () => void;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const tv = isTV();
  const circle = useCircle(circleId);
  const khatms = useKhatms(circleId);
  const khatmId = requestedKhatmId ?? currentKhatm(khatms.data ?? [])?.id;
  const khatm = useKhatm(circleId, khatmId);
  const me = circle.data?.members.find((m) => m.isMe);
  const myMemberId = me?.memberId ?? circle.data?.myMemberId ?? "";
  const manager = circle.data ? isKhatmManager(circle.data.myRole) : false;
  const parts = useKhatmPartMutation(circleId, khatmId ?? "", myMemberId);
  const members = circle.data?.members ?? NO_MEMBERS;
  const dealer = useKhatmDealMutation(circleId, khatmId ?? "", members);
  const [selected, setSelected] = useState<number | null>(null);
  const shareRef = useRef<ViewInstance | null>(null);
  const today = getLocalDateString();

  const patch = useCircleMutation((token, input: UpdateKhatmInput) =>
    updateKhatm(token, circleId, khatmId as string, input),
  );
  const nextRound = useCircleAction((token) => startKhatmRound(token, circleId, khatmId as string));

  const detail = khatm.data;
  const progress = useMemo(() => (detail ? khatmProgress(detail) : null), [detail]);
  const selectedPart = detail?.parts.find((p) => p.partNo === selected) ?? null;

  if (circle.isLoading || khatms.isLoading || (khatmId && khatm.isLoading)) {
    return <CircleLoading label={t("khatmGroups.loading")} />;
  }
  if (circle.isError || !circle.data) {
    return (
      <CircleRetryCard
        message={t("khatmGroups.loadError")}
        retryLabel={t("khatmGroups.retry")}
        onRetry={() => {
          void circle.refetch();
          void khatms.refetch();
        }}
      />
    );
  }

  const openReader = (part: KhatmPart) => {
    if (!detail) return;
    const start = partStartAyah(detail.unit, part.partNo, JUZ_STARTS);
    if (!start) return;
    if (part.status === "assigned" && part.assigneeMemberId === myMemberId) {
      void parts.run({ partNo: part.partNo, action: "reading" });
    }
    setSelected(null);
    router.push({
      pathname: "/quran/[surah]",
      params: { surah: String(start.surah), ayah: String(start.ayah) },
    } as Href);
  };

  const runAction = async (
    part: KhatmPart,
    action: Exclude<KhatmUiAction, "assign" | "reassignStale">,
  ) => {
    if (action === "read") {
      openReader(part);
      return;
    }
    setSelected(null);
    const result = await parts.run({ partNo: part.partNo, action });
    if (!result.ok) {
      toast.info(t(khatmErrorKey(result.error)));
      return;
    }
    if (action === "complete") toast.success(t("khatmGroups.toast.completed"));
    if (action === "claim") toast.success(t("khatmGroups.toast.claimed"));
  };

  const assign = async (part: KhatmPart, memberId: string | null) => {
    setSelected(null);
    const result = await parts.run({ partNo: part.partNo, action: { assign: memberId } });
    if (!result.ok) toast.info(t(khatmErrorKey(result.error)));
  };

  const extend = async () => {
    if (!detail) return;
    const base = detail.deadline && detail.deadline > today ? detail.deadline : today;
    try {
      await patch.mutateAsync({ deadline: addDays(base, EXTEND_DAYS) });
      toast.success(t("khatmGroups.deadline.extended"));
    } catch {
      toast.error(t("khatmGroups.error.unknown"));
    }
  };

  const openRemaining = async () => {
    try {
      await patch.mutateAsync({ openRemainingParts: true });
      toast.success(t("khatmGroups.deadline.opened"));
    } catch {
      toast.error(t("khatmGroups.error.unknown"));
    }
  };

  const startRound = async () => {
    try {
      await nextRound.mutateAsync();
    } catch {
      toast.error(t("khatmGroups.error.unknown"));
    }
  };

  const shareCard = async () => {
    try {
      await shareViewSnapshot(shareRef, {
        filename: "group-khatm",
        dialogTitle: t("khatmGroups.share.dialogTitle"),
        message: t("khatmGroups.share.message"),
      });
    } catch {
      toast.error(t("khatmGroups.share.error"));
    }
  };

  const dealParts = async () => {
    const result = await dealer.run();
    if (result.ok) toast.success(t("khatmGroups.deal.done"));
    else toast.info(t(khatmErrorKey(result.error)));
  };

  const deadline = detail ? deadlineState(detail.deadline, today) : { kind: "none" as const };
  const deal = detail
    ? khatmDealState(detail, members, { isManager: manager, readOnly: tv })
    : { kind: "none" as const };
  const mine = detail ? myParts(detail, myMemberId).filter((p) => p.status !== "done") : [];

  return (
    <View style={styles.stack}>
      {detail && progress ? (
        <View ref={shareRef} collapsable={false}>
          <Card padding="three" style={styles.gap}>
            <SectionHeader
              title={detail.title}
              subtitle={circle.data.name}
              icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            />
            {detail.intention ? (
              <ThemedText type="small" themeColor="mutedForeground" testID="khatm-intention">
                {t("khatmGroups.intentionLine", { intention: detail.intention })}
              </ThemedText>
            ) : null}
            <ProgressBar value={progress.fraction} />
            <ThemedText type="small" testID="khatm-progress">
              {t("khatmGroups.progress", { done: progress.done, total: progress.total })}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {[
                detail.round > 1 ? t("khatmGroups.round", { round: detail.round }) : null,
                deadline.kind === "upcoming"
                  ? t("khatmGroups.deadline.daysLeft", { count: deadline.daysLeft })
                  : deadline.kind === "today"
                    ? t("khatmGroups.deadline.today")
                    : deadline.kind === "passed"
                      ? t("khatmGroups.deadline.passed")
                      : t("khatmGroups.deadline.none"),
                circle.data.masjidOsmRef ? t("khatmGroups.masjidTagged") : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </ThemedText>
          </Card>
        </View>
      ) : null}

      {detail?.status === "completed" ? (
        <Card
          padding="three"
          style={styles.gap}
          accessibilityLabel={t("khatmGroups.complete.title")}
        >
          <SectionHeader
            title={t("khatmGroups.complete.title")}
            icon={{ ios: "sparkles", android: "auto_awesome", web: "auto_awesome" }}
          />
          <ThemedText type="small" themeColor="mutedForeground">
            {t("khatmGroups.complete.body")}
          </ThemedText>
          <Button
            variant="secondary"
            label={t("khatmGroups.complete.openDua")}
            onPress={() =>
              router.push({
                pathname: "/dua/detail/[id]",
                params: { id: KHATM_COMPLETION_DUA_ID },
              } as Href)
            }
          />
          {manager && !tv ? (
            <Button
              label={t("khatmGroups.complete.nextRound")}
              disabled={nextRound.isPending}
              onPress={() => void startRound()}
            />
          ) : null}
        </Card>
      ) : null}

      {detail && manager && !tv && needsDeadlineDecision(detail) ? (
        <Card padding="three" style={styles.gap}>
          <ThemedText type="smallBold">{t("khatmGroups.deadline.decisionTitle")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("khatmGroups.deadline.decisionBody")}
          </ThemedText>
          <Button
            variant="secondary"
            label={t("khatmGroups.deadline.extend", { count: EXTEND_DAYS })}
            disabled={patch.isPending}
            onPress={() => void extend()}
          />
          <Button
            variant="ghost"
            label={t("khatmGroups.deadline.openRemaining")}
            disabled={patch.isPending}
            onPress={() => void openRemaining()}
          />
        </Card>
      ) : null}

      {detail && mine.length > 0 && !tv ? (
        <Card padding="three" style={styles.gap}>
          <SectionHeader title={t("khatmGroups.myParts.title")} />
          {mine.map((part) => (
            <View key={part.partNo} style={styles.myPart} testID={`khatm-my-part-${part.partNo}`}>
              <ThemedText type="smallBold">
                {khatmPartTitle(detail.unit, part.partNo, t)} · {khatmStatusLabel(part.status, t)}
              </ThemedText>
              {part.stale ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("khatmGroups.sheet.staleMine")}
                </ThemedText>
              ) : null}
              <View style={styles.row}>
                <Button
                  size="sm"
                  label={t("khatmGroups.action.read")}
                  onPress={() => openReader(part)}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  label={t("khatmGroups.action.complete")}
                  disabled={parts.isPending}
                  onPress={() => void runAction(part, "complete")}
                />
              </View>
            </View>
          ))}
        </Card>
      ) : null}

      {deal.kind === "ready" || deal.kind === "waiting" ? (
        <Card padding="three" style={styles.gap}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t(deal.kind === "ready" ? "khatmGroups.deal.body" : "khatmGroups.deal.waiting")}
          </ThemedText>
          {deal.kind === "ready" ? (
            <Button
              variant="secondary"
              label={t("khatmGroups.deal.button")}
              disabled={dealer.isPending}
              onPress={() => void dealParts()}
            />
          ) : null}
        </Card>
      ) : null}

      {detail ? (
        <Card padding="three" style={styles.gap}>
          <SectionHeader
            title={t("khatmGroups.grid.title")}
            subtitle={t(assignmentModeHintKey(detail.assignmentMode))}
          />
          <KhatmGrid
            unit={detail.unit}
            parts={detail.parts}
            members={circle.data.members}
            myMemberId={myMemberId}
            onPressPart={tv ? undefined : (part) => setSelected(part.partNo)}
          />
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("khatmGroups.grid.legend")}
          </ThemedText>
        </Card>
      ) : (
        <Card padding="three" style={styles.gap}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("khatmGroups.noKhatm")}
          </ThemedText>
          {manager && !tv ? (
            <Button
              label={t("khatmGroups.startKhatm")}
              onPress={() =>
                router.push({ pathname: "/khatm-groups/new", params: { circleId } } as Href)
              }
            />
          ) : null}
        </Card>
      )}

      {detail && !tv ? (
        <Button
          variant="ghost"
          icon={{ ios: "square.and.arrow.up", android: "share", web: "share" }}
          label={t("khatmGroups.share.button")}
          onPress={() => void shareCard()}
        />
      ) : null}

      {manager && !tv ? (
        <InvitePanel
          circleId={circleId}
          inviteRole="member"
          title={t("khatmGroups.invite.title")}
          hint={t("khatmGroups.invite.hint")}
        />
      ) : null}

      <Card padding="three" style={styles.gap}>
        <ThemedText type="smallBold">{t("khatmGroups.intentionNote.title")}</ThemedText>
        <ThemedText type="small" themeColor="mutedForeground">
          {t("khatmGroups.intentionNote.body")}
        </ThemedText>
      </Card>

      {!tv ? (
        <MyMembershipCard circleId={circleId} me={me} showPause={false} onLeft={onLeft} />
      ) : null}

      {detail ? (
        <KhatmPartSheet
          part={selectedPart}
          unit={detail.unit}
          khatm={detail}
          members={circle.data.members}
          myMemberId={myMemberId}
          isManager={manager}
          busy={parts.isPending}
          onClose={() => setSelected(null)}
          onAction={(part, action) => void runAction(part, action)}
          onAssign={(part, memberId) => void assign(part, memberId)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  myPart: { gap: Spacing.one },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
