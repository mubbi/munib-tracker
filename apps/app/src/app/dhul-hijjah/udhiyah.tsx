import {
  UDHIYAH_MAX_SHARES,
  UDHIYAH_MIN_AGE_MONTHS,
} from "@munib-tracker/shared/content/dhul-hijjah";
import type { UdhiyahAnimal, UdhiyahPlan, UdhiyahStatus } from "@munib-tracker/shared/types";
import { type Href, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { ToggleRow } from "@/components/seasonal/toggle-row";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { PressableScale } from "@/components/ui/pressable-scale";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger } from "@/components/ui/stagger";
import { Stepper } from "@/components/ui/stepper";
import { Radius, Spacing } from "@/constants/theme";
import { TvLayout } from "@/constants/tv-layout";
import { useDhulHijjahSeason } from "@/hooks/use-dhul-hijjah-season";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { isShareAnimal, UDHIYAH_STATUS_ORDER, udhiyahWindow } from "@/lib/dhul-hijjah";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { routeMetadata } from "@/lib/seo/route-metadata";
import {
  useDhulHijjahActions,
  useDhulHijjahYear,
  useEnsureDhulHijjahLoaded,
} from "@/stores/dhul-hijjah-store";

const ANIMALS: readonly UdhiyahAnimal[] = [
  "sheep",
  "goat",
  "cow_share",
  "camel_share",
  "cow",
  "camel",
];
const PROGRESS_STATUSES = UDHIYAH_STATUS_ORDER.filter((s) => s !== "planned");

/**
 * Udhiyah planner (NF-3.3): eligibility per the user's school (all views when
 * none), the planner (animal, shares, arranged via, on behalf of), the status
 * checklist arranged → slaughtered → distributed, the minimum-age table, the
 * slaughter window and the distribution note. Names stay on the device / sync
 * and never appear in notifications.
 */
