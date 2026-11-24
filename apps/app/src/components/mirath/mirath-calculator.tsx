import { MADHHAB_IDS, type MadhhabId } from "@munib-tracker/shared/fiqh";
import {
  calculateAllSchools,
  differingHeirs,
  type HeirType,
  type MirathEstateInput,
  type MirathHeirCounts,
} from "@munib-tracker/shared/mirath";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { MadhhabNote } from "@/components/fiqh/madhhab-note";
import { JannahCallout, JannahNavRow } from "@/components/jannah/primitives";
import { MirathCompareTable, MirathResultView } from "@/components/mirath/mirath-results";
import { AmountInput } from "@/components/records/amount-input";
import { EvidenceCard, type EvidenceItem } from "@/components/records/evidence-card";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stepper } from "@/components/ui/stepper";
import { ThemedSwitch } from "@/components/ui/themed-switch";
import { useRequireVaultUnlock } from "@/components/vault";
import { CurrencyPickerSheet } from "@/components/zakat/currency-picker-sheet";
import { Spacing } from "@/constants/theme";
import { useMadhhab } from "@/hooks/use-madhhab";
import { SCREEN_DIFFERENCES } from "@/lib/fiqh/screen-differences";
import { readOpenDebtsTotal } from "@/lib/mirath/debts-prefill";
import { heirLabelKey } from "@/lib/mirath/explain";
import { buildMirathSnapshot, offerMirathSnapshot } from "@/lib/mirath/wasiyyah-handoff";
import {
  type DeceasedGender,
  effectiveCounts,
  heirsForStep,
  isHeirAsked,
  type MirathStepId,
  maxCountFor,
  siblingsOnlyCountForMother,
  totalHeads,
  visibleSteps,
} from "@/lib/mirath/wizard";
import { defaultCurrencyCode } from "@/lib/money-defaults";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";

const MIRATH_DIFFERENCES = SCREEN_DIFFERENCES["/mirath"];

/** Evidence card (docs/proofs/mirath.md §1) — Qur'an refs deep-link; hadith lines are citations. */
export const MIRATH_EVIDENCE: readonly EvidenceItem[] = [
  { key: "mirath.evidence.children", quran: { surah: 4, ayah: 11 } },
  { key: "mirath.evidence.spouses", quran: { surah: 4, ayah: 12 } },
  { key: "mirath.evidence.siblings", quran: { surah: 4, ayah: 176 } },
  { key: "mirath.evidence.residue" },
  { key: "mirath.evidence.religion" },
  { key: "mirath.evidence.killer" },
];

type EstateDraft = { gross?: number; funeral?: number; debts?: number; bequests?: number };

