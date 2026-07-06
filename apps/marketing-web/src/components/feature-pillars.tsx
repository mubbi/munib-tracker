import type { AppFeaturePillar } from "@munib-tracker/shared/constants";
import { APP_FEATURE_PILLARS } from "@munib-tracker/shared/constants";
import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Check,
  Compass,
  GraduationCap,
  Hand,
  Languages,
  ListChecks,
  Palette,
  RotateCcw,
  ScrollText,
  Search,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";

const ICONS: Record<string, LucideIcon> = {
  prayer: ListChecks,
  qaza: RotateCcw,
  dhikr: Hand,
  library: BookOpen,
  learn: GraduationCap,
  "quran-learning": Languages,
  guides: ScrollText,
  times: Compass,
  insights: BarChart3,
  search: Search,
  personalize: Palette,
  privacy: ShieldCheck,
  platform: Smartphone,
};

function PillarCard({ pillar }: { pillar: AppFeaturePillar }) {
  const Icon = ICONS[pillar.id] ?? Check;
  return (
    <SpotlightCard className="h-full p-7">
      <div className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
        <Icon className="size-5" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{pillar.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.summary}</p>
      <ul className="mt-5 flex flex-col gap-2 border-t border-border/50 pt-5">
        {pillar.highlights.slice(0, 3).map((item) => (
          <li key={item} className="flex gap-2.5 text-sm text-muted">
            <Check className="mt-0.5 size-4 shrink-0 text-brand" />
            {item}
          </li>
        ))}
      </ul>
    </SpotlightCard>
  );
}

export function FeaturePillars({ limit }: { limit?: number }) {
  const pillars = limit ? APP_FEATURE_PILLARS.slice(0, limit) : APP_FEATURE_PILLARS;

  return (
    <Section
      id="pillars"
      eyebrow="Your companion"
      title="Tools for every step of the journey"
      description="From daily salah to clearing qaza, learning your deen, and remembering Allah — Munib Tracker walks with you."
    >
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <StaggerItem key={pillar.id} className="min-h-full">
            <PillarCard pillar={pillar} />
          </StaggerItem>
        ))}
      </Stagger>
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
