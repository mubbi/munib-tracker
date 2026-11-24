import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/toast-provider";

/**
 * "Reset to defaults" for one section (§4.5.7). Confirms first; only settings
 * change — never logs, bookmarks, notes or progress.
 */
export function ResetSectionButton({
  sectionTitle,
  onReset,
}: {
  sectionTitle: string;
  onReset: () => Promise<unknown>;
}) {
  const { t } = useTranslation();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  return (
    <>
      <Button
        label={t("settingsPanel.resetSection")}
        accessibilityHint={t("settingsPanel.resetSectionA11y", { section: sectionTitle })}
        variant="ghost"
        size="sm"
        icon={{ ios: "arrow.counterclockwise", android: "restart_alt", web: "restart_alt" }}
        onPress={() => setConfirming(true)}
      />
      <ConfirmDialog
        visible={confirming}
        title={t("settingsPanel.resetSectionTitle", { section: sectionTitle })}
        message={t("settingsPanel.resetSectionMsg")}
        confirmLabel={t("common.reset")}
        onConfirm={() => {
          void onReset().then(() => toast.success(t("settingsPanel.resetDone")));
        }}
        onClose={() => setConfirming(false)}
      />
    </>
  );
}
