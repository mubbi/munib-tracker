import {
  APP_NAME,
  OFFICIAL_ANDROID_PLAY_STORE_URL,
  OFFICIAL_IOS_APP_STORE_URL,
} from "@munib-tracker/shared/constants";
import type { LucideIcon } from "lucide-react";
import { Apple, Globe, Smartphone, Tv, Watch } from "lucide-react";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";
import { StoreBadges } from "@/components/store-badges";
import { TrackedButton } from "@/components/tracked-button";
import { TrackedWebAppButton } from "@/components/tracked-web-app-button";
import { SpotlightCard } from "@/components/ui/interactive";
import { Stagger, StaggerItem } from "@/components/ui/motion";
import { pageMetadata } from "@/lib/seo";
import { PRODUCT_APP_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/download",
  title: "Download Munib Tracker — Free on iPhone, Android & Web",
  description:
    "Download Munib Tracker free on the App Store or Google Play, or open the web app. No ads and no account needed. Also on Apple Watch, Wear OS and TV.",
});

type Platform = {
  icon: LucideIcon;
  name: string;
  status: string;
  description: string;
  cta:
    | { kind: "web"; label: string; href: string }
    | { kind: "store"; label: string; href: string; cta: "get_app" }
    | null;
};

const PLATFORMS: Platform[] = [
  {
    icon: Globe,
    name: "Web",
    status: "Available now",
    description:
      "Use Munib Tracker in any modern browser. Works offline as a progressive web app with notification support and the full learning library.",
    cta: { kind: "web", label: "Open web app", href: PRODUCT_APP_URL },
  },
  {
    icon: Apple,
    name: "iPhone & iPad",
    status: "App Store",
    description:
      "Native tabs, haptics, compass Qibla, widgets, Live Activities, Siri shortcuts, the Salah focus lock, app lock, and Sign in with Apple.",
    cta: {
      kind: "store",
      label: "Open App Store",
      href: OFFICIAL_IOS_APP_STORE_URL,
      cta: "get_app",
    },
  },
  {
    icon: Smartphone,
    name: "Android",
    status: "Google Play",
    description:
      "Phones and tablets, with compass Qibla, home-screen widgets, Live Updates, Assistant shortcuts, the Salah focus lock, app lock, and Google sign-in.",
    cta: {
      kind: "store",
      label: "Open Google Play",
      href: OFFICIAL_ANDROID_PLAY_STORE_URL,
      cta: "get_app",
    },
  },
  {
    icon: Watch,
    name: "Apple Watch & Wear OS",
    status: "With the phone app",
    description:
      "See the next Salah and mark it from your wrist, with complications on Apple Watch and Salah and Tasbeeh tiles on Wear OS. Installs alongside the phone app.",
    cta: null,
  },
  {
    icon: Tv,
    name: "Apple TV & Android TV",
    status: "App Store and Google Play",
    description:
      "Read the Qur'an, follow adhkar and check your tracker on the big screen, designed for the remote.",
    cta: null,
  },
];

export default function DownloadPage() {
  return (
    <ContentPage
      path="/download"
      wide
      eyebrow="Download"
      title="Get the app"
      intro={`${APP_NAME} runs on iPhone, iPad, Android, the web, Apple Watch, Wear OS, Apple TV and Android TV. Install from the stores or start in your browser.`}
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
                  <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand">
                    Available
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
                    {platform.cta.kind === "web" ? (
                      <TrackedWebAppButton href={platform.cta.href} label={platform.cta.label} />
                    ) : (
                      <TrackedButton
                        href={platform.cta.href}
                        cta={platform.cta.cta}
                        placement="download"
                        size="sm"
                      >
                        {platform.cta.label}
                      </TrackedButton>
                    )}
                  </div>
                ) : null}
              </SpotlightCard>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="flex flex-col items-center gap-4 rounded-[var(--radius-card)] border border-border/60 bg-surface/60 p-8 text-center">
        <p className="font-display text-lg font-semibold text-foreground">Grab it your way</p>
        <StoreBadges className="justify-center" placement="download" />
      </div>

      <ContentSection heading="System requirements">
        <ul className="list-inside list-disc text-muted">
          <li>Web: Chrome, Safari, Firefox, or Edge (latest two versions)</li>
          <li>iPhone and iPad: iOS 16.4 or later (widgets and Live Activities need iOS 17)</li>
          <li>Android: Android 7 (API 24) or later</li>
          <li>Apple Watch: watchOS 10 or later · Wear OS: Android 11 (API 30) or later</li>
          <li>Apple TV: tvOS 17 or later · Android TV: Android 12 (API 31) or later</li>
          <li>Internet required only for sign-in, sync, and on-demand content downloads</li>
        </ul>
      </ContentSection>

      <ContentSection heading="Guest mode">
        <p className="text-muted">
          No account needed for personal use. Install or open the app and start tracking straight
          away. Export a local backup anytime, or sign in with Google, Apple or Facebook to sync
          your Salah, Qaza, Zikr and learning progress across devices, or to use family circles, an
          accountability partner and group khatm.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
