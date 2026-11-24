import { CIRCLE_LIMITS, type FardStatusValue } from "@munib-tracker/shared/circles";
import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { ChildCard } from "@/components/circles/child-card";
import { FardDots } from "@/components/circles/fard-dots";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { EvidenceLinks, type EvidenceRef } from "@/components/self-review/evidence-links";
import { TextField } from "@/components/self-review/text-field";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import {
  createCircle,
  deleteCircle,
  type FardStatusInput,
  leaveCircle,
  putFardStatus,
  updateMyMembership,
} from "@/lib/circles/api";
import { indexSignals, isFamilyParent, signalWindow } from "@/lib/circles/family";
import {
  useChildProfiles,
  useCircle,
  useCircleAction,
  useCircleAuth,
  useCircleMutation,
  useCircleSignals,
  useCircles,
} from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";

/** Islamic basis shown in-app (Abu Dawud 495 is cited in the proof log only — see there). */
export const FAMILY_EVIDENCE: readonly EvidenceRef[] = [
  { kind: "quran", surah: 66, ayah: 6, labelKey: "family.evidence.q666" },
  { kind: "quran", surah: 20, ayah: 132, labelKey: "family.evidence.q20132" },
];

/**
 * Parent view (`/family`, D7): per child per day the five fard statuses and the
 * child's own stickers — that's all. Adults (13+) appear only if they opted in
 * to share. A parent's own salah is never shared.
 */
export default function FamilyScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useCircleAuth();
  const params = useLocalSearchParams<{ circleId?: string }>();
  const circles = useCircles({ enabled: auth.isAccount });
  const family = useMemo(() => {
    const list = (circles.data ?? []).filter((c) => c.type === "family");
    return list.find((c) => c.id === params.circleId) ?? list[0];
  }, [circles.data, params.circleId]);

  return (
    <ScreenLayout
      eyebrow={t("family.eyebrow")}
      title={family?.name ?? t("family.title")}
      subtitle={t("family.subtitle")}
      onBack={() => goBackOrReplace(router, "/circles")}
    >
      <Seo path="/family" index={false} />
      <View style={styles.stack}>
        {!auth.isAccount ? (
          <CircleAccountGate />
        ) : circles.isLoading ? (
          <ThemedText type="small" themeColor="mutedForeground">
            {t("circles.common.loading")}
          </ThemedText>
        ) : circles.isError ? (
          <Card padding="three" style={styles.gap}>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("circles.common.offline")}
            </ThemedText>
            <Button
              label={t("circles.common.retry")}
              variant="secondary"
              onPress={() => void circles.refetch()}
            />
          </Card>
        ) : family ? (
          <FamilyDashboard circleId={family.id} />
        ) : (
          <CreateFamily />
        )}
        <EvidenceLinks titleKey="family.evidence.title" refs={FAMILY_EVIDENCE} />
        <Card padding="three" style={styles.gap}>
          <ThemedText type="smallBold">{t("family.privacy.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("family.privacy.body")}
          </ThemedText>
        </Card>
      </View>
    </ScreenLayout>
  );
}

