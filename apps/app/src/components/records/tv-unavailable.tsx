import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/ui/empty-state";

/**
 * TV: the private records (debts, wasiyyah) are hidden — vault data and
 * free-text entry don't belong on a shared living-room screen.
 */
export function PrivateRecordsTvUnavailable({ bodyKey }: { bodyKey: string }) {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={{ ios: "tv", android: "tv", web: "tv" }}
      title={t("common.tvUnavailableTitle")}
      description={t(bodyKey)}
    />
  );
}
