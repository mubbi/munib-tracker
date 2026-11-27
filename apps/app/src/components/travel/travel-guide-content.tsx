import {
  TRAVEL_HADITH_REFS,
  TRAVEL_OBLIGATION_COUNT,
  TRAVEL_QURAN_REFS,
  TRAVEL_RAKATS,
  TRAVEL_SECTIONS,
  type TravelSectionKey,
} from "@munib-tracker/shared/content/travel-guide";
import type { JannahHadithRef, JannahQuranRef } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { LearnTwoPane, useLearnHubLayout } from "@/components/jannah/hub-layout";
import {
  JannahHadithEvidence,
  JannahQuranEvidence,
  JannahTakeaway,
} from "@/components/jannah/primitives";
import { useRegisterLearnListenText } from "@/components/learn-tts-context";
import { LearnProseText } from "@/components/reading-typography-context";
import { ThemedText } from "@/components/themed-text";
import { TravelModeSheet } from "@/components/travel/travel-mode-sheet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { BorderWidth, Radius, Spacing } from "@/constants/theme";
import { tvDp } from "@/constants/tv-density";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { screenDifferences } from "@/lib/fiqh/screen-differences";
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
  // Desktop: article in the main column; the excused toggle, rakah table and
  // duas link stay beside it.
  const wide = useLearnHubLayout();
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
  const listenBody = useMemo(
    () => [
      ...TRAVEL_SECTIONS.map((sectionKey) => t(`travel.${sectionKey}.body`)),
      ...obligations,
      ...quranRefs
        .map((ref) => ref.excerpt)
        .filter((excerpt): excerpt is string => Boolean(excerpt)),
      ...hadithRefs.map((ref) => ref.excerpt),
    ],
    [hadithRefs, obligations, quranRefs, t],
  );
  useRegisterLearnListenText(listenBody);

  const handleMarkExcused = () => {
    void setDayExcused("travel");
    setConfirmOpen(false);
  };

  const excusedButton = isActive ? (
    <Button
      label={t("travel.clearExcused")}
      variant="secondary"
      fullWidth
      onPress={() => void setDayExcused(null)}
    />
  ) : (
    <Button label={t("travel.markExcused")} fullWidth onPress={() => setConfirmOpen(true)} />
  );

  const takeaway = <JannahTakeaway text={t("travel.takeaway")} />;

  const sectionCards = TRAVEL_SECTIONS.map((sectionKey) => (
    <Card key={sectionKey}>
      <SectionHeader title={t(`travel.${sectionKey}.title`)} icon={SECTION_ICONS[sectionKey]} />
      <TvReadableBlock>
        <LearnProseText themeColor="mutedForeground" style={styles.body}>
          {t(`travel.${sectionKey}.body`)}
        </LearnProseText>
      </TvReadableBlock>
      {/* NF-3.0a: the section's per-school notes (registered in SCREEN_DIFFERENCES). */}
      {screenDifferences(`/travel#${sectionKey}`).map((id) => (
        <MadhhabNote key={id} id={id} />
      ))}
    </Card>
  ));

  const rakatsCard = (
    <Card>
      <SectionHeader
        title={t("travel.rakatsTitle")}
        icon={{
          ios: "list.number",
          android: "format_list_numbered",
          web: "format_list_numbered",
        }}
      />
      <TvReadableBlock>
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
                row.travel < row.resident ? { color: colors.accentText } : undefined,
              ]}
            >
              {row.travel}
            </ThemedText>
          </View>
        ))}
        <LearnProseText proseRole="caption" themeColor="mutedForeground" style={styles.tableNote}>
          {t("travel.rakatsNote")}
        </LearnProseText>
      </TvReadableBlock>
    </Card>
  );

  const obligationsCard = (
    <Card>
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
          <TvReadableBlock key={step}>
            <View style={styles.stepRow}>
              <View style={[styles.stepBadge, { backgroundColor: tokens.accentSoft }]}>
                <ThemedText type="smallBold" style={{ color: tokens.accentOnSoft }}>
                  {index + 1}
                </ThemedText>
              </View>
              <LearnProseText themeColor="mutedForeground" style={styles.stepText}>
                {step}
              </LearnProseText>
            </View>
          </TvReadableBlock>
        ))}
      </View>
    </Card>
  );

  const duasLinkCard = (
    <Card>
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
  );

  const disclaimer = (
    <TvReadableBlock>
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
    </TvReadableBlock>
  );

  return (
    <>
      {wide.twoPane ? (
        <Stagger>
          <LearnTwoPane
            main={
              <>
                {takeaway}
                {sectionCards}
                <JannahQuranEvidence refs={quranRefs} />
                <JannahHadithEvidence refs={hadithRefs} />
                {obligationsCard}
              </>
            }
            aside={
              <>
                {excusedButton}
                {rakatsCard}
                {duasLinkCard}
              </>
            }
          />
          {disclaimer}
        </Stagger>
      ) : (
        <Stagger>
          {excusedButton}
          {takeaway}
          {sectionCards}
          {rakatsCard}
          <JannahQuranEvidence refs={quranRefs} />
          <JannahHadithEvidence refs={hadithRefs} />
          {obligationsCard}
          {duasLinkCard}
          {disclaimer}
        </Stagger>
      )}

      <TravelModeSheet
        visible={confirmOpen}
        onConfirm={handleMarkExcused}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  body: { marginTop: Spacing.two, flexShrink: 1, alignSelf: "stretch" },
  tableHead: {
    flexDirection: "row",
    marginTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Spacing.twoHalf,
    borderTopWidth: BorderWidth.hairline,
  },
  colName: { flex: 1 },
  colNum: { width: tvDp(72), textAlign: "center" },
  tableNote: { marginTop: Spacing.three },
  steps: { gap: Spacing.three, marginTop: Spacing.three },
  stepRow: { flexDirection: "row", gap: Spacing.three, alignItems: "flex-start" },
  stepBadge: {
    width: tvDp(28),
    height: tvDp(28),
    borderRadius: tvDp(14),
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: { flex: 1 },
  disclaimer: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "flex-start",
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  disclaimerText: { flex: 1 },
});
