import type { CircleRole, FardPrayer } from "@munib-tracker/shared/circles";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ChildCard } from "@/components/circles/child-card";
import { FardDots } from "@/components/circles/fard-dots";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import {
  type CircleMember,
  deleteCircle,
  leaveCircle,
  updateMyMembership,
} from "@/lib/circles/api";
import {
  indexSignals,
  isFamilyParent,
  type MemberDay,
  sharingAdultMembers,
  signalWindow,
} from "@/lib/circles/family";
import {
  useChildProfiles,
  useCircle,
  useCircleAction,
  useCircleMutation,
  useCircleSignals,
  useFardStatusLog,
} from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { useToast } from "@/providers/toast-provider";

type MemberDays = Map<string, Map<string, MemberDay>>;

/**
 * Parent view of one family circle (D7): each child's five fard statuses for
 * today, adults (13+) who opted in to share, my own share switch, leave / delete.
 */
export function FamilyDashboard({ circleId }: { circleId: string }) {
  const { t } = useTranslation();
  const tv = isTV();
  const today = getLocalDateString();
  const window = signalWindow(today, 7);
  const detail = useCircle(circleId);
  const role = detail.data?.myRole;
  const parent = role ? isFamilyParent(role) : false;
  const signals = useCircleSignals(circleId, window.from, window.to);
  const index = useMemo(() => indexSignals(signals.data ?? []), [signals.data]);

  if (detail.isLoading) return <CircleLoading />;
  if (detail.isError || !detail.data) {
    return <CircleRetryCard onRetry={() => void detail.refetch()} />;
  }

  const members = detail.data.members;
  const me = members.find((m) => m.isMe);
  const sharingAdults = sharingAdultMembers(members);

  return (
    <View style={styles.stack}>
      {parent ? (
        <FamilyChildrenSection circleId={circleId} today={today} window={window} index={index} />
      ) : null}

      {sharingAdults.length > 0 ? (
        <>
          <SectionHeader title={t("family.adultsTitle")} />
          {sharingAdults.map((m) => (
            <Card key={m.memberId} padding="three" style={styles.gap}>
              <ThemedText type="smallBold">{m.displayName ?? t("family.familyMember")}</ThemedText>
              <FardDots value={index.get(m.memberId)?.get(today)?.fard ?? null} />
            </Card>
          ))}
        </>
      ) : null}

      {me && me.role === "member" ? <ShareMineCard circleId={circleId} me={me} /> : null}

      {!tv && role ? <LeaveFamilyButton circleId={circleId} role={role} /> : null}
    </View>
  );
}

/** Children (parents only): today's dots (tap to log), open a child, add / invite. */
function FamilyChildrenSection({
  circleId,
  today,
  window,
  index,
}: {
  circleId: string;
  today: string;
  window: { from: string; to: string };
  index: MemberDays;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const tv = isTV();
  const children = useChildProfiles(circleId);
  const logFard = useFardStatusLog(circleId, window.from, window.to);
  const list = children.data ?? [];

  const onToggle = async (memberId: string, prayer: FardPrayer) => {
    try {
      await logFard.toggle(memberId, today, prayer);
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  return (
    <>
      <SectionHeader title={t("family.childrenTitle")} />
      {list.length === 0 ? (
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {t("family.noChildren")}
          </ThemedText>
        </Card>
      ) : (
        list.map((child) => (
          <ChildCard
            key={child.id}
            child={child}
            days={index.get(child.id)}
            today={today}
            canEdit={!tv}
            onToggle={(prayer) => void onToggle(child.id, prayer)}
            onOpen={
              tv
                ? undefined
                : () =>
                    router.push({
                      pathname: "/family/child/[childId]",
                      params: { childId: child.id, circleId },
                    })
            }
          />
        ))
      )}
      {!tv ? (
        <View style={styles.row}>
          <Button
            label={t("family.addChild")}
            onPress={() => router.push({ pathname: "/family/add-child", params: { circleId } })}
          />
          <Button
            label={t("family.invite.cta")}
            variant="secondary"
            onPress={() => router.push({ pathname: "/family/invite", params: { circleId } })}
          />
        </View>
      ) : null}
    </>
  );
}

/** Adult (13+) member: opt in / out of sharing my own five fard statuses. */
function ShareMineCard({ circleId, me }: { circleId: string; me: CircleMember }) {
  const { t } = useTranslation();
  const toast = useToast();
  const share = useCircleMutation((token, on: boolean) =>
    updateMyMembership(token, circleId, { shareFardStatus: on }),
  );

  const onShare = async (on: boolean) => {
    try {
      await share.mutateAsync(on);
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  return (
    <Card padding="three" style={styles.gap}>
      <View style={styles.switchRow}>
        <ThemedText type="small" style={styles.flex}>
          {t("family.shareMine")}
        </ThemedText>
        <ThemedSwitch
          value={me.shareFardStatus}
          disabled={isTV() || share.isPending}
          onValueChange={(on) => void onShare(on)}
          accessibilityLabel={t("family.shareMine")}
        />
      </View>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("family.shareMineHint")}
      </ThemedText>
    </Card>
  );
}

/** Owner deletes the family; everyone else leaves it (both confirmed). */
function LeaveFamilyButton({ circleId, role }: { circleId: string; role: CircleRole }) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const owner = role === "owner";
  const leave = useCircleAction((token) => leaveCircle(token, circleId));
  const remove = useCircleAction((token) => deleteCircle(token, circleId));

  const onConfirm = async () => {
    setConfirm(false);
    try {
      if (owner) await remove.mutateAsync();
      else await leave.mutateAsync();
      goBackOrReplace(router, "/circles");
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  return (
    <>
      <Button
        label={owner ? t("family.delete") : t("family.leave")}
        variant="ghost"
        onPress={() => setConfirm(true)}
      />
      <ConfirmDialog
        visible={confirm}
        title={owner ? t("family.deleteConfirmTitle") : t("family.leaveConfirmTitle")}
        message={owner ? t("family.deleteConfirmBody") : t("family.leaveConfirmBody")}
        confirmLabel={owner ? t("family.delete") : t("family.leave")}
        destructive
        onConfirm={() => void onConfirm()}
        onClose={() => setConfirm(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});
