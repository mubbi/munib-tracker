import { UMRAH_EVIDENCE } from "@munib-tracker/shared/content/umrah-mode";
import { UMRAH_STEPS, type UmrahStep } from "@munib-tracker/shared/types";
import {
  canAdvanceUmrah,
  completedUmrahSessions,
  nextUmrahStep,
  previousUmrahStep,
  umrahStepLockReason,
} from "@munib-tracker/shared/utils";
import { type Href, useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { JannahCallout, JannahDisclaimer } from "@/components/jannah/primitives";
import { ScreenLayout } from "@/components/screen-layout";
import { EvidenceLine } from "@/components/seasonal/evidence-line";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { NavRow } from "@/components/ui/nav-row";
import { SegmentedProgress } from "@/components/ui/progress-bar";
import { SectionHeader } from "@/components/ui/section-header";
import { Stagger } from "@/components/ui/stagger";
import { UmrahStepPanel } from "@/components/umrah/umrah-step-panel";
import { Spacing } from "@/constants/theme";
import { triggerHaptic } from "@/lib/haptics";
import { goBackOrReplace } from "@/lib/navigation";
import { isTV } from "@/lib/platform/is-tv";
import { chevronBackward, useArrowForward } from "@/lib/rtl";
import { routeMetadata } from "@/lib/seo/route-metadata";
import { useUmrahKeepAwake } from "@/lib/umrah/keep-awake";
import {
  isCounterStep,
  UMRAH_MODE_ICON,
  UMRAH_STEP_COUNT,
  UMRAH_STEP_ICONS,
  umrahStepNumber,
} from "@/lib/umrah/steps";
import { usePreferences } from "@/stores/preferences-store";
import {
  useCurrentUmrahSession,
  useEnsureUmrahSessionsLoaded,
  useUmrahSessionActions,
  useUmrahSessions,
  useUmrahSessionsReady,
} from "@/stores/umrah-session-store";

const CHECKLIST_ICON = {
  ios: "list.bullet.clipboard",
  android: "assignment",
  web: "assignment",
} as const;
const GUIDE_ICON = { ios: "book.fill", android: "menu_book", web: "menu_book" } as const;

/**
 * Umrah mode (NF-3.4): a live, step-by-step companion during Umrah — prepare →
 * miqat → ihram → talbiyah → arrive at the Haram → tawaf (7) → two rakahs →
 * Zamzam → sa'i (7) → halq / taqsir → complete. The current step and round
 * counts persist locally (offline-first) and resume where the pilgrim left off;
 * the existing Umrah checklist and Hajj & Umrah guide stay the reference.
 * TV: a read-only overview (no counters or location on a television).
 */
export default function UmrahModeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const tv = isTV();
  useEnsureUmrahSessionsLoaded();
  const ready = useUmrahSessionsReady();
  const session = useCurrentUmrahSession();
  const sessions = useUmrahSessions();
  const actions = useUmrahSessionActions();
  const { activeExcusedReason } = usePreferences();
  const excused = activeExcusedReason ?? null;
  const [confirmEnd, setConfirmEnd] = useState(false);
  const forwardIcon = useArrowForward();
  const completedCount = completedUmrahSessions(sessions).length;

  // Keep the screen on while a counter is in use (phones only).
  useUmrahKeepAwake(!tv && session != null && isCounterStep(session.step));

  const back = () => goBackOrReplace(router, "/hajj" as Href);

  if (tv) {
    return (
      <ScreenLayout
        eyebrow={t("umrahMode.eyebrow")}
        title={t("umrahMode.title")}
        subtitle={t("umrahMode.subtitle")}
        onBack={back}
      >
        <Seo path="/umrah" />
        <Stagger>
          <JannahCallout tone="info">{t("umrahMode.tvNote")}</JannahCallout>
          <StepOverview />
          <JannahDisclaimer textKey="hajj.disclaimer" />
        </Stagger>
      </ScreenLayout>
    );
  }

  if (!session) {
    return (
      <ScreenLayout
        eyebrow={t("umrahMode.eyebrow")}
        title={t("umrahMode.title")}
        subtitle={t("umrahMode.subtitle")}
        onBack={back}
      >
        <Seo path="/umrah" />
        <Stagger>
          <Card padding="three">
            <SectionHeader title={t("umrahMode.intro.title")} icon={UMRAH_MODE_ICON} />
            <View style={styles.body}>
              <ThemedText type="small">{t("umrahMode.intro.body")}</ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t("umrahMode.intro.offline")}
              </ThemedText>
              <EvidenceLine refs={UMRAH_EVIDENCE.umrahVirtue} />
              {completedCount > 0 ? (
                <ThemedText type="caption" themeColor="mutedForeground">
                  {t("umrahMode.intro.completed", { number: completedCount })}
                </ThemedText>
              ) : null}
              <Button
                label={t("umrahMode.start")}
                icon={UMRAH_MODE_ICON}
                disabled={!ready}
                onPress={() => {
                  triggerHaptic("medium");
                  void actions.start();
                }}
                fullWidth
              />
            </View>
          </Card>
          <StepOverview />
          <NavRow
            icon={CHECKLIST_ICON}
            label={t("umrahMode.prepare.checklist")}
            onPress={() => router.push("/umrah/checklist" as Href)}
          />
          <NavRow
            icon={GUIDE_ICON}
            label={t("umrahMode.openGuide")}
            onPress={() => router.push("/hajj" as Href)}
          />
          <JannahDisclaimer textKey="hajj.disclaimer" />
        </Stagger>
      </ScreenLayout>
    );
  }

  const step = session.step;
  const complete = step === "complete";
  const next = nextUmrahStep(step);
  const previous = previousUmrahStep(step);
  const locked = umrahStepLockReason(step, excused, session.tawafLaps) != null;
  const canAdvance = canAdvanceUmrah(session) && !locked;
  const nextLabel =
    next === "complete"
      ? t("umrahMode.finish")
      : next
        ? t("umrahMode.nextStep", { step: t(`umrahMode.step.${next}.title`) })
        : "";

  return (
    <ScreenLayout
      eyebrow={t("umrahMode.eyebrow")}
      title={complete ? t("umrahMode.complete.title") : t(`umrahMode.step.${step}.title`)}
      subtitle={
        complete
          ? t("umrahMode.complete.subtitle")
          : t("umrahMode.stepOf", { number: umrahStepNumber(step), total: UMRAH_STEP_COUNT })
      }
      onBack={back}
    >
      <Seo path="/umrah" />
      <Stagger>
        <SegmentedProgress
          total={UMRAH_STEP_COUNT}
          completed={complete ? UMRAH_STEP_COUNT : umrahStepNumber(step) - 1}
        />

        {complete ? (
          <JannahCallout tone="success">{t("umrahMode.complete.body")}</JannahCallout>
        ) : null}

        <UmrahStepPanel session={session} excusedReason={excused} />

        <View style={styles.nav}>
          {previous ? (
            <Button
              label={t("umrahMode.previous")}
              variant="secondary"
              icon={chevronBackward()}
              onPress={() => void actions.back()}
              style={styles.flex}
            />
          ) : null}
          {next ? (
            <Button
              label={nextLabel}
              trailingIcon={forwardIcon}
              disabled={!canAdvance}
              accessibilityHint={
                canAdvance ? undefined : t(`umrahMode.nextBlocked.${locked ? "locked" : step}`)
              }
              onPress={() => {
                triggerHaptic(next === "complete" ? "success" : "selection");
                void actions.advance();
              }}
              style={styles.flex}
            />
          ) : null}
        </View>
        {!canAdvance && next ? (
          <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
            {t(`umrahMode.nextBlocked.${locked ? "locked" : step}`)}
          </ThemedText>
        ) : null}

        <StepOverview current={step} onSelect={(target) => void actions.goTo(target)} />

        {complete ? (
          <Button
            label={t("umrahMode.startNew")}
            variant="secondary"
            icon={UMRAH_MODE_ICON}
            onPress={() => void actions.start()}
          />
        ) : (
          <Button
            label={t("umrahMode.end")}
            variant="ghost"
            size="sm"
            onPress={() => setConfirmEnd(true)}
          />
        )}

        <JannahDisclaimer textKey="hajj.disclaimer" />
      </Stagger>

      <ConfirmDialog
        visible={confirmEnd}
        title={t("umrahMode.endTitle")}
        message={t("umrahMode.endMessage")}
        confirmLabel={t("umrahMode.end")}
        destructive
        onConfirm={() => void actions.discard()}
        onClose={() => setConfirmEnd(false)}
      />
    </ScreenLayout>
  );
}

