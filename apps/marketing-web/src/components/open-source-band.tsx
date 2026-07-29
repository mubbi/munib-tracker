import { APP_NAME } from "@munib-tracker/shared/constants";
import { ArrowRight, GitFork, Scale, Users } from "lucide-react";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { OPEN_SOURCE_SUMMARY } from "@/lib/open-source";
import { GITHUB_REPO_URL, SITE_PATHS } from "@/lib/site";

const HIGHLIGHTS = [
  {
    icon: GitFork,
    title: "Free to fork",
    description: "Use and adapt the code for personal and educational projects — keep the credit.",
  },
  {
    icon: Scale,
    title: "Non-commercial license",
    description:
      "PolyForm Noncommercial: share and improve freely, but do not sell the app or custom builds.",
  },
  {
    icon: Users,
    title: "Built with contributors",
    description: "Code, translations, reviews, and content corrections from the community.",
  },
] as const;

export function OpenSourceBand() {
  return (
    <Section
      id="open-source"
      variant="muted"
      eyebrow="Open source"
      title={`${APP_NAME} is open on GitHub`}
      description={OPEN_SOURCE_SUMMARY}
    >
      <p className="mx-auto mb-8 max-w-2xl text-center text-sm text-muted">
        We do not accept sponsorship, funding, or donations. Do not send money to anyone in the name
        of {APP_NAME}.
      </p>

      <Stagger className="grid gap-5 sm:grid-cols-3">
        {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
          <StaggerItem key={title}>
            <SpotlightCard className="h-full p-6">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </SpotlightCard>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button href={SITE_PATHS.openSource} size="lg">
          Open source details
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <Button href={GITHUB_REPO_URL} variant="outline" size="lg">
          View on GitHub
        </Button>
        <Button href={SITE_PATHS.contributors} variant="ghost" size="lg">
          Contributors
        </Button>
      </div>
    </Section>
  );
}
