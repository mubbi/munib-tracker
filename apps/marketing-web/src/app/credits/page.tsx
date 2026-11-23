import {
  APP_NAME,
  BUNDLED_DATA_CREDITS,
  RUNTIME_DATA_CREDITS,
  SERVICE_DATA_CREDITS,
} from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";
import { CreditList } from "@/components/credit-list";
import { pageMetadata } from "@/lib/seo";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/credits",
  title: "Content Sources & Credits — Qur'an, Hadith and Adhkar Data",
  description:
    "The open datasets behind Munib Tracker's Qur'an text, translations, tafsir, hadith, adhkar, duas and audio, with the licence and attribution for each.",
});

export default function CreditsPage() {
  return (
    <ContentPage
      path="/credits"
      wide
      eyebrow="Credits"
      title="Open data & attributions"
      intro={`${APP_NAME} is built on the generosity of open-source data projects and classical Islamic texts. We are grateful to every project listed below. The same attributions appear in Settings → Credits & data sources inside the app.`}
    >
      <ContentSection heading="Project source code">
        <p className="text-muted">
          The {APP_NAME} codebase is free to use, modify, and redistribute for personal and
          educational purposes under a non-commercial license, with required credit and a link to
          this site. Details:{" "}
          <Link href={SITE_PATHS.openSource} className="font-medium text-brand hover:underline">
            Open source
          </Link>
          . People who contribute code and reviews are listed on{" "}
          <Link href={SITE_PATHS.contributors} className="font-medium text-brand hover:underline">
            Contributors
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection heading="Bundled with the app">
        <CreditList sources={BUNDLED_DATA_CREDITS} />
      </ContentSection>

      <ContentSection heading="Downloaded or streamed on demand">
        <CreditList sources={RUNTIME_DATA_CREDITS} />
      </ContentSection>

      <ContentSection heading="Calculations & enrichment">
        <CreditList sources={SERVICE_DATA_CREDITS} />
      </ContentSection>

      <ContentSection heading="Authenticity note">
        <p className="text-muted">
          We strive for accuracy in all religious content. If you notice an error, please report it
          through the app or our{" "}
          <Link href={SITE_PATHS.contact} className="font-medium text-brand hover:underline">
            contact form
          </Link>{" "}
          so we can correct it promptly. Calculators and estimates are aids, not fatwas — consult a
          qualified scholar for rulings specific to your situation.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
