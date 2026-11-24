import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/ui/empty-state";

/**
 * TV behaviour for the private self-review features (muhasabah, family ties):
 * hidden from TV menus, and a deep link lands here instead — private journals,
 * phone numbers and calls belong on a personal device, not a shared screen.
 */
export function PhoneOnlyNotice() {
  const { t } = useTranslation();
  return (
    <EmptyState
      icon={{ ios: "iphone", android: "smartphone", web: "smartphone" }}
      title={t("selfReview.phoneOnlyTitle")}
      description={t("selfReview.phoneOnlyBody")}
    />
  );
}
