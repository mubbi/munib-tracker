import { diffInDays, getLocalDateString } from "@munib-tracker/shared/utils";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconButton } from "@/components/ui/icon-button";
import { NavRow } from "@/components/ui/nav-row";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { Sheet } from "@/components/ui/sheet";
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
  const { colors } = useThemeTokens();
  const [moreOpen, setMoreOpen] = useState(false);
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
    <Card>
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
          {due ? <Pill tone="info" compact label={t("familyTies.status.goodDay")} /> : null}
          <SymbolView name={chevronForward} size={14} tintColor={colors.mutedForeground} />
        </PressableScale>
        <ThemedText type="caption" themeColor="mutedForeground">
          {statusLine}
        </ThemedText>
        {relative.deceased ? null : (
          // Two primary actions; the rest live behind "More" so the card stays calm.
          <View style={styles.actions}>
            {hasPhone ? (
              <Button
                label={t("familyTies.actions.call")}
                size="sm"
                variant="secondary"
                accessibilityHint={relative.name}
                onPress={() => onContact("call")}
              />
            ) : (
              <Button
                label={t("familyTies.actions.dua")}
                size="sm"
                variant="secondary"
                accessibilityHint={relative.name}
                onPress={onDua}
              />
            )}
            <Button
              label={t("familyTies.actions.log")}
              size="sm"
              variant="ghost"
              accessibilityHint={relative.name}
              onPress={onLog}
            />
            {hasPhone ? (
              <IconButton
                name={{ ios: "ellipsis", android: "more_horiz", web: "more_horiz" }}
                accessibilityLabel={t("familyTies.actions.more", { name: relative.name })}
                onPress={() => setMoreOpen(true)}
              />
            ) : null}
          </View>
        )}
      </View>
      <Sheet
        visible={moreOpen}
        onClose={() => setMoreOpen(false)}
        variant="bottom"
        solid
        title={relative.name}
      >
        <View style={styles.sheet}>
          {(
            [
              [
                "sms",
                "familyTies.actions.message",
                { ios: "message.fill", android: "sms", web: "sms" },
              ],
              [
                "whatsapp",
                "familyTies.actions.whatsapp",
                { ios: "bubble.left.fill", android: "chat", web: "chat" },
              ],
            ] as const
          ).map(([channel, labelKey, icon]) => (
            <NavRow
              key={channel}
              icon={icon}
              label={t(labelKey)}
              onPress={() => {
                setMoreOpen(false);
                onContact(channel);
              }}
            />
          ))}
          <NavRow
            icon={{
              ios: "hands.sparkles.fill",
              android: "volunteer_activism",
              web: "volunteer_activism",
            }}
            label={t("familyTies.actions.dua")}
            onPress={() => {
              setMoreOpen(false);
              onDua();
            }}
          />
        </View>
      </Sheet>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.one },
  header: { flexDirection: "row", alignItems: "center", gap: Spacing.two, minHeight: 44 },
  flex: { flex: 1 },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  sheet: { gap: Spacing.two },
});