/** NF-3.10 inheritance calculator: wizard → estate → results (+ four-school comparison). */
export function MirathCalculator({ fromWasiyyah = false }: { fromWasiyyah?: boolean }) {
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
  const [estate, setEstate] = useState<EstateDraft>({});
  const [estateKey, setEstateKey] = useState(0);
  const [currency, setCurrency] = useState(defaultCurrencyCode);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [debtsNote, setDebtsNote] = useState<string | null>(null);
  const [estateOpen, setEstateOpen] = useState(false);
  const [browse, setBrowse] = useState<MadhhabId>(school ?? "hanafi");
  const [showCompare, setShowCompare] = useState(school == null);
  const { requireVaultUnlock, unlockPrompt } = useRequireVaultUnlock();

  const steps = visibleSteps(counts);
  const index = Math.max(0, steps.indexOf(stepId));
  const current = steps[index] ?? "deceased";
  const heirs = useMemo(() => effectiveCounts(counts, gender), [counts, gender]);

  const estateInput = useMemo<MirathEstateInput | undefined>(
    () =>
      !tv && (estate.gross ?? 0) > 0
        ? {
            gross: estate.gross ?? 0,
            funeral: estate.funeral ?? 0,
            debts: estate.debts ?? 0,
            bequests: estate.bequests ?? 0,
            currency,
          }
        : undefined,
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

  const setCount = (heir: HeirType, value: number) => {
    setCounts((c) => ({ ...c, [heir]: Math.max(0, Math.min(maxCountFor(heir), value)) }));
    setDone(false);
  };
  const go = (delta: number) => {
    const next = steps[index + delta];
    if (next) setStepId(next);
  };

  const shownSchool: MadhhabId = school ?? browse;
  const shown = results?.[shownSchool];
  const differ = results ? differingHeirs(results) : [];

  const prefillDebts = async () => {
    if (!(await requireVaultUnlock())) return;
    const total = await readOpenDebtsTotal(currency);
    if (total == null) {
      setDebtsNote(t("mirath.estate.debtsUnavailable"));
      return;
    }
    setEstate((e) => ({ ...e, debts: total > 0 ? total : undefined }));
    setEstateKey((k) => k + 1);
    setDebtsNote(total > 0 ? t("mirath.estate.debtsFilled") : t("mirath.estate.debtsNone"));
  };

  const stepBody = (() => {
    if (current === "deceased") {
      return (
        <SegmentedControl<DeceasedGender>
          options={[
            { id: "male", label: t("mirath.deceased.male") },
            { id: "female", label: t("mirath.deceased.female") },
          ]}
          value={gender}
          onChange={(g) => {
            setGender(g);
            setDone(false);
          }}
        />
      );
    }
    if (current === "confirm") {
      return (
        <View style={styles.gap}>
          {(["muslim", "alive", "notKiller"] as const).map((k) => (
            <ThemedText key={k} type="small">
              {`• ${t(`mirath.confirm.${k}`)}`}
            </ThemedText>
          ))}
          <View style={styles.switchRow}>
            <ThemedText type="smallBold" style={styles.flex}>
              {t("mirath.confirm.toggle")}
            </ThemedText>
            <ThemedSwitch
              value={confirmed}
              onValueChange={setConfirmed}
              accessibilityLabel={t("mirath.confirm.toggle")}
            />
          </View>
          {totalHeads(heirs) === 0 ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("mirath.confirm.noHeirs")}
            </ThemedText>
          ) : null}
        </View>
      );
    }
    return (
      <View style={styles.gap}>
        {heirsForStep(current, gender)
          .filter((h) => isHeirAsked(h, counts))
          .map((h) => (
            <View key={h} style={styles.heirRow}>
              <ThemedText type="small" style={styles.flex}>
                {t(heirLabelKey(h))}
              </ThemedText>
              <Stepper
                value={counts[h] ?? 0}
                label={t(heirLabelKey(h))}
                onIncrement={() => setCount(h, (counts[h] ?? 0) + 1)}
                onDecrement={() => setCount(h, (counts[h] ?? 0) - 1)}
              />
            </View>
          ))}
        {current === "grandparents" ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("mirath.step.grandparents.note")}
          </ThemedText>
        ) : null}
        {current === "siblings" && siblingsOnlyCountForMother(counts) ? (
          <ThemedText type="caption" themeColor="mutedForeground">
            {t("mirath.step.siblings.withFatherNote")}
          </ThemedText>
        ) : null}
      </View>
    );
  })();

  return (
    <View style={styles.gap}>
      <JannahCallout tone="warning">{t("mirath.disclaimer")}</JannahCallout>

      <Card padding="three">
        <SectionHeader
          title={t(`mirath.step.${current}.title`)}
          icon={{ ios: "person.3.fill", android: "groups", web: "groups" }}
        />
        <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
          {t("mirath.step.progress", { current: index + 1, total: steps.length })}
          {" · "}
          {t(`mirath.step.${current}.hint`)}
        </ThemedText>
        <View style={styles.block}>{stepBody}</View>
        <View style={styles.nav}>
          {index > 0 ? (
            <Button
              label={t("mirath.nav.back")}
              variant="secondary"
              size="sm"
              onPress={() => go(-1)}
            />
          ) : null}
          <View style={styles.flex} />
          {current === "confirm" ? (
            <Button
              label={t("mirath.nav.results")}
              size="sm"
              disabled={!confirmed}
              onPress={() => setDone(true)}
            />
          ) : (
            <Button label={t("mirath.nav.next")} size="sm" onPress={() => go(1)} />
          )}
        </View>
      </Card>

      {!tv ? (
        // Optional: collapsed until wanted, so "Show shares" lands next to the results.
        <Card padding="three">
          <CollapsibleSection
            title={t("mirath.estate.title")}
            icon={{ ios: "banknote.fill", android: "payments", web: "payments" }}
            open={estateOpen}
            onOpenChange={setEstateOpen}
          >
            <ThemedText type="caption" themeColor="mutedForeground" style={styles.hint}>
              {t("mirath.estate.hint")}
            </ThemedText>
            <JannahNavRow
              icon={{ ios: "coloncurrencysign.circle", android: "payments", web: "payments" }}
              title={t("mirath.estate.currency")}
              subtitle={currency}
              onPress={() => setCurrencyOpen(true)}
            />
            <View key={estateKey} style={styles.gap}>
              <AmountInput
                label={t("mirath.estate.gross")}
                value={estate.gross}
                onChange={(gross) => setEstate((e) => ({ ...e, gross }))}
              />
              <AmountInput
                label={t("mirath.estate.funeral")}
                value={estate.funeral}
                onChange={(funeral) => setEstate((e) => ({ ...e, funeral }))}
              />
              <AmountInput
                label={t("mirath.estate.debts")}
                hint={t("mirath.estate.debtsHint")}
                value={estate.debts}
                onChange={(debts) => setEstate((e) => ({ ...e, debts }))}
              />
              <AmountInput
                label={t("mirath.estate.bequests")}
                hint={t("mirath.estate.bequestsHint")}
                value={estate.bequests}
                onChange={(bequests) => setEstate((e) => ({ ...e, bequests }))}
              />
            </View>
            <View style={styles.nav}>
              <Button
                label={t("mirath.estate.useDebts")}
                variant="ghost"
                size="sm"
                onPress={() => void prefillDebts()}
              />
            </View>
            {debtsNote ? (
              <ThemedText type="caption" themeColor="mutedForeground">
                {debtsNote}
              </ThemedText>
            ) : null}
          </CollapsibleSection>
        </Card>
      ) : null}

      {results && shown ? (
        <>
          {school == null ? (
            <Card padding="three">
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

      {/* Advanced fiqh detail: collapsed so the calculator stays the focus. */}
      <Card padding="three">
        <CollapsibleSection
          title={t("mirath.differences.title")}
          icon={{ ios: "book.closed", android: "menu_book", web: "menu_book" }}
        >
          <View style={[styles.gap, styles.block]}>
            {MIRATH_DIFFERENCES.map((id) => (
              <MadhhabNote key={id} id={id} />
            ))}
          </View>
        </CollapsibleSection>
      </Card>

      <Card padding="three">
        <SectionHeader
          title={t("mirath.outOfScope.title")}
          icon={{
            ios: "person.fill.questionmark",
            android: "contact_support",
            web: "contact_support",
          }}
        />
        <View style={[styles.gap, styles.block]}>
          {(
            ["unborn", "missing", "simultaneous", "khuntha", "wala", "deeper", "kindred"] as const
          ).map((k) => (
            <ThemedText key={k} type="small">
              {`• ${t(`mirath.outOfScope.${k}`)}`}
            </ThemedText>
          ))}
          <ThemedText type="smallBold">{t("mirath.outOfScope.consult")}</ThemedText>
        </View>
      </Card>

      <EvidenceCard titleKey="mirath.evidence.title" items={MIRATH_EVIDENCE} />

      <CurrencyPickerSheet
        visible={currencyOpen}
        selectedCode={currency}
        onSelect={(code) => {
          setCurrency(code);
          setCurrencyOpen(false);
        }}
        onClose={() => setCurrencyOpen(false)}
      />
      {unlockPrompt}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: Spacing.three },
  flex: { flex: 1, minWidth: 0 },
  hint: { marginTop: Spacing.one, lineHeight: 20 },
  block: { marginTop: Spacing.three },
  nav: { flexDirection: "row", alignItems: "center", gap: Spacing.two, marginTop: Spacing.three },
  heirRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  switchRow: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
});
