import { SymbolView } from "expo-symbols";
import { type ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { ThemedText } from "@/components/themed-text";
import { IconWell } from "@/components/ui/icon-well";
import { IconSize, Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { AppIcon } from "@/lib/names-of-allah-ui";
import { isTV } from "@/lib/platform/is-tv";

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

/** Same well size as `SettingsRow`'s default `IconWell` (TV: 48dp, pre-density). */
const TV_WELL = 48;
const TRASH_ICON = { ios: "trash", android: "delete", web: "delete" } as const;

/**
 * Destructive / irreversible action with a confirm dialog (§4.5.5) — replaces
 * the hand-rolled app-lock and profile danger rows. When `onConfirm` returns a
 * promise the dialog stays open and busy until it settles, and shows
 * `errorMessage` inline on rejection (ConfirmDialog async contract).
 *
 * Reads as an action, not a note: a danger-tinted icon well, the title in the
 * danger text colour, and a drawn trailing affordance — `actionLabel` as a
 * small tinted "button" (e.g. "Clear"), or a trash glyph. The whole row is the
 * one pressable (scale + ripple pressed state); the affordance is never a
 * second, nested button.
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
  acknowledgeLabel,
  confirmWord,
  errorMessage,
  actionLabel,
  accessory,
}: {
  icon?: AppIcon;
  title: string;
  subtitle?: string;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmLabel?: string;
  destructive?: boolean;
  onConfirm: () => unknown;
  disabled?: boolean;
  /** "I understand…" check box required before confirming (whole-device actions). */
  acknowledgeLabel?: string;
  /** Typed confirmation word (account deletion keeps typed "DELETE" — D-UX6). */
  confirmWord?: string;
  /** Inline error when an async `onConfirm` rejects. */
  errorMessage?: string;
  /**
   * Short verb drawn on the trailing edge ("Clear", "Forget") and used as the
   * confirm button's default label; destructive rows without one draw a trash glyph.
   */
  actionLabel?: string;
  /** Title-line adornment (e.g. the "This device" badge). */
  accessory?: ReactNode;
}) {
  const { t } = useTranslation();
  const { tokens } = useThemeTokens();
  const [open, setOpen] = useState(false);
  const tv = isTV();
  const danger = tokens.status.danger;
  const wellTint = destructive ? danger.onSoft : tokens.accentOnSoft;
  const wellBackground = destructive ? danger.soft : tokens.accentSoft;
  const ink = destructive ? danger.onSoft : tokens.accentOnSoft;

  const wellIcon = icon ?? (destructive ? TRASH_ICON : undefined);
  const leading = wellIcon ? (
    <IconWell
      icon={wellIcon}
      tint={wellTint}
      background={wellBackground}
      well={tv ? TV_WELL : undefined}
      size={tv ? 22 : undefined}
    />
  ) : undefined;

  const trailing = actionLabel ? (
    <View testID="danger-row-action" style={[styles.action, { backgroundColor: wellBackground }]}>
      <ThemedText type="caption" weight="semibold" numberOfLines={1} style={{ color: ink }}>
        {actionLabel}
      </ThemedText>
    </View>
  ) : destructive ? (
    <SymbolView testID="danger-row-action" name={TRASH_ICON} size={IconSize.md} tintColor={ink} />
  ) : undefined;

  return (
    <>
      <SettingsRow
        leading={leading}
        title={title}
        subtitle={subtitle}
        accessory={accessory}
        showChevron={false}
        disabled={disabled}
        // Rows sit on `muted`: status text there is `onSoft` (design-system table).
        titleColor={destructive ? danger.onSoft : undefined}
        trailing={trailing}
        onPress={() => setOpen(true)}
      />
      <ConfirmDialog
        visible={open}
        title={confirmTitle ?? title}
        message={confirmMessage}
        confirmLabel={confirmLabel ?? actionLabel ?? t("common.confirm")}
        destructive={destructive}
        onConfirm={onConfirm}
        onClose={() => setOpen(false)}
        acknowledgeLabel={acknowledgeLabel}
        confirmWord={confirmWord}
        errorMessage={errorMessage}
      />
    </>
  );
}

const styles = StyleSheet.create({
  action: {
    justifyContent: "center",
    paddingHorizontal: Spacing.twoHalf,
    paddingVertical: Spacing.one,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
});
