import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";
import { CtaButton } from "@/components/cta-button";
import { PRODUCT_APP_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Download",
  description: `Get ${APP_NAME} on iOS, Android, or in your browser.`,
};

const PLATFORMS = [
  {
    name: "Web",
    status: "Available now",
    description:
      "Use Munib Tracker in any modern browser. Works offline as a progressive web app with notification support.",
    cta: { label: "Open web app", href: PRODUCT_APP_URL },
  },
  {
    name: "iOS",
    status: "Coming to App Store",
    description:
      "Native tabs, haptics, compass qibla, and Apple Sign In. TestFlight builds available during beta.",
    cta: null,
  },
  {
    name: "Android",
    status: "Coming to Google Play",
    description:
      "Full native experience with magnetometer qibla, Google Sign In, and local notifications.",
    cta: null,
  },
] as const;

export default function DownloadPage() {
  return (
    <ContentPage
      wide
      eyebrow="Download"
      title="Get the app"
      intro={`${APP_NAME} runs on iOS, Android, and web from one codebase. Start in the browser today — native store listings are on the way.`}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {PLATFORMS.map((platform) => (
          <article
            key={platform.name}
            className="flex flex-col rounded-[var(--radius-card)] border border-border/60 bg-card p-6"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              {platform.name}
            </p>
            <p className="mt-2 text-lg font-semibold">{platform.status}</p>
            <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{platform.description}</p>
            {platform.cta ? (
              <div className="mt-6">
                <CtaButton href={platform.cta.href}>{platform.cta.label}</CtaButton>
              </div>
            ) : null}
          </article>
        ))}
      </div>

      <ContentSection heading="System requirements">
        <ul className="list-inside list-disc text-muted">
          <li>Web: Chrome, Safari, Firefox, or Edge (latest two versions)</li>
          <li>iOS 15+ for native app (when available)</li>
          <li>Android 8+ for native app (when available)</li>
          <li>Internet required only for sign-in, sync, and on-demand content downloads</li>
        </ul>
      </ContentSection>

      <ContentSection heading="Guest mode">
        <p className="text-muted">
          No account needed. Install or open the app and start tracking immediately. Sign in with
          Google or Apple later to back up prayers, qaza, and zikr across your devices.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
