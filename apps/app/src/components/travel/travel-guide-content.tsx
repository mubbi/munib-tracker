import {
  TRAVEL_HADITH_REFS,
  TRAVEL_OBLIGATION_COUNT,
  TRAVEL_QURAN_REFS,
  TRAVEL_RAKATS,
  TRAVEL_SECTIONS,
  type TravelSectionKey,
} from "@munib-tracker/shared/content";
import type { JannahHadithRef, JannahQuranRef } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  JannahHadithEvidence,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { Radius, Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { useDayExcused, useTrackerActions } from "@/stores/tracker-store";

const SECTION_ICONS: Record<TravelSectionKey, SymbolViewProps["name"]> = {
  qasr: { ios: "arrow.down.right.and.arrow.up.left", android: "compress", web: "compress" },
  jam: { ios: "arrow.triangle.merge", android: "merge", web: "merge" },
  jamTypes: { ios: "clock.arrow.2.circlepath", android: "schedule", web: "schedule" },
  when: { ios: "location.circle.fill", android: "my_location", web: "my_location" },
  distance: { ios: "map.fill", android: "map", web: "map" },
  sunnah: { ios: "sun.max.fill", android: "wb_sunny", web: "wb_sunny" },
  witr: { ios: "moon.stars.fill", android: "nightlight", web: "nightlight" },
};

export function TravelGuideContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const { colors, tokens } = useThemeTokens();
  const excusedReason = useDayExcused();
  const { setDayExcused } = useTrackerActions();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const isActive = excusedReason === "travel";

  const quranRefs = useMemo((): JannahQuranRef[] => {
    return TRAVEL_QURAN_REFS.map((ref, index) => ({
      ...ref,
      excerpt: t(`travel.quran.${index}.excerpt`),
    }));
  }, [t]);

  const hadithRefs = useMemo((): JannahHadithRef[] => {
    return TRAVEL_HADITH_REFS.map((ref, index) => ({
      ...ref,
      excerpt: t(`travel.hadith.${index}.excerpt`),
    }));
  }, [t]);

  const obligations = useMemo(
    () =>
      Array.from({ length: TRAVEL_OBLIGATION_COUNT }, (_, index) =>
        t(`travel.obligations.${index}`),
      ),
    [t],
  );

  const handleMarkExcused = () => {
    void setDayExcused("travel");
    setConfirmOpen(false);
  };

  return (
    <>
      <Stagger>
        {isActive ? (
          <Button
            label={t("travel.clearExcused")}
            variant="secondary"
            fullWidth
            onPress={() => void setDayExcused(null)}
          />
        ) : (
          <Button label={t("travel.markExcused")} fullWidth onPress={() => setConfirmOpen(true)} />
        )}

        <JannahTakeaway text={t("travel.takeaway")} />

        {TRAVEL_SECTIONS.map((sectionKey) => (
          <Card key={sectionKey} padding="three">
            <SectionHeader
              title={t(`travel.${sectionKey}.title`)}
              icon={SECTION_ICONS[sectionKey]}
            />
            <ThemedText type="small" themeColor="mutedForeground" style={styles.body}>
              {t(`travel.${sectionKey}.body`)}
            </ThemedText>
          </Card>
        ))}

        <Card padding="three">
          <SectionHeader
            title={t("travel.rakatsTitle")}
            icon={{
              ios: "list.number",
              android: "format_list_numbered",
              web: "format_list_numbered",
            }}
          />
          <View style={styles.tableHead}>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.colName}>
              {t("travel.rakatsPrayer")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
              {t("travel.rakatsResident")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.colNum}>
              {t("travel.rakatsTravel")}
            </ThemedText>
          </View>
          {TRAVEL_RAKATS.map((row) => (
            <View key={row.prayerId} style={[styles.tableRow, { borderTopColor: tokens.hairline }]}>
              <ThemedText type="small" style={styles.colName}>
                {t(`prayers.${row.prayerId}`)}
              </ThemedText>
              <ThemedText type="small" style={styles.colNum}>
                {row.resident}
              </ThemedText>
              <ThemedText
                type="small"
                style={[
                  styles.colNum,
                  row.travel < row.resident ? { color: colors.accent } : undefined,
                ]}
              >
                {row.travel}
              </ThemedText>
            </View>
          ))}
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.tableNote}>
            {t("travel.rakatsNote")}
          </ThemedText>
        </Card>

        <JannahQuranEvidence refs={quranRefs} />
        <JannahHadithEvidence refs={hadithRefs} />

        <Card padding="three">
          <SectionHeader
            title={t("travel.obligationsTitle")}
            icon={{
              ios: "checklist",
              android: "checklist",
              web: "checklist",
            }}
          />
          <View style={styles.steps}>
            {obligations.map((step, index) => (
              <View key={step} style={styles.stepRow}>
                <View style={[styles.stepBadge, { backgroundColor: tokens.accentSoft }]}>
                  <ThemedText type="smallBold" style={{ color: colors.accent }}>
                    {index + 1}
                  </ThemedText>
                </View>
                <ThemedText type="small" themeColor="mutedForeground" style={styles.stepText}>
                  {step}
                </ThemedText>
              </View>
            ))}
          </View>
        </Card>

        <Card padding="three">
          <NavRow
            icon={{
              ios: "hands.sparkles.fill",
              android: "volunteer_activism",
              web: "volunteer_activism",
            }}
            label={t("travel.duasLink")}
            onPress={() => router.push("/dua/travel")}
          />
        </Card>

        <View style={[styles.disclaimer, { backgroundColor: tokens.status.info.soft }]}>
          <SymbolView
            name={{ ios: "info.circle.fill", android: "info", web: "info" }}
            size={16}
            tintColor={tokens.status.info.color}
          />
          <ThemedText type="caption" style={[styles.disclaimerText, { color: colors.foreground }]}>
            {t("travel.disclaimer")}
          </ThemedText>
        </View>
      </Stagger>

      <ConfirmDialog
        visible={confirmOpen}
        title={t("tracker.excusedConfirmTitle")}
        message={t("tracker.excusedConfirmMsg", {
          reason: t("tracker.excusedReason.travel"),
        })}
        confirmLabel={t("tracker.excusedConfirmAction")}
        onConfirm={handleMarkExcused}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: Spacing.two, lineHeight: 22 },
  tableHead: {
    flexDirection: "row",
    marginTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.two + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  colName: { flex: 1 },
  colNum: { width: 72, textAlign: "center" },
  tableNote: { marginTop: Spacing.three, lineHeight: 18 },
  steps: { gap: Spacing.three, marginTop: Spacing.three },
  stepRow: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { flex: 1, lineHeight: 22 },
  disclaimer: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "flex-start",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  disclaimerText: { flex: 1, lineHeight: 18 },
});
