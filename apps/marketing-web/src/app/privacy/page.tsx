import { APP_AUTHOR, APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy Policy",
  description:
    "How Munib Tracker handles your data: guest data stays on your device, optional account sync, location use, Qur'an practice audio, and this site's analytics.",
});

const EFFECTIVE_DATE = "23 November 2026";

export default function PrivacyPage() {
  return (
    <ContentPage
      path="/privacy"
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
          Salah logs, Zikr and tasbeeh counts, Qaza and fasting records, Qur&apos;an and hadith
          bookmarks, reading progress, favorites, custom adhkar, khushu&apos; journal entries,
          preferences (theme, language, fonts, notifications, home layout), and optional PIN lock
          settings. Guest mode works fully without an account.
        </p>
      </ContentSection>

      <ContentSection heading="Location">
        <p className="text-muted">
          If you allow location access (or choose a city), Salah times and the Qibla direction are
          calculated on your device. To show a place name for your coordinates, the app may look it
          up with BigDataCloud&apos;s reverse-geocoding service; searching for a city uses
          Open-Meteo&apos;s geocoding service. Coordinates are not sold and are not required for
          core tracking. Optional weather overlays may request local conditions from Open-Meteo or
          MET Norway using your location when that feature is enabled.
        </p>
      </ContentSection>

      <ContentSection heading="Microphone & Qur&apos;an practice">
        <p className="text-muted">
          The app uses the microphone only when you turn it on: to dictate custom adhkar, in
          Qur&apos;an practice and the pronunciation check to follow your recitation, for the Verse
          Detector, and for hands-free tasbeeh. Recitation audio is processed on your device. It is
          not recorded, stored, or uploaded, and practice keeps only counts (for example how many
          words matched) and ayah numbers — never audio or a transcript.
        </p>
        <p className="mt-3 text-muted">
          The practice listener is an optional download (about 70 MB). The iOS and Android apps
          fetch it from the Tilawa project&apos;s release host on GitHub; the web app serves an
          unmodified copy of the same files from its own site. The optional pronunciation listener
          is downloaded from Quran Lab and contacts Quran Lab once to activate; the app turns Quran
          Lab&apos;s usage statistics off and never asks you to share recordings. On the web, Quran
          Lab&apos;s own sheet may offer to share recitations to improve its free models — sharing
          happens only if you agree there, and you can turn it off and delete what you shared from
          Settings → Qur&apos;an practice. The listeners are practice aids, not a ruling on your
          recitation.
        </p>
        <p className="mt-3 text-muted">
          Hands-free tasbeeh and the word-by-word pronunciation check use a speech model that also
          runs on your device; audio is never saved or uploaded and no cloud speech service is used.
          On the web, the model file is downloaded from a content delivery network. Hadith audio
          uses your device&apos;s own text-to-speech voice to read translations.
        </p>
      </ContentSection>

      <ContentSection heading="Masjid finder, timetable scan & Umrah mode">
        <p className="text-muted">
          To list masjids near you, the app sends your approximate location to our server, which
          looks them up on OpenStreetMap and returns the results; we don&apos;t store it with your
          account. Iqamah times you add for your home masjid, whether typed or scanned from a
          timetable, stay on your device and in your own sync and are never shown to other users.
          Timetable photos are read on your device and are not uploaded. Umrah mode&apos;s miqat
          alert uses your location on the device while the app is open.
        </p>
      </ContentSection>

      <ContentSection heading="Salah focus lock">
        <p className="text-muted">
          The focus lock uses your phone&apos;s screen-time features (Apple Screen Time on iPhone,
          usage access on Android) to block the apps you choose. The list of apps you pick stays on
          your device; we never see which apps you use. Emergency unlocks are counted only on your
          device.
        </p>
      </ContentSection>

      <ContentSection heading="Private records: muhasabah, family ties, debts & will">
        <p className="text-muted">
          Your nightly muhasabah, family-ties list, debts and trusts record, and Islamic will are
          stored on your device. Syncing them is optional and end-to-end encrypted: our server
          stores only encrypted data it cannot read. Notifications on your lock screen never show
          sensitive details such as amounts or personal reflections.
        </p>
      </ContentSection>

      <ContentSection heading="Family circles, partners & group khatm">
        <p className="text-muted">
          These features need a free account, because members see shared progress through our
          server. Each circle stores only a small, fixed signal: a child&apos;s five fard Salah
          statuses for their parents; a daily &quot;done&quot; for an accountability partner (never
          your goal or what you missed); and which khatm part each member is reading and when it is
          done. Your other logs, notes and goals are not shared. Leaving a circle deletes your
          signals for it after 30 days, and deleting your account removes them.
        </p>
      </ContentSection>

      <ContentSection heading="Notifications">
        <p className="text-muted">
          Prayer, adhkar, qaza, fasting, family-ties, muhasabah, daily content, Friday, Qur&apos;an
          revision, and achievement reminders are scheduled locally on your device when you enable
          them. If you allow notifications, the app registers a push token with our server so we can
          send service announcements, Live Activity updates on iOS, and web push reminders; you can
          turn these off at any time. Notification content is generated from your preferences and
          local data. You can disable any category or revoke system permission at any time.
        </p>
      </ContentSection>

      <ContentSection heading="Optional account & cloud sync">
        <p className="text-muted">
          If you sign in with Google, Apple or Facebook, we store the minimum needed to sync across
          devices: an account identifier, email and display name from the provider (when provided),
          and the worship and learning records you choose to sync (for example prayer logs, zikr
          progress, qaza, preferences, favorites, bookmarks, khatm/hifz, custom adhkar, journal
          entries, and learning progress). Sync uses last-write-wins conflict handling. We do not
          sell your data or use it for advertising.
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
          You can export a local JSON backup and restore it later, import Salah history from CSV or
          JSON, and download optional Qur&apos;an editions, mushaf fonts, hadith collections, or
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
          sync; Google, Apple or Facebook for sign-in; Sentry for crash reports (without your
          worship data); open CDNs for optional Qur&apos;an/hadith/audio content (see{" "}
          <Link href={SITE_PATHS.credits} className="font-medium text-brand hover:underline">
            Credits
          </Link>
          ); and weather providers when overlays are enabled. The product app does not embed
          third-party advertising or behavioural-tracking SDKs.
        </p>
      </ContentSection>

      <ContentSection heading="This marketing website">
        <p className="text-muted">
          If Google Analytics 4 is configured for this site, we may collect anonymized page-view and
          interaction metrics (IP anonymization enabled) to understand how the marketing pages are
          used. Analytics storage is gated by Google Consent Mode v2 and our first-party cookie
          banner — defaults deny storage until you accept analytics (or reopen Cookie preferences
          from the footer). The contact form stores your name, email, and message in our database so
          our support team can respond; we use it only to reply and do not sell contact data.
          Analytics on this website is separate from the product app and is not used to profile your
          worship data.
        </p>
      </ContentSection>

      <ContentSection heading="Children">
        <p className="text-muted">
          Children under 13 use {APP_NAME} only through kids mode, set up by a parent. A child
          profile holds a nickname and birth year only, with no email or password, and we record the
          parent&apos;s consent. A child&apos;s device is linked with a one-time QR code that the
          parent can revoke. Child sessions show no ads and send no third-party analytics; crash
          reports contain no user identifiers. Parents see only their child&apos;s five fard Salah
          statuses. To delete a child profile, remove it from your family circle or contact us.
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
