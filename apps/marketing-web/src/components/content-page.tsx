import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_PATHS } from "@/lib/site";

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
    <div className="flex flex-1 flex-col">
      <article
        className={`mx-auto w-full px-6 py-16 md:px-8 md:py-20 ${wide ? "max-w-4xl" : "max-w-2xl"}`}
      >
        <Link
          href={SITE_PATHS.home}
          className="text-sm font-medium text-muted transition-colors hover:text-brand"
        >
          ← Back to home
        </Link>
        {eyebrow ? (
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {intro ? <p className="mt-4 text-lg leading-relaxed text-muted">{intro}</p> : null}
        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed">{children}</div>
      </article>
    </div>
  );
}

/** A titled section within a `ContentPage`. */
export function ContentSection({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xl font-semibold tracking-tight">{heading}</h2>
      {children}
    </section>
  );
}
