"use client";

import { openCookiePreferences } from "@/lib/cookie-preferences-events";

/** Reopens the cookie banner's preferences (footer link). */
export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => openCookiePreferences()}>
      Cookie preferences
    </button>
  );
}
