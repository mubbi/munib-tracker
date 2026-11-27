import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { type StyleProp, StyleSheet, View, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { PressableScale } from "@/components/ui/pressable-scale";
import { BorderWidth, Radius, Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { VoiceSteps } from "@/hooks/use-voice-tasbeeh-steps";
import { isTV } from "@/lib/platform/is-tv";

import { VoiceListeningPanel } from "./voice-listening-panel";
import { VoiceTasbeehSheet } from "./voice-tasbeeh-sheet";
import { VoiceTeachPanel } from "./voice-teach-panel";

const MIC = { ios: "mic.fill", android: "mic", web: "mic" } as const;
const MIC_OFF = { ios: "mic.slash.fill", android: "mic_off", web: "mic_off" } as const;

const STOP_COPY: Partial<Record<NonNullable<VoiceSteps["stopNotice"]>, string>> = {
  silence: "tasbeehVoice.stopped.silence",
  background: "tasbeehVoice.stopped.background",
  interrupted: "tasbeehVoice.stopped.interrupted",
  error: "tasbeehVoice.stopped.error",
};

/**
 * The hands-free on / off switch for a step-by-step counter (guided adhkar
 * session, D69). Hidden where the platform cannot listen (TV, no microphone).
 */
export function VoiceStepToggle({
  steps,
  style,
}: {
  steps: VoiceSteps;
  style?: StyleProp<ViewStyle>;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  if (!steps.offered || isTV()) return null;
  const on = steps.on;
  return (
    <PressableScale
      haptic="selection"
      accessibilityRole="button"
      accessibilityLabel={
        on ? t("tasbeehVoice.toggle.a11yStop") : t("tasbeehVoice.toggle.a11yStart")
      }
      accessibilityState={{ selected: on }}
      onPress={steps.toggle}
      style={[
        styles.toggle,
        { backgroundColor: on ? tokens.accentSoft : withAlpha(colors.foreground, 0.06) },
        style,
      ]}
    >
      <SymbolView name={on ? MIC_OFF : MIC} size={14} tintColor={colors.accentText} />
      <ThemedText weight="semibold" type="caption" style={{ color: colors.accentText }}>
        {on ? t("tasbeehVoice.toggle.stop") : t("tasbeehVoice.toggle.start")}
      </ThemedText>
    </PressableScale>
  );
}

/**
 * Compact hands-free status under a step-by-step counter (D69): teach /
 * re-teach inline (D50), the listening status with the honest counting label
 * (D51 — "tap to correct any miscount"), and the first-use sheet (privacy +
 * microphone). Renders nothing while hands-free is off.
 */
export function VoiceStepPanel({
  steps,
  label,
  hasNext = true,
}: {
  steps: VoiceSteps;
  /** The step's zikr name (dataset title). */
  label: string | null;
  /** Another step follows this one (false on the last one / when all are done). */
  hasNext?: boolean;
}) {
  const { t } = useTranslation();
  const { colors, tokens } = useThemeTokens();
  if (!steps.offered || isTV()) return null;
  const { voice } = steps;
  const teaching = voice.teach.status === "recording";
  const busy = voice.listening || voice.preparing;
  const stopCopy = steps.stopNotice ? STOP_COPY[steps.stopNotice] : undefined;

  let body: ReactNode = null;
  if (teaching) {
    body = (
      <VoiceTeachPanel
        teach={voice.teach}
        label={label}
        level={voice.level}
        speaking={voice.speaking}
        onDone={() => void voice.finishTeaching()}
        onCancel={() => voice.cancelTeaching({ resume: true })}
        compact
      />
    );
  } else if (busy && voice.zikr) {
    body = (
      <View style={styles.stack}>
        <VoiceListeningPanel
          compact
          zikr={voice.zikr}
          countingMode={voice.countingMode}
          listening={voice.listening}
          preparing={voice.preparing}
          level={voice.level}
          stuck={voice.stuck}
          flashKey={voice.flashKey}
          stopReason={null}
          showFocusTip={false}
          suggestReteach={voice.suggestReteach}
          onReteach={steps.teach}
          onDismissReteach={voice.dismissReteach}
        />
        {voice.listening && !voice.suggestReteach ? (
          <PressableScale
            haptic="selection"
            accessibilityRole="button"
            onPress={steps.teach}
            style={styles.link}
          >
            <ThemedText weight="semibold" type="caption" style={{ color: colors.accentText }}>
              {voice.taught ? t("tasbeehVoice.teach.reteach") : t("handsFreeZikr.steps.teachThis")}
            </ThemedText>
          </PressableScale>
        ) : null}
      </View>
    );
  } else if (steps.needsChoice) {
    body = (
      <View
        style={[
          styles.choice,
          {
            backgroundColor: tokens.accentSoft,
            borderColor: withAlpha(colors.accent, tokens.isDark ? 0.4 : 0.25),
          },
        ]}
      >
        <ThemedText type="caption" style={{ color: colors.accentText }}>
          {t("handsFreeZikr.steps.choose", { phrase: label ?? "" })}
        </ThemedText>
        <View style={styles.row}>
          <Button
            label={t("tasbeehVoice.teach.start")}
            size="sm"
            onPress={steps.teach}
            style={styles.flex}
          />
          <Button
            label={t("tasbeehVoice.teach.skip")}
            size="sm"
            variant="secondary"
            onPress={steps.skipTeaching}
            style={styles.flex}
          />
        </View>
      </View>
    );
  } else if (steps.on) {
    body = (
      <ThemedText type="caption" themeColor="mutedForeground" style={styles.center}>
        {steps.eligible ? t("handsFreeZikr.steps.next") : t("handsFreeZikr.steps.tapThisOne")}
      </ThemedText>
    );
    // Between steps of an eligible run there is nothing to say until the mic reopens.
    if (steps.eligible && (!steps.atLimit || !hasNext)) body = null;
  } else if (stopCopy) {
    body = (
      <ThemedText
        type="caption"
        themeColor="mutedForeground"
        accessibilityLiveRegion="polite"
        style={styles.center}
      >
        {t(stopCopy)}
      </ThemedText>
    );
  }

  return (
    <>
      {body}
      <VoiceTasbeehSheet
        visible={steps.sheetOpen}
        onClose={steps.closeSheet}
        voice={voice}
        choosable={false}
        zikr={voice.zikr}
        onChooseZikr={() => {}}
      />
    </>
  );
}

const styles = StyleSheet.create({
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.oneHalf,
    minHeight: 36,
    borderRadius: Radius.pill,
    borderCurve: "continuous",
  },
  stack: { gap: Spacing.one, alignSelf: "stretch" },
  link: { alignSelf: "center", paddingHorizontal: Spacing.two, paddingVertical: Spacing.one },
  choice: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: Radius.lg,
    borderCurve: "continuous",
    borderWidth: BorderWidth.hairline,
    alignSelf: "stretch",
  },
  row: { flexDirection: "row", gap: Spacing.two },
  flex: { flex: 1 },
  center: { textAlign: "center", alignSelf: "stretch" },
});
