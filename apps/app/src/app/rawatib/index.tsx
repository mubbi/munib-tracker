import { RAWATIB_EXTRA_PRAYERS, RAWATIB_PRAYERS } from "@munib-tracker/shared/constants";
import type { RawatibId } from "@munib-tracker/shared/types";
import { defaultRakahs, rakahsForLog } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { HadithExcerptCard } from "@/components/hadith/hadith-excerpt-card";
import { TahiyyatHint } from "@/components/masjid/tahiyyat-hint";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { TvReadableBlock } from "@/components/ui/tv-readable-block";
import { Radius, Spacing } from "@/constants/theme";
import { useMadhhabPrompt } from "@/hooks/use-madhhab-prompt";
import { useRawatibConfig } from "@/hooks/use-rawatib";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { SCREEN_DIFFERENCES } from "@/lib/fiqh/screen-differences";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import {
  RAWATIB_EVIDENCE,
  RAWATIB_EXTRA_EVIDENCE,
  startRawatib,
  updateRawatibPreferences,
} from "@/lib/rawatib";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useSetting } from "@/lib/settings/use-setting";
import { usePrayerRakahsMap, useTodayPrayers } from "@/stores/tracker-store";

const CORE_EVIDENCE = [
  RAWATIB_EVIDENCE.twelve,
  RAWATIB_EVIDENCE.breakdown,
  RAWATIB_EVIDENCE.ten,
  RAWATIB_EVIDENCE.fourBeforeDhuhr,
  RAWATIB_EVIDENCE.fajr,
  RAWATIB_EVIDENCE.fajrMakeup,
] as const;

const TRACKER_HREF = "/tracker?focus=rawatib" as Href;

/**
 * Sunnah rawatib hub (NF-3.1): today's progress, the preset (10 / 12, D8) and
 * optional extras, the per-school notes, and the evidence rendered by reference
 * from the hadith corpus. TV is read-only (no switches).
 */
