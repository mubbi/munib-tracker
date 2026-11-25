import { MADHHAB_IDS, type MadhhabId } from "@munib-tracker/shared/fiqh";
import {
  calculateAllSchools,
  differingHeirs,
  type HeirType,
  type MirathHeirCounts,
} from "@munib-tracker/shared/mirath";
import { useRouter } from "expo-router";
import { type RefObject, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { type ScrollViewInstance, StyleSheet, View } from "react-native";

import { JannahCallout } from "@/components/jannah/primitives";
import { MirathCompareTable } from "@/components/mirath/mirath-compare-table";
import { MirathEstateCard } from "@/components/mirath/mirath-estate-card";
import { MirathReference } from "@/components/mirath/mirath-reference";
import { MirathResultView } from "@/components/mirath/mirath-results";
import { MirathStepBody } from "@/components/mirath/mirath-step-body";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { useRevealOnShow } from "@/components/wizard/use-reveal-on-show";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { estateInputFrom, type MirathEstateDraft } from "@/lib/mirath/estate";
import { buildMirathSnapshot, offerMirathSnapshot } from "@/lib/mirath/wasiyyah-handoff";
import {
  type DeceasedGender,
  effectiveCounts,
  type MirathStepId,
  visibleSteps,
  withHeirCount,
} from "@/lib/mirath/wizard";
import { defaultCurrencyCode } from "@/lib/money-defaults";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";

// Public import path (evidence-registry test) — the list lives with the reference cards.
export { MIRATH_EVIDENCE } from "@/components/mirath/mirath-reference";

/** NF-3.10 inheritance calculator: wizard → estate → results (+ four-school comparison). */
export function MirathCalculator({
  fromWasiyyah = false,
  scrollRef,
}: {
  fromWasiyyah?: boolean;
  /** The screen's scroll view, so "Show shares" can bring the results into view. */
  scrollRef?: RefObject<ScrollViewInstance | null>;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const tv = isTV();
  const { schoolFor } = useMadhhab();
  const school = schoolFor("inheritance");

  const [gender, setGender] = useState<DeceasedGender>("male");
  const [counts, setCounts] = useState<MirathHeirCounts>({});
  const [stepId, setStepId] = useState<MirathStepId>("deceased");
  const [confirmed, setConfirmed] = useState(false);
  const [done, setDone] = useState(false);
  const [estate, setEstate] = useState<MirathEstateDraft>({});
  const [currency, setCurrency] = useState(defaultCurrencyCode);
  const [browse, setBrowse] = useState<MadhhabId>(school ?? "hanafi");
  const [showCompare, setShowCompare] = useState(school == null);

  const { targetRef: resultsRef, reveal } = useRevealOnShow(scrollRef);
  const steps = visibleSteps(counts);
  const index = Math.max(0, steps.indexOf(stepId));
  const current = steps[index] ?? "deceased";
  const heirs = useMemo(() => effectiveCounts(counts, gender), [counts, gender]);

  // TV has no estate form, so it always shows fractions only.
  const estateInput = useMemo(
    () => (tv ? undefined : estateInputFrom(estate, currency)),
    [tv, estate, currency],
  );

  const results = useMemo(
    () =>
      done
        ? calculateAllSchools({
            deceased: { gender },
            heirs,
            ...(estateInput && { estate: estateInput }),
          })
        : null,
    [done, gender, heirs, estateInput],
  );

  // "Show shares" computes below the fold: scroll to the results and move focus there.
  useEffect(() => {
    if (done) reveal();
  }, [done, reveal]);

  const setCount = (heir: HeirType, value: number) => {
    setCounts((c) => withHeirCount(c, heir, value));
    setDone(false);
  };
  const go = (delta: number) => {
    const next = steps[index + delta];
    if (next) setStepId(next);
  };

  const shownSchool: MadhhabId = school ?? browse;
  const shown = results?.[shownSchool];
  const differ = results ? differingHeirs(results) : [];

  return (
    <View style={styles.gap}>
      <JannahCallout tone="warning">{t("mirath.disclaimer")}</JannahCallout>

      <WizardShell
        title={t(`mirath.step.${current}.title`)}
        subtitle={t(`mirath.step.${current}.hint`)}
        stepIndex={index}
        total={steps.length}
        stepLabel={t("mirath.step.progress", { current: index + 1, total: steps.length })}
        progressLabel={t("mirath.step.progressLabel")}
        backLabel={t("mirath.nav.back")}
        onBack={() => go(-1)}
        nextLabel={current === "confirm" ? t("mirath.nav.results") : t("mirath.nav.next")}
        onNext={current === "confirm" ? () => setDone(true) : () => go(1)}
        nextDisabled={current === "confirm" && !confirmed}
      >
        <MirathStepBody
          step={current}
          gender={gender}
          onGenderChange={(g) => {
            setGender(g);
            setDone(false);
          }}
          counts={counts}
          heirs={heirs}
          onCountChange={setCount}
          confirmed={confirmed}
          onConfirmedChange={setConfirmed}
        />
      </WizardShell>

      {!tv ? (
        <MirathEstateCard
          estate={estate}
          onEstateChange={setEstate}
          currency={currency}
          onCurrencyChange={setCurrency}
        />
      ) : null}

      {results && shown ? (
        <>
          {school == null ? (
            <Card>
              <ThemedText type="small" themeColor="mutedForeground">
                {t("mirath.compare.allViewsIntro")}
              </ThemedText>
              <View style={styles.block}>
                <SegmentedControl<MadhhabId>
                  options={MADHHAB_IDS.map((s) => ({ id: s, label: t(`fiqh.school.${s}`) }))}
                  value={browse}
                  onChange={setBrowse}
                />
              </View>
            </Card>
          ) : null}
          {showCompare || school == null ? (
            <MirathCompareTable results={results} selected={shownSchool} />
          ) : null}
          <MirathResultView
            headingRef={resultsRef}
            result={shown}
            school={school}
            currency={estateInput ? currency : undefined}
            highlight={differ}
          />
          {school != null ? (
            <Button
              label={showCompare ? t("mirath.compare.hide") : t("mirath.compare.show")}
              variant="secondary"
              size="sm"
              onPress={() => setShowCompare((v) => !v)}
            />
          ) : null}
          {fromWasiyyah && shown.outcome === "distributed" && school == null ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.wasiyyah.attachSchool", { school: t(`fiqh.school.${shownSchool}`) })}
            </ThemedText>
          ) : null}
          {fromWasiyyah && shown.outcome === "distributed" ? (
            <Button
              label={t("mirath.wasiyyah.attach")}
              onPress={() => {
                offerMirathSnapshot(buildMirathSnapshot(shown));
                goBackOrReplace(router, "/wasiyyah/edit");
              }}
            />
          ) : null}
        </>
      ) : null}

      <MirathReference />
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.three },
  block: { marginTop: Spacing.three },
});
