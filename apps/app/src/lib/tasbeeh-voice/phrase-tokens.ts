import type { LatticeVariant } from "./ctc-keyword-spotter";
import data from "./phrase-tokens.json";
import type { PhraseKey } from "./phrases";

/**
 * Typed view of the generated `phrase-tokens.json`
 * (`scripts/build-tasbeeh-voice-tokens.mjs`). Locked to the pinned FastConformer
 * `version` — `phrase-tokens.test.ts` fails when the model changes.
 */
export type PhraseTokens = {
  modelVersion: string;
  vocabSha256: string;
  blankId: number;
  vocabSize: number;
  fillers: number[];
  phrases: Record<PhraseKey, { variants: LatticeVariant[] }>;
};

export function phraseTokens(): PhraseTokens {
  return data as unknown as PhraseTokens;
}
