import { APP_ACHIEVEMENTS } from "@munib-tracker/shared/constants";
import type { LucideIcon } from "lucide-react";
import { Award, Flame, Gem, Sparkles, Target, Trophy } from "lucide-react";
import { Section } from "@/components/section";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";

const ICONS: LucideIcon[] = [Gem, Trophy, Flame, Target, Sparkles, Award];

export function AchievementsSection({ align = "center" }: { align?: "center" | "left" }) {
  return (
    <Section
      align={align}
      variant="muted"
      eyebrow="Milestones"
      title="Encouragement that never runs out"
      description="Infinite tracks and growing Noor devotion levels — gentle motivation that scales with you, never shame."
    >
      <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APP_ACHIEVEMENTS.map((badge, index) => {
          const Icon = ICONS[index % ICONS.length] ?? Award;
          return (
            <StaggerItem key={badge.name} className="min-h-full">
              <SpotlightCard className="flex h-full items-start gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gold-soft to-gold text-hero-to">
                  <Icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display font-semibold text-foreground">
                    {badge.name}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">
                    {badge.trigger}
                  </span>
                </span>
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
