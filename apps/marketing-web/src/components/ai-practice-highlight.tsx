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
import { useLocale, useTranslations } from "next-intl";
import { Section } from "@/components/section";
import { TrackedLink } from "@/components/tracked-link";
import { buttonClass } from "@/components/ui/button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/motion";
import type { CtaPlacement } from "@/lib/analytics";
import { PRACTICE_DEMO_AYAH } from "@/lib/practice-demo-ayah";
import { productAppUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Landing-page spotlight for Qur'an practice — the app's on-device AI listener.
 *
 * Wording rule (Qur'an practice, NF-2.38): the listener *follows*
 * your recitation. Never promise "mistake detection", "tajweed correction", or a score.
 */
const POINTS = [
  { id: "follow", icon: Mic },
  { id: "memorize", icon: EyeOff },
  { id: "revise", icon: CalendarClock },
  { id: "private", icon: ShieldCheck },
] as const;

const CHIPS = [
  { id: "onDevice", icon: Sparkles },
  { id: "offline", icon: WifiOff },
  { id: "free", icon: ShieldCheck },
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
  const t = useTranslations("home.aiPractice");
  return (
    <Section
      id="quran-practice"
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("description")}
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
            <ul className="flex flex-wrap gap-2" aria-label={t("chipsLabel")}>
              {CHIPS.map(({ id, icon: Icon }) => (
                <li
                  key={id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-xs font-semibold text-brand"
                >
                  <Icon className="size-3.5" aria-hidden />
                  {t(`chips.${id}`)}
                </li>
              ))}
            </ul>

            <Stagger className="mt-7 grid gap-5 sm:grid-cols-2">
              {POINTS.map(({ id, icon: Icon }) => (
                <StaggerItem key={id}>
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {t(`points.${id}.title`)}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {t(`points.${id}.body`)}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <PracticeCtas
              className="mt-8"
              placement="home_ai_practice"
              tryLabel={t("tryPractice")}
              howLabel={t("howItWorks")}
            />
            <p className="mt-4 text-xs leading-relaxed text-muted">{t("footnote")}</p>
          </div>

          <Reveal delay={0.1}>
            <PracticePreview />
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

function PracticeCtas({
  className,
  placement,
  tryLabel,
  howLabel,
}: {
  className?: string;
  placement: CtaPlacement;
  tryLabel: string;
  howLabel: string;
}) {
  const locale = useLocale();
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <TrackedLink
        href={productAppUrl(locale, "/quran/practice")}
        className={buttonClass("primary", "md")}
        track="cta"
        cta="try_quran_practice"
        placement={placement}
      >
        <Mic className="size-4" aria-hidden />
        {tryLabel}
      </TrackedLink>
      <TrackedLink
        href="/features/quran-practice"
        className={buttonClass("outline", "md")}
        track="cta"
        cta="explore_features"
        placement={placement}
      >
        {howLabel}
      </TrackedLink>
    </div>
  );
}

/** A static, illustrative mock of a practice session (not a screenshot). */
export function PracticePreview() {
  const t = useTranslations("home.practicePreview");
  return (
    <figure
      className="relative mx-auto w-full max-w-sm rounded-[1.75rem] border border-border/70 bg-background/80 p-5 shadow-[var(--shadow-card)] backdrop-blur"
      aria-label={t("label")}
    >
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-semibold text-foreground">
          {t("heading", { ayah: PRACTICE_DEMO_AYAH.ayah })}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-2.5 py-1 font-semibold text-brand">
          <span className="size-1.5 animate-pulse rounded-full bg-brand" aria-hidden />
          {t("listening")}
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
        <Legend className="bg-brand" label={t("legend.heard")} />
        <Legend className="bg-amber-400" label={t("legend.tryAgain")} />
        <Legend className="ring-2 ring-brand" label={t("legend.upNext")} />
      </ul>

      <div className="mt-6 flex items-center justify-center gap-5">
        <MockControl icon={Volume2} label={t("controls.hear")} />
        <div className="relative flex size-16 items-center justify-center">
          <span
            aria-hidden
            className="absolute inset-0 animate-ping rounded-full bg-brand/30 motion-reduce:animate-none"
          />
          <span className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-b from-brand to-brand-strong text-white shadow-lg">
            <Mic className="size-7" aria-hidden />
          </span>
        </div>
        <MockControl icon={CircleCheck} label={t("controls.end")} accent />
      </div>

      <figcaption className="mt-5 text-center text-xs text-muted">{t("caption")}</figcaption>
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
