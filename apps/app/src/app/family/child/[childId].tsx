import { CIRCLE_LIMITS, KIDS_MODE_MAX_AGE } from "@munib-tracker/shared/circles";
import { formatShortDate, getLocalDateString } from "@munib-tracker/shared/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FardDots } from "@/components/circles/fard-dots";
import { InviteMethodTabs } from "@/components/circles/nearby/invite-method-tabs";
import { NearbyHostPanel } from "@/components/circles/nearby/nearby-host-panel";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { TextField } from "@/components/self-review/text-field";
import { Seo } from "@/components/seo/seo";
import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { buildHttpsAppUrl } from "@/lib/app-links";
import {
  type ChildDeviceLink,
  clearSignal,
  createChildDeviceLink,
  deleteChild,
  putRestDay,
  revokeChildDevice,
  type UpdateChildInput,
  updateChild,
} from "@/lib/circles/api";
import { indexSignals, lastNDates, signalWindow } from "@/lib/circles/family";
import {
  useChildProfiles,
  useCircleAction,
  useCircleMutation,
  useCircleSignals,
  useFardStatusLog,
} from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";

/** HTTPS link the child's device opens from the QR (camera app → App Link → `/kids/link`). */
export function childLinkUrl(linkToken: string): string {
  return buildHttpsAppUrl(`/kids/link?token=${encodeURIComponent(linkToken)}`);
}

