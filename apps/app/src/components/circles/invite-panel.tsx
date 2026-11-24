import { type CircleRole, circleJoinPath, formatInviteCode } from "@munib-tracker/shared/circles";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, View } from "react-native";

import { InviteMethodTabs } from "@/components/circles/nearby/invite-method-tabs";
import { NearbyHostPanel } from "@/components/circles/nearby/nearby-host-panel";
import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { buildHttpsAppUrl } from "@/lib/app-links";
import { createInvite, type InviteCreated } from "@/lib/circles/api";
import { useCircleAction } from "@/lib/circles/hooks";
import { isTV } from "@/lib/platform/is-tv";
import { formatDisplayDateTime } from "@/lib/time";
import { useToast } from "@/providers/toast-provider";
import { useLocation } from "@/stores/location-store";
import { usePreferences } from "@/stores/preferences-store";

/** HTTPS join link (D36): opens the app via App Links, or the web join screen. */
export function inviteJoinUrl(code: string): string {
  return buildHttpsAppUrl(`/${circleJoinPath(code)}`);
}

/**
 * Create an invite and show it three ways (§9.0): the 10-char code, a QR and a
 * share link `…/circle/join/<CODE>` — plus, on phones, a "Nearby" tab that
 * advertises the circle over Bluetooth for host-approved joins (NF-3.25). The code is returned once by the server
 * (stored hashed), so it only lives in this component's state.
 */
export function InvitePanel({
  circleId,
  inviteRole,
  title,
  hint,
}: {
  circleId: string;
  inviteRole: Extract<CircleRole, "parent" | "member" | "admin">;
  title: string;
  hint: string;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const toast = useToast();
  const prefs = usePreferences();
  const location = useLocation();
  const [invite, setInvite] = useState<InviteCreated | null>(null);
  const create = useCircleAction((token) => createInvite(token, circleId, { role: inviteRole }));

  const onCreate = async () => {
    try {
      setInvite(await create.mutateAsync());
    } catch {
      toast.error(t("circles.invite.error"));
    }
  };

  const onShare = async () => {
    if (!invite) return;
    const url = inviteJoinUrl(invite.code);
    try {
      await Share.share({
        message: t("circles.invite.shareMessage", { code: formatInviteCode(invite.code), url }),
      });
    } catch {
      // Share sheet unavailable (some web browsers) — the link is shown below.
    }
  };

  return (
    <Card padding="three" style={styles.card}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText type="small" themeColor="mutedForeground">
        {hint}
      </ThemedText>
      <InviteMethodTabs
        nearby={
          inviteRole === "admin" ? null : <NearbyHostPanel circleId={circleId} role={inviteRole} />
        }
      >
        {invite ? (
          <View style={styles.result}>
            <ThemedText
              type="title"
              selectable
              accessibilityLabel={t("circles.invite.codeA11y", {
                code: invite.code.split("").join(" "),
              })}
              style={styles.code}
            >
              {formatInviteCode(invite.code)}
            </ThemedText>
            {!isTV() ? (
              <BrandQrCode
                data={inviteJoinUrl(invite.code)}
                size={200}
                accessibilityLabel={t("circles.invite.qrA11y")}
              />
            ) : null}
            <ThemedText type="caption" themeColor="mutedForeground" selectable>
              {inviteJoinUrl(invite.code)}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t(invite.maxUses > 1 ? "circles.invite.expiresShared" : "circles.invite.expires", {
                when: formatDisplayDateTime(
                  new Date(invite.expiresAt),
                  prefs.timeFormat,
                  prefs.locale,
                  location.timeZone,
                  prefs.defaultCalendar,
                ),
              })}
            </ThemedText>
            <View style={[styles.actions, { borderColor: colors.border }]}>
              <Button label={t("circles.invite.share")} onPress={() => void onShare()} />
              <Button
                label={t("circles.invite.another")}
                variant="secondary"
                onPress={() => void onCreate()}
              />
            </View>
          </View>
        ) : (
          <Button
            label={create.isPending ? t("circles.common.working") : t("circles.invite.create")}
            disabled={create.isPending}
            onPress={() => void onCreate()}
          />
        )}
      </InviteMethodTabs>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: Spacing.two },
  result: { alignItems: "center", gap: Spacing.two },
  code: { letterSpacing: 2 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two, justifyContent: "center" },
});
