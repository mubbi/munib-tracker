import {
  CIRCLE_LIMITS,
  formatInviteCode,
  isValidInviteCode,
  normalizeInviteCode,
} from "@munib-tracker/shared/circles";
import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { CircleCodeEntry } from "@/components/circles/code-entry";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { CircleSessionGate } from "@/components/circles/session-gate";
import { ScreenLayout } from "@/components/screen-layout";
import { TextField } from "@/components/self-review/text-field";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { circleErrorStatus, joinCircle } from "@/lib/circles/api";
import { canUseCircleType, circleHomeHref } from "@/lib/circles/family";
import { useCircleAuth, useCircleMutation, useInvitePreview } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useAuth } from "@/providers/auth-provider";
import { useToast } from "@/providers/toast-provider";

/** The invite doesn't exist (404) or is no longer usable (410). */
function isGone(status: number): boolean {
  return status === 404 || status === 410;
}

function errorKey(status: number): string {
  if (isGone(status)) return "circles.join.invalid";
  if (status === 429) return "circles.join.rateLimited";
  if (status === 409) return "circles.join.full";
  if (status === 403) return "circles.join.forbidden";
  return "circles.common.offline";
}

/**
 * Invite landing (`circle/join/<CODE>`, D36): opened from the share link, the
 * QR or the hub. Works as a direct web entry — a guest session is created on
 * boot, so a guest can join a khatm group on the web without an account; family
 * and partner circles ask to sign in first.
 */
export default function CircleJoinScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const { isReady } = useAuth();
  const auth = useCircleAuth();
  const params = useLocalSearchParams<{ code?: string | string[] }>();
  const raw = Array.isArray(params.code) ? params.code[0] : params.code;
  const code = normalizeInviteCode(raw ?? "");
  const valid = isValidInviteCode(code);
  const preview = useInvitePreview(valid ? code : undefined);
  const [displayName, setDisplayName] = useState("");
  const join = useCircleMutation((token, input: { code: string; displayName?: string }) =>
    joinCircle(token, input),
  );

  const data = preview.data;
  const needsAccount = data ? !canUseCircleType(data.circleType, auth.isAccount) : false;

  const onJoin = async () => {
    try {
      const circle = await join.mutateAsync({
        code,
        displayName: displayName.trim() || undefined,
      });
      toast.success(t("circles.join.joined"));
      router.replace(circleHomeHref(circle) as Href);
    } catch (error) {
      toast.error(t(errorKey(circleErrorStatus(error))));
    }
  };

  return (
    <ScreenLayout
      eyebrow={t("circles.join.eyebrow")}
      title={t("circles.join.title")}
      subtitle={valid ? formatInviteCode(code) : undefined}
      onBack={() => goBackOrReplace(router, "/circles")}
    >
      <Seo path="/circle/join" index={false} />
      <View style={styles.stack}>
        {!valid || (preview.isError && isGone(circleErrorStatus(preview.error))) ? (
          // A bad, expired or used code is not a dead end: say so and offer the code field.
          <Card style={styles.gap}>
            <Callout tone="warning">
              {t(valid ? "circles.join.invalid" : "circles.join.badCode")}
            </Callout>
            <CircleCodeEntry
              onSubmit={(next) =>
                router.replace({ pathname: "/circle/join/[code]", params: { code: next } })
              }
            />
          </Card>
        ) : isReady && !auth.hasSession ? (
          <CircleSessionGate />
        ) : !isReady || preview.isLoading ? (
          <CircleLoading />
        ) : preview.isError || !data ? (
          <CircleRetryCard
            message={t(errorKey(circleErrorStatus(preview.error)))}
            onRetry={() => void preview.refetch()}
          />
        ) : (
          <Card style={styles.gap}>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t(`circles.type.${data.circleType}`)}
            </ThemedText>
            <ThemedText type="subtitle">{data.circleName}</ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("circles.join.members", { count: data.memberCount })}
            </ThemedText>
            <ThemedText type="small" themeColor="mutedForeground">
              {t(`circles.join.roleHint.${data.circleType}`)}
            </ThemedText>
            {data.alreadyMember ? (
              <>
                <ThemedText type="small">{t("circles.join.already")}</ThemedText>
                <Button label={t("circles.join.open")} onPress={() => router.replace("/circles")} />
              </>
            ) : needsAccount ? (
              <CircleAccountGate />
            ) : (
              <>
                <TextField
                  label={t("circles.join.displayName")}
                  hint={t("circles.join.displayNameHint")}
                  value={displayName}
                  onChangeText={setDisplayName}
                  maxLength={CIRCLE_LIMITS.displayNameMaxLength}
                />
                <Button
                  label={t("circles.join.confirm")}
                  loading={join.isPending}
                  disabled={!auth.hasSession}
                  onPress={() => void onJoin()}
                />
              </>
            )}
          </Card>
        )}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/circle/join/[code]");