/**
 * All steps at a glance. With `onSelect` each row jumps there (a pilgrim may
 * open the app already in ihram); without it (no session / TV) it is a list.
 */
function StepOverview({
  current,
  onSelect,
}: {
  current?: UmrahStep;
  onSelect?: (step: UmrahStep) => void;
}) {
  const { t } = useTranslation();
  const currentIndex = current ? UMRAH_STEPS.indexOf(current) : -1;
  const steps = UMRAH_STEPS.filter((step) => step !== "complete");
  return (
    <CollapsibleSection title={t("umrahMode.allSteps")} defaultOpen={!onSelect}>
      <View style={styles.list}>
        {steps.map((step, index) =>
          onSelect ? (
            <NavRow
              key={step}
              icon={UMRAH_STEP_ICONS[step]}
              label={t("umrahMode.stepRow", {
                number: index + 1,
                step: t(`umrahMode.step.${step}.title`),
              })}
              completed={index < currentIndex}
              badge={step === current ? t("umrahMode.current") : undefined}
              onPress={() => onSelect(step)}
            />
          ) : (
            <View key={step} style={styles.overviewRow}>
              <ThemedText type="smallBold">
                {t("umrahMode.stepRow", {
                  number: index + 1,
                  step: t(`umrahMode.step.${step}.title`),
                })}
              </ThemedText>
              <ThemedText type="caption" themeColor="mutedForeground">
                {t(`umrahMode.step.${step}.body`)}
              </ThemedText>
            </View>
          ),
        )}
      </View>
    </CollapsibleSection>
  );
}

const styles = StyleSheet.create({
  body: { gap: Spacing.two, marginTop: Spacing.two },
  nav: { flexDirection: "row", gap: Spacing.two },
  flex: { flex: 1 },
  center: { textAlign: "center" },
  list: { gap: Spacing.two },
  overviewRow: { gap: Spacing.half },
});

/** Static web <head> from the SEO registry (see src/lib/seo/route-metadata.ts). */
export const generateMetadata = routeMetadata("/umrah");
