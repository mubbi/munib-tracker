import { ADHAN_FOLLOW_ALONG_STYLE_ID } from "@/lib/adhan-audio";
import cuesData from "../../assets/data/adhan/medina-phrase-cues.json";

export type AdhanPhraseCue = {
  index: number;
  start: number;
  end: number;
};

type AdhanPhraseCuesFile = {
  version: number;
  styleId: string;
  audioUri: string;
  totalDurationSec?: number;
  cues: AdhanPhraseCue[];
};

const data = cuesData as AdhanPhraseCuesFile;

/** Cues sorted by `start` for timeline lookup. */
const sortedCues = [...data.cues].sort((a, b) => a.start - b.start);

const startByIndex = new Map(sortedCues.map((cue) => [cue.index, cue.start]));

export function isAdhanFollowAlongTrack(trackId: string | undefined | null): boolean {
  return trackId === `adhan:${ADHAN_FOLLOW_ALONG_STYLE_ID}`;
}

/** Phrase step index active at `positionSec` in the Medina follow-along track. */
export function phraseIndexAtCueTime(positionSec: number): number | undefined {
  if (positionSec < 0 || sortedCues.length === 0) return undefined;

  for (let i = sortedCues.length - 1; i >= 0; i--) {
    const cue = sortedCues[i];
    if (!cue || positionSec < cue.start) continue;

    if (positionSec < cue.end) return cue.index;

    const next = sortedCues[i + 1];
    if (!next) {
      const limit = data.totalDurationSec ?? cue.end;
      return positionSec <= limit ? cue.index : undefined;
    }
    if (positionSec < next.start) return cue.index;
  }

  return undefined;
}

/** Seek target (seconds) for a phrase step in the follow-along track. */
export function cueStartSec(index: number): number | undefined {
  return startByIndex.get(index);
}

export function getAdhanFollowAlongCueCount(): number {
  return sortedCues.length;
}
