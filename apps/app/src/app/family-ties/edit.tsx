import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/confirm-dialog";
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
  const [dirty, setDirty] = useState(false);
  const [confirmLeave, setConfirmLeave] = useState(false);
  const leave = () => goBackOrReplace(router, "/family-ties");
  // Back and Cancel both ask before throwing away typed edits.
  const requestLeave = () => (dirty ? setConfirmLeave(true) : leave());
  return (
    <ScreenLayout
      eyebrow={t("familyTies.eyebrow")}
      title={id ? t("familyTies.form.editTitle") : t("familyTies.form.addTitle")}
      onBack={requestLeave}
    >
      <Seo path="/family-ties/edit" />
      {isTV() ? (
        <PhoneOnlyNotice />
      ) : (
        <VaultLockGate>
          <RelativeForm id={id} onDirtyChange={setDirty} onCancel={requestLeave} />
        </VaultLockGate>
      )}
      <ConfirmDialog
        visible={confirmLeave}
        destructive
        title={t("common.discardTitle")}
        message={t("common.discardMessage")}
        confirmLabel={t("common.discard")}
        cancelLabel={t("common.keepEditing")}
        onConfirm={() => {
          setConfirmLeave(false);
          leave();
        }}
        onClose={() => setConfirmLeave(false)}
      />
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/family-ties/edit");
