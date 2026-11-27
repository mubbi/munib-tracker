import { getLocalDateString } from "@munib-tracker/shared/utils";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ChildDeviceCard } from "@/components/circles/child/child-device-card";
import {
  ChildGraduationCard,
  ChildProfileCard,
  ChildRewardCard,
} from "@/components/circles/child/child-settings-cards";
import { ChildWeekCard } from "@/components/circles/child/child-week-card";
import { CircleLoading, CircleRetryCard } from "@/components/circles/query-state";
import { useCircleRun } from "@/components/circles/use-circle-run";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { NavRow } from "@/components/ui/nav-row";
import { Spacing } from "@/constants/theme";
import { deleteChild, type UpdateChildInput, updateChild } from "@/lib/circles/api";
import { useChildProfiles, useCircleAction, useCircleMutation } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useToast } from "@/providers/toast-provider";

/** Parent tools for one child profile: week log, device link, reward, graduation, delete. */
export default function ChildProfileScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const run = useCircleRun();
  const toast = useToast();
  const { childId, circleId } = useLocalSearchParams<{ childId: string; circleId?: string }>();
  const back = () => goBackOrReplace(router, "/family");
  const children = useChildProfiles(circleId);
  const child = children.data?.find((c) => c.id === childId);
  const today = getLocalDateString();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const update = useCircleMutation((token, input: UpdateChildInput) =>
    updateChild(token, circleId as string, childId, input),
  );
  const remove = useCircleAction((token) => deleteChild(token, circleId as string, childId));
  const save = (input: UpdateChildInput) =>
    void run(() => update.mutateAsync(input), "family.saved");

  if (isTV() || !circleId) {
    return (
      <ScreenLayout title={t("family.title")} onBack={back}>
        <Card>
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
        children.isLoading ? (
          <CircleLoading />
        ) : children.isError ? (
          <CircleRetryCard onRetry={() => void children.refetch()} />
        ) : (
          <EmptyState
            icon={{
              ios: "person.crop.circle.badge.questionmark",
              android: "person_off",
              web: "person_off",
            }}
            title={t("family.child.notFound")}
            actionLabel={t("family.child.backToFamily")}
            onAction={back}
          />
        )
      ) : (
        <View style={styles.stack}>
          <Button
            label={t("family.child.kidsMode", { name: child.nickname })}
            onPress={() => router.push({ pathname: "/kids", params: { childId, circleId } })}
          />
          <ChildWeekCard circleId={circleId} childId={childId} today={today} />
          <ChildDeviceCard circleId={circleId} child={child} />
          <ChildRewardCard child={child} onSave={save} />
          <ChildProfileCard child={child} onSave={save} />
          <ChildGraduationCard child={child} onSave={save} />
          <NavRow
            tone="danger"
            icon={{ ios: "trash", android: "delete", web: "delete" }}
            label={t("family.child.delete")}
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
        errorMessage={t("circles.common.offline")}
        onConfirm={async () => {
          await remove.mutateAsync();
          setConfirmDelete(false);
          toast.success(t("family.child.deleted"));
          back();
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family/child/[childId]");
