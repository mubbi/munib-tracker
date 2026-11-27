import {
  FIQH_CUSTOM_BOUNDS,
  FIQH_DOMAINS,
  type FiqhDomain,
  MADHHAB_IDS,
  type NisabBasis,
} from "@munib-tracker/shared/fiqh";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { AsrOfferCard, useMadhhabChooser } from "@/components/fiqh/madhhab-chooser";
import { MadhhabPicker } from "@/components/fiqh/madhhab-picker";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import {
  FIQH_CUSTOM_NUMERIC,
  type FiqhOverrideChoice,
  initialCustomValue,
  overrideChoiceOf,
  schoolDefaultFor,
  setFiqhCustomValue,
  setFiqhOverride,
  whereThisApplies,
} from "@/lib/settings/fiqh-settings";
import { useStore } from "@/stores/create-store";
import { useLocation } from "@/stores/location-store";
import { preferencesStore } from "@/stores/preferences-store";

import { ChoiceList } from "../choice-list";
import { SettingsRow } from "../settings-rows";
import { StepperRow } from "../stepper-row";

function useFiqhPrefs() {
  const madhhab = useStore(preferencesStore, (s) => s.prefs.madhhab);
  const madhhabOverrides = useStore(preferencesStore, (s) => s.prefs.madhhabOverrides);
  const fiqhCustom = useStore(preferencesStore, (s) => s.prefs.fiqhCustom);
  return { madhhab, madhhabOverrides, fiqhCustom };
}

/**
 * "My madhhab" (§4.1.5 items 1, 2, 5): the shared picker (with its neutral
 * "Not sure?" explainer) and the shared pick flow — saves through `setMadhhab`
 * (which reschedules reminders), shows "Rulings updated across the app", and
 * offers the school's Asr calculation when it differs from the device's (the
 * same card onboarding, the home card and the lazy sheet show).
 */
export function MadhhabEditor() {
  const { t } = useTranslation();
  const { madhhab } = useFiqhPrefs();
  const location = useLocation();
  const chooser = useMadhhabChooser();

  return (
    <View style={styles.block}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("fiqh.picker.subtitle")}
      </ThemedText>
      <MadhhabPicker value={madhhab} onChange={(choice) => void chooser.choose(choice)} />
      {chooser.offer ? (
        <AsrOfferCard
          offer={chooser.offer}
          currentAsr={location.madhab}
          onAccept={() => void chooser.acceptOffer()}
          onDecline={chooser.declineOffer}
        />
      ) : null}
    </View>
  );
}

const NISAB_OPTIONS: readonly ("default" | NisabBasis)[] = ["default", "lower", "gold", "silver"];

/**
 * Advanced (collapsed, §4.1.5 item 3): per-area school overrides under the
 * talfiq caution, then the scholar-given custom values, each bounded by
 * `FIQH_CUSTOM_BOUNDS` and labelled "Custom — as advised by your scholar".
 */
