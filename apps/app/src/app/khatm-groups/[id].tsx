import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { KhatmGroupView } from "@/components/circles/khatm/khatm-group-view";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useCircle } from "@/lib/circles/hooks";
import { goBackOrReplace } from "@/lib/navigation";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** NF-3.18 one khatm group (`id` = circle id; optional `khatmId` from the inbox). */
export default function KhatmGroupScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; khatmId?: string }>();
  const circle = useCircle(params.id, { poll: false });

  return (
    <ScreenLayout
      eyebrow={t("khatmGroups.eyebrow")}
      title={circle.data?.name ?? t("khatmGroups.title")}
      onBack={() => goBackOrReplace(router, "/khatm-groups")}
    >
      <Seo path="/khatm-groups" index={false} />
      {params.id ? (
        <KhatmGroupView
          key={params.id}
          circleId={params.id}
          khatmId={params.khatmId}
          onLeft={() => goBackOrReplace(router, "/khatm-groups")}
        />
      ) : null}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/khatm-groups/[id]");
