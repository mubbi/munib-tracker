import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { AppState } from "react-native";

import { QuranReadingSession, READING_FLUSH_INTERVAL_MS } from "@/lib/quran-reading-session";
import { quranReadingLogStore } from "@/stores/quran-reading-log-store";

function commitReading(date: string, delta: { seconds: number; ayahs: number; pages: number }) {
  void quranReadingLogStore
    .getState()
    .record(date, delta)
    .catch(() => undefined);
}

/**
 * D40: records real Qur'an reading into the daily reading log while a reader
 * screen is focused and the app is in the foreground. Readers report what
 * settles on screen (`noteAyahRange` / `notePage`); the session decides when
 * that counts as reading (see `quran-reading-session.ts`). Returns a stable
 * session object, safe to call from refs/callbacks created once.
 */
export function useQuranReadingRecorder(): QuranReadingSession {
  const [session] = useState(() => new QuranReadingSession(commitReading));

  useFocusEffect(
    useCallback(() => {
      if (AppState.currentState === "active") session.resume();
      const subscription = AppState.addEventListener("change", (state) => {
        if (state === "active") session.resume();
        else session.pause();
      });
      const heartbeat = setInterval(() => session.tick(), READING_FLUSH_INTERVAL_MS);
      return () => {
        subscription.remove();
        clearInterval(heartbeat);
        session.pause();
      };
    }, [session]),
  );

  return session;
}
