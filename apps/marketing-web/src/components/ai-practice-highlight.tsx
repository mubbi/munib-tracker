"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarClock,
  CircleCheck,
  EyeOff,
  Mic,
  ShieldCheck,
  Sparkles,
  Volume2,
  WifiOff,
} from "lucide-react";
import { Section } from "@/components/section";
import { TrackedLink } from "@/components/tracked-link";
import { buttonClass } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { CtaPlacement } from "@/lib/analytics";
import { PRACTICE_DEMO_AYAH } from "@/lib/practice-demo-ayah";
import { PRODUCT_APP_URL, SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Landing-page spotlight for Qur'an practice — the app's on-device AI listener.
 *
 * Wording rule (Qur'an practice, NF-2.38): the listener *follows*
 * your recitation. Never promise "mistake detection", "tajweed correction", or a score.
 */
const POINTS: { id: string; icon: LucideIcon; title: string; body: string }[] = [
  {
    id: "follow",
    icon: Mic,
    title: "Follows you word by word",
    body: "Recite at your own pace. Words light up as the listener hears them, and any it couldn't follow get a gentle try-again mark. No scores.",
  },
  {
    id: "memorize",
    icon: EyeOff,
    title: "Built for memorization",
    body: "Hide words or whole ayahs and recite from memory. Each word appears as you reach it, and you can tap any word to hear it.",
  },
  {
    id: "revise",
    icon: CalendarClock,
    title: "Revision that remembers",
    body: "Passages you practise come back for review after 1, 3, 7, 14, and 30 days, with an optional daily reminder.",
  },
  {
    id: "private",
    icon: ShieldCheck,
    title: "Private by design",
    body: "Your recitation is processed on your device. It is never recorded, stored, or uploaded. Only counts and ayah numbers are kept.",
  },
];

const CHIPS = [
  { icon: Sparkles, label: "AI on your device" },
  { icon: WifiOff, label: "Works offline" },
  { icon: ShieldCheck, label: "Free, no account" },
] as const;

type DemoState = "heard" | "tryAgain" | "next" | "hidden";

/** Illustrative states for the preview — one per word of the demo ayah. */
const DEMO_STATES: readonly DemoState[] = ["heard", "heard", "tryAgain", "next"];

const STATE_CLASS: Record<DemoState, string> = {
  heard: "bg-brand/15 text-foreground ring-brand/40",
  tryAgain: "bg-amber-400/15 text-foreground ring-amber-400/60",
  next: "bg-muted-surface text-foreground ring-brand ring-2 animate-pulse",
  hidden: "bg-muted-surface text-transparent ring-border",
};

export function AiPracticeHighlight() {
  return (
    <Section
      id="quran-practice"
      eyebrow="New · Qur'an practice with AI"
      title="Recite, and it follows along"
      description="An AI listener that runs on your phone follows your recitation word by word, so you can memorize and revise the Qur'an on your own, privately and for free."
    >
      <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-brand/30 bg-card/80 p-6 shadow-[var(--shadow-card)] md:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-brand/20 blur-[110px]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-36 -left-24 size-80 rounded-full bg-gold/15 blur-[110px]"
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <ul className="flex flex-wrap gap-2" aria-label="Highlights">
              {CHIPS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
                >
                  <Icon className="size-3.5" aria-hidden />
                  {label}
                </li>
              ))}
            </ul>

            <Stagger className="mt-7 grid gap-5 sm:grid-cols-2">
              {POINTS.map(({ id, icon: Icon, title, body }) => (
                <StaggerItem key={id}>
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <PracticeCtas className="mt-8" placement="home_ai_practice" />
            <p className="mt-4 text-xs leading-relaxed text-muted">
              The listener is a one-time optional download (about 70&nbsp;MB) on iOS, Android, and
              the web. It helps you practise; it is not a replacement for a teacher.
            </p>
          </div>

          <Reveal delay={0.1}>
            <PracticePreview />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/**
 * Compact banner for inner pages (e.g. /features): the same story in one card,
 * with the session preview beside it on wide screens.
 */
export function AiPracticeBanner({ placement }: { placement: CtaPlacement }) {
  return (
    <section
      id="quran-practice"
      aria-labelledby="ai-practice-banner-title"
      className="relative overflow-hidden rounded-[var(--radius-card)] border border-brand/30 bg-card/80 p-6 shadow-[var(--shadow-card)] md:p-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-brand/20 blur-[110px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-36 -left-24 size-72 rounded-full bg-gold/15 blur-[110px]"
      />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-gold-soft to-gold px-3 py-1 text-xs font-bold text-hero-to">
            <Sparkles className="size-3.5" aria-hidden />
            New · AI feature
          </span>
          <h2
            id="ai-practice-banner-title"
            className="mt-4 text-balance font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl"
          >
            Qur&apos;an practice with AI
          </h2>
          <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">
            Recite, and an AI listener on your phone follows you word by word. Hide words or whole
            ayahs to test your memorization, hear any word again, and let a spaced revision queue
            bring passages back before they fade. Your audio never leaves the device.
          </p>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Highlights">
            {CHIPS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
              >
                <Icon className="size-3.5" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
          <PracticeCtas className="mt-7" placement={placement} />
        </div>
        <PracticePreview />
      </div>
    </section>
  );
}

function PracticeCtas({ className, placement }: { className?: string; placement: CtaPlacement }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <TrackedLink
        href={`${PRODUCT_APP_URL}/quran/practice`}
        className={buttonClass("primary", "md")}
        track="cta"
        cta="try_quran_practice"
        placement={placement}
      >
        <Mic className="size-4" aria-hidden />
        Try Qur&apos;an practice
      </TrackedLink>
      <TrackedLink
        href={SITE_PATHS.download}
        className={buttonClass("outline", "md")}
        track="cta"
        cta="get_app"
        placement={placement}
      >
        Get the app
      </TrackedLink>
    </div>
  );
}

/** A static, illustrative mock of a practice session (not a screenshot). */
function PracticePreview() {
  return (
    <figure
      className="relative mx-auto w-full max-w-sm rounded-[1.75rem] border border-border/70 bg-background/80 p-5 shadow-[var(--shadow-card)] backdrop-blur"
      aria-label="Illustration of a Qur'an practice session"
    >
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-semibold text-foreground">Al-Fatiha · Ayah 2</span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-semibold text-brand">
          <span className="size-1.5 animate-pulse rounded-full bg-brand" aria-hidden />
          Listening
        </span>
      </div>

      <p
        lang="ar"
        dir="rtl"
        className="mt-6 flex flex-wrap justify-center gap-2 font-quran text-[1.9rem] leading-[2.6]"
      >
        {PRACTICE_DEMO_AYAH.words.map((word, i) => {
          const state = DEMO_STATES[i] ?? "hidden";
          return (
            <span
              key={`${PRACTICE_DEMO_AYAH.surah}:${PRACTICE_DEMO_AYAH.ayah}:${word}`}
              className={cn("rounded-xl px-2.5 ring-1 transition-colors", STATE_CLASS[state])}
            >
              {word}
            </span>
          );
        })}
      </p>

      <ul className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-muted">
        <Legend className="bg-brand" label="Heard" />
        <Legend className="bg-amber-400" label="Try again" />
        <Legend className="ring-2 ring-brand" label="Up next" />
      </ul>

      <div className="mt-6 flex items-center justify-center gap-5">
        <MockControl icon={Volume2} label="Hear" />
        <div className="relative flex size-16 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-brand/30 motion-reduce:animate-none"
          />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-b from-brand to-brand-strong text-white shadow-lg">
            <Mic className="size-7" aria-hidden />
          </span>
        </div>
        <MockControl icon={CircleCheck} label="End" accent />
      </div>

      <figcaption className="mt-5 text-center text-xs text-muted">
        Audio stays on your device
      </figcaption>
    </figure>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-1.5">
      <span aria-hidden className={cn("size-2.5 rounded-full", className)} />
      {label}
    </li>
  );
}

function MockControl({
  icon: Icon,
  label,
  accent = false,
}: {
  icon: LucideIcon;
  label: string;
  accent?: boolean;
}) {
  return (
    <span className="flex flex-col items-center gap-1 text-[0.7rem] text-muted">
      <span className="flex size-11 items-center justify-center rounded-full border border-border bg-muted-surface">
        <Icon className={cn("size-5", accent ? "text-brand" : "text-foreground")} aria-hidden />
      </span>
      {label}
    </span>
  );
}
