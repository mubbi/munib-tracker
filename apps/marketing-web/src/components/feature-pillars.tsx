import type { AppFeaturePillar } from "@munib-tracker/shared/constants";
import { APP_FEATURE_PILLARS } from "@munib-tracker/shared/constants";
import Link from "next/link";
import { Section } from "@/components/section";
import { SITE_PATHS } from "@/lib/site";

function PillarCard({ pillar }: { pillar: AppFeaturePillar }) {
  return (
    <article className="group flex h-full flex-col rounded-[var(--radius-card)] border border-border/60 bg-card p-7 shadow-sm transition-shadow hover:shadow-md">
      <h3 className="text-xl font-semibold tracking-tight text-card-foreground">{pillar.title}</h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{pillar.summary}</p>
      <ul className="mt-5 flex flex-col gap-2 border-t border-border/40 pt-5">
        {pillar.highlights.slice(0, 3).map((item) => (
          <li key={item} className="flex gap-2 text-sm text-muted">
            <span aria-hidden className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function FeaturePillars({ limit }: { limit?: number }) {
  const pillars = limit ? APP_FEATURE_PILLARS.slice(0, limit) : APP_FEATURE_PILLARS;

  return (
    <Section
      id="pillars"
      eyebrow="Your companion"
      title="Tools for every step of the journey"
      description="From daily salah to clearing qaza and remembering Allah — Munib Tracker walks with you."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <PillarCard key={pillar.id} pillar={pillar} />
        ))}
      </div>
      {limit && limit < APP_FEATURE_PILLARS.length ? (
        <p className="mt-12 text-center">
          <Link
            href={SITE_PATHS.features}
            className="inline-flex items-center gap-1 font-semibold text-brand transition-opacity hover:opacity-80"
          >
            See all features
            <span aria-hidden>→</span>
          </Link>
        </p>
      ) : null}
    </Section>
  );
}
