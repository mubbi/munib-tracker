"use client";

import { APP_NAME } from "@munib-tracker/shared/constants";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useCallback, useEffect, useState } from "react";
import { CookieNoAdsNotice } from "@/components/cookie-no-ads-notice";
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

const DEFAULT_PREFS: ConsentPreferences = { essential: true, analytics: false };

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

  useEffect(() => {
    if (!gaConfigured) return;
    const stored = getStoredConsent();
    if (!hasValidStoredConsent(stored)) {
      setVisible(true);
      setShowDetails(false);
      setVoluntaryOpen(false);
      setPrefs(stored?.preferences ?? DEFAULT_PREFS);
    }
  }, [gaConfigured]);

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

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          aria-label={t("dialogLabel")}
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] box-border max-w-[100vw] p-3 sm:p-5"
          style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        >
          <div className="pointer-events-auto mx-auto w-full min-w-0 max-w-3xl overflow-hidden rounded-2xl border border-white/12 bg-[#0a1626]/96 shadow-[0_24px_64px_-20px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl">
            <div className="flex flex-col gap-4 p-4 sm:gap-6 sm:p-6">
              <CookieNoAdsNotice appName={APP_NAME} />

              {!showDetails ? (
                <>
                  <div className="min-w-0 space-y-2">
                    <h2
                      id="cookie-consent-title"
                      className="font-display text-base font-semibold tracking-tight text-white"
                    >
                      {t("summary.title")}
                    </h2>
                    <p className="max-w-2xl text-[13px] leading-relaxed text-white/70 sm:text-sm">
                      {t.rich("summary.body", { link: privacyLink })}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:pt-5">
                    <button
                      type="button"
                      onClick={() => setShowDetails(true)}
                      disabled={loading}
                      className={tertiaryBtnClass}
                    >
                      {t("managePreferences")}
                    </button>
                    <div className="flex w-full flex-row gap-2.5 sm:w-auto sm:items-center sm:gap-3">
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
                  </div>
                </>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 space-y-2">
                      <h2
                        id="cookie-consent-title"
                        className="font-display text-base font-semibold tracking-tight text-white"
                      >
                        {t("details.title")}
                      </h2>
                      <p className="text-sm leading-relaxed text-white/70">
                        {t.rich("details.body", { link: privacyLink })}
                      </p>
                    </div>
                    {voluntaryOpen ? (
                      <button
                        type="button"
                        onClick={() => setVisible(false)}
                        className={ghostBtnClass}
                      >
                        {t("close")}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowDetails(false)}
                        className={ghostBtnClass}
                      >
                        {t("back")}
                      </button>
                    )}
                  </div>

                  <ul className="divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
                    {CONSENT_ITEMS.map((item) => {
                      const prefKey = toConsentItemId(item.id);
                      if (!prefKey) return null;
                      return (
                        <li
                          key={item.id}
                          className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-sm font-semibold text-white">
                                {t(`items.${item.id}.title`)}
                              </span>
                              {item.required ? (
                                <span className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium tracking-wide text-white/55 uppercase">
                                  {t("alwaysOn")}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                              {t(`items.${item.id}.description`)}
                            </p>
                          </div>
                          <div className="flex shrink-0 items-center gap-2.5 self-end sm:self-center">
                            <span
                              className={cn(
                                "min-w-7 text-end text-xs font-medium tabular-nums",
                                prefs[prefKey] ? "text-brand" : "text-white/45",
                              )}
                            >
                              {t("state", { on: String(prefs[prefKey]) })}
                            </span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={prefs[prefKey] ? "true" : "false"}
                              aria-label={t("switchLabel", {
                                item: t(`items.${item.id}.title`),
                                on: String(prefs[prefKey]),
                              })}
                              disabled={item.required}
                              onClick={() => {
                                if (!item.required) setPref(prefKey, !prefs[prefKey]);
                              }}
                              className={cn(
                                "relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1626] disabled:cursor-not-allowed disabled:opacity-55",
                                prefs[prefKey] ? "bg-brand" : "bg-white/15",
                              )}
                            >
                              <span
                                className={cn(
                                  "pointer-events-none inline-block size-5 rounded-full bg-white shadow-sm transition-transform",
                                  prefs[prefKey]
                                    ? "translate-x-[1.35rem] rtl:-translate-x-[1.35rem]"
                                    : "translate-x-1 rtl:-translate-x-1",
                                )}
                              />
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
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
                      className={cn(secondaryBtnClass, "bg-white/[0.06] hover:bg-white/10")}
                    >
                      {t("acceptAll")}
                    </button>
                    <button
                      type="button"
                      onClick={saveMyChoices}
                      disabled={loading}
                      className={primaryBtnClass}
                    >
                      {t("saveChoices")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const btnBase =
  "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold tracking-tight transition-all duration-200 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1626] disabled:pointer-events-none disabled:opacity-50";

const tertiaryBtnClass = cn(
  btnBase,
  "h-auto justify-start px-0 py-1 font-medium text-white/65 underline-offset-4 hover:text-white hover:underline sm:justify-center",
);

const secondaryBtnClass = cn(
  btnBase,
  "min-w-0 flex-1 border border-white/20 bg-white/[0.04] px-4 text-white/85 hover:border-white/30 hover:bg-white/[0.08] hover:text-white sm:flex-none sm:px-5",
);

const primaryBtnClass = cn(
  btnBase,
  "min-w-0 flex-1 bg-gradient-to-b from-brand to-brand-strong px-4 text-white shadow-[0_12px_28px_-12px_color-mix(in_srgb,var(--color-brand)_75%,transparent),inset_0_1px_0_rgba(255,255,255,0.22)] hover:brightness-[1.05] sm:min-w-[8.5rem] sm:flex-none sm:px-5",
);

const ghostBtnClass =
  "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium text-white/55 transition hover:bg-white/5 hover:text-white/85";
