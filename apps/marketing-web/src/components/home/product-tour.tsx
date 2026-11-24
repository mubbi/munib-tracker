"use client";

import { DUA_COUNT } from "@munib-tracker/shared/constants";
import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { type KeyboardEvent, useId, useRef, useState } from "react";
import { DeviceFrame } from "@/components/day-arc/device-frame";
import { trackCtaClick, trackSelectContent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
  title: string;
  text: string;
  points: string[];
  href: string;
  cta: string;
  shot: { src: string; alt: string };
};

/** Real screenshots only (public/screenshots, captured from the shipping app). */
const TABS: Tab[] = [
  {
    id: "salah",
    label: "Salah",
    title: "See your day of Salah at a glance",
    text: "Tap each Salah as you pray it. Your progress ring, streak and calendar fill in, without guilt when a day doesn't go to plan.",
    points: [
      "Completed, delayed, missed and Qaza",
      "Witr, Sunnah and Jama'ah",
      "Streaks, calendar and statistics",
    ],
    href: "/features/salah-tracker",
    cta: "Explore the Salah tracker",
    shot: {
      src: "/screenshots/tracker.webp",
      alt: "Tracker screen: 2 of 5 obligatory Salah logged, a 2-day streak, and rings for Witr, adhkar, Qaza and khatm.",
    },
  },
  {
    id: "qaza",
    label: "Qaza",
    title: "Turn missed Salah into a plan",
    text: "Estimate what you missed, pick a daily pace you can keep, and watch the number fall, with a finish date that updates as you go.",
    points: ["Lifetime calculator", "Gentle to intensive pace presets", "Missed fasts tracked too"],
    href: "/features/qaza-salah-tracker",
    cta: "Explore the Qaza tracker",
    shot: {
      src: "/screenshots/qaza.webp",
      alt: "Qaza screen: 25 remaining, 62 made up, 71% complete and an estimated finish date.",
    },
  },
  {
    id: "zikr",
    label: "Zikr",
    title: "Adhkar for every part of your day",
    text: "Guided sessions for the morning, evening, after Salah and before sleep, each zikr shown with its source hadith.",
    points: [
      "60 adhkar with sources",
      "Tasbeeh counter with targets",
      `${DUA_COUNT} duas from Hisnul Muslim`,
    ],
    href: "/features/zikr-tracker",
    cta: "Explore Zikr & tasbeeh",
    shot: {
      src: "/screenshots/zikr.webp",
      alt: "Zikr screen with favorites, search, My adhkar and categories like Morning and Evening Adhkar.",
    },
  },
  {
    id: "quran",
    label: "Qur'an",
    title: "Read, listen and practise the Qur'an",
    text: "The full Qur'an offline with word-by-word and tajweed colours, a khatm plan, and an on-device listener to practise your recitation.",
    points: [
      "Surah, juz and 604-page mushaf",
      "25 translations and tafsir",
      "AI recitation practice",
    ],
    href: "/features/quran",
    cta: "Explore the Qur'an reader",
    shot: {
      src: "/screenshots/quran.webp",
      alt: "Qur'an screen with continue reading for Al-Baqarah, shortcuts to search, pages, juz, learn and khatm.",
    },
  },
];

/** Tabbed tour of the real app (WAI-ARIA tabs pattern, arrow-key navigation). */
export function ProductTour() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active] ?? TABS[0];
  if (!tab) return null;

  const select = (i: number) => {
    setActive(i);
    trackSelectContent({
      content_type: "product_tour",
      item_id: TABS[i]?.id ?? "",
      placement: "home",
    });
  };

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
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
            Inside the app
          </p>
          <h2
            id="tour-title"
            className="mt-3 text-balance font-display text-3xl font-bold tracking-tight text-white md:text-[2.5rem] md:leading-[1.12]"
          >
            One app for your daily worship
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/70">
            Munib Tracker brings your Salah, Qaza, Zikr and Qur&apos;an together, so you can see
            your whole day of worship in one place.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="App features"
          className="mx-auto mt-10 flex w-full max-w-md justify-between gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1.5"
        >
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              id={`${baseId}-tab-${t.id}`}
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
              {t.label}
            </button>
          ))}
        </div>

        <div
          id={`${baseId}-panel`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          className="mt-12 grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16 lg:px-10"
        >
          <div className="order-2 md:order-1">
            <h3 className="font-display text-2xl font-bold text-white md:text-3xl">{tab.title}</h3>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-white/72">{tab.text}</p>
            <ul className="mt-6 flex flex-col gap-3">
              {tab.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-[15px] text-white/85">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-brand/15">
                    <Check aria-hidden className="size-3.5 text-brand" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <Link
              href={tab.href}
              className="group mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
              onClick={() => trackCtaClick("explore_features", "home_tour")}
            >
              {tab.cta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
          <div className="order-1 flex justify-center md:order-2">
            <DeviceFrame
              key={tab.id}
              src={tab.shot.src}
              alt={tab.shot.alt}
              width={960}
              height={2087}
              className="w-[220px] sm:w-[250px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
