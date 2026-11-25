import { resolveAppVersion } from "@/lib/app/resolve-app-version";

import type { HeadValues } from "./judge";
import {
  type PronunciationClient,
  QuranLabError,
  quranLabKeyFor,
  type SharingState,
  toQuranLabError,
} from "./types";

/**
 * Web: `@quran-lab/tajweedformer` 4.x (D66). The npm package is a thin wrapper
 * that loads Quran Lab's hosted loader (`web.quranlab.ai/4/loader.js`, with
 * backup hosts); the engine, the protected model and its lease run in Quran
 * Lab's hidden frame + Worker, so nothing is self-hosted any more and the
 * wrapper (no `import.meta`, no imports) bundles as a lazy Metro chunk.
 *
 * SDK 4 rules this client follows:
 * - No `analytics` / `audience` options: passing either is `invalid_argument`.
 *   Anonymous analytics + error reports are always on (disclosed on the consent
 *   sheet and in Credits / the privacy policy).
 * - The SDK asks every learner itself, on its own `<quranlab-consent>` sheet after
 *   a good take (at most three times); the app never calls `sharing.ask()`.
 * - `appVersion` / `appBuild` go on the config request so Quran Lab can serve each
 *   release the model it was built for.
 * - CSP: the site sends no `script-src` / `frame-src` / `connect-src`, so the
 *   README's lines are not needed; add them if `vercel.json` ever restricts those.
 * - Threads stay off (`threads: 'off'` default): the site is not cross-origin
 *   isolated (D3 web runtime notes).
 */

type WebSdk = typeof import("@quran-lab/tajweedformer");
type WebClient = Awaited<ReturnType<WebSdk["TajweedClient"]["create"]>>;
type WebModel = Awaited<ReturnType<WebClient["model"]>>;
type WebSession = Awaited<ReturnType<WebModel["listen"]>>;

/** Build number sent with the version (web has no native build; the version doubles as it). */
function appBuild(): string {
  const fromEnv = typeof process !== "undefined" ? process.env?.EXPO_PUBLIC_APP_BUILD : undefined;
  return fromEnv?.trim() || resolveAppVersion();
}

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
      client = await sdk.TajweedClient.create({
        key,
        appVersion: resolveAppVersion(),
        appBuild: appBuild(),
      });
      return client;
    } catch (error) {
      throw toQuranLabError(error);
    }
  };

  const wrap = async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      throw toQuranLabError(error);
    }
  };

  return {
    available,
    // The web sheet follows its own light/dark design; SDK 4's web API takes wording overrides only.
    setSharingTheme() {},
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

    async prepareTake() {
      if (!available) return;
      try {
        const c = await ensure();
        model ??= await c.model();
      } catch {
        // Warm-up only: the take itself reports any real failure.
      }
    },

    async diagnose() {
      if (!client) return null;
      try {
        return JSON.stringify(await client.diagnose(), null, 2);
      } catch {
        return null;
      }
    },

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
            if (event.type === "ended")
              onEnded(event.reason === "hidden" ? "background" : event.reason);
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
