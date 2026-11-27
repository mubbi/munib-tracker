import { RECITATION_MODELS } from "@/constants/recitation-models";
import { createFastConformerRunner } from "@/lib/speech/fastconformer-runner";

import { createChunker } from "../audio/resample";
import { PracticeError, reportPracticeError, toPracticeErrorCode } from "../error-codes";
import { mapTilawaEvent, type TilawaMessage } from "../map-tilawa-event";
import type { LoadedModelAssets } from "../model/types";
import type { CompanionEvent, EngineId, Passage } from "../types";
import type { EngineMode, EnginePlatform, OrtNamespace, RecitationEngine } from "./types";

/**
 * Shared Tilawa adapter (§8). `@tilawa/core` is imported dynamically so the
 * reader, home and `__common` bundles never load it — only the practice route.
 *
 * Correction issues are acknowledged with `review_later` straight away: the
 * session screen never pauses a take mid-word (§9.2), and acknowledging lets the
 * controller raise the next issue in the same take.
 *
 * Free recitation (recite-to-find, D68): `freeRecitation: true` builds the same
 * engine for "which ayah is this?" instead of a known passage. The Zipformer
 * session is created with `stayOnSurah: false` (so it can relocate anywhere in
 * the Qur'an when the reciter moves on), always runs in tracking mode with no
 * expected passage, and the mapper also forwards the verse-level messages
 * (`verse_match` → `verseMatch`, `verse_candidate` → `verseCandidates`,
 * `final_sequence` → `verseSequence`). FastConformer already discovers over the
 * whole Qur'an, so only the mapping changes for it.
 */

export type TilawaEngineOptions = {
  /** Recite-to-find: no passage, whole-Qur'an lookup, verse-level events. */
  freeRecitation?: boolean;
};

type ZipformerLike = {
  feed(samples: Float32Array): Promise<TilawaMessage[]>;
  stop(): Promise<TilawaMessage[]>;
  reset(): TilawaMessage[];
  setMode(mode: EngineMode): TilawaMessage[];
  setExpected(passage: { surah: number; ayah: number; ayahEnd?: number } | null): void;
  correct(action: "review_later"): TilawaMessage[];
};

type FastConformerLike = {
  feed(samples: Float32Array): Promise<TilawaMessage[]>;
  stop(): Promise<TilawaMessage[]>;
  reset(): void;
};

type CorpusJson = { surahs?: { ayahs?: { w?: [string, string, string][] }[] }[] };
type QuranRow = { surah: number; ayah: number; text_uthmani?: string };

function zipformerWords(corpus: unknown, surah: number, ayah: number): string[] {
  const c = corpus as CorpusJson;
  const words = c?.surahs?.[surah - 1]?.ayahs?.[ayah - 1]?.w;
  return Array.isArray(words) ? words.map((w) => w?.[2] ?? "") : [];
}

function fastconformerWordsFactory(quran: unknown): (surah: number, ayah: number) => string[] {
  const index = new Map<string, string>();
  if (Array.isArray(quran)) {
    for (const row of quran as QuranRow[]) {
      if (row?.text_uthmani) index.set(`${row.surah}:${row.ayah}`, row.text_uthmani);
    }
  }
  return (surah, ayah) => (index.get(`${surah}:${ayah}`) ?? "").split(/\s+/).filter(Boolean);
}

