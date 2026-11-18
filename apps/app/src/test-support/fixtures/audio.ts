import type { AudioTrack } from "@/providers/audio-player-types";

/** Long enough that mid-utterance seeks slice at a word boundary. */
export const TTS_SAMPLE_TEXT = "Alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu";

/** A remote (CDN) audio track; `uri` is derived from `id` unless overridden. */
export function buildAudioTrack(overrides: Partial<AudioTrack> = {}): AudioTrack {
  const id = overrides.id ?? "track-1";
  return {
    id,
    title: `Track ${id}`,
    uri: `https://cdn.test/${id}.mp3`,
    ...overrides,
  };
}

/** A track spoken via platform TTS (no audio file). */
export function buildTtsTrack(
  overrides: Partial<AudioTrack> = {},
  text: string = TTS_SAMPLE_TEXT,
): AudioTrack {
  const id = overrides.id ?? "tts-1";
  return {
    id,
    title: `Speech ${id}`,
    uri: "",
    ttsPlayback: { text, lang: "en" },
    ...overrides,
  };
}
