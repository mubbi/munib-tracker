"use client";

import { BarChart3, Check, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackCookieConsent } from "@/lib/analytics";
import {
  CONSENT_ITEMS,
  CONSENT_VERSION,
  type ConsentItemId,
  type ConsentPreferences,
  getStoredConsent,
  hasValidStoredConsent,
  setStoredConsent,
  toConsentItemId,
} from "@/lib/consent-storage";
import { COOKIE_PREFERENCES_OPEN_EVENT } from "@/lib/cookie-preferences-events";
import {
  applyAnalyticsFromCookiePreferences,
  getGaMeasurementId,
  trackGtagPageView,
} from "@/lib/gtag";
import { SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Analytics stay off until the visitor allows them (no pre-ticked consent). */
const DEFAULT_PREFS: ConsentPreferences = { essential: true, analytics: false };

/** First visit: wait this long (or for the first scroll) so the hero is seen before the ask. */
export const CONSENT_DELAY_MS = 2000;

/** The three promises shown as chips; copy is `consent.promises.<id>`. */
const PROMISES = ["noAds", "noProfiling", "neverSold"] as const;

function privacyLink(chunks: ReactNode) {
  return (
    <Link
      href={SITE_PATHS.privacy}
      className="font-medium text-brand underline decoration-brand/40 underline-offset-[3px] transition hover:decoration-brand"
    >
      {chunks}
    </Link>
  );
}

/**
 * Cookie consent: a compact, non-modal card in the bottom corner.
 *
 * UX rules (keep them when editing):
 * - It asks once, after a short delay or the first scroll, never over the
 *   first paint; it sits below the header so menus open above it.
 * - One message with the value ("help us improve") and the promises
 *   (no ads, no profiling, never sold); details live behind a link.
 * - Allowing and declining are equally easy: two same-size buttons.
 * - Analytics are off by default; the settings view has toggles + save.
 * - Non-modal: the page stays usable, so no `aria-modal` and no focus trap.
 */
export function CookieConsentBanner() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [voluntaryOpen, setVoluntaryOpen] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPreferences>(DEFAULT_PREFS);

  const gaConfigured = Boolean(getGaMeasurementId());

  const loadStored = useCallback(() => {
    const stored = getStoredConsent();
    setPrefs(stored?.preferences ?? DEFAULT_PREFS);
  }, []);

  // First visit: show after a short delay or the first scroll, whichever comes first.
  useEffect(() => {
    if (!gaConfigured) return;
    const stored = getStoredConsent();
    if (hasValidStoredConsent(stored)) return;
    setPrefs(stored?.preferences ?? DEFAULT_PREFS);
    const show = () => {
      setVisible(true);
      setShowDetails(false);
      setVoluntaryOpen(false);
      cleanup();
    };
    const timer = window.setTimeout(show, CONSENT_DELAY_MS);
    const onScroll = () => show();
    window.addEventListener("scroll", onScroll, { passive: true, once: true });
    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, [gaConfigured]);

  // "Cookie preferences" in the footer reopens the settings view.
  useEffect(() => {
    if (!gaConfigured) return;
    const open = () => {
      loadStored();
      setVisible(true);
      setShowDetails(true);
      setVoluntaryOpen(true);
    };
    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, open);
    return () => window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, open);
  }, [gaConfigured, loadStored]);

  const submit = (
    next: ConsentPreferences,
    action: "accept_all" | "essential_only" | "save_choices",
  ) => {
    setLoading(true);
    try {
      setStoredConsent(next, CONSENT_VERSION);
      applyAnalyticsFromCookiePreferences(next);
      if (next.analytics) {
        trackGtagPageView(
          `${window.location.pathname}${window.location.search}${window.location.hash}`,
        );
      }
      trackCookieConsent(action, { analytics: next.analytics });
      setPrefs(next);
      setVisible(false);
      setShowDetails(false);
    } finally {
      setLoading(false);
    }
  };

  const acceptAll = () => submit({ essential: true, analytics: true }, "accept_all");
  const essentialOnly = () => submit({ essential: true, analytics: false }, "essential_only");
  const saveMyChoices = () => submit(prefs, "save_choices");

  const setPref = (id: ConsentItemId, value: boolean) => {
    if (id === "essential") return;
    setPrefs((p) => ({ ...p, [id]: value }));
  };

  if (!gaConfigured) return null;

  // Slides in with a CSS animation (`.consent-in`, off under reduced motion).
  return visible ? (
    <section
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-body"
      className={cn(
        // Below the header (z-50) so its menus open over the card.
        "consent-in fixed inset-x-3 bottom-3 z-40 sm:inset-x-auto sm:bottom-5 sm:start-5",
        showDetails ? "sm:w-[26rem]" : "sm:w-[23.5rem]",
      )}
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="rounded-2xl border border-white/12 bg-[#0a1626]/95 p-3.5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl sm:p-5">
        {!showDetails ? (
          <>
            <div className="flex items-start gap-3">
              <span className="mt-0.5 hidden size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand ring-1 ring-brand/30 sm:flex">
                <BarChart3 aria-hidden className="size-4.5" />
              </span>
              <div className="min-w-0">
                <h2
                  id="cookie-consent-title"
                  className="font-display text-[15px] font-semibold leading-snug text-white"
                >
                  {t("summary.title")}
                </h2>
                <p
                  id="cookie-consent-body"
                  className="mt-1 text-[13px] leading-relaxed text-white/70"
                >
                  {t.rich("summary.body", { link: privacyLink })}
                </p>
              </div>
            </div>
            {/* Phones: the promises as one quiet line; larger screens: chips. */}
            <p className="mt-1.5 text-[12px] font-medium text-white/60 sm:hidden">
              {PROMISES.map((id) => t(`promises.${id}`)).join(" · ")}
            </p>
            <ul className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
              {PROMISES.map((id) => (
                <li
                  key={id}
                  className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2.5 py-1 text-[12px] font-medium text-white/75"
                >
                  <Check aria-hidden className="size-3.5 text-brand" />
                  {t(`promises.${id}`)}
                </li>
              ))}
            </ul>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-4">
              <button
                type="button"
                onClick={essentialOnly}
                disabled={loading}
                className={secondaryBtnClass}
              >
                {t("essentialOnly")}
              </button>
              <button
                type="button"
                onClick={acceptAll}
                disabled={loading}
                className={primaryBtnClass}
              >
                {t("acceptAll")}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              disabled={loading}
              className="mt-1.5 w-full rounded-md py-1 sm:mt-2.5 text-center text-[13px] font-medium text-white/55 underline-offset-4 transition hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            >
              {t("managePreferences")}
            </button>
          </>
        ) : (
          <>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  id="cookie-consent-title"
                  className="font-display text-[15px] font-semibold text-white"
                >
                  {t("details.title")}
                </h2>
                <p
                  id="cookie-consent-body"
                  className="mt-1 text-[13px] leading-relaxed text-white/70"
                >
                  {t.rich("details.body", { link: privacyLink })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => (voluntaryOpen ? setVisible(false) : setShowDetails(false))}
                aria-label={voluntaryOpen ? t("close") : t("back")}
                className="-me-1 -mt-1 flex size-8 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            <ul className="mt-4 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
              {CONSENT_ITEMS.map((item) => {
                const prefKey = toConsentItemId(item.id);
                if (!prefKey) return null;
                const on = prefs[prefKey];
                return (
                  <li key={item.id} className="flex items-start gap-4 px-4 py-3.5">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-white">
                          {t(`items.${item.id}.title`)}
                        </span>
                        {item.required ? (
                          <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-white/55">
                            {t("alwaysOn")}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-white/55">
                        {t(`items.${item.id}.description`)}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={on ? "true" : "false"}
                      aria-label={t("switchLabel", {
                        item: t(`items.${item.id}.title`),
                        on: String(on),
                      })}
                      disabled={item.required}
                      onClick={() => {
                        if (!item.required) setPref(prefKey, !on);
                      }}
                      className={cn(
                        "relative mt-0.5 inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1626] disabled:cursor-not-allowed disabled:opacity-55",
                        on ? "bg-brand" : "bg-white/15",
                      )}
                    >
                      <span
                        className={cn(
                          "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
                          on
                            ? "translate-x-[1.35rem] rtl:-translate-x-[1.35rem]"
                            : "translate-x-1 rtl:-translate-x-1",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={saveMyChoices}
                disabled={loading}
                className={secondaryBtnClass}
              >
                {t("saveChoices")}
              </button>
              <button
                type="button"
                onClick={acceptAll}
                disabled={loading}
                className={primaryBtnClass}
              >
                {t("acceptAll")}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  ) : null;
}

const btnBase =
  "inline-flex h-10 min-w-0 items-center justify-center rounded-full px-3 text-sm font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1626] disabled:pointer-events-none disabled:opacity-50";

const secondaryBtnClass = cn(
  btnBase,
  "border border-white/20 bg-white/[0.04] text-white/85 hover:border-white/30 hover:bg-white/[0.08] hover:text-white",
);

const primaryBtnClass = cn(
  btnBase,
  "bg-gradient-to-b from-brand to-brand-strong text-white shadow-[0_10px_24px_-12px_color-mix(in_srgb,var(--color-brand)_75%,transparent),inset_0_1px_0_rgba(255,255,255,0.22)] hover:brightness-[1.05]",
);
