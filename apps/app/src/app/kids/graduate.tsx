import { CIRCLE_LIMITS } from "@munib-tracker/shared/circles";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { TextField } from "@/components/self-review/text-field";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { Spacing } from "@/constants/theme";
import { type GraduateChildInput, graduateChild } from "@/lib/circles/api";
import { clearChildSession, useChildSession } from "@/lib/circles/child-session";
import { circleHomeHref } from "@/lib/circles/family";
import { useCircleAuth, useCircleMutation } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";

/**
 * Graduation (NF-3.16): at about 13 (or earlier if the parent allows), the young
 * person signs in with their own account on this device and the child profile
 * becomes an adult family membership. After that the parents see nothing unless
 * the young person opts in to share fard status (off by default).
 */
export default function KidsGraduateScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const toast = useToast();
  const auth = useCircleAuth();
  const session = useChildSession();
  const [displayName, setDisplayName] = useState(session.meta?.child.nickname ?? "");
  const [share, setShare] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const graduate = useCircleMutation((token, input: GraduateChildInput) =>
    graduateChild(token, input),
  );

  // Throws on failure so the confirm dialog stays open with its inline error + retry.
  const onGraduate = async () => {
    if (!session.token) return;
    const circle = await graduate.mutateAsync({
      childToken: session.token,
      displayName: displayName.trim() || undefined,
      shareFardStatus: share,
    });
    await clearChildSession();
    toast.success(t("kids.graduate.done"));
    router.replace(circleHomeHref(circle) as Href);
  };

  return (
    <ScreenLayout
      eyebrow={t("kids.eyebrow")}
      title={t("kids.graduate.title")}
      subtitle={t("kids.graduate.subtitle")}
      onBack={() => goBackOrReplace(router, "/kids")}
    >
      <Seo path="/kids/graduate" index={false} />
      <View style={styles.stack}>
        {!session.token || !session.meta?.child.graduationAvailable ? (
          <EmptyState
            icon={{ ios: "graduationcap", android: "school", web: "school" }}
            title={t("kids.graduate.notYetTitle")}
            description={t("kids.graduate.notYet")}
            actionLabel={t("common.goBack")}
            onAction={() => goBackOrReplace(router, "/kids")}
          />
        ) : !auth.isAccount ? (
          <CircleAccountGate message={t("kids.graduate.signIn")} />
        ) : (
          <Card style={styles.gap}>
            <TextField
              label={t("circles.join.displayName")}
              hint={t("circles.join.displayNameHint")}
              value={displayName}
              onChangeText={setDisplayName}
              maxLength={CIRCLE_LIMITS.displayNameMaxLength}
            />
            <View style={styles.row}>
              <ThemedText type="small" style={styles.flex}>
                {t("family.shareMine")}
              </ThemedText>
              <ThemedSwitch
                value={share}
                onValueChange={setShare}
                accessibilityLabel={t("family.shareMine")}
              />
            </View>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("kids.graduate.privacy")}
            </ThemedText>
            <Button
              label={t("kids.graduate.confirm")}
              loading={graduate.isPending}
              onPress={() => setConfirmOpen(true)}
            />
          </Card>
        )}
      </View>
      <ConfirmDialog
        visible={confirmOpen}
        destructive
        busy={graduate.isPending}
        title={t("kids.graduate.confirmTitle")}
        message={t("kids.graduate.confirmMessage", {
          share: share ? t("kids.graduate.shareOn") : t("kids.graduate.shareOff"),
        })}
        confirmLabel={t("kids.graduate.confirm")}
        onConfirm={onGraduate}
        onClose={() => setConfirmOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
  row: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1 },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids/graduate");
