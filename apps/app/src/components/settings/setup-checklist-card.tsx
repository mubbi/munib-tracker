import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { getPlatformCtx } from "@/lib/settings/platform";
import {
  dismissSetupItems,
  openSetupItem,
  pendingSetupItems,
  type SetupItem,
  type SetupItemId,
  useDismissedSetupItems,
} from "@/lib/settings/setup-checklist";
import { useSettingsSelector } from "@/lib/settings/use-setting";

import { SettingsRow } from "./settings-rows";

/**
 * The ONE "Finish setting up" checklist (§4.5.3): the Settings hub shows it as
 * a dismissible card, and onboarding's last step shows the same items (minus
 * the one that step itself asks) so a new user sees what's still unset.
 */
export function SetupChecklistCard({
  onOpen,
  exclude,
  dismissible = true,
  hintKey,
}: {
  /** Called after the item is marked reviewed (language / method). */
  onOpen: (item: SetupItem) => void;
  /** Items the surrounding screen already asks (e.g. madhhab on its own onboarding step). */
  exclude?: readonly SetupItemId[];
  /** Hub: "Not now" hides the items showing; onboarding ignores past dismissals. */
  dismissible?: boolean;
  hintKey?: string;
}) {
  const { t } = useTranslation();
  const ctx = useMemo(getPlatformCtx, []);
  const dismissed = useDismissedSetupItems();
  const pending = useSettingsSelector((s) => pendingSetupItems(s, ctx));
  const items = pending.filter(
    (item) => !exclude?.includes(item.id) && !(dismissible && dismissed.includes(item.id)),
  );
  if (items.length === 0) return null;
  return (
    <Card style={styles.card}>
      <ThemedText type="smallBold" accessibilityRole="header">
        {t("settingsPanel.setup.title")}
      </ThemedText>
      {hintKey ? (
        <ThemedText type="caption" themeColor="mutedForeground">
          {t(hintKey)}
        </ThemedText>
      ) : null}
      {items.map((item) => (
        <SettingsRow
          key={item.id}
          icon={{ ios: "exclamationmark.circle.fill", android: "error", web: "error" }}
          title={t(item.titleKey)}
          onPress={() => {
            // Opening "language" / "method" counts as reviewing it.
            void openSetupItem(item.id);
            onOpen(item);
          }}
        />
      ))}
      {dismissible ? (
        <Button
          label={t("settingsPanel.setup.dismiss")}
          variant="ghost"
          size="sm"
          onPress={() => void dismissSetupItems(items.map((i) => i.id))}
        />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
});
