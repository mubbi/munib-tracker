import { isValidInviteCode, normalizeInviteCode } from "@munib-tracker/shared/circles";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { JoinNearbyButton } from "@/components/circles/nearby/nearby-join-sheet";
import { ScreenLayout } from "@/components/screen-layout";
import { TextField } from "@/components/self-review/text-field";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { circleHomeHref } from "@/lib/circles/family";
import { useCircleAuth, useCircles } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

const TYPE_ICON = {
  family: {
    ios: "figure.2.and.child.holdinghands",
    android: "family_restroom",
    web: "family_restroom",
  },
  partner: { ios: "person.2.fill", android: "group", web: "group" },
  khatm_group: { ios: "book.fill", android: "menu_book", web: "menu_book" },
} as const;

/**
 * Circles hub (NF-3.16–3.18): every circle I belong to, join with a code, and
 * start a family circle. Partner and group khatm creation live on their own
 * screens (NF-3.17 / NF-3.18).
 */
export default function CirclesHubScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const auth = useCircleAuth();
  const circles = useCircles();
  const [code, setCode] = useState("");
  const tv = isTV();
  const codeValid = isValidInviteCode(code);

  const join = () => {
    if (!codeValid) return;
    router.push({
      pathname: "/circle/join/[code]",
      params: { code: normalizeInviteCode(code) },
    });
  };

  return (
    <ScreenLayout
      eyebrow={t("circles.hub.eyebrow")}
      title={t("circles.hub.title")}
      subtitle={t("circles.hub.subtitle")}
      onBack={() => goBackOrReplace(router, "/library")}
    >
      <Seo path="/circles" index={false} />
      <View style={styles.stack}>
        {circles.isLoading ? (
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
        ) : (circles.data ?? []).length === 0 ? (
          <EmptyState
            icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
            title={t("circles.hub.emptyTitle")}
            description={t("circles.hub.emptyBody")}
          />
        ) : (
          <Card padding="two" style={styles.gap}>
            {(circles.data ?? []).map((circle) => (
              <NavRow
                key={circle.id}
                icon={TYPE_ICON[circle.type]}
                label={circle.name}
                badge={t(`circles.type.${circle.type}`)}
                onPress={() => router.push(circleHomeHref(circle) as Href)}
              />
            ))}
          </Card>
        )}

        <SectionHeader title={t("circles.hub.familyTitle")} />
        {auth.isAccount ? (
          <Card padding="three" style={styles.gap}>
            <ThemedText type="small" themeColor="mutedForeground">
              {t("circles.hub.familyBody")}
            </ThemedText>
            <Button label={t("circles.hub.openFamily")} onPress={() => router.push("/family")} />
          </Card>
        ) : (
          <CircleAccountGate />
        )}

        {/* NF-3.17 / NF-3.18 — their own screens handle creation. */}
        <Card padding="two" style={styles.gap}>
          <NavRow
            icon={TYPE_ICON.partner}
            label={t("partnerCircle.title")}
            onPress={() => router.push("/partner" as Href)}
          />
          <NavRow
            icon={TYPE_ICON.khatm_group}
            label={t("khatmGroups.title")}
            onPress={() => router.push("/khatm-groups" as Href)}
          />
        </Card>

        {!tv ? (
          <>
            <SectionHeader title={t("circles.hub.joinTitle")} />
            <Card padding="three" style={styles.gap}>
              <TextField
                label={t("circles.hub.codeLabel")}
                hint={t("circles.hub.codeHint")}
                value={code}
                onChangeText={setCode}
                autoCapitalize="characters"
                autoCorrect={false}
                maxLength={16}
                onSubmitEditing={join}
              />
              <Button label={t("circles.hub.join")} disabled={!codeValid} onPress={join} />
              {/* NF-3.25: phones next to each other, host-approved (hidden on web / TV). */}
              <JoinNearbyButton />
            </Card>
          </>
        ) : null}

        <Card padding="three" style={styles.gap}>
          <ThemedText type="smallBold">{t("circles.privacy.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("circles.privacy.body")}
          </ThemedText>
        </Card>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/circles");
