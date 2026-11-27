import { useLocalSearchParams, useRouter } from "expo-router";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { PartnerCircleView } from "@/components/circles/partner/partner-circle-view";
import { PartnerCreateCard } from "@/components/circles/partner/partner-create-card";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { useCircleAuth, useCircles } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/**
 * NF-3.17 Accountability partner. `/partner?circleId=…` opens one circle (the
 * circles hub and the inbox link here); without it we open the only partner
 * circle, list several, or offer to start one. Partner circles need a linked
 * account (guests see the sign-in gate).
 */
export default function PartnerScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ circleId?: string }>();
  const auth = useCircleAuth();
  const circles = useCircles({ enabled: auth.isAccount });
  const partnerCircles = (circles.data ?? []).filter((c) => c.type === "partner");
  const circleId =
    params.circleId ?? (partnerCircles.length === 1 ? partnerCircles[0]?.id : undefined);

  const open = (id: string) => router.setParams({ circleId: id });
  const backToList = () => router.setParams({ circleId: undefined });

  let body: ReactNode;
  if (!auth.isAccount) {
    body = <CircleAccountGate message={t("partnerCircle.gate")} />;
  } else if (circleId) {
    body = (
      <PartnerCircleView
        key={circleId}
        circleId={circleId}
        onLeft={() => goBackOrReplace(router, "/circles")}
      />
    );
  } else if (circles.isLoading) {
    body = <CircleLoading label={t("partnerCircle.loading")} />;
  } else {
    body = (
      <View style={styles.stack}>
        {circles.isError ? (
          <CircleRetryCard
            message={t("partnerCircle.loadError")}
            retryLabel={t("partnerCircle.retry")}
            onRetry={() => void circles.refetch()}
          />
        ) : null}
        {partnerCircles.length > 1 ? (
          <>
            <SectionHeader title={t("partnerCircle.listTitle")} />
            <Card padding="two" style={styles.gap}>
              {partnerCircles.map((c) => (
                <NavRow
                  key={c.id}
                  icon={{ ios: "person.2.fill", android: "group", web: "group" }}
                  label={c.name}
                  onPress={() => open(c.id)}
                />
              ))}
            </Card>
          </>
        ) : null}
        <Card style={styles.gap}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("partnerCircle.intro")}
          </ThemedText>
        </Card>
        {isTV() ? null : <PartnerCreateCard onCreated={(c) => open(c.id)} />}
        {isTV() ? null : (
          <Button
            variant="ghost"
            label={t("partnerCircle.haveInvite")}
            onPress={() => router.push("/circles")}
          />
        )}
      </View>
    );
  }

  return (
    <ScreenLayout
      eyebrow={t("partnerCircle.eyebrow")}
      title={t("partnerCircle.title")}
      subtitle={t("partnerCircle.subtitle")}
      onBack={() =>
        params.circleId && partnerCircles.length > 1
          ? backToList()
          : goBackOrReplace(router, "/circles")
      }
    >
      <Seo path="/partner" index={false} />
      {body}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/partner");
