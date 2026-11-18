/**
 * Pure PCM conditioning (§7): downmix interleaved channels to mono, then linear
 * resample to 16 kHz. The fractional read position carries across chunks so chunk
 * edges do not click. No whole-take buffer is kept.
 */

export const TARGET_SAMPLE_RATE = 16_000;

export type Resampler = {
  /** Feed one interleaved chunk; returns 16 kHz mono samples (may be empty). */
  push(interleaved: Float32Array, sampleRate: number, channels: number): Float32Array;
  reset(): void;
};

/** Average interleaved channels into one mono channel. */
export function downmix(interleaved: Float32Array, channels: number): Float32Array {
  if (channels <= 1) return interleaved;
  const frames = Math.floor(interleaved.length / channels);
  const out = new Float32Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    for (let c = 0; c < channels; c++) sum += interleaved[f * channels + c];
    out[f] = sum / channels;
  }
  return out;
}

/** Convert little-endian int16 PCM to float32 in [-1, 1]. */
export function int16ToFloat32(buffer: ArrayBuffer): Float32Array {
  const ints = new Int16Array(buffer);
  const out = new Float32Array(ints.length);
  for (let i = 0; i < ints.length; i++) out[i] = ints[i] / 32768;
  return out;
}

export function createResampler(targetRate = TARGET_SAMPLE_RATE): Resampler {
  /** Position (in source frames) of the next output sample, relative to `prev`'s index. */
  let position = 0;
  /** Last source sample of the previous chunk, so interpolation spans the edge. */
  let prev: number | null = null;
  let lastRate = 0;

  return {
    push(interleaved, sampleRate, channels) {
      const mono = downmix(interleaved, Math.max(1, channels));
      if (sampleRate === targetRate) {
        prev = mono.length ? mono[mono.length - 1] : prev;
        return mono;
      }
      if (sampleRate !== lastRate) {
        // A route change (e.g. Bluetooth) can change the rate mid-take: restart cleanly.
        position = 0;
        prev = null;
        lastRate = sampleRate;
      }
      const step = sampleRate / targetRate;
      // Source sequence for this chunk: [prev?, ...mono]. Index 0 is `prev` when present.
      const offset = prev == null ? 0 : 1;
      const sourceLength = mono.length + offset;
      const at = (i: number): number => (i < offset ? (prev as number) : mono[i - offset]);
      const out: number[] = [];
      while (position + 1 < sourceLength) {
        const i = Math.floor(position);
        const frac = position - i;
        out.push(at(i) * (1 - frac) + at(i + 1) * frac);
        position += step;
      }
      // Rebase so the last source sample becomes index 0 of the next chunk.
      position -= sourceLength - 1;
      if (mono.length) prev = mono[mono.length - 1];
      return Float32Array.from(out);
    },
    reset() {
      position = 0;
      prev = null;
      lastRate = 0;
    },
  };
}

/**
 * Accumulates 16 kHz samples and hands out chunks of ~`chunkMs`. Keeps at most
 * `maxQueueMs` waiting; when the engine falls behind the oldest audio is dropped
 * (§7: never run two feeds concurrently, never block the UI).
 */
export function createChunker(chunkMs = 160, maxQueueMs = 2000) {
  const chunkSize = Math.round((TARGET_SAMPLE_RATE * chunkMs) / 1000);
  const maxSamples = Math.round((TARGET_SAMPLE_RATE * maxQueueMs) / 1000);
  let pending: Float32Array[] = [];
  let pendingLength = 0;
  let dropped = 0;

  return {
    push(samples: Float32Array): void {
      if (!samples.length) return;
      pending.push(samples);
      pendingLength += samples.length;
      while (pendingLength > maxSamples && pending.length) {
        const head = pending.shift() as Float32Array;
        pendingLength -= head.length;
        dropped += head.length;
      }
    },
    /** Next full chunk, or null when not enough audio is queued (unless `flush`). */
    take(flush = false): Float32Array | null {
      if (!pendingLength || (!flush && pendingLength < chunkSize)) return null;
      const size = flush ? pendingLength : chunkSize;
      const out = new Float32Array(size);
      let filled = 0;
      while (filled < size && pending.length) {
        const head = pending[0];
        const need = size - filled;
        if (head.length <= need) {
          out.set(head, filled);
          filled += head.length;
          pending.shift();
        } else {
          out.set(head.subarray(0, need), filled);
          pending[0] = head.subarray(need);
          filled += need;
        }
      }
      pendingLength -= size;
      return out;
    },
    get droppedSamples() {
      return dropped;
    },
    reset(): void {
      pending = [];
      pendingLength = 0;
      dropped = 0;
    },
  };
}
