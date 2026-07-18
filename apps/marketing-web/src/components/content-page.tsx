import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Soft radial wash under the sticky chrome — fades out, no hard band. */
export function PageAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[28rem]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_-5%,rgba(52,211,153,0.10),transparent_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_12%_18%,rgba(226,192,138,0.07),transparent_60%)]" />
    </div>
  );
}

type PageMastheadProps = {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Optional CTAs or secondary content under the intro. */
  actions?: ReactNode;
  className?: string;
};

/**
 * Shared page masthead for marketing/content pages — back link, eyebrow,
 * title, intro, optional actions, and a soft hairline before body content.
 */
export function PageMasthead({ eyebrow, title, intro, actions, className }: PageMastheadProps) {
  return (
    <header className={cn("relative pb-12 md:pb-16", className)}>
      <Link
        href={SITE_PATHS.home}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-white/55 transition-colors hover:text-brand"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>
      <Reveal>
        {eyebrow ? (
          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-brand md:mt-12">
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "max-w-3xl text-balance font-display text-4xl font-extrabold tracking-tight text-white md:text-5xl",
            eyebrow ? "mt-3" : "mt-10 md:mt-12",
          )}
        >
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-white/70 md:mt-6">
            {intro}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">{actions}</div>
        ) : null}
      </Reveal>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />
    </header>
  );
}

type ContentPageProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  wide?: boolean;
  actions?: ReactNode;
};

/** Shared shell for long-form marketing/legal pages. */
export function ContentPage({
  eyebrow,
  title,
  intro,
  children,
  wide = false,
  actions,
}: ContentPageProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <PageAtmosphere />
      <article
        className={cn(
          "relative mx-auto w-full px-6 pb-20 pt-8 md:px-8 md:pb-28 md:pt-12",
          wide ? "max-w-4xl" : "max-w-3xl",
        )}
      >
        <PageMasthead eyebrow={eyebrow} title={title} intro={intro} actions={actions} />
        <div className="mt-10 flex flex-col gap-12 md:mt-12">{children}</div>
      </article>
    </div>
  );
}

/** A titled section within a `ContentPage`. */
export function ContentSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold tracking-tight text-white">{heading}</h2>
      {children}
    </section>
  );
}
