import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";

type LessonCompleteButtonProps = {
  /** i18n namespace that owns the `markComplete` / `markIncomplete` labels. */
  ns: string;
  completed: boolean;
  onToggle: () => void;
};

/**
 * "Mark lesson/topic complete" button used across the learn sections. Marking
 * complete asks for confirmation first; un-marking toggles immediately.
 */
export function LessonCompleteButton({ ns, completed, onToggle }: LessonCompleteButtonProps) {
  const { t } = useTranslation();
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <>
      <Button
        label={completed ? t(`${ns}.markIncomplete`) : t(`${ns}.markComplete`)}
        variant={completed ? "secondary" : "primary"}
        fullWidth
        onPress={() => {
          if (completed) {
            onToggle();
          } else {
            setConfirmVisible(true);
          }
        }}
      />
      <ConfirmDialog
        visible={confirmVisible}
        title={t("common.markCompleteConfirmTitle")}
        message={t("common.markCompleteConfirmMsg")}
        confirmLabel={t("common.markCompleteConfirmAction")}
        onConfirm={onToggle}
        onClose={() => setConfirmVisible(false)}
      />
    </>
  );
}
