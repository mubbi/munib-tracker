import type { Locale } from "@/i18n/routing";
import en from "./en";

export type Messages = typeof en;

/**
 * Per-locale catalog loaders. English is bundled statically (it is the
 * fallback for every other locale); other locales are code-split.
 */
const LOADERS: Record<Locale, () => Promise<DeepPartial<Messages>>> = {
  en: async () => en,
  ar: () => import("./ar").then((m) => m.default),
  ur: () => import("./ur").then((m) => m.default),
};

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Overlays `override` on `base` so untranslated keys keep their English text. */
export function mergeMessages<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (!override) return base;
  if (!isPlainObject(base) || !isPlainObject(override)) return (override as T) ?? base;
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    out[key] =
      isPlainObject(value) && isPlainObject(out[key]) ? mergeMessages(out[key], value) : value;
  }
  return out as T;
}

/** Full catalog for `locale`, with English filling any gaps. */
export async function loadMessages(locale: Locale): Promise<Messages> {
  if (locale === "en") return en;
  return mergeMessages(en, await LOADERS[locale]());
}

/**
 * Namespaces needed by client components. Only these are serialized into the
 * page for `NextIntlClientProvider`; everything else is rendered on the server
 * so page copy never ships in the client bundle. Prefer passing translated
 * strings as props to a client island over adding a namespace here.
 */
export const CLIENT_NAMESPACES = [
  "consent",
  "contactForm",
  "localeSwitcher",
  "nav",
  "productTour",
  "storeBadges",
] as const satisfies readonly (keyof Messages)[];

export type ClientMessages = Pick<Messages, (typeof CLIENT_NAMESPACES)[number]>;

export function pickClientMessages(messages: Messages): ClientMessages {
  return Object.fromEntries(
    CLIENT_NAMESPACES.map((ns) => [ns, messages[ns]]),
  ) as unknown as ClientMessages;
}
