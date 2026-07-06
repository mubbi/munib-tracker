"use client";

import { Loader2, Pause, Play } from "lucide-react";
import { type SyntheticEvent, useRef, useState } from "react";

/** Full Surah Al-Fatiha, Mishary Alafasy — Al-Quran Cloud CDN. */
const AUDIO_SRC = "https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayerDemo() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      setLoading(true);
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    } finally {
      setLoading(false);
    }
  }

  function onTimeUpdate(e: SyntheticEvent<HTMLAudioElement>) {
    setCurrent(e.currentTarget.currentTime);
  }

  function onLoadedMetadata(e: SyntheticEvent<HTMLAudioElement>) {
    setDuration(e.currentTarget.duration);
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-6">
      <h3 className="font-display text-lg font-semibold text-foreground">
        Audio recitation preview
      </h3>
      <p className="mt-1 text-sm text-muted">
        Surah Al-Fatiha, recited by Mishary Alafasy — tap play to listen.
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-border/50 bg-muted-surface/40 p-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause recitation" : "Play recitation"}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-brand to-brand-strong text-white shadow-[0_8px_20px_-6px_color-mix(in_srgb,var(--color-brand)_70%,transparent)] transition-transform active:scale-95"
        >
          {loading ? (
            <Loader2 className="size-5 animate-spin" />
          ) : playing ? (
            <Pause className="size-5 fill-current" />
          ) : (
            <Play className="size-5 translate-x-0.5 fill-current" />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-foreground">Al-Fatiha</p>
            <p className="font-mono text-xs text-muted">
              {formatTime(current)} / {formatTime(duration)}
            </p>
          </div>
          <p dir="rtl" lang="ar" className="mt-0.5 truncate font-serif text-sm text-muted">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border/70">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-gold transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        preload="none"
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onPlaying={() => setLoading(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
      >
        <track kind="captions" label="Recitation" srcLang="ar" default />
      </audio>

      <p className="mt-4 text-xs text-muted">
        Full app: per-ayah and surah playback, reciter selection, and 99 Names play-all mode.
      </p>
    </div>
  );
}
