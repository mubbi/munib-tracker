import { DUA_ITEMS } from "@munib-tracker/shared/content/duas";
import { ZIKR_ITEMS } from "@munib-tracker/shared/content/zikr";

import { RECITATION_MODELS } from "@/constants/recitation-models";

import { arabicWords, phraseMatchText } from "./arabic-text";
import { phraseForArabic } from "./phrase-display";
import { phraseTokens } from "./phrase-tokens";
import { PHRASE_KEYS, type PhraseRef, phraseForZikr, VOICE_PHRASES } from "./phrases";

const fastConformer = RECITATION_MODELS["tilawa-fastconformer"];
const tokens = phraseTokens();

function resolve(ref: PhraseRef): string {
  const items = ref.corpus === "zikr" ? ZIKR_ITEMS : DUA_ITEMS;
  const item = items.find((i) => i.id === ref.id);
  if (!item) throw new Error(`missing dataset entry ${ref.corpus}:${ref.id}`);
  if (!ref.words) return item.arabic;
  return arabicWords(item.arabic).slice(ref.words[0], ref.words[1]).join(" ");
}

describe("phrase tokens (generated)", () => {
  it("is locked to the pinned FastConformer version — rebuild on any model change", () => {
    // Fails after a model pin change: run `pnpm --filter app tasbeeh-voice:tokens`.
    expect(tokens.modelVersion).toBe(fastConformer.version);
    const vocab = fastConformer.files.find((f) => f.fileName === "vocab.json");
    expect(tokens.vocabSha256).toBe(vocab?.sha256);
    expect(tokens.blankId).toBe(1024);
    expect(tokens.vocabSize).toBe(1025);
  });

  it("matches the bundled dataset text for every phrase and variant (no typed Arabic)", () => {
    for (const key of PHRASE_KEYS) {
      const phrase = VOICE_PHRASES[key];
      const generated = tokens.phrases[key].variants;
      expect(generated.map((v) => v.id)).toEqual(phrase.variants.map((v) => v.id));
      phrase.variants.forEach((variant, i) => {
        const arabic = variant.parts.map(resolve).join(" ");
        expect(generated[i].text).toBe(phraseMatchText(arabic));
      });
    }
  });

  it("can spell every phrase from vocab pieces", () => {
    for (const key of PHRASE_KEYS) {
      for (const variant of tokens.phrases[key].variants) {
        const reach = new Set([0]);
        const edges = [...variant.edges].sort((a, b) => Number(a[0]) - Number(b[0]));
        for (const [pos, , len] of edges)
          if (reach.has(Number(pos))) reach.add(Number(pos) + Number(len));
        expect(reach.has(variant.text.length)).toBe(true);
      }
    }
  });

  it("points every counter id at a real adhkar entry", () => {
    for (const key of PHRASE_KEYS) {
      for (const id of VOICE_PHRASES[key].zikrIds) {
        expect(ZIKR_ITEMS.some((item) => item.id === id)).toBe(true);
        expect(phraseForZikr(id)).toBe(key);
      }
    }
    expect(phraseForZikr("before_sleep-name")).toBeNull();
    expect(phraseForZikr(undefined)).toBeNull();
  });

  it("matches a custom counter's Arabic to a catalog phrase only on an exact (folded) match", () => {
    const tasbih = ZIKR_ITEMS.find((i) => i.id === "after_prayer-tasbih");
    expect(phraseForArabic(tasbih?.arabic)).toBe("subhanallah");
    expect(phraseForArabic("SubhanAllah")).toBeNull();
    expect(phraseForArabic("")).toBeNull();
  });
});
