import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import type { ListenerState } from "@/lib/quran-companion/model/download-job";

/**
 * Whether to offer a recite-along entry point (D68). Same gate as Qur'an practice
 * (no TV — no microphone path), and hidden once the listener store reports that
 * this device or browser cannot run the on-device listener. A listener that is
 * simply not downloaded yet is still "available": the session offers the download.
 *
 * Unlike `isReciteToFindAvailable`, there is no `window` check — that would make the
 * web static render differ from the first client render (hydration mismatch).
 */
export function isReciteAlongAvailable(listener?: Pick<ListenerState, "status"> | null): boolean {
  if (!isPracticeAvailable()) return false;
  return listener?.status !== "unsupported";
}
