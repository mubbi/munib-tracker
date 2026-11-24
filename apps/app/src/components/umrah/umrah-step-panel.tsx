import { UMRAH_EVIDENCE, UMRAH_STEP_CONTENT } from "@munib-tracker/shared/content/umrah-mode";
import type { ExcusedReason, UmrahHairChoice, UmrahSession } from "@munib-tracker/shared/types";
import { stepEnteredAt, umrahLapDurations, umrahStepLockReason } from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { GuideMadhhabNotes } from "@/components/fiqh/guide-madhhab-notes";
import { JannahCallout } from "@/components/jannah/primitives";
import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { ToggleRow } from "@/components/seasonal/toggle-row";
import { ThemedText } from "@/components/themed-text";
import { Card } from "@/components/ui/card";
import { NavRow } from "@/components/ui/nav-row";
import { SectionHeader } from "@/components/ui/section-header";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { DuaByRef } from "@/components/umrah/dua-by-ref";
import { MiqatCard } from "@/components/umrah/miqat-card";
import { RoundCounter } from "@/components/umrah/round-counter";
import { Spacing } from "@/constants/theme";
import { SCREEN_DIFFERENCES } from "@/lib/fiqh/screen-differences";
import { UMRAH_STEP_ICONS } from "@/lib/umrah/steps";
import { useUmrahSessionActions } from "@/stores/umrah-session-store";

const DUA_ICON = {
  ios: "hands.sparkles.fill",
  android: "volunteer_activism",
  web: "volunteer_activism",
} as const;
const GUIDE_ICON = { ios: "book.fill", android: "menu_book", web: "menu_book" } as const;
const CHECKLIST_ICON = {
  ios: "list.bullet.clipboard",
  android: "assignment",
  web: "assignment",
} as const;
const HAYD_ICON = { ios: "drop.circle", android: "water_drop", web: "water_drop" } as const;
const DOUBT_ICON = { ios: "questionmark.circle", android: "help", web: "help" } as const;

type UmrahStepPanelProps = {
  session: UmrahSession;
  excusedReason: ExcusedReason | null;
  /** TV / read-only: counters and location are not interactive. */
  readOnly?: boolean;
};

/**
 * The current step of Umrah mode (NF-3.4): its card (guide copy from i18n),
 * step tools (miqat check, tawaf / sa'i counters, halq choice), duas by
 * reference, madhhab notes, evidence and a link to the full guide topic.
 */
