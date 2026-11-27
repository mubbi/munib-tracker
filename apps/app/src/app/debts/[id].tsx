import { DEBT_DIRECTIONS, type DebtDirection } from "@munib-tracker/shared/types";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

import { DebtDetailBody } from "@/components/debts/debt-detail-body";
import { PrivateRecordsTvUnavailable } from "@/components/records/tv-unavailable";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { VaultLockGate } from "@/components/vault";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

/** One debt / trust record — `id === "new"` creates one (optional `?direction=`). */
export default function DebtDetailScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { id, direction } = useLocalSearchParams<{ id: string; direction?: string }>();
  const initialDirection = DEBT_DIRECTIONS.includes(direction as DebtDirection)
    ? (direction as DebtDirection)
    : "i_owe";
  const recordId = typeof id === "string" && id ? id : "new";
  return (
    <ScreenLayout
      eyebrow={t("debts.title")}
      title={t(recordId === "new" ? "debts.form.newTitle" : "debts.detail.title")}
      onBack={() => goBackOrReplace(router, "/debts")}
    >
      <Seo path="/debts/[id]" />
      {isTV() ? (
        <PrivateRecordsTvUnavailable bodyKey="debts.tvBody" />
      ) : (
        <VaultLockGate>
          <DebtDetailBody key={recordId} id={recordId} initialDirection={initialDirection} />
        </VaultLockGate>
      )}
    </ScreenLayout>
  );
}

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/debts/[id]");
