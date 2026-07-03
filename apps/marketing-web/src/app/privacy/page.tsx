import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${APP_NAME} handles your data — offline-first, with optional account sync.`,
};

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`${APP_NAME} is built to protect your privacy. Your worship data belongs to you.`}
    >
      <ContentSection heading="Data stored on your device">
        <p className="text-muted">
          By default, all of your tracking data — prayers, dhikr counts, qadha counters, notes, and
          preferences — is stored locally on your device. It never leaves your phone unless you
          explicitly choose to create an account and enable cloud sync.
        </p>
      </ContentSection>

      <ContentSection heading="Optional account & sync">
        <p className="text-muted">
          If you sign in with Google, Apple, or Facebook, we store the minimum needed to sync your
          data across devices: an account identifier, your email and display name from the provider,
          and the worship records you choose to sync. We do not sell your data or use it for
          advertising.
        </p>
      </ContentSection>

      <ContentSection heading="No third-party tracking">
        <p className="text-muted">
          {APP_NAME} does not embed third-party advertising or behavioural-tracking SDKs. Guest mode
          works fully offline with no account at all.
        </p>
      </ContentSection>

      <ContentSection heading="Your choices">
        <p className="text-muted">
          You can continue as a guest, delete your synced data, or delete your account at any time
          from within the app. Deleting your account removes your synced records from our servers.
        </p>
      </ContentSection>

      <ContentSection heading="Contact">
        <p className="text-muted">
          Questions about privacy? Reach out through the support link in the app and we will respond
          as soon as we can.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