export function FiqhAdvancedEditor() {
  const { t } = useTranslation();
  const prefs = useFiqhPrefs();
  const [domainSheet, setDomainSheet] = useState<FiqhDomain | null>(null);

  const choiceLabel = (choice: FiqhOverrideChoice) => {
    if (choice === "inherit") return t("settingsStep4.fiqh.followMine");
    if (choice === "all") return t("fiqh.allViews");
    return t(`fiqh.school.${choice}`);
  };
  const choices: FiqhOverrideChoice[] = ["inherit", ...MADHHAB_IDS, "all"];
  const nisab = prefs.fiqhCustom?.nisabBasis;

  // The "Advanced" section folds this editor (groups.ts `collapsedSections`).
  return (
    <View style={styles.block}>
      <View style={styles.block}>
        <ThemedText type="smallBold">{t("fiqh.talfiq.title")}</ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fiqh.talfiq.body")}
        </ThemedText>
        <ThemedText type="smallBold" style={styles.subhead}>
          {t("settingsStep4.fiqh.perArea")}
        </ThemedText>
        {FIQH_DOMAINS.map((domain) => (
          <SettingsRow
            key={domain}
            title={t(`fiqh.domain.${domain}`)}
            value={choiceLabel(overrideChoiceOf(prefs, domain))}
            onPress={() => setDomainSheet(domain)}
          />
        ))}

        <ThemedText type="smallBold" style={styles.subhead}>
          {t("settingsStep4.fiqh.customValues")}
        </ThemedText>
        <ThemedText type="caption" themeColor="mutedForeground">
          {t("fiqh.customHint")}
        </ThemedText>
        {FIQH_CUSTOM_NUMERIC.map(({ key, domain, unit }) => {
          const custom = prefs.fiqhCustom?.[key];
          const bounds = FIQH_CUSTOM_BOUNDS[key];
          const fallback = schoolDefaultFor(prefs, key, domain);
          const format = (v: number) =>
            t(unit === "km" ? "settingsStep4.fiqh.km" : "settingsStep4.fiqh.days", { value: v });
          const title = t(`settingsStep4.fiqh.custom.${key}`);
          if (typeof custom === "number") {
            return (
              <View key={key} style={styles.customRow}>
                <StepperRow
                  title={title}
                  value={custom}
                  min={bounds.min}
                  max={bounds.max}
                  step={1}
                  format={format}
                  onChange={(v) => void setFiqhCustomValue(key, v)}
                />
                <Button
                  label={t("settingsStep4.fiqh.useSchoolDefault")}
                  size="sm"
                  variant="ghost"
                  onPress={() => void setFiqhCustomValue(key, undefined)}
                />
              </View>
            );
          }
          return (
            <SettingsRow
              key={key}
              title={title}
              subtitle={t("settingsStep4.fiqh.setCustom")}
              value={fallback == null ? t("fiqh.allViews") : format(fallback)}
              onPress={() => void setFiqhCustomValue(key, initialCustomValue(prefs, key, domain))}
            />
          );
        })}
        <ThemedText type="small" style={styles.subhead}>
          {t("zakat.fiqh.basisTitle")}
        </ThemedText>
        <ChoiceList
          items={NISAB_OPTIONS.map((value) => ({
            value,
            label:
              value === "default"
                ? t("settingsStep4.fiqh.schoolDefaultOption")
                : t(`zakat.fiqh.basis.${value}`),
          }))}
          value={nisab ?? "default"}
          onChange={(value) =>
            void setFiqhCustomValue(
              "nisabBasis",
              value === "default" ? undefined : (value as NisabBasis),
            )
          }
        />
      </View>
      <Sheet
        accessibilityLabel={domainSheet ? t(`fiqh.domain.${domainSheet}`) : ""}
        visible={domainSheet != null}
        onClose={() => setDomainSheet(null)}
        variant="bottom"
      >
        {domainSheet ? (
          <View style={styles.block}>
            <ThemedText type="subtitle">{t(`fiqh.domain.${domainSheet}`)}</ThemedText>
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("fiqh.talfiq.body")}
            </ThemedText>
            <ChoiceList
              items={choices.map((value) => ({ value, label: choiceLabel(value) }))}
              value={overrideChoiceOf(prefs, domainSheet)}
              onChange={(value) => {
                const domain = domainSheet;
                setDomainSheet(null);
                void setFiqhOverride(domain, value);
              }}
            />
          </View>
        ) : null}
      </Sheet>
    </View>
  );
}

/** "Where this applies" (§4.1.5 item 4): every place a school difference is shown, with a deep link. */
export function FiqhWhereAppliesEditor() {
  const { t } = useTranslation();
  const router = useRouter();
  const groups = whereThisApplies();
  // The "Where this applies" section folds this list (groups.ts `collapsedSections`).
  return (
    <View style={styles.block}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("settingsStep4.fiqh.whereAppliesSub")}
      </ThemedText>
      {groups.map((group) => (
        <View key={group.domain} style={styles.block}>
          <ThemedText type="smallBold" style={styles.subhead}>
            {t(`fiqh.domain.${group.domain}`)}
          </ThemedText>
          {group.items.map((item) => (
            <SettingsRow
              key={item.id}
              title={t(item.titleKey)}
              onPress={() => router.push(item.route as Href)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  subhead: { marginTop: Spacing.two },
  customRow: { gap: Spacing.one },
});
