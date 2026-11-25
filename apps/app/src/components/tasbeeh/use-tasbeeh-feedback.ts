import { type RefObject, useCallback, useContext } from "react";

import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { getDesign, resolveSoundPack } from "@/lib/tasbeeh/designs";
import { feedbackFor, playHapticPattern, type TasbeehFeedbackEvent } from "@/lib/tasbeeh/feedback";
import { materialFor } from "@/lib/tasbeeh/materials";
import { useTasbeehAppearance } from "@/lib/tasbeeh/use-tasbeeh-appearance";
import { useTasbeehSound } from "@/lib/tasbeeh/use-tasbeeh-sound";
import { AudioContext } from "@/providers/audio-player-context";

/**
 * The one feedback path for every tasbeeh counter surface (the main counter and
 * the sticky dock): the user's design, haptic level and sound pack decide what
 * a count feels and sounds like — so the dock never disagrees with the counter.
 *
 * `soundMutedRef`: while hands-free listening the microphone would hear the
 * counter's sounds, so they are skipped (haptics stay on).
 */
export function useTasbeehFeedback(soundMutedRef?: RefObject<boolean>) {
  const { colors } = useThemeTokens();
  const appearance = useTasbeehAppearance();
  const design = getDesign(appearance.design);
  const sharedPlaying = useContext(AudioContext)?.isPlaying ?? false;
  const playSound = useTasbeehSound({
    enabled: appearance.sound.enabled,
    pack: resolveSoundPack(
      appearance,
      materialFor(appearance.misbaha.material, colors.accent).sound,
    ),
    volume: appearance.sound.volume,
    sharedPlaying,
  });

  const dispatch = useCallback(
    (event: TasbeehFeedbackEvent) => {
      const feedback = feedbackFor(design.id, event, appearance.haptics);
      playHapticPattern(feedback.haptics);
      if (feedback.sound && appearance.sound.enabled && !soundMutedRef?.current) {
        playSound(feedback.sound);
      }
    },
    [design.id, appearance.haptics, appearance.sound.enabled, playSound, soundMutedRef],
  );

  return { dispatch, appearance, design };
}
