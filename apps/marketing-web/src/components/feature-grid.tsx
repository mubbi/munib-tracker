import { APP_HOME_FEATURES, APP_TAGLINE } from "@munib-tracker/shared/constants";
import Link from "next/link";
import { FEATURE_ICONS } from "@/components/icons/feature-icons";
import { Section } from "@/components/section";
import { SITE_PATHS } from "@/lib/site";

export function FeatureGrid() {
  return (
    <Section
      id="features"
      eyebrow="Features"
      title={APP_TAGLINE}
      description="Salah, dhikr, qadha, Qur'an, hadith, audio, and reminders — everything you need to stay consistent on the path back to Allah."
    >
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {APP_HOME_FEATURES.map((feature) => {
          const Icon = FEATURE_ICONS[feature.icon];
          return (
            <li key={feature.id}>
              <article className="reveal-up group flex h-full flex-col rounded-[var(--radius-card)] border border-border/60 bg-card p-6 shadow-sm transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10 text-brand transition-colors group-hover:bg-brand/15">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{feature.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
                <Link
                  href={SITE_PATHS.features}
                  className="mt-4 text-sm font-semibold text-brand transition-opacity hover:opacity-80"
                >
                  Learn more →
                </Link>
              </article>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
