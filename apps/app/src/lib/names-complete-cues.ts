import { NAMES_COMPLETE_TRACK_ID } from "@/lib/audio-tracks";
import cuesData from "../../assets/data/names/names-complete-cues.json";

export type NameCompleteCue = {
  id: string;
  start: number;
  end: number;
};

type NamesCompleteCuesFile = {
  version: number;
  audioUri: string;
  audioRepoSha: string;
  totalDurationSec?: number;
  cues: NameCompleteCue[];
};

const data = cuesData as NamesCompleteCuesFile;

/** Cues sorted by `start` for timeline lookup. */
const sortedCues = [...data.cues].sort((a, b) => a.start - b.start);

const startById = new Map(sortedCues.map((cue) => [cue.id, cue.start]));

export function isNamesCompleteTrack(trackId: string | undefined | null): boolean {
  return trackId === NAMES_COMPLETE_TRACK_ID;
}

/** Name id active at `positionSec` in the continuous recitation, if any. */
export function nameIdAtCueTime(positionSec: number): string | undefined {
  if (positionSec < 0 || sortedCues.length === 0) return undefined;

  for (let i = sortedCues.length - 1; i >= 0; i--) {
    const cue = sortedCues[i];
    if (!cue || positionSec < cue.start) continue;

    if (positionSec < cue.end) return cue.id;

    const next = sortedCues[i + 1];
    if (!next) {
      const limit = data.totalDurationSec ?? cue.end;
      return positionSec <= limit ? cue.id : undefined;
    }
    if (positionSec < next.start) return undefined;
    return undefined;
  }

  return undefined;
}

/** Seek target for a name in the continuous track, if mapped. */
export function cueStartSec(nameId: string): number | undefined {
  return startById.get(nameId);
}
