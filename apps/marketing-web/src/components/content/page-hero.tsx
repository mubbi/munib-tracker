import type { ReactNode } from "react";
import { Breadcrumbs, Screenshot } from "@/components/content/primitives";
import { PageAtmosphere } from "@/components/content-page";
import type { ScreenshotSlot } from "@/content/types";
import type { Crumb } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/**
 * Shared hero for every template page: breadcrumbs, eyebrow, the single H1,
 * an intro, optional actions, and an optional real screenshot (or any visual).
 */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  actions,
  screenshot,
  visual,
  meta,
}: {
  crumbs: readonly Crumb[];
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  actions?: ReactNode;
  screenshot?: ScreenshotSlot | null;
  /** Custom visual when there is no screenshot. */
  visual?: ReactNode;
  /** Small line under the intro (dates, reading time). */
  meta?: ReactNode;
}) {
  const side = screenshot ? (
    <Screenshot slot={screenshot} priority showCaption={false} className="w-[230px] sm:w-[260px]" />
  ) : (
    visual
  );
  return (
    <header className="relative overflow-hidden">
      <PageAtmosphere />
      <div
        className={cn(
          "relative mx-auto grid max-w-6xl gap-10 px-5 pb-12 pt-6 md:px-8 md:pb-16 md:pt-10",
          Boolean(side) && "lg:grid-cols-[1.25fr_0.75fr] lg:items-center lg:gap-14",
        )}
      >
        <div>
          <Breadcrumbs items={crumbs} />
          {eyebrow ? (
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-brand md:mt-10">
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "max-w-3xl text-balance font-display text-[2.35rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.35rem]",
              eyebrow ? "mt-3" : "mt-8 md:mt-10",
            )}
          >
            {title}
          </h1>
          {intro ? (
            <div className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/75 md:mt-6 md:text-xl md:leading-relaxed">
              {intro}
            </div>
          ) : null}
          {meta ? <div className="mt-5 text-sm text-white/50">{meta}</div> : null}
          {actions ? <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
        {side ? <div className="flex justify-center lg:justify-end">{side}</div> : null}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />
    </header>
  );
}
