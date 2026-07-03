import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ar from "./ar.json";
import en from "./en.json";
import ur from "./ur.json";

const SUPPORTED = ["en", "ar", "ur"] as const;

const deviceLanguage = getLocales()[0]?.languageCode ?? "en";
const initialLanguage = (SUPPORTED as readonly string[]).includes(deviceLanguage)
  ? deviceLanguage
  : "en";

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
      ur: { translation: ur },
    },
    lng: initialLanguage,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    returnNull: false,
    react: { useSuspense: false },
  });
}

export default i18n;
