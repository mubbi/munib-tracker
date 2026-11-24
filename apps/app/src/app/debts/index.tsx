import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { DebtsScreenBody } from "@/components/debts/debts-screen-body";
import { PrivateRecordsTvUnavailable } from "@/components/records/tv-unavailable";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VaultLockGate } from "@/components/vault";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** NF-3.8 Debts & trusts record (vault doc `debts`, D2). Hidden on TV. */
export default function DebtsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("debts.eyebrow")}
      title={t("debts.title")}
      subtitle={t("debts.subtitle")}
      onBack={() => goBackOrReplace(router, "/library")}
    >
      <Seo path="/debts" />
      {isTV() ? (
        <PrivateRecordsTvUnavailable bodyKey="debts.tvBody" />
      ) : (
        <VaultLockGate>
          <DebtsScreenBody />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/debts");
