import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";

import { SettingsRow } from "./settings-rows";

type ActionRowProps = {
  icon?: AppIcon;
  title: string;
  subtitle?: string;
  value?: string;
  onPress: () => void;
  disabled?: boolean;
};

/** A row that does something in place (preview, reset hints…): no chevron (§4.5.5). */
export function ActionRow(props: ActionRowProps) {
  return <SettingsRow {...props} showChevron={false} />;
}

/**
 * Destructive / irreversible action with a confirm dialog (§4.5.5) — replaces
 * the hand-rolled app-lock and profile danger rows.
 */
export function DangerRow({
  icon,
  title,
  subtitle,
  confirmTitle,
  confirmMessage,
  confirmLabel,
  destructive = true,
  onConfirm,
  disabled,
}: {
  icon?: AppIcon;
  title: string;
  subtitle?: string;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const [open, setOpen] = useState(false);
  return (
    <>
      <SettingsRow
        icon={icon}
        title={title}
        subtitle={subtitle}
        showChevron={false}
        disabled={disabled}
        titleColor={destructive ? tokens.status.danger.text : undefined}
        onPress={() => setOpen(true)}
      />
      <ConfirmDialog
        visible={open}
        title={confirmTitle ?? title}
        message={confirmMessage}
        confirmLabel={confirmLabel ?? t("common.confirm")}
        destructive={destructive}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
