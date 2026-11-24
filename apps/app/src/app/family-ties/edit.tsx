import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { RelativeForm } from "@/components/family-ties/relative-form";
import { ScreenLayout } from "@/components/screen-layout";
import { PhoneOnlyNotice } from "@/components/self-review/phone-only-notice";
import { Seo } from "@/components/seo/seo";
import { VaultLockGate } from "@/components/vault";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

export default function FamilyTiesEditScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  return (
    <ScreenLayout
      eyebrow={t("familyTies.eyebrow")}
      title={id ? t("familyTies.form.editTitle") : t("familyTies.form.addTitle")}
      onBack={() => goBackOrReplace(router, "/family-ties")}
    >
      <Seo path="/family-ties/edit" />
      {isTV() ? (
        <PhoneOnlyNotice />
      ) : (
        <VaultLockGate>
          <RelativeForm id={id} />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family-ties/edit");
