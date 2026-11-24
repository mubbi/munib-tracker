import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { InvitePanel } from "@/components/circles/invite-panel";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useCircle, useCircleAuth } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * Invite the other parent (role `parent`) or a young person 13+ with their own
 * account (role `member`). Children under 13 are never invited — they get a
 * parent-managed profile instead (D7).
 */
export default function FamilyInviteScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useCircleAuth();
  const { circleId } = useLocalSearchParams<{ circleId?: string }>();
  const circle = useCircle(auth.isAccount ? circleId : undefined);
  // Only the owner may mint a parent invite (API: owner-only, single-use, ≤ 48 h).
  const canInviteParent = circle.data?.myRole === "owner";

  return (
    <ScreenLayout
      eyebrow={t("family.eyebrow")}
      title={t("family.invite.title")}
      subtitle={t("family.invite.subtitle")}
      onBack={() => goBackOrReplace(router, "/family")}
    >
      <Seo path="/family/invite" index={false} />
      {!auth.isAccount ? (
        <CircleAccountGate />
      ) : isTV() || !circleId ? (
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {t("family.tvSetup")}
          </ThemedText>
        </Card>
      ) : (
        <View style={styles.stack}>
          {canInviteParent ? (
            <InvitePanel
              circleId={circleId}
              inviteRole="parent"
              title={t("family.invite.parentTitle")}
              hint={t("family.invite.parentHint")}
            />
          ) : null}
          <InvitePanel
            circleId={circleId}
            inviteRole="member"
            title={t("family.invite.memberTitle")}
            hint={t("family.invite.memberHint")}
          />
        </View>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family/invite");
