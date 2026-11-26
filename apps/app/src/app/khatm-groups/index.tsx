import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { CircleSessionGate } from "@/components/circles/session-gate";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { Spacing } from "@/constants/theme";
import type { CircleSummary } from "@/lib/circles/api";
import { useCircleAuth, useCircles, useKhatms } from "@/lib/circles/hooks";
import { currentKhatm } from "@/lib/circles/khatm";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

function groupHref(circleId: string, khatmId?: string): Href {
  return {
    pathname: "/khatm-groups/[id]",
    params: khatmId ? { id: circleId, khatmId } : { id: circleId },
  } as Href;
}

/** One group row: its current khatm's calm progress ("12 of 30 done"), no rankings. */
function GroupRow({ circle, onPress }: { circle: CircleSummary; onPress: () => void }) {
  const { t } = useTranslation();
  const khatms = useKhatms(circle.id, { poll: false });
  const current = currentKhatm(khatms.data ?? []);
  const badge = current
    ? current.status === "completed"
      ? t("khatmGroups.list.completed")
      : t("khatmGroups.progress", { done: current.doneCount, total: current.partCount })
    : undefined;
  return (
    <NavRow
      icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
      label={circle.name}
      badge={badge}
      onPress={onPress}
    />
  );
}

/**
 * NF-3.18 "My groups". `/khatm-groups?circleId=…&khatmId=…` (hub + inbox links)
 * forwards to the group screen. Guests may create and join khatm groups.
 */
export default function KhatmGroupsScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ circleId?: string; khatmId?: string }>();
  const auth = useCircleAuth();
  const circles = useCircles();
  const groups = (circles.data ?? []).filter((c) => c.type === "khatm_group");
  const tv = isTV();

  useEffect(() => {
    if (params.circleId) router.replace(groupHref(params.circleId, params.khatmId));
  }, [params.circleId, params.khatmId, router]);

  return (
    <ScreenLayout
      eyebrow={t("khatmGroups.eyebrow")}
      title={t("khatmGroups.title")}
      subtitle={t("khatmGroups.subtitle")}
      onBack={() => goBackOrReplace(router, "/circles")}
    >
      <Seo path="/khatm-groups" index={false} />
      <View style={styles.stack}>
        {!auth.hasSession ? (
          <CircleSessionGate
            title={t("khatmGroups.session.title")}
            body={t("khatmGroups.session.body")}
          />
        ) : circles.isLoading ? (
          <CircleLoading label={t("khatmGroups.loading")} />
        ) : circles.isError ? (
          <CircleRetryCard
            message={t("khatmGroups.loadError")}
            retryLabel={t("khatmGroups.retry")}
            onRetry={() => void circles.refetch()}
          />
        ) : groups.length === 0 ? (
          <EmptyState
            icon={{ ios: "book.fill", android: "menu_book", web: "menu_book" }}
            title={t("khatmGroups.list.emptyTitle")}
            description={t("khatmGroups.list.emptyBody")}
          />
        ) : (
          <Card padding="two" style={styles.gap}>
            {groups.map((circle) => (
              <GroupRow
                key={circle.id}
                circle={circle}
                onPress={() => router.push(groupHref(circle.id))}
              />
            ))}
          </Card>
        )}

        {!tv && auth.hasSession ? (
          <>
            <Button
              label={t("khatmGroups.startGroup")}
              icon={{ ios: "plus", android: "add", web: "add" }}
              onPress={() => router.push("/khatm-groups/new" as Href)}
            />
            <Button
              variant="ghost"
              label={t("khatmGroups.haveInvite")}
              onPress={() => router.push("/circles")}
            />
          </>
        ) : null}

        <Card style={styles.gap}>
          <ThemedText type="smallBold">{t("khatmGroups.privacy.title")}</ThemedText>
          <ThemedText type="small" themeColor="mutedForeground">
            {t("khatmGroups.privacy.body")}
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
export const generateMetadata = routeMetadata("/khatm-groups");
