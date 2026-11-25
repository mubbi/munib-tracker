import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { KidsDeviceFooter } from "@/components/circles/kids/kids-device-footer";
import { KidsDuasTab } from "@/components/circles/kids/kids-duas-tab";
import { KidsLearnTab } from "@/components/circles/kids/kids-learn-tab";
import { DevicePrayTab, ParentPrayTab } from "@/components/circles/kids/kids-pray-tab";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { KidsReciteEntry } from "@/components/kids/kids-recite-entry";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";
import type { ChildProfile } from "@/lib/circles/api";
import {
  flushPendingChildStatuses,
  refreshChildProfile,
  useChildSession,
} from "@/lib/circles/child-session";
import { useChildProfiles, useCircleAuth } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

type Tab = "pray" | "learn" | "duas";

/**
 * Kids mode shell (NF-3.16, D7/D27): Pray (5 big buttons), Learn (existing
 * Learn hubs + short surahs) and Duas (curated daily duas and adhkar from the
 * bundled datasets, existing audio only). Runs either on a linked child device
 * (scoped child session) or on a parent's device in "Child: <nickname>" mode.
 * No leaderboards, no sibling comparison, no hayd UI — the parent marks generic
 * rest days.
 */
export default function KidsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const session = useChildSession();
  const auth = useCircleAuth();
  const params = useLocalSearchParams<{ childId?: string; circleId?: string }>();
  const onDevice = session.token != null && session.meta != null;
  const actingAsParent = !onDevice && auth.isAccount && !!params.childId && !!params.circleId;
  const [tab, setTab] = useState<Tab>("pray");

  useEffect(() => {
    if (onDevice) {
      void refreshChildProfile();
      void flushPendingChildStatuses();
    }
  }, [onDevice]);

  const parentChildren = useChildProfiles(actingAsParent ? params.circleId : undefined);
  const parentChild = parentChildren.data?.find((c) => c.id === params.childId);
  const child: ChildProfile | undefined = onDevice ? session.meta?.child : parentChild;

  if (isTV()) {
    return (
      <ScreenLayout title={t("kids.title")} onBack={() => goBackOrReplace(router, "/")}>
        <Card padding="three">
          <ThemedText type="small" themeColor="mutedForeground">
            {t("kids.tvUnavailable")}
          </ThemedText>
        </Card>
      </ScreenLayout>
    );
  }

  if (!onDevice && !actingAsParent) {
    return (
      <ScreenLayout
        eyebrow={t("kids.eyebrow")}
        title={t("kids.title")}
        onBack={() => goBackOrReplace(router, "/")}
      >
        <Seo path="/kids" index={false} />
        <Card padding="three" style={styles.gap}>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("kids.notLinked")}
          </ThemedText>
          <Button label={t("kids.linkCta")} onPress={() => router.push("/kids/link")} />
        </Card>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout
      eyebrow={
        actingAsParent
          ? t("kids.parentEyebrow", { name: child?.nickname ?? "" })
          : t("kids.eyebrow")
      }
      title={child ? t("kids.hello", { name: child.nickname }) : t("kids.title")}
      // A linked child device stays inside kids mode (no back to the full app).
      onBack={actingAsParent ? () => goBackOrReplace(router, "/family") : undefined}
    >
      <Seo path="/kids" index={false} />
      <View style={styles.stack}>
        <SegmentedControl<Tab>
          options={[
            { id: "pray", label: t("kids.tab.pray") },
            { id: "learn", label: t("kids.tab.learn") },
            { id: "duas", label: t("kids.tab.duas") },
          ]}
          value={tab}
          onChange={setTab}
        />
        {!child ? (
          actingAsParent && parentChildren.isError ? (
            <CircleRetryCard onRetry={() => void parentChildren.refetch()} />
          ) : (
            <CircleLoading
              label={
                actingAsParent && parentChildren.isSuccess ? t("family.child.notFound") : undefined
              }
            />
          )
        ) : tab === "pray" ? (
          onDevice ? (
            <DevicePrayTab child={child} />
          ) : (
            <ParentPrayTab child={child} circleId={params.circleId as string} />
          )
        ) : tab === "learn" ? (
          <>
            {/* D68: recite the short surahs along with the on-device listener. */}
            <KidsReciteEntry />
            <KidsLearnTab />
          </>
        ) : (
          <KidsDuasTab />
        )}
        {onDevice && child ? <KidsDeviceFooter child={child} /> : null}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
  gap: { gap: Spacing.two },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/kids");
