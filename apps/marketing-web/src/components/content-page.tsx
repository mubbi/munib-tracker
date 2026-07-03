import type { ReactNode } from "react";

type ContentPageProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

/** Shared shell for long-form marketing/legal pages. */
export function ContentPage({ eyebrow, title, intro, children }: ContentPageProps) {
  return (
    <main className="flex flex-1 flex-col">
      <article className="mx-auto w-full max-w-2xl px-6 py-20 md:px-8">
        {eyebrow ? (
          <p className="text-sm font-medium uppercase tracking-widest text-brand">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        {intro ? <p className="mt-4 text-lg text-muted">{intro}</p> : null}
        <div className="mt-10 flex flex-col gap-8 text-base leading-relaxed">{children}</div>
      </article>
    </main>
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
