import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { InviteMethodTabs } from "@/components/circles/nearby/invite-method-tabs";
import { NearbyHostPanel } from "@/components/circles/nearby/nearby-host-panel";
import { useCircleRun } from "@/components/circles/use-circle-run";
import { BrandQrCode } from "@/components/share/brand-qr-code";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { Spacing } from "@/constants/theme";
import { buildHttpsAppUrl } from "@/lib/app-links";
import {
  type ChildDeviceLink,
  type ChildProfile,
  createChildDeviceLink,
  revokeChildDevice,
} from "@/lib/circles/api";
import { useCircleAction } from "@/lib/circles/hooks";

/** HTTPS link the child's device opens from the QR (camera app → App Link → `/kids/link`). */
export function childLinkUrl(linkToken: string): string {
  return buildHttpsAppUrl(`/kids/link?token=${encodeURIComponent(linkToken)}`);
}

/**
 * Link the child's own phone: a one-time QR (the token is shown once and only
 * kept in this component) or, on phones, host-approved Nearby (NF-3.25).
 */
export function ChildDeviceCard({ circleId, child }: { circleId: string; child: ChildProfile }) {
  const { t } = useTranslation();
  const run = useCircleRun();
  const [link, setLink] = useState<ChildDeviceLink | null>(null);
  const deviceLink = useCircleAction((token) => createChildDeviceLink(token, circleId, child.id));
  const revoke = useCircleAction((token) => revokeChildDevice(token, circleId, child.id));

  return (
    <>
      <SectionHeader title={t("family.device.title")} />
      <Card padding="three" style={styles.gap}>
        <ThemedText type="small" themeColor="mutedForeground">
          {child.linkedDeviceAt ? t("family.device.linked") : t("family.device.body")}
        </ThemedText>
        {/* NF-3.25: link the child's phone over Bluetooth (parent approves), or by QR. */}
        <InviteMethodTabs
          nearby={
            child.consentPending ? null : <NearbyHostPanel circleId={circleId} childId={child.id} />
          }
        >
          {link ? (
            <View style={styles.center}>
              <BrandQrCode
                data={childLinkUrl(link.linkToken)}
                size={220}
                accessibilityLabel={t("family.device.qrA11y")}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("family.device.qrHint")}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground" selectable>
                {link.linkToken}
              </ThemedText>
            </View>
          ) : null}
          <Button
            label={t(child.linkedDeviceAt ? "family.device.relink" : "family.device.link")}
            onPress={() =>
              void run(async () => {
                setLink(await deviceLink.mutateAsync());
              })
            }
          />
        </InviteMethodTabs>
        {child.linkedDeviceAt ? (
          <Button
            label={t("family.device.revoke")}
            variant="secondary"
            onPress={() => void run(() => revoke.mutateAsync(), "family.device.revoked")}
          />
        ) : null}
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.two },
  center: { alignItems: "center", gap: Spacing.two },
});
