import { useTranslation } from "react-i18next";

import { UnavailableOnDevice } from "@/components/ui/unavailable-on-device";

/**
 * TV: the private records (debts, wasiyyah) are hidden — vault data and
 * free-text entry don't belong on a shared living-room screen. Uses the one
 * "not on this device" treatment (P8-06), so the screen always has a focusable
 * Go back instead of a D-pad dead end.
 */
export function PrivateRecordsTvUnavailable({ bodyKey }: { bodyKey: string }) {
  const { t } = useTranslation();
  return <UnavailableOnDevice title={t("common.tvUnavailableTitle")} description={t(bodyKey)} />;
}
