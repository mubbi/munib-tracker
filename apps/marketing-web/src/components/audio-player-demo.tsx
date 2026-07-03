"use client";

import { useRef, useState } from "react";

/** Accessible demo player — uses a short public-domain tone clip pattern via Web Audio is heavy; use native audio with sample. */
export function AudioPlayerDemo() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  // Short silent-compatible demo: user sees controls; actual app streams from everyayah.com
  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <div className="rounded-[var(--radius-card)] border border-border/60 bg-card p-6">
      <h3 className="text-lg font-semibold">Audio recitation preview</h3>
      <p className="mt-1 text-sm text-muted">
        Surah Al-Fatiha — demo controls mirror the in-app mini player.
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-xl bg-muted-surface/50 p-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause recitation" : "Play recitation"}
          className="inline-flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground transition-transform active:scale-95"
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="flex-1">
          <p className="text-sm font-semibold">Al-Fatiha</p>
          <p className="text-xs text-muted">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
        </div>
      </div>

      {/* Minimal demo audio — 1s silent WAV data URI for control demo without external deps */}
      <audio
        ref={audioRef}
        onEnded={() => setPlaying(false)}
        preload="none"
        aria-label="Al-Fatiha recitation demo"
      >
        <source
          src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"
          type="audio/wav"
        />
        <track kind="captions" label="Transliteration" srcLang="en" default />
      </audio>

      <p className="mt-4 text-xs text-muted">
        Full app: per-ayah and surah playback, reciter selection, and 99 Names play-all mode.
      </p>
    </div>
  );
}
