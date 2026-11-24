import { type ReactNode, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { Spacing } from "@/constants/theme";
import { isNearbyAvailable } from "@/lib/nearby/native";

type Method = "code" | "nearby";

/**
 * "Code & QR" | "Nearby" switch on every invite surface in D43 scope (group
 * khatm, family adult / parent invites, partner, child-device link). Where the
 * nearby module isn't available (web, TV, Expo Go, no BLE) only the code / QR
 * content renders — the fallback is always there. The nearby panel mounts only
 * while its tab is selected, so nothing advertises behind the code view.
 */
export function InviteMethodTabs({ nearby, children }: { nearby: ReactNode; children: ReactNode }) {
  const { t } = useTranslation();
  const available = useMemo(() => isNearbyAvailable(), []);
  const [method, setMethod] = useState<Method>("code");
  if (!available || nearby == null) return <>{children}</>;
  return (
    <View style={styles.stack}>
      <SegmentedControl<Method>
        options={[
          { id: "code", label: t("nearby.tabs.code") },
          { id: "nearby", label: t("nearby.tabs.nearby") },
        ]}
        value={method}
        onChange={setMethod}
      />
      {method === "code" ? children : nearby}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.three },
});
