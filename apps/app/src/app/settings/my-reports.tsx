import type { ContentReportSummary } from "@munib-tracker/shared/types/content-report";
import { goBackOrReplace } from "@/lib/navigation";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill } from "@/components/ui/pill";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { listContentReports } from "@/lib/content-report-api";
import { useAuth } from "@/providers/auth-provider";

export default function MyReportsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { session, isGuest } = useAuth();
  const { tokens } = useThemeTokens();
  const [items, setItems] = useState<ContentReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!session?.accessToken || isGuest) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const response = await listContentReports(session.accessToken);
      setItems(response.items);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [session?.accessToken, isGuest]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <ScreenLayout
      eyebrow={t("settings.eyebrow")}
      title={t("contentReport.myReportsTitle")}
      subtitle={t("contentReport.myReportsSubtitle")}
      onBack={() => (goBackOrReplace(router, "/settings"))}
    >
      <Seo path="/settings/my-reports" title={t("contentReport.myReportsTitle")} />
      {isGuest ? (
        <EmptyState
          icon={{ ios: "person.crop.circle", android: "account_circle", web: "account_circle" }}
          title={t("contentReport.signInRequiredTitle")}
          description={t("contentReport.myReportsGuest")}
          actionLabel={t("contentReport.signInCta")}
          onAction={() => router.push("/profile")}
        />
      ) : loading ? (
        <ActivityIndicator style={styles.loader} />
      ) : error ? (
        <EmptyState
          icon={{ ios: "wifi.slash", android: "cloud_off", web: "cloud_off" }}
          title={t("contentReport.loadFailed")}
          actionLabel={t("common.tryAgain")}
          onAction={() => void load()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={{ ios: "flag", android: "flag", web: "flag" }}
          title={t("contentReport.emptyTitle")}
          description={t("contentReport.emptyDesc")}
        />
      ) : (
        <Stagger>
          {items.map((report) => (
            <Card key={report.id} padding="three" style={styles.card}>
              <View style={styles.cardHeader}>
                <Pill
                  label={t(`contentReport.status.${report.status}`)}
                  color={
                    report.status === "completed"
                      ? tokens.status.success.color
                      : report.status === "spam" || report.status === "cancelled"
                        ? tokens.status.warning.color
                        : tokens.status.info.color
                  }
                  background={
                    report.status === "completed"
                      ? tokens.status.success.soft
                      : report.status === "spam" || report.status === "cancelled"
                        ? tokens.status.warning.soft
                        : tokens.status.info.soft
                  }
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {new Date(report.createdAt).toLocaleDateString()}
                </ThemedText>
              </View>
              <ThemedText type="smallBold">
                {report.content.snapshot?.title ?? report.content.contentId}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`contentReport.issueTypes.${report.issueType}`)}
              </ThemedText>
              <ThemedText type="small" numberOfLines={3} style={styles.description}>
                {report.description}
              </ThemedText>
              {report.attachmentCount > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("contentReport.attachmentCount", { count: report.attachmentCount })}
                </ThemedText>
              ) : null}
            </Card>
          ))}
        </Stagger>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  loader: { marginTop: Spacing.six },
  card: { marginBottom: Spacing.two },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.two,
  },
  description: { marginTop: Spacing.one },
});
