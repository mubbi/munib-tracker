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
    "How Munib Tracker handles your data: guest data stays on your device, optional sync, the encrypted vault, family circles, location, Qur'an practice audio and analytics.",
});

const EFFECTIVE_DATE = "24 November 2026";

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
          bookmarks, ayah notes and highlights, reading progress, favorites, custom adhkar,
          khushu&apos; journal entries, preferences (theme, language, fonts, notifications, home
          layout, madhhab, Hijri adjustment), and optional PIN lock settings. Guest mode works fully
          without an account. The weekly coach works out its suggestions on your device from these
          records with simple rules; nothing is sent to a server or to an AI service to do it.
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
          Qur&apos;an practice to follow your recitation, for the Verse Detector, and for hands-free
          tasbeeh, which only listens for the pauses between the phrases you say. Audio is processed
          on your device. It is not recorded, stored, or uploaded, and practice keeps only counts
          (for example how many words matched) and ayah numbers — never audio or a transcript.
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
          The pronunciation check uses a second on-device speech model. On the web its files are
          downloaded from a public mirror on Hugging Face and checked against pinned fingerprints.
          Audio is never saved or uploaded and no cloud speech service is used. Tajweed coaching
          keeps only which sounds you practised, when, and references to example words — never audio
          or a score.
        </p>
      </ContentSection>

      <ContentSection heading="Masjid finder & Umrah mode">
        <p className="text-muted">
          To list masjids near you, the app sends our server only a short area code for a cell of
          about 5 km, never your exact coordinates. The request carries no account, user ID or
          cookie. Our server looks the area up on OpenStreetMap, caches the public results and sends
          them back; distances to each masjid are worked out on your device. The server does not log
          the area you looked up. Your home masjid is saved in your preferences, and iqamah times
          you type in for it stay on your device and your own synced devices: they are never sent to
          the Masjid finder or shown to other users. If you mark a Salah as prayed at the masjid,
          that note is part of your own Salah log. Umrah mode&apos;s miqat check uses your location
          on the device while the screen is open.
        </p>
        <p className="mt-3 text-muted">
          If you scan your masjid&apos;s timetable, the photo is read on your device (Apple Vision
          on iPhone, ML Kit on Android, or a text-recognition engine that runs inside your browser
          on the web, downloaded once from a public CDN). The photo and the recognised text are
          never uploaded; the app&apos;s copy of the photo is deleted after reading, or when you
          finish checking if you choose to keep it on screen. Only the times you review and save are
          kept, as your private times.
        </p>
      </ContentSection>

      <ContentSection heading="Salah focus lock">
        <p className="text-muted">
          The Salah focus lock is optional. If you turn it on, the apps you choose to pause stay on
          your device. On iPhone they are kept by Apple&apos;s Screen Time framework as private
          tokens we cannot read. On Android the app checks which app is open (using usage access)
          only while one of your prayer windows is running, and never stores or sends that
          information. Your focus-lock settings (which prayers, timing and mode) sync with your
          account like other preferences; your app choices and emergency-unlock history do not.
        </p>
      </ContentSection>

      <ContentSection heading="Private vault: muhasabah, family ties, debts & will">
        <p className="text-muted">
          Your nightly muhasabah, family-ties list (including the names and phone numbers of
          relatives you add), debts and trusts record, and Islamic will are kept in an encrypted
          vault on your device (AES-256-GCM, with the key held in your device&apos;s secure storage,
          or as a browser key that can&apos;t be exported on the web). They are not synced unless
          you turn on vault sync.
        </p>
        <p className="mt-3 text-muted">
          Vault sync is optional and end-to-end encrypted. You choose a passphrase and receive a
          24-word recovery code that is shown only once. The encryption key is derived on your
          device and never sent, so our server stores only encrypted data that we cannot read. If
          you lose both your passphrase and your recovery code, the synced copy cannot be recovered
          by anyone, including us; the records on your device keep working.
        </p>
        <p className="mt-3 text-muted">
          Reminders for these records use generic text: lock-screen notifications never show names,
          amounts or personal reflections. A document photo you attach to a debt is encrypted on
          your device and is never synced or included in backups. A will or debts statement you
          export as a PDF is created only to hand to the share or print sheet and is deleted
          afterwards on iPhone and Android; once you share it, that copy is under your control.
        </p>
      </ContentSection>

      <ContentSection heading="Family circles, partners & group khatm">
        <p className="text-muted">
          Family circles and accountability partners need a free account, because members see shared
          progress through our server. A group khatm can also be joined as a guest on the web. Each
          circle stores only a small, fixed signal: a child&apos;s five fard Salah statuses (done or
          not) and generic rest days, for their parents; a daily &quot;done&quot; for an
          accountability partner (never your goal or what you missed); and which khatm part each
          member is reading and when it is done. The server rejects any other field, so your notes,
          Qaza, journals and goals can&apos;t be shared through a circle. A parent&apos;s own Salah
          is never shared, and adults in a family share nothing unless they turn sharing on.
        </p>
        <p className="mt-3 text-muted">
          Members see the display name you choose for each circle, never your account name or email.
          A partner&apos;s dua or reminder nudge is anonymous. Daily signals are deleted after 90
          days and nudges after 30 days. When you leave a circle, you are hidden at once and your
          signals and membership are deleted after 30 days. Deleting your account removes your
          circle data; circles you own pass to another member or are dissolved.
        </p>
      </ContentSection>

      <ContentSection heading="Notifications">
        <p className="text-muted">
          Prayer, preferred-time, adhkar, Qaza, fasting, family-ties, muhasabah, iqamah, debt and
          will, weekly coach, daily content, Friday, Qur&apos;an revision, and achievement reminders
          are scheduled locally on your device when you enable them. If you allow notifications, the
          app registers a push token with our server so we can send service announcements, Live
          Activity updates on iOS, and web push reminders; you can turn these off at any time.
          Notification content is generated from your preferences and local data. You can disable
          any category or revoke system permission at any time.
        </p>
        <p className="mt-3 text-muted">
          If you are signed in and belong to a circle, our server can also push three kinds of
          circle event: a khatm part was completed, a khatm was completed, and someone made dua for
          you. Their text is fixed and contains no names, circle names, intentions or Salah status.
          Parents in a family circle can also get a weekly family digest with counts only (for
          example how many Salah were logged that week), never children&apos;s names or individual
          prayers. Each kind has its own switch in Settings, and the server follows your choice once
          your preferences have synced. Guests in a group khatm don&apos;t receive circle pushes.
        </p>
      </ContentSection>

      <ContentSection heading="Optional account & cloud sync">
        <p className="text-muted">
          If you sign in with Google, Apple or Facebook, we store the minimum needed to sync across
          devices: an account identifier, email and display name from the provider (when provided),
          and the worship and learning records you choose to sync (for example prayer logs, zikr
          progress, Qaza, preferences, favorites, bookmarks, ayah notes and highlights, khatm/hifz,
          custom adhkar, journal entries, and learning progress). Vault records sync only end-to-end
          encrypted, as described above. We do not sell your data or use it for advertising.
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
          worship data); open CDNs for optional Qur&apos;an/hadith/audio content, a public GitHub
          copy of the Quranic Arabic Corpus for root-word search, a public Hugging Face mirror for
          speech-model files on the web, and a public CDN for the in-browser timetable reader (see{" "}
          <Link href={SITE_PATHS.credits} className="font-medium text-brand hover:underline">
            Credits
          </Link>
          ); OpenStreetMap, through our server, for the Masjid finder; and weather providers when
          overlays are enabled. The product app does not embed third-party advertising or
          behavioural-tracking SDKs.
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
          Kids mode is for children under 13 and is set up by a parent, who confirms their consent
          in the app; we record when consent was given and which version of this policy it applied
          to. A child profile holds only a nickname, a birth year and an optional built-in avatar,
          with no email or password. A child&apos;s device is linked with a one-time QR code that
          expires after five minutes, and the parent can unlink it at any time. The app has no ads
          or analytics SDKs, and in a child session crash reports carry no user, request or activity
          details. Parents see only their child&apos;s five fard Salah statuses and the stickers
          earned from them.
        </p>
        <p className="mt-3 text-muted">
          Deleting a child profile deletes it and its signals immediately. When a child is ready to
          move to their own account, the profile and its signals are deleted and the young person
          joins with sharing off. If the parent who gave consent deletes their account, the
          child&apos;s profile passes to another parent in the family, who must confirm consent
          again within 30 days or the profile is deleted; with no other parent it is deleted at
          once. To delete a child profile, remove it from your family circle or contact us.
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
