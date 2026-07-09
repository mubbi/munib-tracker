import { HAJJ_GUIDE_SECTIONS } from "@munib-tracker/shared/content";
import type { HajjGuideStep } from "@munib-tracker/shared/types";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ScreenLayout } from "@/components/screen-layout";
import { Seo } from "@/components/seo/seo";
import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FocusHighlight } from "@/components/ui/focus-highlight";
import { Pill } from "@/components/ui/pill";
import { PressableScale } from "@/components/ui/pressable-scale";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Spacing } from "@/constants/theme";
import { useScreenFocus } from "@/hooks/use-screen-focus";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { localizeList } from "@/lib/content-i18n";
import { overlayList } from "@/lib/content-overlay-registry";
import { goBackOrReplace } from "@/lib/navigation";
import {
  useEnsureHajjChecklistLoaded,
  useHajjChecklist,
  useHajjChecklistActions,
} from "@/stores/hajj-checklist-store";

const TOTAL_STEPS = HAJJ_GUIDE_SECTIONS.reduce((sum, section) => sum + section.steps.length, 0);

function CheckStep({
  step,
  done,
  onToggle,
}: {
  step: HajjGuideStep;
  done: boolean;
  onToggle: () => void;
}) {
  const { colors, tokens } = useThemeTokens();
  return (
    <PressableScale
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={step.title}
      onPress={onToggle}
      scaleTo={0.98}
      haptic="selection"
      style={styles.step}
    >
      <SymbolView
        name={
          done
            ? { ios: "checkmark.circle.fill", android: "check_circle", web: "check_circle" }
            : { ios: "circle", android: "radio_button_unchecked", web: "radio_button_unchecked" }
        }
        size={24}
        tintColor={done ? tokens.status.success.color : colors.mutedForeground}
      />
      <View style={styles.stepCopy}>
        <View style={styles.stepHead}>
          <ThemedText type="smallBold" style={done ? { color: colors.mutedForeground } : undefined}>
            {step.title}
          </ThemedText>
          {step.location ? (
            <Pill
              label={step.location}
              compact
              color={colors.accent}
              background={tokens.accentSoft}
            />
          ) : null}
        </View>
        <ThemedText type="caption" themeColor="mutedForeground">
          {step.body}
        </ThemedText>
      </View>
    </PressableScale>
  );
}

export default function HajjScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  const { scrollRef, register, onScroll, isFocused } = useScreenFocus();
  useEnsureHajjChecklistLoaded();
  const done = useHajjChecklist();
  const { toggle, reset } = useHajjChecklistActions();
  const [resetOpen, setResetOpen] = useState(false);

  // Recompute per locale so translated section titles/summaries/steps render on switch.
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-localize when the app language changes
  const sections = useMemo(
    () => localizeList(HAJJ_GUIDE_SECTIONS, overlayList("HAJJ_GUIDE_SECTIONS")),
    [i18n.language],
  );

  const doneCount = useMemo(() => Object.values(done).filter(Boolean).length, [done]);
  const progress = TOTAL_STEPS > 0 ? doneCount / TOTAL_STEPS : 0;

  return (
    <ScreenLayout
      eyebrow={t("hajj.eyebrow")}
      title={t("hajj.title")}
      subtitle={t("hajj.subtitle")}
      onBack={() => goBackOrReplace(router, "/")}
      scrollRef={scrollRef}
      onScroll={onScroll}
    >
      <Seo path="/hajj" />

      <Card padding="three" style={styles.progressCard}>
        <View style={styles.progressHead}>
          <ThemedText type="smallBold">
            {t("hajj.progress", { done: doneCount, total: TOTAL_STEPS })}
          </ThemedText>
          {doneCount > 0 ? (
            <Button
              label={t("hajj.reset")}
              variant="ghost"
              size="sm"
              onPress={() => setResetOpen(true)}
            />
          ) : null}
        </View>
        <ProgressBar value={progress} height={6} color={tokens.status.success.color} />
      </Card>

      {sections.map((section) => (
        <FocusHighlight key={section.id} ref={register(section.id)} active={isFocused(section.id)}>
          <Card padding="three" style={styles.sectionCard}>
            <View style={styles.sectionHead}>
              <View style={styles.sectionTitleWrap}>
                <ThemedText type="subtitle">{section.title}</ThemedText>
                <ThemedText type="caption" themeColor="mutedForeground">
                  {section.summary}
                </ThemedText>
              </View>
              <Pill
                label={
                  section.day ?? (section.kind === "umrah" ? t("hajj.umrahTag") : t("hajj.hajjTag"))
                }
                color={colors.accentText}
                background={tokens.accentSoft}
              />
            </View>
            <View style={styles.steps}>
              {section.steps.map((step) => (
                <CheckStep
                  key={step.id}
                  step={step}
                  done={!!done[step.id]}
                  onToggle={() => void toggle(step.id)}
                />
              ))}
            </View>
          </Card>
        </FocusHighlight>
      ))}

      <ThemedText type="caption" themeColor="mutedForeground" style={styles.disclaimer}>
        {t("hajj.disclaimer")}
      </ThemedText>

      <ConfirmDialog
        visible={resetOpen}
        title={t("hajj.resetConfirmTitle")}
        message={t("hajj.resetConfirmMsg")}
        confirmLabel={t("hajj.reset")}
        cancelLabel={t("common.cancel")}
        destructive
        onConfirm={() => {
          setResetOpen(false);
          void reset();
        }}
        onCancel={() => setResetOpen(false)}
        onClose={() => setResetOpen(false)}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  progressCard: { gap: Spacing.two },
  progressHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: Spacing.two,
  },
  sectionCard: { gap: Spacing.three },
  sectionHead: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.three,
  },
  sectionTitleWrap: { flex: 1, gap: Spacing.one },
  steps: { gap: Spacing.three },
  step: { flexDirection: "row", alignItems: "flex-start", gap: Spacing.three },
  stepCopy: { flex: 1, gap: Spacing.one },
  stepHead: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: Spacing.two,
  },
  disclaimer: { textAlign: "center", marginTop: Spacing.two },
});
