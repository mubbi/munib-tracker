import { APP_NAME } from "@munib-tracker/shared/constants";
import type { LucideIcon } from "lucide-react";
import { Apple, Globe, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";
import { StoreBadges } from "@/components/store-badges";
import { Button } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { PRODUCT_APP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download",
  description: `Get ${APP_NAME} on iOS, Android, or in your browser.`,
};

type Platform = {
  icon: LucideIcon;
  name: string;
  status: string;
  available: boolean;
  description: string;
  cta: { label: string; href: string } | null;
};

const PLATFORMS: Platform[] = [
  {
    icon: Globe,
    name: "Web",
    status: "Available now",
    available: true,
    description:
      "Use Munib Tracker in any modern browser. Works offline as a progressive web app with notification support and the full learning library.",
    cta: { label: "Open web app", href: PRODUCT_APP_URL },
  },
  {
    icon: Apple,
    name: "iOS",
    status: "Coming to the App Store",
    available: false,
    description:
      "Native tabs, haptics, compass qibla, widgets, Live Activities, Apple Watch, Siri shortcuts, app lock, and Apple Sign In. TestFlight builds available during beta.",
    cta: null,
  },
  {
    icon: Smartphone,
    name: "Android",
    status: "Coming to Google Play",
    available: false,
    description:
      "Full native experience with magnetometer qibla, home-screen widgets, Wear OS, Assistant shortcuts, app lock, Google Sign In, and local notifications.",
    cta: null,
  },
];

export default function DownloadPage() {
  return (
    <ContentPage
      wide
      eyebrow="Download"
      title="Get the app"
      intro={`${APP_NAME} runs on iOS, Android, and web from one codebase. Start in the browser today — native store listings are on the way.`}
    >
      <Stagger className="grid gap-5 md:grid-cols-3">
        {PLATFORMS.map((platform) => {
          const Icon = platform.icon;
          return (
            <StaggerItem key={platform.name} className="min-h-full">
              <SpotlightCard className="flex h-full flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/15">
                    <Icon className="size-5" />
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      platform.available ? "bg-brand/10 text-brand" : "bg-muted-surface text-muted"
                    }`}
                  >
                    {platform.available ? "Live" : "Soon"}
                  </span>
                </div>
                <p className="mt-4 font-display text-lg font-semibold text-foreground">
                  {platform.name}
                </p>
                <p className="text-sm font-medium text-brand">{platform.status}</p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {platform.description}
                </p>
                {platform.cta ? (
                  <div className="mt-6">
                    <Button href={platform.cta.href} size="sm">
                      {platform.cta.label}
                    </Button>
                  </div>
                ) : null}
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-border/60 bg-surface/60 p-8 text-center">
        <p className="font-display text-lg font-semibold text-foreground">Grab it your way</p>
        <StoreBadges className="justify-center" />
      </div>

      <ContentSection heading="System requirements">
        <ul className="list-inside list-disc text-muted">
          <li>Web: Chrome, Safari, Firefox, or Edge (latest two versions)</li>
          <li>iOS 15+ for the native app (when available)</li>
          <li>Android 8+ for the native app (when available)</li>
          <li>Internet required only for sign-in, sync, and on-demand content downloads</li>
        </ul>
      </ContentSection>

      <ContentSection heading="Guest mode">
        <p className="text-muted">
          No account needed. Install or open the app and start tracking immediately. Export a local
          backup anytime, or sign in with Google or Apple later to sync prayers, qaza, zikr, and
          learning progress across your devices.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
