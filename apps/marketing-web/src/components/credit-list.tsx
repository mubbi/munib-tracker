"use client";

import { TrackedLink } from "@/components/tracked-link";

type CreditSource = {
  name: string;
  attribution: string;
  license: string;
  url: string;
  note?: string;
};

export function CreditList({ sources }: { sources: readonly CreditSource[] }) {
  return (
    <div className="flex flex-col gap-4">
      {sources.map((source) => (
        <article
          key={source.name}
          className="rounded-[var(--radius-card)] border border-border/50 bg-card p-5"
        >
          <h3 className="font-semibold">
            <TrackedLink
              href={source.url}
              className="text-brand hover:underline"
              track="outbound"
              linkText={source.name}
              placement="credits"
            >
              {source.name}
            </TrackedLink>
          </h3>
          <p className="mt-2 text-sm text-muted">{source.attribution}</p>
          <p className="mt-1 text-xs text-muted/80">{source.license}</p>
          {source.note ? <p className="mt-1 text-xs italic text-muted/70">{source.note}</p> : null}
        </article>
      ))}
    </div>
  );
}
