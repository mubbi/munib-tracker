import { diffInDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { RelativeRecord } from "@/lib/family-ties/family-ties-store";
import { normalizePhone } from "@/lib/family-ties/model";
import { useChevronForward } from "@/lib/rtl";

import type { ContactChannel } from "./use-contact-actions";

/**
 * One relative on the family-ties list. Gentle copy only: "a good day to reach
 * out" / "last in touch N days ago" — never "overdue" or "you failed".
 *
 * Only the header (name + kinship) opens the editor. The card itself is not a
 * button: a pressable card would swallow the Call / Message buttons for
 * VoiceOver (an accessible parent hides its children) and nest buttons on web.
 */
export function RelativeCard({
  relative,
  due,
  onEdit,
  onContact,
  onLog,
  onDua,
  today = getLocalDateString(),
}: {
  relative: RelativeRecord;
  due: boolean;
  onEdit: () => void;
  onContact: (channel: ContactChannel) => void;
  onLog: () => void;
  onDua: () => void;
  today?: string;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const chevronForward = useChevronForward();
  const hasPhone = normalizePhone(relative.phone) != null;
  const daysSince = relative.lastContact ? diffInDays(today, relative.lastContact.date) : null;

  const statusLine =
    daysSince == null
      ? t("familyTies.status.notYet")
      : daysSince === 0
        ? t("familyTies.status.today", {
            kind: t(`familyTies.contact.${relative.lastContact?.kind ?? "call"}`),
          })
        : t("familyTies.status.daysAgo", { count: daysSince });

  return (
    <Card padding="three">
      <View style={styles.body}>
        <PressableScale
          accessibilityRole="button"
          accessibilityLabel={t("familyTies.editA11y", { name: relative.name })}
          onPress={onEdit}
          scaleTo={0.98}
          style={styles.header}
        >
          <View style={styles.flex}>
            <ThemedText type="smallBold">{relative.name}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t(`familyTies.kinship.${relative.kinship}`)}
            </ThemedText>
          </View>
          {due ? (
            <ThemedText type="caption" style={{ color: tokens.status.info.text }}>
              {t("familyTies.status.goodDay")}
            </ThemedText>
          ) : null}
          <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
        </PressableScale>
        <ThemedText type="caption" themeColor="mutedForeground">
          {statusLine}
        </ThemedText>
        {relative.deceased ? null : (
          <View style={styles.actions}>
            {hasPhone ? (
              <>
                <Button
                  label={t("familyTies.actions.call")}
                  size="sm"
                  variant="secondary"
                  accessibilityHint={relative.name}
                  onPress={() => onContact("call")}
                />
                <Button
                  label={t("familyTies.actions.message")}
                  size="sm"
                  variant="secondary"
                  accessibilityHint={relative.name}
                  onPress={() => onContact("sms")}
                />
                <Button
                  label={t("familyTies.actions.whatsapp")}
                  size="sm"
                  variant="secondary"
                  accessibilityHint={relative.name}
                  onPress={() => onContact("whatsapp")}
                />
              </>
            ) : null}
            <Button
              label={t("familyTies.actions.log")}
              size="sm"
              variant="ghost"
              accessibilityHint={relative.name}
              onPress={onLog}
            />
            <Button
              label={t("familyTies.actions.dua")}
              size="sm"
              variant="ghost"
              accessibilityHint={relative.name}
              onPress={onDua}
            />
          </View>
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.one },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two, minHeight: 44 },
  flex: { flex: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, marginTop: Spacing.two },
});
