import type { Locale } from "@/i18n/routing";
import type { Messages } from "@/messages";

/** Typed message keys and locales for `useTranslations` / `getTranslations`. */
declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: Messages;
  }
}