export function UmrahStepPanel({ session, excusedReason, readOnly = false }: UmrahStepPanelProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const actions = useUmrahSessionActions();
  const [lapTimer, setLapTimer] = useState(false);
  const step = session.step;
  const content = UMRAH_STEP_CONTENT[step];
  const lock = umrahStepLockReason(step, excusedReason, session.tawafLaps);

  const counter =
    (step === "tawaf" || step === "sai") && !lock ? (
      <Card padding="three">
        <View style={styles.body}>
          {step === "tawaf" ? (
            <JannahCallout tone="accent">{t("umrahMode.tawaf.startHint")}</JannahCallout>
          ) : (
            <JannahCallout tone="accent">{t("umrahMode.sai.startHint")}</JannahCallout>
          )}
          <RoundCounter
            kind={step}
            laps={step === "tawaf" ? session.tawafLaps : session.saiLaps}
            onCount={() => void actions.countRound(step)}
            onUndo={() => void actions.undoRound(step)}
            durations={umrahLapDurations(session, step)}
            currentStartedAt={currentRoundStart(session, step)}
            showTimer={lapTimer}
            readOnly={readOnly}
          />
          {readOnly ? null : (
            <ToggleRow
              title={t("umrahMode.counter.timer")}
              subtitle={t("umrahMode.counter.timerHint")}
              value={lapTimer}
              onValueChange={setLapTimer}
            />
          )}
        </View>
      </Card>
    ) : null;

  return (
    <View style={styles.root}>
      <Card padding="three">
        <SectionHeader title={t(`umrahMode.step.${step}.title`)} icon={UMRAH_STEP_ICONS[step]} />
        <View style={styles.body}>
          <ThemedText type="small">{t(`umrahMode.step.${step}.body`)}</ThemedText>
          {lock ? (
            <View style={styles.body} testID="umrah-step-locked">
              <JannahCallout tone="warning">{t(`umrahMode.lock.${lock}`)}</JannahCallout>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("umrahMode.lock.wait")}
              </ThemedText>
              <EvidenceLine refs={UMRAH_EVIDENCE.hayd} />
              <NavRow
                icon={HAYD_ICON}
                label={t("umrahMode.lock.haydGuide")}
                onPress={() => router.push("/hayd" as Href)}
              />
            </View>
          ) : null}
          {step === "prepare" ? (
            <>
              <ThemedText type="small" themeColor="mutedForeground">
                {t("umrahMode.prepare.intention")}
              </ThemedText>
              <NavRow
                icon={CHECKLIST_ICON}
                label={t("umrahMode.prepare.checklist")}
                onPress={() => router.push("/umrah/checklist" as Href)}
              />
              <NavRow
                icon={GUIDE_ICON}
                label={t("umrahMode.prepare.prohibitions")}
                onPress={() => router.push("/hajj/ihram-prohibitions" as Href)}
              />
            </>
          ) : null}
          {step === "ihram" ? (
            <NavRow
              icon={GUIDE_ICON}
              label={t("umrahMode.prepare.prohibitions")}
              onPress={() => router.push("/hajj/ihram-prohibitions" as Href)}
            />
          ) : null}
          {step === "miqat" && !readOnly ? (
            <MiqatCard session={session} onSetTravel={(patch) => void actions.setTravel(patch)} />
          ) : null}
          {step === "halq_taqsir" ? (
            <HairChoice
              value={session.hairChoice}
              onChange={(choice) => void actions.setHairChoice(choice)}
              readOnly={readOnly}
            />
          ) : null}
          {step === "sai" ? (
            <ThemedText type="caption" themeColor="mutedForeground">
              {t("umrahMode.sai.purityNote")}
            </ThemedText>
          ) : null}
          <EvidenceLine refs={content.evidence} />
        </View>
      </Card>

      {counter}

      {step === "tawaf" ? (
        <Card padding="three">
          <SectionHeader title={t("umrahMode.tawaf.duasTitle")} icon={DUA_ICON} />
          <View style={styles.body}>
            <ThemedText type="small">{t("umrahMode.tawaf.noFixedDua")}</ThemedText>
            <NavRow
              icon={DUA_ICON}
              label={t("umrahMode.tawaf.myDuas")}
              onPress={() => router.push("/dua/favorites" as Href)}
            />
          </View>
        </Card>
      ) : null}

      <DuaByRef ids={content.duaIds} />

      {step === "tawaf" ? (
        <Card padding="three" variant="muted">
          <SectionHeader title={t("umrahMode.tawaf.doubtTitle")} icon={DOUBT_ICON} />
          <View style={styles.body}>
            <ThemedText type="small">{t("umrahMode.tawaf.doubtBody")}</ThemedText>
            <EvidenceLine refs={UMRAH_EVIDENCE.doubt} />
          </View>
        </Card>
      ) : null}

      {/* NF-3.0a: wudu for tawaf — a condition for most schools, wajib for Hanafis. */}
      {step === "tawaf" ? <GuideMadhhabNotes ids={SCREEN_DIFFERENCES["/umrah#tawaf"]} /> : null}
      {/* NF-3.0a: the least a man may shorten differs (¼ of the head / three hairs / the whole head). */}
      {step === "halq_taqsir" ? (
        <GuideMadhhabNotes ids={SCREEN_DIFFERENCES["/umrah#halq_taqsir"]} />
      ) : null}

      {step === "complete" ? (
        <Card padding="three">
          <SectionHeader title={t("umrahMode.complete.duaTitle")} icon={DUA_ICON} />
          <View style={styles.body}>
            <ThemedText type="small">{t("umrahMode.complete.duaBody")}</ThemedText>
            <NavRow
              icon={DUA_ICON}
              label={t("umrahMode.tawaf.myDuas")}
              onPress={() => router.push("/dua/favorites" as Href)}
            />
            <NavRow
              icon={DUA_ICON}
              label={t("umrahMode.complete.browseDuas")}
              onPress={() => router.push("/dua" as Href)}
            />
          </View>
        </Card>
      ) : null}

      {content.guideTopicId ? (
        <NavRow
          icon={GUIDE_ICON}
          label={t("umrahMode.readGuide")}
          onPress={() => router.push(`/hajj/${content.guideTopicId}` as Href)}
        />
      ) : null}
    </View>
  );
}

/** Start of the round in progress: the last counted round, or entering the step. */
function currentRoundStart(session: UmrahSession, kind: "tawaf" | "sai"): string | undefined {
  const times = (kind === "tawaf" ? session.tawafLapTimes : session.saiLapTimes) ?? [];
  const last = times[times.length - 1];
  return last ?? stepEnteredAt(session, kind);
}

function HairChoice({
  value,
  onChange,
  readOnly,
}: {
  value: UmrahHairChoice | undefined;
  onChange: (choice: UmrahHairChoice) => void;
  readOnly: boolean;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.body}>
      <ThemedText type="smallBold">{t("umrahMode.halq.menTitle")}</ThemedText>
      {readOnly ? null : (
        <SegmentedControl
          options={[
            { id: "halq", label: t("umrahMode.halq.halq") },
            { id: "taqsir", label: t("umrahMode.halq.taqsir") },
          ]}
          value={value ?? "halq"}
          onChange={onChange}
        />
      )}
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("umrahMode.halq.menBody")}
      </ThemedText>
      <ThemedText type="smallBold">{t("umrahMode.halq.womenTitle")}</ThemedText>
      <ThemedText type="caption" themeColor="mutedForeground">
        {t("umrahMode.halq.womenBody")}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { gap: Spacing.three },
  body: { gap: Spacing.two, marginTop: Spacing.two },
});
