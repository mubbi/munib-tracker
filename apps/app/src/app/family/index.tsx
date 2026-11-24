import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleAccountGate } from "@/components/circles/account-gate";
import { CreateFamilyCard } from "@/components/circles/family/create-family-card";
import { FamilyDashboard } from "@/components/circles/family/family-dashboard";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { ScreenLayout } from "@/components/screen-layout";
import { EvidenceLinks, type EvidenceRef } from "@/components/self-review/evidence-links";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useCircleAuth, useCircles } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

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
          <CircleLoading />
        ) : circles.isError ? (
          <CircleRetryCard onRetry={() => void circles.refetch()} />
        ) : family ? (
          <FamilyDashboard circleId={family.id} />
        ) : (
          <CreateFamilyCard />
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

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family");