function CreateFamily() {
  const { t } = useTranslation();
  const toast = useToast();
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const create = useCircleMutation((token, input: { name: string; displayName?: string }) =>
    createCircle(token, { type: "family", ...input }),
  );

  if (isTV()) {
    return (
      <Card padding="three">
        <ThemedText type="small" themeColor="mutedForeground">
          {t("family.tvSetup")}
        </ThemedText>
      </Card>
    );
  }

  const onCreate = async () => {
    try {
      await create.mutateAsync({
        name: name.trim(),
        displayName: displayName.trim() || undefined,
      });
      toast.success(t("family.created"));
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  return (
    <Card padding="three" style={styles.gap}>
      <ThemedText type="subtitle">{t("family.create.title")}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {t("family.create.body")}
      </ThemedText>
      <TextField
        label={t("family.create.name")}
        placeholder={t("family.create.namePlaceholder")}
        value={name}
        onChangeText={setName}
        maxLength={CIRCLE_LIMITS.nameMaxLength}
      />
      <TextField
        label={t("circles.join.displayName")}
        hint={t("circles.join.displayNameHint")}
        value={displayName}
        onChangeText={setDisplayName}
        maxLength={CIRCLE_LIMITS.displayNameMaxLength}
      />
      <Button
        label={create.isPending ? t("circles.common.working") : t("family.create.cta")}
        disabled={!name.trim() || create.isPending}
        onPress={() => void onCreate()}
      />
    </Card>
  );
}

function FamilyDashboard({ circleId }: { circleId: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const tv = isTV();
  const today = getLocalDateString();
  const window = signalWindow(today, 7);
  const detail = useCircle(circleId);
  const role = detail.data?.myRole;
  const parent = role ? isFamilyParent(role) : false;
  const children = useChildProfiles(circleId, { enabled: parent });
  const signals = useCircleSignals(circleId, window.from, window.to);
  const index = useMemo(() => indexSignals(signals.data ?? []), [signals.data]);
  const [confirm, setConfirm] = useState<"leave" | "delete" | null>(null);

  const logFard = useCircleMutation((token, input: FardStatusInput) =>
    putFardStatus(token, circleId, input),
  );
  const share = useCircleMutation((token, on: boolean) =>
    updateMyMembership(token, circleId, { shareFardStatus: on }),
  );
  const leave = useCircleAction((token) => leaveCircle(token, circleId));
  const remove = useCircleAction((token) => deleteCircle(token, circleId));

  const me = detail.data?.members.find((m) => m.isMe);
  const sharingAdults = (detail.data?.members ?? []).filter(
    (m) => m.memberKind === "user" && !m.isMe && m.role === "member" && m.shareFardStatus,
  );

  const onToggle = async (memberId: string, next: FardStatusValue) => {
    try {
      await logFard.mutateAsync({ date: today, memberId, ...next });
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  const onConfirm = async () => {
    const action = confirm;
    setConfirm(null);
    try {
      if (action === "delete") await remove.mutateAsync();
      else if (action === "leave") await leave.mutateAsync();
      goBackOrReplace(router, "/circles");
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  if (detail.isLoading) {
    return (
      <ThemedText type="small" themeColor="mutedForeground">
        {t("circles.common.loading")}
      </ThemedText>
    );
  }

  return (
    <View style={styles.stack}>
      {parent ? (
        <>
          <SectionHeader title={t("family.childrenTitle")} />
          {(children.data ?? []).length === 0 ? (
            <Card padding="three">
              <ThemedText type="small" themeColor="mutedForeground">
                {t("family.noChildren")}
              </ThemedText>
            </Card>
          ) : (
            (children.data ?? []).map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                days={index.get(child.id)}
                today={today}
                canEdit={!tv}
                onToggle={(_, next) => void onToggle(child.id, next)}
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

      {me && me.role === "member" ? (
        <Card padding="three" style={styles.gap}>
          <View style={styles.switchRow}>
            <ThemedText type="small" style={styles.flex}>
              {t("family.shareMine")}
            </ThemedText>
            <ThemedSwitch
              value={me.shareFardStatus}
              disabled={tv || share.isPending}
              onValueChange={(on) => void share.mutateAsync(on).catch(() => undefined)}
              accessibilityLabel={t("family.shareMine")}
            />
          </View>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("family.shareMineHint")}
          </ThemedText>
        </Card>
      ) : null}

      {!tv ? (
        <Button
          label={role === "owner" ? t("family.delete") : t("family.leave")}
          variant="ghost"
          onPress={() => setConfirm(role === "owner" ? "delete" : "leave")}
        />
      ) : null}

      <ConfirmDialog
        visible={confirm != null}
        title={
          confirm === "delete" ? t("family.deleteConfirmTitle") : t("family.leaveConfirmTitle")
        }
        message={
          confirm === "delete" ? t("family.deleteConfirmBody") : t("family.leaveConfirmBody")
        }
        confirmLabel={confirm === "delete" ? t("family.delete") : t("family.leave")}
        destructive
        onConfirm={() => void onConfirm()}
        onClose={() => setConfirm(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family");
