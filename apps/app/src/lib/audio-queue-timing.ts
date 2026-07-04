import { DB_KEYS } from "@/db/keys";
import { readJSON, updateJSON } from "@/db/store";
import type { AudioTrack } from "@/providers/audio-player-provider";

/** Sum cached durations for every track in the queue. */
export function queueDuration(
  tracks: AudioTrack[],
  durations: Readonly<Record<string, number>>,
): number {
  return tracks.reduce((sum, track) => sum + (durations[track.id] ?? 0), 0);
}

/**
 * Queue-wide duration for progress UI. The active track uses
 * `max(cachedDuration, currentPosition)` so underestimates from prefetch/HEAD
 * do not shrink the bar when live playback passes the estimate.
 */
export function queueDurationForProgress(
  tracks: AudioTrack[],
  index: number,
  currentPosition: number,
  durations: Readonly<Record<string, number>>,
): number {
  return tracks.reduce((sum, track, i) => {
    const cached = durations[track.id] ?? 0;
    if (i === index) return sum + Math.max(cached, currentPosition);
    return sum + cached;
  }, 0);
}

/** Start-of-track boundary for a queue index (sum of every prior track). */
export function queueStartBoundary(
  tracks: AudioTrack[],
  index: number,
  durations: Readonly<Record<string, number>>,
): number {
  let elapsed = 0;
  for (let i = 0; i < index; i++) {
    elapsed += durations[tracks[i]?.id ?? ""] ?? 0;
  }
  return elapsed;
}

/** Elapsed time within the queue: completed tracks + current position. */
export function queuePosition(
  tracks: AudioTrack[],
  index: number,
  currentPosition: number,
  durations: Readonly<Record<string, number>>,
): number {
  let elapsed = 0;
  for (let i = 0; i < index; i++) {
    elapsed += durations[tracks[i]?.id ?? ""] ?? 0;
  }
  return elapsed + currentPosition;
}

/** Map a queue-wide timestamp to a track index and offset within that track. */
export function locateQueuePosition(
  tracks: AudioTrack[],
  seconds: number,
  durations: Readonly<Record<string, number>>,
): { index: number; offset: number } {
  if (tracks.length === 0) return { index: 0, offset: 0 };

  let remaining = Math.max(0, seconds);
  for (let i = 0; i < tracks.length; i++) {
    const track = tracks[i];
    if (!track) continue;
    const trackDuration = durations[track.id] ?? 0;
    if (trackDuration <= 0) {
      return { index: i, offset: remaining };
    }
    if (remaining <= trackDuration || i === tracks.length - 1) {
      return { index: i, offset: Math.min(remaining, trackDuration) };
    }
    remaining -= trackDuration;
  }

  const last = tracks.length - 1;
  return { index: last, offset: durations[tracks[last]?.id ?? ""] ?? 0 };
}

/** Parse kbps from everyayah-style reciter directory names, e.g. `Alafasy_128kbps`. */
export function bitrateFromUri(uri: string): number {
  const match = uri.match(/_(\d+)kbps/i);
  return match ? Number(match[1]) * 1000 : 128_000;
}

/** In-memory + persisted cache of HEAD-estimated MP3 durations (static files). */
const durationMemory = new Map<string, number>();
let durationStorageLoaded = false;

async function ensureDurationStorageLoaded(): Promise<void> {
  if (durationStorageLoaded) return;
  const stored = await readJSON<Record<string, number>>(DB_KEYS.audioDurationCache, {});
  for (const [uri, seconds] of Object.entries(stored)) {
    if (Number.isFinite(seconds) && seconds > 0) durationMemory.set(uri, seconds);
  }
  durationStorageLoaded = true;
}

/** Read a previously estimated duration for a remote audio URI (sync, memory only). */
export function getCachedTrackDuration(uri: string): number | undefined {
  const hit = durationMemory.get(uri);
  return hit != null && hit > 0 ? hit : undefined;
}

function rememberTrackDuration(uri: string, seconds: number): void {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  const existing = durationMemory.get(uri);
  if (existing != null && Math.abs(existing - seconds) < 0.25) return;

  durationMemory.set(uri, seconds);
  void updateJSON<Record<string, number>>(DB_KEYS.audioDurationCache, {}, (cache) => {
    cache[uri] = seconds;
    return cache;
  }).catch(() => {
    // storage quota — in-memory cache still helps this session
  });
}

/** Estimate MP3 duration from file size when metadata is not yet loaded. */
export async function estimateDurationFromUri(uri: string): Promise<number | null> {
  if (!uri.startsWith("http")) return null;

  await ensureDurationStorageLoaded();
  const cached = durationMemory.get(uri);
  if (cached != null && cached > 0) return cached;

  try {
    const response = await fetch(uri, { method: "HEAD" });
    if (!response.ok) return null;
    const contentLength = response.headers.get("content-length");
    if (!contentLength) return null;
    const bytes = Number(contentLength);
    if (!Number.isFinite(bytes) || bytes <= 0) return null;
    const seconds = (bytes * 8) / bitrateFromUri(uri);
    rememberTrackDuration(uri, seconds);
    return seconds;
  } catch {
    return null;
  }
}

const PREFETCH_BATCH = 8;

/** Warm duration estimates for a queue so surah-wide timers are available early. */
export async function prefetchTrackDurations(
  tracks: AudioTrack[],
  onDuration: (id: string, seconds: number) => void,
): Promise<void> {
  for (let i = 0; i < tracks.length; i += PREFETCH_BATCH) {
    const batch = tracks.slice(i, i + PREFETCH_BATCH);
    await Promise.all(
      batch.map(async (track) => {
        const estimated = await estimateDurationFromUri(track.uri);
        if (estimated != null && estimated > 0) onDuration(track.id, estimated);
      }),
    );
  }
}
