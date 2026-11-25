import { Platform } from "react-native";
import { isPracticeAvailable } from "@/lib/quran-companion/availability";
import type { ListenerState } from "@/lib/quran-companion/model/download-job";

/**
 * Whether to offer the Recite mode at all. Same gate as Qur'an practice (no TV,
 * which has no microphone path), and hidden once the listener store says this
 * device or browser cannot run the on-device listener. A missing download is
 * not "unavailable" — the panel offers the download instead.
 */
export function isReciteToFindAvailable(listener?: Pick<ListenerState, "status"> | null): boolean {
  if (!isPracticeAvailable()) return false;
  if (Platform.OS === "web" && typeof window === "undefined") return false;
  return listener?.status !== "unsupported";
}
