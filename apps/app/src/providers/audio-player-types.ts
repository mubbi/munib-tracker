import type {
  QuranRepeatMode,
  QuranRepeatPlan,
  QuranTranslationAudio,
} from "@munib-tracker/shared/types";

export type AudioTrack = {
  id: string;
  title: string;
  subtitle?: string;
  /** Short preview shown in the expanded player playlist (e.g. ayah opening). */
  preview?: string;
  /** Expanded-player playlist primary line (defaults to subtitle || title). */
  playlistPrimary?: string;
  /** Expanded-player playlist secondary line (defaults to preview). */
  playlistSecondary?: string;
  /** When true, `playlistPrimary` uses Arabic typography. */
  playlistPrimaryRtl?: boolean;
  uri: string;
  /** Bundled asset module (from `require()`), used instead of `uri` when set. */
  source?: number;
  /**
   * When set, the mini-player speaks this text via platform TTS instead of
   * loading `uri`. Enables pause/rate/next for custom-adhkar listen.
   */
  ttsPlayback?: {
    text: string;
    lang: string;
    voice?: string;
  };
  /** Optional translation text spoken after the Arabic track via native TTS. */
  tts?: {
    text: string;
    lang: string;
    voice?: string;
  };
  /**
   * Clip playback within `uri` (seconds). Used for Learn Qur'an example phrases
   * cut from an everyayah ayah file via word-segment timings.
   */
  clipStart?: number;
  clipEnd?: number;
};

export type LoopMode = "off" | "all" | "one";

export type TranslationAudioMode = QuranTranslationAudio;
export type { QuranRepeatMode, QuranRepeatPlan };
