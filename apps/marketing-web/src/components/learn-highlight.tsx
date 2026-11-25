import {
  BookOpenCheck,
  Flame,
  GraduationCap,
  Hand,
  Languages,
  Scale,
  ScrollText,
  Sparkles,
  Swords,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/section";
import { TrackedLink } from "@/components/tracked-link";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { SITE_PATHS } from "@/lib/site";

const AREAS = [
  {
    id: "aqeedah",
    href: "/learn#creed",
    icon: BookOpenCheck,
  },
  {
    id: "prophets",
    href: "/learn#creed",
    icon: Users,
  },
  {
    id: "seerah",
    href: "/learn#creed",
    icon: Swords,
  },
  {
    id: "jannah",
    href: "/learn#creed",
    icon: Sparkles,
  },
  {
    id: "jahannam",
    href: "/learn#creed",
    icon: Flame,
  },
  {
    id: "last_day",
    href: "/learn#creed",
    icon: Scale,
  },
  {
    id: "learn_quran",
    href: "/features/learn-quran",
    icon: Languages,
  },
  {
    id: "learn_dua",
    href: "/learn#life-guides",
    icon: Hand,
  },
  {
    id: "fiqh_guides",
    href: "/learn#worship-guides",
    icon: ScrollText,
  },
] as const;

export function LearnHighlight() {
  const t = useTranslations("home.learn");
  return (
    <Section id="learn" eyebrow={t("eyebrow")} title={t("title")} description={t("description")}>
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AREAS.map(({ id, icon: Icon, href }) => (
          <StaggerItem key={id}>
            <SpotlightCard className="h-full">
              <TrackedLink
                href={href}
                className="flex h-full items-start gap-4 p-6"
                track="select_content"
                contentType="learn_area"
                itemId={id}
                placement="home_learn"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand ring-1 ring-brand/15">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-base font-semibold text-foreground">
                    {t(`areas.${id}.title`)}
                  </span>
                  <span className="mt-1 block text-sm text-muted">{t(`areas.${id}.meta`)}</span>
                </span>
              </TrackedLink>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>
      <div className="mt-10 flex justify-center">
        <TrackedLink
          href={SITE_PATHS.learn}
          className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-5 py-2.5 text-sm font-semibold text-brand ring-1 ring-brand/20 transition-colors hover:bg-brand/15"
          track="cta"
          cta="explore_library"
          placement="home_learn"
        >
          <GraduationCap className="size-4" />
          {t("explore")}
        </TrackedLink>
      </div>
    </Section>
  );
}
