import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { LabeledIconButton } from "@/components/ui/labeled-icon-button";
import type { ZikrAudioControl } from "@/components/zikr/use-zikr-audio";
import { Spacing, withAlpha } from "@/constants/theme";
import { useThemeTokens } from "@/hooks/use-theme-tokens";
import type { VoiceSteps } from "@/hooks/use-voice-tasbeeh-steps";
import { isTV } from "@/lib/platform/is-tv";

const UNDO = { ios: "arrow.uturn.backward", android: "undo", web: "undo" } as const;
const PLAY = { ios: "play.fill", android: "play_arrow", web: "play_arrow" } as const;
const PAUSE = { ios: "pause.fill", android: "pause", web: "pause" } as const;
const MIC = { ios: "mic.fill", android: "mic", web: "mic" } as const;
const MIC_OFF = { ios: "mic.slash.fill", android: "mic_off", web: "mic_off" } as const;
const CHECK = { ios: "checkmark", android: "check", web: "check" } as const;
const RESET = {
  ios: "arrow.counterclockwise",
  android: "restart_alt",
  web: "restart_alt",
} as const;

type AdhkarActionRowProps = {
  /** The zikr reached its target (Done becomes Reset). */
  done: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onComplete: () => void;
  onReset: () => void;
  /** Recitation of the zikr on screen — Play shows only when it has audio. */
  audio?: ZikrAudioControl;
  /** Hands-free (D69) — shown only where the platform can listen (never on TV). */
  handsFree?: VoiceSteps;
};

/**
 * The guided session's action row: equal-size labelled icon buttons in the
 * Qur'an ayah-row style — Undo · Play · Hands-free · Done. Done is the only
 * emphasised (accent-filled) action and turns into Reset (same shape) once the
 * zikr is complete; unavailable actions are greyed, never hidden, so the row
 * keeps its rhythm (Play / Hands-free only exist when the zikr / device allow).
 */
export function AdhkarActionRow({
  done,
  canUndo,
  onUndo,
  onComplete,
  onReset,
  audio,
  handsFree,
}: AdhkarActionRowProps) {
  const { t } = useTranslation();
  const { colors } = useThemeTokens();
  const well = withAlpha(colors.foreground, 0.06);
  const muted = colors.mutedForeground;
  const showHandsFree = handsFree?.offered === true && !isTV();
  const handsFreeOn = handsFree?.on === true;

  return (
    <View style={styles.row}>
      <LabeledIconButton
        name={UNDO}
        label={t("tasbeehUi.undo")}
        accessibilityLabel={t("tasbeehUi.undo")}
        tintColor={colors.foreground}
        labelColor={colors.foreground}
        background={well}
        disabled={!canUndo}
        accessibilityState={{ disabled: !canUndo }}
        onPress={onUndo}
        style={styles.cell}
      />
      {audio?.available ? (
        <LabeledIconButton
          name={audio.playing ? PAUSE : PLAY}
          label={audio.playing ? t("common.pause") : t("common.play")}
          accessibilityLabel={
            audio.playing ? t("zikrSession.dock.pauseA11y") : t("zikrSession.dock.playA11y")
          }
          accessibilityState={{ selected: audio.playing }}
          tintColor={audio.playing ? colors.accentText : colors.foreground}
          labelColor={audio.playing ? colors.accentText : colors.foreground}
          background={audio.playing ? withAlpha(colors.accent, 0.14) : well}
          haptic="selection"
          onPress={audio.toggle}
          style={styles.cell}
        />
      ) : null}
      {showHandsFree && handsFree ? (
        <LabeledIconButton
          name={handsFreeOn ? MIC_OFF : MIC}
          label={handsFreeOn ? t("tasbeehVoice.toggle.stop") : t("tasbeehVoice.toggle.start")}
          accessibilityLabel={
            handsFreeOn ? t("tasbeehVoice.toggle.a11yStop") : t("tasbeehVoice.toggle.a11yStart")
          }
          accessibilityState={{ selected: handsFreeOn }}
          tintColor={handsFreeOn ? colors.accentText : colors.foreground}
          labelColor={handsFreeOn ? colors.accentText : colors.foreground}
          background={handsFreeOn ? withAlpha(colors.accent, 0.14) : well}
          haptic="selection"
          onPress={handsFree.toggle}
          style={styles.cell}
        />
      ) : null}
      {done ? (
        <LabeledIconButton
          name={RESET}
          label={t("zikrSession.dock.reset")}
          accessibilityLabel={t("zikrSession.markNotDone")}
          accessibilityHint={t("zikrSession.resetHint")}
          tintColor={muted}
          labelColor={muted}
          background={well}
          onPress={onReset}
          style={styles.cell}
        />
      ) : (
        <LabeledIconButton
          name={CHECK}
          label={t("zikrSession.dock.done")}
          accessibilityLabel={t("zikrSession.markComplete")}
          accessibilityHint={t("zikrSession.markCompleteHint")}
          tintColor={colors.accentForeground}
          labelColor={colors.accentForeground}
          background={colors.accent}
          haptic="success"
          onPress={onComplete}
          style={styles.cell}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "stretch", gap: Spacing.two },
  cell: { flex: 1, minWidth: 0, paddingVertical: Spacing.one },
});
