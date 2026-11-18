import type { HeadValues } from "./judge";
import {
  type PronunciationClient,
  QuranLabError,
  quranLabKeyFor,
  type SharingState,
  toQuranLabCode,
} from "./types";

/**
 * Web: `@quran-lab/tajweedformer` (WebAssembly in a module Worker). Loaded with
 * a dynamic import so it only reaches the drill route's chunk. Analytics off.
 *
 * Note: on the web the SDK shows its own `<quranlab-consent>` sharing sheet after
 * a finished take when Quran Lab's signed config offers sharing for this app —
 * an app cannot turn that off in code. The settings card therefore always shows
 * the learner's sharing switch and "Delete what I shared" (§20 privacy copy).
 */

type WebSdk = typeof import("@quran-lab/tajweedformer");
type WebClient = Awaited<ReturnType<WebSdk["TajweedClient"]["create"]>>;
type WebModel = Awaited<ReturnType<WebClient["model"]>>;
type WebSession = Awaited<ReturnType<WebModel["listen"]>>;

export function createPronunciationClient(): PronunciationClient {
  const key = quranLabKeyFor("web");
  const available =
    key != null &&
    typeof window !== "undefined" &&
    typeof WebAssembly === "object" &&
    typeof AudioWorkletNode !== "undefined" &&
    window.isSecureContext;
  let client: WebClient | null = null;
  let model: WebModel | null = null;
  let session: WebSession | null = null;
  let heardSpeech = false;

  const ensure = async (): Promise<WebClient> => {
    if (!available || !key) throw new QuranLabError(key ? "runtime_unsupported" : "not_configured");
    if (client) return client;
    try {
      const sdk = await import("@quran-lab/tajweedformer");
      client = await sdk.TajweedClient.create({ key, analytics: "off" });
      return client;
    } catch (error) {
      throw new QuranLabError(toQuranLabCode(error), (error as Error)?.message);
    }
  };

  const wrap = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (error instanceof QuranLabError) throw error;
      throw new QuranLabError(toQuranLabCode(error), (error as Error)?.message);
    }
  };

  return {
    available,
    configure: async () => {
      await ensure();
    },

    prefetch: (onProgress) =>
      wrap(async () => {
        const c = await ensure();
        await c.prefetch({
          onProgress: ({ bytesDone, bytesTotal }) => onProgress(bytesDone, bytesTotal),
        });
      }),

    openModel: () =>
      wrap(async () => {
        const c = await ensure();
        model ??= await c.model();
        return {
          version: model.version,
          build: model.build,
          defaultContext: model.defaultContext,
          calibration: model.calibration?.json ?? null,
        };
      }),

    startTake: (heads, onSpeech, onEnded) =>
      wrap(async () => {
        const c = await ensure();
        model ??= await c.model();
        if (session) await session.cancel?.();
        heardSpeech = false;
        session = await model.listen({
          heads,
          endOnSilenceMs: 1500,
          onChunk: (chunk) => {
            if (chunk.speech) heardSpeech = true;
            onSpeech(chunk.speech);
          },
          onEvent: (event) => {
            if (event.type === "ended") onEnded(event.reason);
          },
        });
      }),

    finishTake: () =>
      wrap(async () => {
        if (!session) throw new QuranLabError("cancelled");
        const heads = await session.finish();
        session = null;
        const out: HeadValues[] = [];
        for (const name of heads.names) {
          const h = heads.get(name);
          if (h) out.push({ name: h.name, frames: h.frames, classes: h.classes, values: h.values });
        }
        return { heads: out, heardSpeech };
      }),

    async cancelTake() {
      try {
        await session?.cancel?.();
      } catch {
        // ended
      }
      session = null;
    },

    removeModels: () =>
      wrap(async () => {
        const c = await ensure();
        model = null;
        await c.removeModels();
      }),

    async storageBytes() {
      if (!available) return 0;
      try {
        const c = await ensure();
        const s = await c.storage();
        return s.models.reduce((sum, m) => sum + (m.bytes ?? 0), 0);
      } catch {
        return 0;
      }
    },

    async sharingState(): Promise<SharingState> {
      if (!available) return { isAvailable: false, isOn: false, recoveryCode: null };
      const c = await ensure();
      return {
        isAvailable: c.sharing.isAvailable,
        isOn: c.sharing.isOn,
        recoveryCode: c.sharing.recoveryCode,
      };
    },

    setSharingOn: (on) =>
      wrap(async () => {
        const c = await ensure();
        await c.sharing.setOn(on);
      }),

    deleteShared: () =>
      wrap(async () => {
        const c = await ensure();
        await c.sharing.delete();
        return true;
      }),

    async close() {
      try {
        await session?.cancel?.();
        await client?.close();
      } catch {
        // closing
      }
      session = null;
      model = null;
      client = null;
    },
  };
}
