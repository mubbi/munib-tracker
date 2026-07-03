import type { AudioTrack } from "@/providers/audio-player-provider";

/**
 * Bundled adhan-call audio (D11). The MP3 is `require()`d (Metro bundles it as
 * an asset — no native dependency) and played through the shared audio player.
 * Use a relative path: `require()` does not resolve the `@/` alias under Metro.
 */
const ADHAN_DEFAULT = require("../../assets/audio/adhan/adhan.mp3") as number;

export interface AdhanStyle {
  id: string;
  name: string;
  source: number;
}

export const ADHAN_STYLES: AdhanStyle[] = [{ id: "default", name: "Adhan", source: ADHAN_DEFAULT }];

export const DEFAULT_ADHAN_STYLE = "default";

/** Build an `AudioTrack` for a bundled adhan style. */
export function adhanTrack(styleId: string = DEFAULT_ADHAN_STYLE): AudioTrack {
  const style = ADHAN_STYLES.find((s) => s.id === styleId) ?? ADHAN_STYLES[0];
  return {
    id: `adhan:${style.id}`,
    title: style.name,
    subtitle: "Call to prayer",
    uri: "",
    source: style.source,
  };
}