/** Parent tools for one child profile: week log, device link, reward, graduation, delete. */
export default function ChildProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { childId, circleId } = useLocalSearchParams<{ childId: string; circleId?: string }>();
  const back = () => goBackOrReplace(router, "/family");
  const children = useChildProfiles(circleId);
  const child = children.data?.find((c) => c.id === childId);
  const today = getLocalDateString();
  const window = signalWindow(today, 7);
  const signals = useCircleSignals(circleId, window.from, window.to);
  const days = useMemo(
    () => indexSignals(signals.data ?? []).get(childId),
    [signals.data, childId],
  );

  const [nickname, setNickname] = useState("");
  const [birthYear, setBirthYear] = useState(0);
  const [rewardTitle, setRewardTitle] = useState("");
  const [rewardDays, setRewardDays] = useState(7);
  const [link, setLink] = useState<ChildDeviceLink | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const thisYear = new Date().getUTCFullYear();
  // Same range as "Add a child" (kids mode is under 13); a profile already past
  // it keeps its stored year as the floor instead of jumping.
  const minBirthYear = Math.min(child?.birthYear ?? thisYear, thisYear - KIDS_MODE_MAX_AGE);

  useEffect(() => {
    if (!child) return;
    setNickname(child.nickname);
    setBirthYear(child.birthYear);
    setRewardTitle(child.reward?.title ?? "");
    setRewardDays(child.reward?.days ?? 7);
  }, [child]);

  const update = useCircleMutation((token, input: UpdateChildInput) =>
    updateChild(token, circleId as string, childId, input),
  );
  const log = useFardStatusLog(circleId, window.from, window.to);
  const rest = useCircleMutation(async (token, input: { date: string; on: boolean }) => {
    if (input.on) {
      await putRestDay(token, circleId as string, { date: input.date, memberId: childId });
    } else {
      await clearSignal(token, circleId as string, "rest_day", input.date, childId);
    }
  });
  const deviceLink = useCircleAction((token) =>
    createChildDeviceLink(token, circleId as string, childId),
  );
  const revoke = useCircleAction((token) => revokeChildDevice(token, circleId as string, childId));
  const remove = useCircleAction((token) => deleteChild(token, circleId as string, childId));

  const run = async (fn: () => Promise<unknown>, okKey?: string) => {
    try {
      await fn();
      if (okKey) toast.success(t(okKey));
    } catch {
      toast.error(t("circles.common.offline"));
    }
  };

  if (isTV() || !circleId) {
    return (
      <ScreenLayout title={t("family.title")} onBack={back}>
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {t("family.tvSetup")}
          </ThemedText>
        </Card>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("family.eyebrow")}
      title={child?.nickname ?? t("family.child.title")}
      subtitle={child ? t(`family.band.${child.ageBand}`) : undefined}
      onBack={back}
    >
      <Seo path="/family/child" index={false} />
      {!child ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {children.isLoading ? t("circles.common.loading") : t("family.child.notFound")}
        </ThemedText>
      ) : (
        <View style={styles.stack}>
          <Button
            label={t("family.child.kidsMode", { name: child.nickname })}
            onPress={() => router.push({ pathname: "/kids", params: { childId, circleId } })}
          />

          <SectionHeader title={t("family.child.weekTitle")} />
          <Card padding="three" style={styles.gap}>
            {lastNDates(today, 7)
              .reverse()
              .map((date) => {
                const day = days?.get(date);
                return (
                  <View key={date} style={styles.day}>
                    <View style={styles.switchRow}>
                      <ThemedText type="smallBold" style={styles.flex}>
                        {date === today ? t("family.today") : formatShortDate(date)}
                      </ThemedText>
                      <ThemedText type="caption" themeColor="mutedForeground">
                        {t("family.restDay")}
                      </ThemedText>
                      <ThemedSwitch
                        value={day?.rest === true}
                        onValueChange={(on) => void run(() => rest.mutateAsync({ date, on }))}
                        accessibilityLabel={t("family.restDay")}
                      />
                    </View>
                    <FardDots
                      value={day?.fard ?? null}
                      showLabels={date === today}
                      onToggle={(prayer) => void run(() => log.toggle(childId, date, prayer))}
                    />
                  </View>
                );
              })}
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("family.restDayHint")}
            </ThemedText>
          </Card>

          <SectionHeader title={t("family.device.title")} />
          <Card padding="three" style={styles.gap}>
            <ThemedText type="small" themeColor="mutedForeground">
              {child.linkedDeviceAt ? t("family.device.linked") : t("family.device.body")}
            </ThemedText>
            {/* NF-3.25: link the child's phone over Bluetooth (parent approves), or by QR. */}
            <InviteMethodTabs
              nearby={
                child.consentPending ? null : (
                  <NearbyHostPanel circleId={circleId} childId={childId} />
                )
              }
            >
              {link ? (
                <View style={styles.center}>
                  <BrandQrCode
                    data={childLinkUrl(link.linkToken)}
                    size={220}
                    accessibilityLabel={t("family.device.qrA11y")}
                  />
                  <ThemedText type="caption" themeColor="mutedForeground">
                    {t("family.device.qrHint")}
                  </ThemedText>
                  <ThemedText type="caption" themeColor="mutedForeground" selectable>
                    {link.linkToken}
                  </ThemedText>
                </View>
              ) : null}
              <Button
                label={t(child.linkedDeviceAt ? "family.device.relink" : "family.device.link")}
                onPress={() =>
                  void run(async () => {
                    setLink(await deviceLink.mutateAsync());
                  })
                }
              />
            </InviteMethodTabs>
            {child.linkedDeviceAt ? (
              <Button
                label={t("family.device.revoke")}
                variant="secondary"
                onPress={() => void run(() => revoke.mutateAsync(), "family.device.revoked")}
              />
            ) : null}
          </Card>

          <SectionHeader title={t("family.reward.title")} />
          <Card padding="three" style={styles.gap}>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("family.reward.body")}
            </ThemedText>
            <TextField
              label={t("family.reward.what")}
              placeholder={t("family.reward.placeholder")}
              value={rewardTitle}
              onChangeText={setRewardTitle}
              maxLength={CIRCLE_LIMITS.rewardTitleMaxLength}
            />
            <ThemedText type="smallBold">
              {t("family.reward.days", { count: rewardDays })}
            </ThemedText>
            <Stepper
              value={rewardDays}
              min={1}
              label={t("family.reward.daysLabel")}
              onDecrement={() => setRewardDays((d) => Math.max(1, d - 1))}
              onIncrement={() => setRewardDays((d) => Math.min(CIRCLE_LIMITS.rewardMaxDays, d + 1))}
            />
            <View style={styles.row}>
              <Button
                label={t("family.reward.save")}
                disabled={!rewardTitle.trim()}
                onPress={() =>
                  void run(
                    () =>
                      update.mutateAsync({
                        reward: { title: rewardTitle.trim(), days: rewardDays },
                      }),
                    "family.saved",
                  )
                }
              />
              {child.reward ? (
                <Button
                  label={t("family.reward.clear")}
                  variant="secondary"
                  onPress={() =>
                    void run(() => update.mutateAsync({ reward: null }), "family.saved")
                  }
                />
              ) : null}
            </View>
          </Card>

          <SectionHeader title={t("family.child.profileTitle")} />
          <Card padding="three" style={styles.gap}>
            <TextField
              label={t("family.add.nickname")}
              value={nickname}
              onChangeText={setNickname}
              maxLength={CIRCLE_LIMITS.nicknameMaxLength}
            />
            <ThemedText type="smallBold">{`${t("family.add.birthYear")}: ${birthYear}`}</ThemedText>
            <Stepper
              value={birthYear}
              min={minBirthYear}
              label={t("family.add.birthYear")}
              onDecrement={() => setBirthYear((y) => Math.max(minBirthYear, y - 1))}
              onIncrement={() => setBirthYear((y) => Math.min(thisYear, y + 1))}
            />
            <Button
              label={t("family.saveProfile")}
              variant="secondary"
              disabled={!nickname.trim()}
              onPress={() =>
                void run(
                  () => update.mutateAsync({ nickname: nickname.trim(), birthYear }),
                  "family.saved",
                )
              }
            />
          </Card>

          <SectionHeader title={t("family.graduation.title")} />
          <Card padding="three" style={styles.gap}>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("family.graduation.body")}
            </ThemedText>
            <View style={styles.switchRow}>
              <ThemedText type="small" style={styles.flex}>
                {t("family.graduation.early")}
              </ThemedText>
              <ThemedSwitch
                value={child.graduationUnlocked}
                onValueChange={(on) =>
                  void run(() => update.mutateAsync({ graduationUnlocked: on }), "family.saved")
                }
                accessibilityLabel={t("family.graduation.early")}
              />
            </View>
          </Card>

          <Button
            label={t("family.child.delete")}
            variant="ghost"
            onPress={() => setConfirmDelete(true)}
          />
        </View>
      )}
      <ConfirmDialog
        visible={confirmDelete}
        title={t("family.child.deleteTitle")}
        message={t("family.child.deleteBody")}
        confirmLabel={t("family.child.delete")}
        destructive
        onConfirm={() => {
          setConfirmDelete(false);
          void run(async () => {
            await remove.mutateAsync();
            back();
          }, "family.child.deleted");
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  day: { gap: Spacing.one, paddingVertical: Spacing.one },
  row: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
  center: { alignItems: "center", gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family/child/[childId]");
