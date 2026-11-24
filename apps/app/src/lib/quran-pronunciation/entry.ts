/**
 * Entry points for NF-3.24 "Check pronunciation": the practice session route in
 * its own mode (`/quran/practice/session?mode=pronunciation`). Kept out of
 * `SessionMode` on purpose — stored sessions use the existing `follow` mode so
 * older clients never meet an unknown mode.
 */
export const PRONUNCIATION_MODE = "pronunciation" as const;

export function pronunciationCheckHref(
  surah: number,
  from: number,
  to: number = from,
  source: "reader" | "hub" = "hub",
) {
  return {
    pathname: "/quran/practice/session" as const,
    params: {
      surah: String(surah),
      from: String(from),
      to: String(to),
      mode: PRONUNCIATION_MODE,
      source,
    },
  };
}
