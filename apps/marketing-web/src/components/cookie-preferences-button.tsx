"use client";

import { useTranslations } from "next-intl";
import { openCookiePreferences } from "@/lib/cookie-preferences-events";

/** Reopens the cookie banner's preferences (footer link). */
export function CookiePreferencesButton({ className }: { className?: string }) {
  const t = useTranslations("consent");
  return (
    <button type="button" className={className} onClick={() => openCookiePreferences()}>
      {t("openPreferences")}
    </button>
  );
}
