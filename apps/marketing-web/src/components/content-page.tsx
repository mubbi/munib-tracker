import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Aurora } from "@/components/ui/backgrounds";
import { Reveal } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";
import { cn } from "@/lib/utils";

type ContentPageProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
  wide?: boolean;
};

/** Shared shell for long-form marketing/legal pages. */
export function ContentPage({ eyebrow, title, intro, children, wide = false }: ContentPageProps) {
  return (
    <div className="relative flex flex-1 flex-col">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[26rem]">
        <Aurora className="opacity-70" />
      </div>
      <article
        className={cn(
          "relative mx-auto w-full px-6 py-14 md:px-8 md:py-20",
          wide ? "max-w-4xl" : "max-w-3xl",
        )}
      >
        <Link
          href={SITE_PATHS.home}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-brand"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Link>
        <Reveal>
          {eyebrow ? (
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-3 text-balance font-display text-4xl font-extrabold tracking-tight md:text-5xl">
            {title}
          </h1>
          {intro ? (
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">{intro}</p>
          ) : null}
        </Reveal>
        <div className="mt-12 flex flex-col gap-10 text-base leading-relaxed">{children}</div>
      </article>
    </div>
  );
}

/** A titled section within a `ContentPage`. */
export function ContentSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
        {heading}
      </h2>
      {children}
    </section>
  );
}
