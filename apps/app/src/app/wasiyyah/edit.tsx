import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { PrivateRecordsTvUnavailable } from "@/components/records/tv-unavailable";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VaultLockGate } from "@/components/vault";
import { initialWasiyyahData, WasiyyahWizard } from "@/components/wasiyyah/wasiyyah-wizard";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useWasiyyah } from "@/lib/wasiyyah/wasiyyah-store";

function WizardLoader() {
  const { versions, draft, isReady } = useWasiyyah();
  if (!isReady) return null;
  return <WasiyyahWizard initialData={initialWasiyyahData(draft, versions[0]?.data)} />;
}

/** The wasiyyah wizard (sections 1–8 + review). Hidden on TV. */
export default function WasiyyahEditScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  return (
    <ScreenLayout
      eyebrow={t("wasiyyah.title")}
      title={t("wasiyyah.wizard.title")}
      onBack={() => goBackOrReplace(router, "/wasiyyah")}
    >
      <Seo path="/wasiyyah/edit" />
      {isTV() ? (
        <PrivateRecordsTvUnavailable bodyKey="wasiyyah.tvBody" />
      ) : (
        <VaultLockGate>
          <WizardLoader />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/wasiyyah/edit");
