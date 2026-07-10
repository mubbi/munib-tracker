import { APP_AUTHOR, APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${APP_NAME} handles your data — offline-first, with optional account sync.`,
};

const EFFECTIVE_DATE = "10 July 2026";

export default function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      intro={`${APP_NAME} is built to protect your privacy. Your worship data belongs to you.`}
    >
      <p className="text-sm text-muted">Effective date: {EFFECTIVE_DATE}</p>

      <ContentSection heading="Who we are">
        <p className="text-muted">
          {APP_NAME} is provided by {APP_AUTHOR}. This policy covers the mobile and web product app
          and this marketing website ( <span className="whitespace-nowrap">munibtracker.app</span>
          ). Questions: use our{" "}
          <Link href={SITE_PATHS.contact} className="font-medium text-brand hover:underline">
            contact form
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection heading="Data stored on your device">
        <p className="text-muted">
          By default, all of your tracking and learning data stays on your device. That includes
          salah logs, dhikr and tasbeeh counts, qaza and fasting records, Qur&apos;an and hadith
          bookmarks, reading progress, favorites, custom adhkar, khushu&apos; journal entries,
          preferences (theme, language, fonts, notifications, home layout), and optional PIN lock
          settings. Guest mode works fully without an account.
        </p>
      </ContentSection>

      <ContentSection heading="Location">
        <p className="text-muted">
          If you allow location access (or choose a city), we use it on-device to calculate prayer
          times and qibla direction. Coordinates are not sold and are not required for core
          tracking. Optional weather overlays may request local conditions from Open-Meteo or MET
          Norway using your location when that feature is enabled.
        </p>
      </ContentSection>

      <ContentSection heading="Notifications">
        <p className="text-muted">
          Prayer, adhkar, qaza, daily content, Friday, and achievement reminders are scheduled
          locally on your device when you enable them. Notification content is generated from your
          preferences and local data. You can disable any category or revoke system permission at
          any time.
        </p>
      </ContentSection>

      <ContentSection heading="Optional account & cloud sync">
        <p className="text-muted">
          If you sign in with Google or Apple, we store the minimum needed to sync across devices:
          an account identifier, email and display name from the provider (when provided), and the
          worship and learning records you choose to sync (for example prayer logs, zikr progress,
          qaza, preferences, favorites, bookmarks, khatm/hifz, custom adhkar, journal entries, and
          learning progress). Sync uses last-write-wins conflict handling. We do not sell your data
          or use it for advertising.
        </p>
      </ContentSection>

      <ContentSection heading="App lock (PIN & biometrics)">
        <p className="text-muted">
          On supported native builds you may enable a PIN and optional device biometrics to unlock
          the app. The PIN is stored only on your device; biometric checks use the platform secure
          enclave / keystore. We never receive your PIN or biometric templates.
        </p>
      </ContentSection>

      <ContentSection heading="Backups, import & offline downloads">
        <p className="text-muted">
          You can export a local JSON backup and restore it later, import prayer history from
          CSV/text, and download optional Qur&apos;an editions, mushaf fonts, hadith collections, or
          audio for offline use. Exports you share leave your device under your control. Cached
          downloads stay on-device until you clear them.
        </p>
      </ContentSection>

      <ContentSection heading="Content reports">
        <p className="text-muted">
          If you report a content error from the app, we receive the details you submit (and any
          optional attachments) so we can investigate and correct the material. Use reports only for
          genuine accuracy issues.
        </p>
      </ContentSection>

      <ContentSection heading="Third-party services">
        <p className="text-muted">
          Depending on features you use, the app or site may contact: our API host for auth and
          sync; Google or Apple for sign-in; open CDNs for optional Qur&apos;an/hadith/audio content
          (see{" "}
          <Link href={SITE_PATHS.credits} className="font-medium text-brand hover:underline">
            Credits
          </Link>
          ); and weather providers when overlays are enabled. The product app does not embed
          third-party advertising or behavioural-tracking SDKs.
        </p>
      </ContentSection>

      <ContentSection heading="This marketing website">
        <p className="text-muted">
          If Google Analytics 4 is configured for this site, we may collect anonymized page-view
          metrics (IP anonymization enabled) to understand how the marketing pages are used. The
          contact form sends the message you submit to our support inbox via a webhook; we use it
          only to respond. Analytics on this website is separate from the product app and is not
          used to profile your worship data.
        </p>
      </ContentSection>

      <ContentSection heading="Children">
        <p className="text-muted">
          {APP_NAME} is suitable for family use and does not knowingly collect personal information
          from children for advertising. Parents and guardians should supervise account creation and
          sync. If you believe a child has provided data inappropriately, contact us and we will
          delete it.
        </p>
      </ContentSection>

      <ContentSection heading="Retention & deletion">
        <p className="text-muted">
          Local data remains until you clear app storage, restore a backup, or uninstall. Synced
          server records are retained while your account exists. You can delete synced data or your
          account from the app profile; deletion removes your synced records from our servers. Local
          copies on other devices may remain until you clear them.
        </p>
      </ContentSection>

      <ContentSection heading="International transfers">
        <p className="text-muted">
          Our API and hosting may process data in regions where our cloud providers operate. By
          signing in and syncing, you understand your account and synced records may be stored
          outside your country of residence, subject to applicable law.
        </p>
      </ContentSection>

      <ContentSection heading="Changes">
        <p className="text-muted">
          We may update this policy as the product evolves. The effective date above will change
          when we do. Continued use after an update constitutes acceptance of the revised policy.
        </p>
      </ContentSection>

      <ContentSection heading="Contact">
        <p className="text-muted">
          Privacy questions:{" "}
          <Link href={SITE_PATHS.contact} className="font-medium text-brand hover:underline">
            contact form
          </Link>{" "}
          or the support / report flows inside the app.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
