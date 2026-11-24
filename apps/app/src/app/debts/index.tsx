import type { DebtDirection } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { DebtDetailBody } from "@/components/debts/debt-detail-body";
import { DebtsScreenBody } from "@/components/debts/debts-screen-body";
import { PrivateRecordsTvUnavailable } from "@/components/records/tv-unavailable";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { useSettingsMasterDetail } from "@/components/settings/settings-layout";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { VaultLockGate } from "@/components/vault";
import { Spacing } from "@/constants/theme";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";

type Pane = { id: string; direction?: DebtDirection } | null;

/**
 * Wide windows (tablets, desktop web; the shared list–detail breakpoint): the
 * list stays on the start side and the open record — or a new one — fills the
 * end pane, like Settings. Phones keep pushing `/debts/[id]`.
 */
function DebtsMasterDetail() {
  const { t } = useTranslation();
  const [pane, setPane] = useState<Pane>(null);
  return (
    <View style={styles.columns}>
      <View style={styles.masterColumn}>
        <DebtsScreenBody
          selectedId={pane?.id ?? null}
          onOpenRecord={(id) => setPane({ id })}
          onAddRecord={(direction) => setPane({ id: "new", direction })}
        />
      </View>
      <View style={styles.detailColumn}>
        {pane ? (
          <>
            <ThemedText type="subtitle" accessibilityRole="header">
              {t(pane.id === "new" ? "debts.form.newTitle" : "debts.detail.title")}
            </ThemedText>
            <DebtDetailBody
              key={`${pane.id}:${pane.direction ?? ""}`}
              id={pane.id}
              initialDirection={pane.direction}
              onCreated={(id) => setPane({ id })}
              onClosed={() => setPane(null)}
            />
          </>
        ) : (
          <Card padding="three" variant="muted">
            <EmptyState
              icon={{ ios: "doc.text", android: "description", web: "description" }}
              title={t("privateUx.debts.selectTitle")}
              description={t("privateUx.debts.selectBody")}
            />
          </Card>
        )}
      </View>
    </View>
  );
}

/** NF-3.8 Debts & trusts record (vault doc `debts`, D2). Hidden on TV. */
export default function DebtsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const masterDetail = useSettingsMasterDetail();
  return (
    <ScreenLayout
      eyebrow={t("debts.eyebrow")}
      title={t("debts.title")}
      subtitle={t("debts.subtitle")}
      onBack={() => goBackOrReplace(router, "/library")}
    >
      <Seo path="/debts" />
      {isTV() ? (
        <PrivateRecordsTvUnavailable bodyKey="debts.tvBody" />
      ) : (
        <VaultLockGate>{masterDetail ? <DebtsMasterDetail /> : <DebtsScreenBody />}</VaultLockGate>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  columns: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.four },
  masterColumn: { width: 400, maxWidth: "45%" },
  detailColumn: { flex: 1, minWidth: 0, gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/debts");
