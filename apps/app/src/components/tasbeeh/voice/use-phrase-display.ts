import { useEffect, useState } from "react";

import { useScriptureTranslation } from "@/hooks/use-scripture-translation";
import { type PhraseDisplay, phraseDisplay } from "@/lib/tasbeeh-voice/phrase-display";
import type { PhraseKey } from "@/lib/tasbeeh-voice/phrases";
import { ensureZikrCorpus, getZikrById } from "@/lib/zikr";

/** Arabic (from the dataset) + translation for the phrase being listened for. */
export function usePhraseDisplay(phrase: PhraseKey | null): {
  arabic: string | null;
  translation: string | null;
} {
  const [display, setDisplay] = useState<PhraseDisplay | null>(() =>
    phrase ? phraseDisplay(phrase, getZikrById) : null,
  );
  useEffect(() => {
    let alive = true;
    if (!phrase) {
      setDisplay(null);
      return;
    }
    void ensureZikrCorpus().then(() => {
      if (alive) setDisplay(phraseDisplay(phrase, getZikrById));
    });
    return () => {
      alive = false;
    };
  }, [phrase]);
  const translation = useScriptureTranslation(display?.item ?? { translation: "" });
  return { arabic: display?.arabic ?? null, translation: display?.item ? translation : null };
}
