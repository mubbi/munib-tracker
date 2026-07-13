import {
  CalendarCheck,
  GraduationCap,
  HeartHandshake,
  RotateCcw,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";

const BENEFITS = [
  {
    icon: CalendarCheck,
    title: "Never miss a salah",
    description:
      "Live prayer times, gentle reminders, and an honest daily checklist keep every fard in view.",
  },
  {
    icon: RotateCcw,
    title: "Clear your qaza",
    description:
      "Turn an overwhelming backlog into a daily pace you can keep — with an estimate and an ETA.",
  },
  {
    icon: TrendingUp,
    title: "Build lasting habits",
    description:
      "Streaks, perfect days, and growing Noor levels make consistency feel achievable, never shameful.",
  },
  {
    icon: GraduationCap,
    title: "Learn your deen",
    description:
      "Study aqeedah, seerah, sahaba, Qur'an, and fiqh — 350+ structured lessons with citations, not just tracking.",
  },
  {
    icon: HeartHandshake,
    title: "Prepare for the Akhirah",
    description:
      "Reflect on Jannah, the Last Day, and the path back to Allah — worship with purpose and hope.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    description:
      "Everything works offline and stays on your device. No account required, no ads in the app, optional sync when you want it.",
  },
];

export function Benefits() {
  return (
    <Section
      id="benefits"
      eyebrow="Why Munib"
      title="A companion for the whole journey"
      description="Not another guilt-driven tracker — a calm, complete home for your worship and your growth."
    >
      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map(({ icon: Icon, title, description }) => (
          <StaggerItem key={title}>
            <SpotlightCard className="h-full p-7">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                <Icon className="size-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
