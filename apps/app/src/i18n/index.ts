import { APP_LOCALE_CODES } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { preloadContentOverlays } from "@/lib/content-overlay-registry";
import { applyRtlForLocale, willRequireNativeReloadForLocale } from "@/lib/i18n/rtl";
import { completeAllStaggerEntrances } from "@/lib/stagger-entrances";

import en from "./en.json";

const SUPPORTED = APP_LOCALE_CODES;

/** Stashed before a native RTL reload so the next boot applies strings + layout together. */
export const PENDING_APP_LOCALE_KEY = "@munib-tracker/pending-app-locale";

/** Set when a JS reload was already attempted for RTL layout but direction still mismatches. */
export const RTL_LAYOUT_RETRY_KEY = "@munib-tracker/rtl-layout-retry";

type Catalog = typeof en;

/**
 * Dynamic import map so Metro/web can code-split locale JSON. English stays in
 * the entry graph; other catalogs load on first use (boot locale or language change).
 */
const LOCALE_LOADERS: Record<Exclude<AppLocale, "en">, () => Promise<{ default: Catalog }>> = {
  ar: () => import("./ar.json"),
  ur: () => import("./ur.json"),
  id: () => import("./id.json"),
  tr: () => import("./tr.json"),
  bn: () => import("./bn.json"),
  ms: () => import("./ms.json"),
  fa: () => import("./fa.json"),
  fr: () => import("./fr.json"),
  ha: () => import("./ha.json"),
  sw: () => import("./sw.json"),
  ru: () => import("./ru.json"),
  az: () => import("./az.json"),
  ps: () => import("./ps.json"),
  so: () => import("./so.json"),
  uz: () => import("./uz.json"),
  kk: () => import("./kk.json"),
  ku: () => import("./ku.json"),
  bs: () => import("./bs.json"),
  sq: () => import("./sq.json"),
  ky: () => import("./ky.json"),
  tg: () => import("./tg.json"),
  tk: () => import("./tk.json"),
};

const loadedLocales = new Set<AppLocale>(["en"]);

export function getSupportedLocales(): readonly AppLocale[] {
  return SUPPORTED;
}

function isSupportedLocale(value: string | null | undefined): value is AppLocale {
  return value != null && (SUPPORTED as readonly string[]).includes(value);
}

async function ensureCatalogLoaded(lng: AppLocale): Promise<void> {
  if (loadedLocales.has(lng) || lng === "en") return;

  let catalog: Catalog;
  if (process.env.NODE_ENV === "test") {
    // Jest CJS VM cannot evaluate native `import()` without --experimental-vm-modules.
    // Static require map lives in a separate module so Metro accepts it and production
    // tree-shaking can drop the test branch (keeps async locale code-splits).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { LOCALE_SYNC_LOADERS } = require("./locale-sync-loaders") as typeof import("./locale-sync-loaders");
    catalog = LOCALE_SYNC_LOADERS[lng]();
  } else {
    const mod = await LOCALE_LOADERS[lng]();
    catalog = mod.default;
  }

  i18n.addResourceBundle(lng, "translation", catalog, true, true);
  loadedLocales.add(lng);
}

async function ensureI18nInit(lng: AppLocale): Promise<void> {
  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      resources: { en: { translation: en } },
      lng: "en",
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      returnNull: false,
      react: { useSuspense: false },
    });
  }

  await ensureCatalogLoaded(lng);

  if (i18n.language !== lng) {
    await i18n.changeLanguage(lng);
  }
}

if (!i18n.isInitialized) {
  void ensureI18nInit("en");
}

/** Locale queued for a post-paint native RTL reload (startup must not block on reload). */
let pendingRtlReloadLocale: AppLocale | null = null;

export function consumePendingRtlReloadLocale(): AppLocale | null {
  const locale = pendingRtlReloadLocale;
  pendingRtlReloadLocale = null;
  return locale;
}

async function finishLocaleSwitch(code: AppLocale): Promise<void> {
  if (i18n.language !== code) {
    await i18n.changeLanguage(code);
    completeAllStaggerEntrances();
  }
  // Prefetch Learn overlays for this locale in the background (English until ready).
  void preloadContentOverlays(code);
}

export async function changeAppLocale(
  code: AppLocale,
  options?: { deferReload?: boolean },
): Promise<boolean> {
  if (willRequireNativeReloadForLocale(code)) {
    const retryLocale = await AsyncStorage.getItem(RTL_LAYOUT_RETRY_KEY);
    if (retryLocale === code) {
      // reloadAppAsync already ran once and native layout direction is still
      // wrong — proceed with strings so startup cannot brick on the splash screen.
      await AsyncStorage.multiRemove([PENDING_APP_LOCALE_KEY, RTL_LAYOUT_RETRY_KEY]);
      await ensureI18nInit(code);
      await finishLocaleSwitch(code);
      return false;
    }

    await AsyncStorage.setItem(PENDING_APP_LOCALE_KEY, code);
    await AsyncStorage.setItem(RTL_LAYOUT_RETRY_KEY, code);

    // Apply UI strings before any native reload so splash dismissal is not blocked.
    await ensureI18nInit(code);
    await finishLocaleSwitch(code);

    if (options?.deferReload) {
      pendingRtlReloadLocale = code;
      return true;
    }

    return applyRtlForLocale(code);
  }

  await AsyncStorage.multiRemove([PENDING_APP_LOCALE_KEY, RTL_LAYOUT_RETRY_KEY]);
  await ensureI18nInit(code);
  // Apply `document.dir` before `changeLanguage` so any i18n-driven re-render
  // and `isRTL()` (which reads the saved locale) agree on direction.
  const rtlApplied = await applyRtlForLocale(code);
  await finishLocaleSwitch(code);
  return rtlApplied;
}

export async function bootstrapAppLocale(code: AppLocale): Promise<boolean> {
  const pending = await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY);
  const effective = isSupportedLocale(pending) ? pending : code;
  return changeAppLocale(effective, { deferReload: true });
}

export default i18n;
