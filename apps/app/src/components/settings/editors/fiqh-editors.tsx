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

import { MadhhabPicker } from "@/components/fiqh/madhhab-picker";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { Sheet } from "@/components/ui/sheet";
import { Spacing } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { acceptAsrOffer, type MadhhabChoice, setMadhhab } from "@/lib/fiqh/set-madhhab";
import type { MadhabKey } from "@/lib/prayer-times";
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
import { useToast } from "@/providers/toast-provider";
import { useStore } from "@/stores/create-store";
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
 * "Not sure?" explainer). A change saves through `setMadhhab` (which reschedules
 * reminders), shows "Rulings updated across the app", and — when the school's
 * Asr calculation differs from the device's — offers to switch it.
 */
export function MadhhabEditor() {
  const { t } = useTranslation();
  const toast = useToast();
  const { colors, tokens } = useThemeTokens();
  const { madhhab } = useFiqhPrefs();
  const [asrOffer, setAsrOffer] = useState<MadhabKey | null>(null);

  const onChange = (choice: MadhhabChoice) => {
    void setMadhhab(choice).then((result) => {
      if (result.changed) toast.success(t("settingsStep4.fiqh.rulingsUpdated"));
      setAsrOffer(result.asrOffer);
    });
  };

  const asrLabel = (key: MadhabKey) =>
    t(key === "hanafi" ? "location.madhabHanafi" : "location.madhabShafi");

  return (
    <View style={styles.block}>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("fiqh.picker.subtitle")}
      </ThemedText>
      <MadhhabPicker value={madhhab} onChange={onChange} />
      {asrOffer ? (
        <Card
          padding="three"
          style={[styles.offer, { backgroundColor: tokens.accentSoft, borderColor: colors.accent }]}
        >
          <ThemedText type="smallBold">
            {t("settingsStep4.fiqh.asrOfferTitle", { asr: asrLabel(asrOffer) })}
          </ThemedText>
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("settingsStep4.fiqh.asrOfferBody")}
          </ThemedText>
          <View style={styles.actions}>
            <Button
              label={t("settingsStep4.fiqh.asrOfferAccept")}
              size="sm"
              onPress={() => {
                const key = asrOffer;
                setAsrOffer(null);
                void acceptAsrOffer(key).then(() =>
                  toast.success(t("settingsStep4.fiqh.asrUpdated", { asr: asrLabel(key) })),
                );
              }}
            />
            <Button
              label={t("settingsStep4.fiqh.asrOfferDecline")}
              size="sm"
              variant="ghost"
              onPress={() => setAsrOffer(null)}
            />
          </View>
        </Card>
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

  return (
    <CollapsibleSection title={t("settingsStep4.fiqh.advanced")}>
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
                  subtitle={t("fiqh.customHint")}
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
            description: value === "default" ? undefined : t("fiqh.customHint"),
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
      <Sheet visible={domainSheet != null} onClose={() => setDomainSheet(null)} variant="bottom">
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
    </CollapsibleSection>
  );
}

/** "Where this applies" (§4.1.5 item 4): every place a school difference is shown, with a deep link. */
export function FiqhWhereAppliesEditor() {
  const { t } = useTranslation();
  const router = useRouter();
  const groups = whereThisApplies();
  return (
    <CollapsibleSection title={t("settingsStep4.fiqh.whereApplies")}>
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
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  block: { gap: Spacing.two },
  subhead: { marginTop: Spacing.two },
  customRow: { gap: Spacing.one },
  offer: { gap: Spacing.two, borderWidth: 1 },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: Spacing.two },
});