export default function RawatibScreen() {
  // §4.1.1 item 4: once per session while the madhhab was never chosen.
  const madhhabPrompt = useMadhhabPrompt();
  const router = useRouter();
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const tv = isTV();
  const config = useRawatibConfig();
  const nudge = useSetting<boolean>("notifications.sunnah.rawatibNudge");
  const { status } = useTodayPrayers();
  const rakahs = usePrayerRakahsMap();

  const done = RAWATIB_PRAYERS.reduce(
    (sum, id) =>
      status[id] === "completed"
        ? sum + rakahsForLog({ rakahs: rakahs[id] }, id, config.preset)
        : sum,
    0,
  );
  const target = config.preset;
  const schoolName = config.school ? t(`fiqh.school.${config.school}`) : null;
  const presetHint =
    config.presetSource === "school" && schoolName
      ? t("rawatib.hub.presetFromSchool", { school: schoolName })
      : config.presetSource === "user"
        ? t("rawatib.hub.presetCustom")
        : t("rawatib.hub.presetNoSchool");

  const rowLabel = (id: RawatibId) =>
    t("rawatib.hub.rowLabel", {
      name: t(`prayers.${id}`),
      count: defaultRakahs(id, config.preset),
    });

  return (
    <ScreenLayout
      eyebrow={t("rawatib.hub.eyebrow")}
      title={t("rawatib.hub.title")}
      subtitle={t("rawatib.hub.subtitle")}
      onBack={() => goBackOrReplace(router, "/tracker")}
    >
      <Seo path="/rawatib" />
      {madhhabPrompt.sheet}
      <Stagger>
        <Card padding="four">
          <SectionHeader
            title={t("rawatib.hub.todayTitle")}
            icon={{ ios: "sun.horizon.fill", android: "wb_sunny", web: "wb_sunny" }}
          />
          {config.enabled ? (
            <View style={styles.stack}>
              <ThemedText type="subtitle">
                {t("rawatib.card.progress", { done, total: target })}
              </ThemedText>
              <ProgressBar value={Math.min(1, done / target)} color={tokens.status.success.color} />
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("rawatib.hub.todayHint")}
              </ThemedText>
            </View>
          ) : (
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.stack}>
              {t("rawatib.hub.off")}
            </ThemedText>
          )}
          <View style={styles.rows}>
            <NavRow
              icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
              label={t("rawatib.hub.openTracker")}
              onPress={() => router.push(TRACKER_HREF)}
            />
            <NavRow
              icon={{ ios: "chart.bar.fill", android: "bar_chart", web: "bar_chart" }}
              label={t("rawatib.hub.openStats")}
              onPress={() => router.push("/statistics")}
            />
          </View>
        </Card>

        <Card padding="four">
          <SectionHeader
            title={t("rawatib.hub.setupTitle")}
            icon={{ ios: "slider.horizontal.3", android: "tune", web: "tune" }}
          />
          <View style={styles.stack}>
            <SettingRow
              label={t("rawatib.hub.enabled")}
              value={config.enabled}
              readOnly={tv}
              onChange={(next) =>
                void (next && config.needsChoice
                  ? startRawatib(config.preset)
                  : updateRawatibPreferences(config, { enabled: next }))
              }
            />
            <ThemedText type="smallBold">{t("rawatib.hub.presetTitle")}</ThemedText>
            {tv ? (
              <ThemedText type="small">
                {t("rawatib.hub.presetValue", { count: config.preset })}
              </ThemedText>
            ) : (
              <SegmentedControl
                options={[
                  { id: "12", label: t("rawatib.hub.presetValue", { count: 12 }) },
                  { id: "10", label: t("rawatib.hub.presetValue", { count: 10 }) },
                ]}
                value={String(config.preset) as "10" | "12"}
                onChange={(id) =>
                  void updateRawatibPreferences(config, { preset: id === "12" ? 12 : 10 })
                }
              />
            )}
            <ThemedText type="caption" themeColor="mutedForeground">
              {presetHint}
            </ThemedText>
            {!tv && config.presetSource === "user" && config.school ? (
              <Button
                label={t("rawatib.hub.followSchool")}
                variant="ghost"
                size="sm"
                onPress={() => void updateRawatibPreferences(config, { preset: null })}
              />
            ) : null}
            <TvReadableBlock>
              <View style={[styles.list, { backgroundColor: colors.muted }]}>
                {RAWATIB_PRAYERS.map((id) => (
                  <ThemedText key={id} type="small">
                    {rowLabel(id)}
                  </ThemedText>
                ))}
              </View>
            </TvReadableBlock>

            <ThemedText type="smallBold">{t("rawatib.hub.extrasTitle")}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("rawatib.hub.extrasHint")}
            </ThemedText>
            {RAWATIB_EXTRA_PRAYERS.map((id) => (
              <SettingRow
                key={id}
                label={rowLabel(id)}
                value={config.extras.includes(id)}
                readOnly={tv}
                onChange={(on) => void updateRawatibPreferences(config, { extra: id, on })}
              />
            ))}

            <SettingRow
              label={t("rawatib.hub.nudge")}
              hint={t("rawatib.hub.nudgeHint")}
              value={nudge.value}
              readOnly={tv}
              onChange={(next) => void nudge.setValue(next)}
            />
          </View>
        </Card>

        <View style={styles.notes}>
          {SCREEN_DIFFERENCES["/rawatib"].map((id) => (
            <MadhhabNote key={id} id={id} />
          ))}
        </View>

        {/* NF-3.11: tahiyyat al-masjid (#tahiyyat) — evidence + the schools' difference. */}
        <TahiyyatHint />

        <Card padding="four">
          <SectionHeader
            title={t("rawatib.hub.evidenceTitle")}
            icon={{ ios: "text.book.closed.fill", android: "auto_stories", web: "auto_stories" }}
          />
          <View style={styles.stack}>
            {CORE_EVIDENCE.map((id) => (
              <HadithExcerptCard key={id} hadithId={id} />
            ))}
            <ThemedText type="smallBold">{t("rawatib.hub.extrasEvidenceTitle")}</ThemedText>
            {RAWATIB_EXTRA_PRAYERS.map((id) => (
              <HadithExcerptCard key={id} hadithId={RAWATIB_EXTRA_EVIDENCE[id]} />
            ))}
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("rawatib.hub.gradingNote")}
            </ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("fiqh.disclaimer")}
            </ThemedText>
          </View>
        </Card>
      </Stagger>
    </ScreenLayout>
  );
}

function SettingRow({
  label,
  hint,
  value,
  readOnly,
  onChange,
}: {
  label: string;
  hint?: string;
  value: boolean;
  readOnly: boolean;
  onChange: (next: boolean) => void;
}) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  return (
    <View style={[styles.settingRow, { borderColor: colors.border }]}>
      <View style={styles.settingCopy}>
        <ThemedText type="small">{label}</ThemedText>
        {hint ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {hint}
          </ThemedText>
        ) : null}
      </View>
      {readOnly ? (
        <ThemedText type="smallBold">
          {value ? t("rawatib.witr.on") : t("rawatib.witr.off")}
        </ThemedText>
      ) : (
        <ThemedSwitch value={value} onValueChange={onChange} accessibilityLabel={label} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: Spacing.two + 2,
    marginTop: Spacing.three,
  },
  rows: {
    gap: Spacing.two,
    marginTop: Spacing.three,
  },
  list: {
    gap: Spacing.one + 2,
    padding: Spacing.three,
    borderRadius: Radius.md,
    borderCurve: "continuous",
  },
  notes: {
    gap: Spacing.three,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    paddingVertical: Spacing.two,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  settingCopy: {
    flex: 1,
    gap: 2,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/rawatib");
