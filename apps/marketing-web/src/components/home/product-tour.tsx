"use client";

import { APP_NAME, DUA_COUNT } from "@munib-tracker/shared/constants";
import { ArrowRight, Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { DeviceScreen } from "@/components/content/device-screen";
import { isLocale, LOCALE_META } from "@/i18n/locales";
import { Link } from "@/i18n/navigation";
import { trackCtaClick, trackSelectContent } from "@/lib/analytics";
import type { Frame, Screenshot } from "@/lib/screenshots";
import { cn } from "@/lib/utils";

export type TourTabId = "salah" | "qaza" | "zikr" | "quran";

/** The capture each tab shows, resolved on the server in the page locale. */
export type TourShots = Record<TourTabId, Screenshot>;

type Tab = {
  id: TourTabId;
  /** Keys of `productTour.tabs.<id>.points`, in display order. */
  points: readonly string[];
  href: string;
};

type TourKey = Parameters<ReturnType<typeof useTranslations<"productTour">>>[0];

const TABS = [
  { id: "salah", points: ["statuses", "extras", "progress"], href: "/features/salah-tracker" },
  { id: "qaza", points: ["calculator", "pace", "fasts"], href: "/features/qaza-salah-tracker" },
  { id: "zikr", points: ["adhkar", "tasbeeh", "duas"], href: "/features/zikr-tracker" },
  { id: "quran", points: ["views", "translations", "practice"], href: "/features/quran" },
] as const satisfies readonly Tab[];

/**
 * Width + `sizes` per frame. Each fits the fixed-height stage below, so
 * switching between a phone, a portrait iPad and a landscape tablet never
 * moves the copy beside it.
 */
const STAGE_FIT: Partial<Record<Frame, { className: string; sizes: string }>> = {
  phone: {
    className: "w-[200px] sm:w-[230px] lg:w-[240px]",
    sizes: "(min-width: 1024px) 240px, (min-width: 640px) 230px, 200px",
  },
  android: {
    className: "w-[200px] sm:w-[230px] lg:w-[240px]",
    sizes: "(min-width: 1024px) 240px, (min-width: 640px) 230px, 200px",
  },
  tablet: {
    className: "w-full max-w-[20rem] sm:max-w-[23rem] lg:max-w-[24rem]",
    sizes: "(min-width: 1024px) 384px, (min-width: 640px) 368px, 320px",
  },
  "tablet-landscape": {
    className: "w-full max-w-[28rem]",
    sizes: "(min-width: 768px) 448px, 92vw",
  },
};

/**
 * Tabbed tour of the real app (WAI-ARIA tabs pattern, arrow-key navigation).
 * Each tab shows a real capture on a different device, in the page language;
 * the parent server component resolves `shots` so the manifest stays off the
 * client.
 */
export function ProductTour({ shots }: { shots: TourShots }) {
  const t = useTranslations("productTour");
  const locale = useLocale();
  const rtl = isLocale(locale) && LOCALE_META[locale].dir === "rtl";
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active] ?? TABS[0];
  if (!tab) return null;
  const shot = shots[tab.id];
  const fit = STAGE_FIT[shot.frame];

  const select = (i: number) => {
    setActive(i);
    trackSelectContent({
      content_type: "product_tour",
      item_id: TABS[i]?.id ?? "",
      placement: "home",
    });
  };

  // In RTL the tab row runs right-to-left, so ArrowLeft moves to the next tab.
  const forwardKey = rtl ? "ArrowLeft" : "ArrowRight";
  const backKey = rtl ? "ArrowRight" : "ArrowLeft";
  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === forwardKey) next = (i + 1) % TABS.length;
    else if (e.key === backKey) next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="features" aria-labelledby="tour-title" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            {t("eyebrow")}
          </p>
          <h2
            id="tour-title"
            className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-white md:text-[2.5rem] md:leading-[1.12]"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            {t("intro", { appName: APP_NAME })}
          </p>
        </div>

        <div
          role="tablist"
          aria-label={t("tablistLabel")}
          className="mx-auto mt-10 flex w-full max-w-md justify-between gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5"
        >
          {TABS.map((item, i) => (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${item.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              className={cn(
                "flex-1 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
                i === active ? "bg-brand text-[#03271c]" : "text-white/70 hover:text-white",
              )}
              onClick={() => select(i)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t(`tabs.${item.id}.label`)}
            </button>
          ))}
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          className="mt-12 grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:gap-14 lg:px-10"
        >
          <div className="order-2 md:order-1">
            <h3 className="font-display text-2xl font-bold text-white md:text-3xl">
              {t(`tabs.${tab.id}.title`)}
            </h3>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/72">
              {t(`tabs.${tab.id}.text`)}
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {tab.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[15px] text-white/85">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand/15">
                    <Check aria-hidden className="size-3.5 text-brand" />
                  </span>
                  {/* `count` feeds the dua plural; other points ignore it. The cast is needed
                      because TS can't pair each tab with its own point ids. */}
                  {t(`tabs.${tab.id}.points.${p}` as TourKey, { count: DUA_COUNT })}
                </li>
              ))}
            </ul>
            <Link
              href={tab.href}
              className="group mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
              onClick={() => trackCtaClick("explore_features", "home_tour")}
            >
              {t(`tabs.${tab.id}.cta`)}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
              />
            </Link>
          </div>
          <figure className="order-1 md:order-2">
            <div className="flex h-[430px] items-center justify-center sm:h-[500px] lg:h-[520px]">
              <DeviceScreen
                key={tab.id}
                shot={{ ...shot, alt: t(`tabs.${tab.id}.shotAlt`) }}
                className={fit?.className}
                sizes={fit?.sizes}
              />
            </div>
            <figcaption className="mt-4 text-center text-sm text-white/55">
              {t("shownOn", { device: t(`devices.${shot.device}` as TourKey) })}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
