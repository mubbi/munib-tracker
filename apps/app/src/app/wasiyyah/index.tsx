import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { PrivateRecordsTvUnavailable } from "@/components/records/tv-unavailable";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VaultLockGate } from "@/components/vault";
import { WasiyyahOverview } from "@/components/wasiyyah/wasiyyah-overview";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** NF-3.9 Wasiyyah (Islamic will) builder — vault doc `wasiyyah` (D2). Hidden on TV. */
export default function WasiyyahScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("wasiyyah.eyebrow")}
      title={t("wasiyyah.title")}
      subtitle={t("wasiyyah.subtitle")}
      onBack={() => goBackOrReplace(router, "/library")}
    >
      <Seo path="/wasiyyah" />
      {isTV() ? (
        <PrivateRecordsTvUnavailable bodyKey="wasiyyah.tvBody" />
      ) : (
        <VaultLockGate>
          <WasiyyahOverview />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/wasiyyah");