export async function createTilawaEngine(
  engineId: EngineId,
  assets: LoadedModelAssets,
  platform: EnginePlatform,
  engineOptions: TilawaEngineOptions = {},
): Promise<RecitationEngine> {
  const spec = RECITATION_MODELS[engineId];
  const free = engineOptions.freeRecitation === true;
  const listeners = new Set<(event: CompanionEvent) => void>();
  const emit = (event: CompanionEvent) => {
    for (const l of listeners) l(event);
  };

  let ort: OrtNamespace;
  let inference: Awaited<ReturnType<EnginePlatform["createSession"]>>;
  try {
    ort = await platform.loadOrt();
    inference = await platform.createSession(ort, assets);
  } catch (error) {
    const code = toPracticeErrorCode(error, "engine-init-failed");
    reportPracticeError(error, code, "engine-init");
    throw new PracticeError(code, (error as Error)?.message);
  }

  const tilawa = await import("@tilawa/core");
  let zipformer: ZipformerLike | null = null;
  let fastconformer: FastConformerLike | null = null;
  let engineWords: (surah: number, ayah: number) => string[];

  if (engineId === "tilawa-zipformer") {
    const corpus = assets.json["zipformer_quran.json"];
    zipformer = (await tilawa.createZipformerSession({
      session: inference as never,
      Tensor: ort.Tensor as never,
      corpus,
      // Practice stays on the passage's surah; free lookup must be able to move.
      stayOnSurah: !free,
    })) as unknown as ZipformerLike;
    engineWords = (s, a) => zipformerWords(corpus, s, a);
  } else {
    const quran = assets.json["quran.json"];
    // Shared with hands-free tasbeeh / pronunciation (lib/speech/fastconformer-runner).
    // The adapter keeps owning the session's release (dispose below).
    const runner = createFastConformerRunner(ort, inference);
    const session = await tilawa.createRecognitionSession({
      engine: "fastconformer",
      runner,
      assets: {
        vocab: assets.json["vocab.json"] as Record<string, string>,
        quranCtcTokens: assets.json["quran_ctc_tokens.json"] as never,
        quran: quran as unknown[],
      },
    });
    fastconformer = session as unknown as FastConformerLike;
    engineWords = fastconformerWordsFactory(quran);
  }

  const options = {
    confirmedMismatchEnabled: !free && spec.confirmedMismatchEnabled && spec.supportsCorrection,
    verseEvents: free,
  };
  const chunker = createChunker(480, 2000);
  let busy = false;
  let disposed = false;
  let active = false;
  let failed = false;

  const handle = (messages: TilawaMessage[] | undefined) => {
    for (const message of messages ?? []) {
      const event = mapTilawaEvent(message, options);
      if (event) emit(event);
      if (message.type === "correction" && zipformer) {
        const state = (message as Extract<TilawaMessage, { type: "correction" }>).state;
        if (state?.phase === "error") handle(zipformer.correct("review_later"));
      }
    }
  };

  const fail = (error: unknown, phase: string) => {
    if (failed) return;
    failed = true;
    const code = toPracticeErrorCode(error, "engine-runtime");
    reportPracticeError(error, code, phase);
    emit({ type: "failed", code });
  };

  const drain = async (flush = false) => {
    if (busy || disposed) return;
    busy = true;
    try {
      for (;;) {
        const chunk = chunker.take(flush);
        if (!chunk || disposed) break;
        const messages = await (zipformer ?? fastconformer)?.feed(chunk);
        handle(messages);
      }
    } catch (error) {
      fail(error, "engine-feed");
    } finally {
      busy = false;
    }
  };

  return {
    id: engineId,
    get ready() {
      return !disposed;
    },
    confirmsMismatches: options.confirmedMismatchEnabled,

    async start(passage: Passage, mode: EngineMode) {
      chunker.reset();
      failed = false;
      active = true;
      if (zipformer) {
        handle(zipformer.reset());
        const engineMode = free || !spec.supportsCorrection ? "tracking" : mode;
        handle(zipformer.setMode(engineMode));
        // Free recitation never has an expected passage (whole-Qur'an lookup).
        zipformer.setExpected(
          !free && mode === "correction"
            ? { surah: passage.surah, ayah: passage.ayahStart, ayahEnd: passage.ayahEnd }
            : null,
        );
      } else {
        fastconformer?.reset();
      }
      emit({ type: "started" });
    },

    feed(pcm) {
      if (!active || disposed || failed) return;
      chunker.push(pcm);
      void drain();
    },

    async stop() {
      if (!active) return;
      active = false;
      // Wait for an in-flight feed, then flush what is queued.
      while (busy) await new Promise((r) => setTimeout(r, 20));
      await drain(true);
      try {
        if (!failed) handle(await (zipformer ?? fastconformer)?.stop());
      } catch (error) {
        fail(error, "engine-stop");
      }
      emit({ type: "completed" });
    },

    async dispose() {
      disposed = true;
      active = false;
      chunker.reset();
      listeners.clear();
      try {
        await inference.release?.();
      } catch {
        // already released
      }
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },

    engineWords(surah, ayah) {
      return engineWords(surah, ayah);
    },
  };
}
