import type { ContentReportSummary } from "@munib-tracker/shared/types/content-report";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SettingsDetailScreen } from "@/components/settings/settings-screen";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Pill, type PillTone } from "@/components/ui/pill";
import { Sheet } from "@/components/ui/sheet";
import { SkeletonPlaceholder } from "@/components/ui/skeleton";
import { Stagger } from "@/components/ui/stagger";
import { Spacing } from "@/constants/theme";
import { useFormatCalendarDate } from "@/hooks/use-calendar-format";
import { listContentReports } from "@/lib/content-report-api";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useAuth } from "@/providers/auth-provider";

/** Pill tone per status — label uses the AA `onSoft` text token, never the raw hue. */
function statusTone(report: ContentReportSummary): PillTone {
  if (report.status === "completed") return "success";
  if (report.status === "spam" || report.status === "cancelled") return "warning";
  return "info";
}

export default function MyReportsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { session, isGuest } = useAuth();
  const { formatDate } = useFormatCalendarDate();
  const [items, setItems] = useState<ContentReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const tv = isTV();
  /**
   * G-93: every card opens the full report (description is clamped in the list).
   * On TV this also makes each card a D-pad focus target, so the list scrolls.
   */
  const [openReport, setOpenReport] = useState<ContentReportSummary | null>(null);

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
    <SettingsDetailScreen
      parent="privacy"
      path="/settings/my-reports"
      title={t("contentReport.myReportsTitle")}
      subtitle={t("contentReport.myReportsSubtitle")}
      seoTitle={t("contentReport.myReportsTitle")}
    >
      {isGuest ? (
        <EmptyState
          icon={{ ios: "person.crop.circle", android: "account_circle", web: "account_circle" }}
          title={t("contentReport.signInRequiredTitle")}
          description={t("contentReport.myReportsGuest")}
          actionLabel={t("contentReport.signInCta")}
          onAction={() => router.push("/profile")}
        />
      ) : loading ? (
        <SkeletonPlaceholder preset="card" count={3} style={styles.loader} />
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
            <Card
              key={report.id}
              style={styles.card}
              onPress={() => setOpenReport(report)}
              accessibilityLabel={t("contentReport.cardA11y", {
                title: report.content.snapshot?.title ?? report.content.contentId,
                status: t(`contentReport.status.${report.status}`),
              })}
            >
              <View style={styles.cardHeader}>
                <Pill
                  label={t(`contentReport.status.${report.status}`)}
                  tone={statusTone(report)}
                />
                <ThemedText type="caption" themeColor="mutedForeground">
                  {formatDate(new Date(report.createdAt), {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
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

      <Sheet
        visible={openReport != null}
        onClose={() => setOpenReport(null)}
        title={
          openReport ? (openReport.content.snapshot?.title ?? openReport.content.contentId) : ""
        }
        solid
      >
        {openReport ? (
          <View style={styles.sheetBody}>
            <View style={styles.cardHeader}>
              <Pill
                label={t(`contentReport.status.${openReport.status}`)}
                tone={statusTone(openReport)}
              />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`contentReport.issueTypes.${openReport.issueType}`)}
              </ThemedText>
            </View>
            <ThemedText type="small">{openReport.description}</ThemedText>
            {openReport.resolvedAt ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("contentReport.resolvedOn", {
                  date: formatDate(new Date(openReport.resolvedAt), {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }),
                })}
              </ThemedText>
            ) : null}
            <Button
              label={t("common.done")}
              variant="secondary"
              preferredFocus={tv}
              onPress={() => setOpenReport(null)}
            />
          </View>
        ) : null}
      </Sheet>
    </SettingsDetailScreen>
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
  sheetBody: { gap: Spacing.three },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/settings/my-reports");
