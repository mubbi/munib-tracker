import { type Href, useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { KhatmCreateForm } from "@/components/circles/khatm/khatm-create-form";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { useCircleAuth } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** NF-3.18 start a group khatm (optionally inside an existing group via `circleId`). */
export default function NewKhatmGroupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ circleId?: string }>();
  const auth = useCircleAuth();

  return (
    <ScreenLayout
      eyebrow={t("khatmGroups.eyebrow")}
      title={t("khatmGroups.create.screenTitle")}
      subtitle={t("khatmGroups.create.screenSubtitle")}
      onBack={() => goBackOrReplace(router, "/khatm-groups")}
    >
      <Seo path="/khatm-groups/new" index={false} />
      {isTV() || !auth.hasSession ? (
        <ThemedText type="small" themeColor="mutedForeground">
          {isTV() ? t("khatmGroups.create.tv") : t("khatmGroups.noSession")}
        </ThemedText>
      ) : (
        <KhatmCreateForm
          circleId={params.circleId}
          onCreated={({ circleId, khatm }) =>
            router.replace({
              pathname: "/khatm-groups/[id]",
              params: { id: circleId, khatmId: khatm.id },
            } as Href)
          }
        />
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/khatm-groups/new");
