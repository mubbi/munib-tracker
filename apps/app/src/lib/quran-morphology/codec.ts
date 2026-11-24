/**
 * Packed, delta-encoded occurrence lists for the root index.
 *
 * A location `(surah, ayah, word)` packs into one integer —
 * `surah << 17 | ayah << 8 | word` (surah ≤ 114, ayah ≤ 286 < 512, word ≤ 255) —
 * so sorting the integers sorts by reading order. A list is stored as the
 * base-36 deltas between consecutive sorted codes, comma-separated: dense lists
 * (thousands of nearby words) cost 1–3 characters per occurrence.
 */

export type WordLocation = { surah: number; ayah: number; word: number };

export function packLocation(surah: number, ayah: number, word: number): number {
  return surah * 131_072 + ayah * 256 + word;
}

export function unpackLocation(code: number): WordLocation {
  return {
    surah: Math.floor(code / 131_072),
    ayah: Math.floor(code / 256) % 512,
    word: code % 256,
  };
}

/** Encode location codes (sorted ascending here; duplicates kept). */
export function encodeLocations(codes: readonly number[]): string {
  const sorted = [...codes].sort((a, b) => a - b);
  let prev = 0;
  const parts: string[] = [];
  for (const code of sorted) {
    parts.push((code - prev).toString(36));
    prev = code;
  }
  return parts.join(",");
}

export function decodeLocations(packed: string): number[] {
  if (!packed) return [];
  const out: number[] = [];
  let prev = 0;
  for (const part of packed.split(",")) {
    prev += Number.parseInt(part, 36);
    out.push(prev);
  }
  return out;
}

/** Occurrence count without decoding (one entry per comma-separated delta). */
export function countLocations(packed: string): number {
  if (!packed) return 0;
  let n = 1;
  for (let i = 0; i < packed.length; i++) if (packed.charCodeAt(i) === 44) n++;
  return n;
}
