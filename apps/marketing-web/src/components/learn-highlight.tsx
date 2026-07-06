import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  Flame,
  GraduationCap,
  Languages,
  Scale,
  ScrollText,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";

const AREAS: { icon: LucideIcon; title: string; meta: string }[] = [
  { icon: BookOpenCheck, title: "Aqeedah", meta: "27 lessons on the articles of faith" },
  { icon: Users, title: "The Prophets", meta: "25 prophets with a timeline" },
  { icon: Swords, title: "Seerah & battles", meta: "26-event life + major battles" },
  { icon: Sparkles, title: "Jannah", meta: "51 topics · the eight gates" },
  { icon: Flame, title: "Jahannam", meta: "The seven names & repentance" },
  { icon: Scale, title: "The Last Day", meta: "29 lessons + an interactive quiz" },
  { icon: Languages, title: "Learn the Qur'an", meta: "Letters, tajweed & memorization" },
  { icon: ScrollText, title: "Fiqh guides", meta: "Salah, zakat, hajj & purification" },
];

export function LearnHighlight() {
  return (
    <Section
      id="learn"
      eyebrow="Learn, don't just track"
      title="A scholar-checked library in your pocket"
      description="Every lesson is referenced to the Qur'an and authenticated hadith, with per-topic progress so you always know where you are."
    >
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AREAS.map(({ icon: Icon, title, meta }) => (
          <StaggerItem key={title}>
            <SpotlightCard className="h-full">
              <Link href={SITE_PATHS.learn} className="flex h-full items-start gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-base font-semibold text-foreground">
                    {title}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{meta}</span>
                </span>
              </Link>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-10 flex justify-center">
        <Link
          href={SITE_PATHS.learn}
          className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand ring-1 ring-brand/20 transition-colors hover:bg-brand/15"
        >
          <GraduationCap className="size-4" />
          Explore the learning library
        </Link>
      </div>
    </Section>
  );
}