export default function UdhiyahPlannerScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const season = useDhulHijjahSeason();
  useEnsureDhulHijjahLoaded();
  const state = useDhulHijjahYear(season.year);
  const { setUdhiyahPlan, setIntendsUdhiyah } = useDhulHijjahActions();
  const plan = state?.udhiyah;
  const [names, setNames] = useState(plan?.onBehalfOf?.join(", ") ?? "");
  const tv = isTV();
  const school = season.udhiyahRules;

  const save = (patch: Partial<UdhiyahPlan>) => {
    const base: UdhiyahPlan = plan ?? { animal: "sheep", via: "self", status: "planned" };
    void setUdhiyahPlan(season.year, { ...base, ...patch });
  };
  const saveNames = () =>
    save({
      onBehalfOf: names
        .split(",")
        .map((n) => n.trim())
        .filter(Boolean),
    });

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    try {
      return new Date(y as number, (m as number) - 1, d as number).toLocaleDateString(
        i18n.language || "en",
        { day: "numeric", month: "long" },
      );
    } catch {
      return iso;
    }
  };

  const statusIndex = plan ? UDHIYAH_STATUS_ORDER.indexOf(plan.status) : 0;
  const setStatus = (status: UdhiyahStatus) => {
    const index = UDHIYAH_STATUS_ORDER.indexOf(status);
    // Ticking a done step again steps back to the one before it.
    save({
      status: statusIndex >= index ? (UDHIYAH_STATUS_ORDER[index - 1] ?? "planned") : status,
    });
  };

  return (
    <ScreenLayout
      eyebrow={t("dhulHijjah.eyebrow")}
      title={t("dhulHijjah.udhiyah.plannerTitle")}
      subtitle={t("dhulHijjah.udhiyah.plannerSubtitle")}
      onBack={() => goBackOrReplace(router, "/dhul-hijjah" as Href)}
    >
      <Seo path="/dhul-hijjah/udhiyah" />
      <Stagger>
        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.udhiyah.eligibilityTitle")}
            icon={{ ios: "info.circle.fill", android: "info", web: "info" }}
          />
          <View style={styles.body}>
            <MadhhabNote id="udhiyah.status" />
            {school == null || school.udhiyah.status === "wajib_for_capable" ? (
              <NavRow
                icon={{ ios: "scalemass.fill", android: "balance", web: "balance" }}
                label={t("dhulHijjah.udhiyah.nisabLink")}
                onPress={() => router.push("/zakat" as Href)}
              />
            ) : null}
            <ToggleRow
              title={t("dhulHijjah.udhiyah.intendToggle")}
              subtitle={t("dhulHijjah.udhiyah.intendHint")}
              value={state?.intendsUdhiyah != null}
              onValueChange={(on) => void setIntendsUdhiyah(season.year, on)}
            />
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.udhiyah.planTitle")}
            icon={{ ios: "list.bullet.clipboard", android: "assignment", web: "assignment" }}
          />
          <View style={styles.body}>
            <ThemedText type="smallBold">{t("dhulHijjah.udhiyah.animalLabel")}</ThemedText>
            <View style={styles.chips}>
              {ANIMALS.map((animal) => {
                const selected = plan?.animal === animal;
                return (
                  <PressableScale
                    key={animal}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    onPress={() =>
                      save({
                        animal,
                        shares: isShareAnimal(animal) ? (plan?.shares ?? 1) : undefined,
                      })
                    }
                    haptic="selection"
                    style={[
                      styles.chip,
                      tv ? styles.chipTv : null,
                      {
                        borderColor: selected ? colors.accent : tokens.hairline,
                        backgroundColor: selected ? tokens.accentSoft : colors.card,
                      },
                    ]}
                  >
                    <ThemedText type="caption">
                      {t(`dhulHijjah.udhiyah.animal.${animal}`)}
                    </ThemedText>
                  </PressableScale>
                );
              })}
            </View>
            {plan && isShareAnimal(plan.animal) ? (
              <View style={styles.inline}>
                <ThemedText type="small" style={styles.flex}>
                  {t("dhulHijjah.udhiyah.sharesLabel", { max: UDHIYAH_MAX_SHARES })}
                </ThemedText>
                <Stepper
                  value={plan.shares ?? 1}
                  min={1}
                  size="sm"
                  label={t("dhulHijjah.udhiyah.sharesLabel", { max: UDHIYAH_MAX_SHARES })}
                  onIncrement={() =>
                    save({ shares: Math.min(UDHIYAH_MAX_SHARES, (plan.shares ?? 1) + 1) })
                  }
                  onDecrement={() => save({ shares: Math.max(1, (plan.shares ?? 1) - 1) })}
                />
              </View>
            ) : null}
            <ThemedText type="smallBold">{t("dhulHijjah.udhiyah.viaLabel")}</ThemedText>
            <SegmentedControl
              options={[
                { id: "self", label: t("dhulHijjah.udhiyah.via.self") },
                { id: "agency", label: t("dhulHijjah.udhiyah.via.agency") },
              ]}
              value={plan?.via ?? "self"}
              onChange={(via) => save({ via })}
            />
            {/* TV: no free-text names (D-pad keyboards) — the rest of the planner works. */}
            {!tv ? (
              <>
                <ThemedText type="smallBold">{t("dhulHijjah.udhiyah.behalfLabel")}</ThemedText>
                <TextInput
                  value={names}
                  onChangeText={setNames}
                  onBlur={saveNames}
                  onSubmitEditing={saveNames}
                  maxLength={300}
                  placeholder={t("dhulHijjah.udhiyah.behalfPlaceholder")}
                  placeholderTextColor={colors.mutedForeground}
                  accessibilityLabel={t("dhulHijjah.udhiyah.behalfLabel")}
                  style={[styles.input, { color: colors.foreground, borderColor: tokens.hairline }]}
                />
              </>
            ) : null}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.udhiyah.statusTitle")}
            icon={{ ios: "checklist", android: "checklist", web: "checklist" }}
          />
          <View style={styles.body}>
            {PROGRESS_STATUSES.map((status) => {
              const done = statusIndex >= UDHIYAH_STATUS_ORDER.indexOf(status);
              return (
                <PressableScale
                  key={status}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: done }}
                  accessibilityLabel={t(`dhulHijjah.udhiyah.status.${status}`)}
                  onPress={() => setStatus(status)}
                  haptic="selection"
                  style={[styles.inline, tv ? styles.chipTv : null]}
                >
                  <SymbolView
                    name={
                      done
                        ? {
                            ios: "checkmark.circle.fill",
                            android: "check_circle",
                            web: "check_circle",
                          }
                        : {
                            ios: "circle",
                            android: "radio_button_unchecked",
                            web: "radio_button_unchecked",
                          }
                    }
                    size={24}
                    tintColor={done ? tokens.status.success.color : colors.mutedForeground}
                  />
                  <ThemedText type="small">{t(`dhulHijjah.udhiyah.status.${status}`)}</ThemedText>
                </PressableScale>
              );
            })}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.udhiyah.windowTitle")}
            icon={{ ios: "calendar", android: "calendar_month", web: "calendar_month" }}
          />
          <View style={styles.body}>
            {udhiyahWindow(school, season.year).map((w) => (
              <ThemedText key={w.lastDayHijri} type="small">
                {t(`dhulHijjah.udhiyah.window.${w.lastDayHijri}`, {
                  from: formatDate(w.startDate),
                  to: formatDate(w.endDate),
                })}
              </ThemedText>
            ))}
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.udhiyah.ageTitle")}
            icon={{ ios: "info.circle.fill", android: "info", web: "info" }}
          />
          <View style={styles.body}>
            {(Object.keys(UDHIYAH_MIN_AGE_MONTHS) as (keyof typeof UDHIYAH_MIN_AGE_MONTHS)[]).map(
              (row) => (
                <ThemedText key={row} type="small">
                  {t(`dhulHijjah.udhiyah.age.${row}`)}
                </ThemedText>
              ),
            )}
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("dhulHijjah.udhiyah.ageNote")}
            </ThemedText>
          </View>
        </Card>

        <Card padding="three">
          <SectionHeader
            title={t("dhulHijjah.udhiyah.distributionTitle")}
            icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
          />
          <ThemedText type="small" themeColor="mutedForeground" style={styles.body}>
            {t("dhulHijjah.udhiyah.distributionBody")}
          </ThemedText>
        </Card>

        <JannahDisclaimer textKey="dhulHijjah.disclaimer" />
      </Stagger>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
  chip: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipTv: { minHeight: TvLayout.chipMinHeight, justifyContent: "center" },
  inline: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  flex: { flex: 1, minWidth: 0 },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/dhul-hijjah/udhiyah");
