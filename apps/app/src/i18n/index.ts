import { APP_LOCALE_CODES } from "@munib-tracker/shared/i18n";
import type { AppLocale } from "@munib-tracker/shared/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { applyRtlForLocale, willRequireNativeReloadForLocale } from "@/lib/i18n/rtl";
import { completeAllStaggerEntrances } from "@/lib/stagger-entrances";

import ar from "./ar.json";
import az from "./az.json";
import bn from "./bn.json";
import bs from "./bs.json";
import en from "./en.json";
import fa from "./fa.json";
import fr from "./fr.json";
import ha from "./ha.json";
import id from "./id.json";
import kk from "./kk.json";
import ku from "./ku.json";
import ky from "./ky.json";
import ms from "./ms.json";
import ps from "./ps.json";
import ru from "./ru.json";
import so from "./so.json";
import sq from "./sq.json";
import sw from "./sw.json";
import tg from "./tg.json";
import tk from "./tk.json";
import tr from "./tr.json";
import ur from "./ur.json";
import uz from "./uz.json";

const SUPPORTED = APP_LOCALE_CODES;

/** Stashed before a native RTL reload so the next boot applies strings + layout together. */
export const PENDING_APP_LOCALE_KEY = "@munib-tracker/pending-app-locale";

/** Set when a JS reload was already attempted for RTL layout but direction still mismatches. */
export const RTL_LAYOUT_RETRY_KEY = "@munib-tracker/rtl-layout-retry";

const CATALOG_BY_LOCALE: Record<AppLocale, object> = {
  en,
  ar,
  ur,
  id,
  tr,
  bn,
  ms,
  fa,
  fr,
  ha,
  sw,
  ru,
  az,
  ps,
  so,
  uz,
  kk,
  ku,
  bs,
  sq,
  ky,
  tg,
  tk,
};

const I18N_RESOURCES = Object.fromEntries(
  SUPPORTED.map((code) => [code, { translation: CATALOG_BY_LOCALE[code] }]),
);

export function getSupportedLocales(): readonly AppLocale[] {
  return SUPPORTED;
}

function isSupportedLocale(value: string | null | undefined): value is AppLocale {
  return value != null && (SUPPORTED as readonly string[]).includes(value);
}

function ensureI18nInit(lng: AppLocale): Promise<void> {
  if (i18n.isInitialized) {
    if (i18n.language === lng) return Promise.resolve();
    return i18n.changeLanguage(lng).then(() => undefined);
  }
  return i18n
    .use(initReactI18next)
    .init({
      resources: I18N_RESOURCES,
      lng,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      returnNull: false,
      react: { useSuspense: false },
    })
    .then(() => undefined);
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
      if (i18n.language !== code) {
        await i18n.changeLanguage(code);
        completeAllStaggerEntrances();
      }
      return false;
    }

    await AsyncStorage.setItem(PENDING_APP_LOCALE_KEY, code);
    await AsyncStorage.setItem(RTL_LAYOUT_RETRY_KEY, code);

    // Apply UI strings before any native reload so splash dismissal is not blocked.
    await ensureI18nInit(code);
    if (i18n.language !== code) {
      await i18n.changeLanguage(code);
      completeAllStaggerEntrances();
    }

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
  if (i18n.language !== code) {
    await i18n.changeLanguage(code);
    completeAllStaggerEntrances();
  }
  return rtlApplied;
}

export async function bootstrapAppLocale(code: AppLocale): Promise<boolean> {
  const pending = await AsyncStorage.getItem(PENDING_APP_LOCALE_KEY);
  const effective = isSupportedLocale(pending) ? pending : code;
  return changeAppLocale(effective, { deferReload: true });
}

export default i18n;
