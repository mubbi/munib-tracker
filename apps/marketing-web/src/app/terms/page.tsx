import { APP_AUTHOR, APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms under which you may use ${APP_NAME}.`,
};

const EFFECTIVE_DATE = "10 July 2026";

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Service"
      intro={`By using ${APP_NAME}, you agree to these terms.`}
    >
      <p className="text-sm text-muted">Effective date: {EFFECTIVE_DATE}</p>

      <ContentSection heading="The service">
        <p className="text-muted">
          {APP_NAME} is a free worship companion for personal and educational use on iOS, Android,
          and web. It is provided by {APP_AUTHOR}. Features include salah and qaza tracking, dhikr,
          Qur&apos;an and hadith libraries, learning content, prayer times, reminders, optional
          cloud sync, and related tools described on our{" "}
          <Link href={SITE_PATHS.features} className="font-medium text-brand hover:underline">
            Features
          </Link>{" "}
          page.
        </p>
      </ContentSection>

      <ContentSection heading="Personal & educational use">
        <p className="text-muted">
          You may use the app to support your own worship and share it with others for
          non-commercial personal or educational purposes. You may not resell it, redistribute it as
          your own product, scrape or bulk-redistribute bundled datasets in violation of their
          licenses, or use the service to harass others or break the law.
        </p>
      </ContentSection>

      <ContentSection heading="Accounts">
        <p className="text-muted">
          Guest mode requires no account. If you sign in with Google or Apple, you are responsible
          for keeping access to that provider account secure. You must not impersonate others or
          attempt to access another user&apos;s synced data. We may suspend or terminate accounts
          that abuse the service, attempt unauthorized access, or submit malicious content reports.
        </p>
      </ContentSection>

      <ContentSection heading="Religious content disclaimer">
        <p className="text-muted">
          Calculators and estimates (such as lifetime qaza and missed-fast estimates), fiqh guides,
          and learning lessons are aids for education — not fatwas. For rulings specific to your
          situation, consult a qualified scholar. We strive for accuracy and cite open sources (see{" "}
          <Link href={SITE_PATHS.credits} className="font-medium text-brand hover:underline">
            Credits
          </Link>
          ), but the app is not a substitute for scholarly guidance. Scripture text and translations
          remain subject to their original licenses and attributions.
        </p>
      </ContentSection>

      <ContentSection heading="Intellectual property">
        <p className="text-muted">
          The {APP_NAME} name, branding, UI, and original software are owned by {APP_AUTHOR} or its
          licensors. Open-source libraries and Islamic datasets remain under their respective
          licenses. You retain ownership of the personal worship data you create; by syncing, you
          grant us a limited license to store and process that data solely to provide sync and
          related account features.
        </p>
      </ContentSection>

      <ContentSection heading="Privacy">
        <p className="text-muted">
          How we handle personal data is described in our{" "}
          <Link href={SITE_PATHS.privacy} className="font-medium text-brand hover:underline">
            Privacy Policy
          </Link>
          , which forms part of these terms.
        </p>
      </ContentSection>

      <ContentSection heading="No warranty">
        <p className="text-muted">
          The app and website are provided &ldquo;as is&rdquo; without warranties of any kind,
          express or implied, including fitness for a particular purpose and non-infringement. We do
          not warrant uninterrupted availability, perfect prayer-time accuracy in every locale, or
          that content is free of error. We are not liable for any loss arising from use of the
          service, including loss of locally stored data — enable sync or export a backup if
          preserving history matters to you.
        </p>
      </ContentSection>

      <ContentSection heading="Limitation of liability">
        <p className="text-muted">
          To the fullest extent permitted by law, {APP_AUTHOR} and contributors are not liable for
          indirect, incidental, special, consequential, or punitive damages, or any loss of data,
          profits, or goodwill, whether based on contract, tort, or otherwise, even if advised of
          the possibility. Our total liability for any claim relating to the service shall not
          exceed the amount you paid us for the service in the twelve months before the claim (which
          is zero while the app remains free).
        </p>
      </ContentSection>

      <ContentSection heading="Age">
        <p className="text-muted">
          If you are under the age of digital consent in your region, use the app only with a parent
          or guardian&apos;s permission. Parents are responsible for supervising minors&apos; use
          and any linked accounts.
        </p>
      </ContentSection>

      <ContentSection heading="Changes to these terms">
        <p className="text-muted">
          We may update these terms as the app evolves. The effective date above will change when we
          do. Continued use after an update constitutes acceptance of the revised terms. If you do
          not agree, stop using the service and delete your account if you have one.
        </p>
      </ContentSection>

      <ContentSection heading="Contact">
        <p className="text-muted">
          Questions about these terms:{" "}
          <Link href={SITE_PATHS.contact} className="font-medium text-brand hover:underline">
            contact form
          </Link>
          .
        </p>
      </ContentSection>
    </ContentPage>
  );
}
