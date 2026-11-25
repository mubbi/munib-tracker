import { LESSON_DRILL_HEAD } from "@/lib/quran-companion/pronunciation/judge";
import { isReciteAlongAvailable } from "@/lib/recite-along/availability";
import { useListenerState } from "@/stores/quran-listener-store";
import {
  useEnsurePronunciationLoaded,
  usePronunciationState,
} from "@/stores/quran-pronunciation-store";

/**
 * The one availability check for every recite-along entry point (D68): false on
 * TV (no microphone path) and once the on-device listener reports this runtime
 * unsupported. Use it instead of `isPracticeAvailable()` in recite-along UI.
 */
export function useReciteAlongAvailable(): boolean {
  const listener = useListenerState();
  return isReciteAlongAvailable(listener);
}

/**
 * Whether the tajweed pronunciation drill for a lesson (`/learn-quran/tajweed/drill/[id]`)
 * can be offered: the lesson has a drill head, recite-along is available, and the
 * loaded calibration does not rule that sound unreliable. Before the listener is
 * set up the heads are unknown, so the entry shows and the drill screen explains.
 */
export function useTajweedDrillAvailable(lessonId: string | undefined): boolean {
  const available = useReciteAlongAvailable();
  useEnsurePronunciationLoaded();
  const pronunciation = usePronunciationState();
  const head = lessonId ? LESSON_DRILL_HEAD[lessonId] : undefined;
  return (
    !!head &&
    available &&
    pronunciation.status !== "unavailable" &&
    (pronunciation.cached == null || pronunciation.cached.reliable.includes(head))
  );
}
