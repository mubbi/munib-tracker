import { APP_ACHIEVEMENTS } from "@munib-tracker/shared/constants";
import { Section } from "@/components/section";

export function AchievementsSection() {
  return (
    <Section
      variant="muted"
      eyebrow="Milestones"
      title="Celebrate progress on the journey"
      description="Five infinite tracks and devotion levels — gentle encouragement that grows with you, never runs out."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {APP_ACHIEVEMENTS.map((badge) => (
          <div
            key={badge.name}
            className="flex items-start gap-4 rounded-[var(--radius-card)] border border-border/50 bg-card p-5"
          >
            <span
              aria-hidden
              className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-lg"
            >
              ★
            </span>
            <div>
              <h3 className="font-semibold">{badge.name}</h3>
              <p className="mt-1 text-sm text-muted">{badge.trigger}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
