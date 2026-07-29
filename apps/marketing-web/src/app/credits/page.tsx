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
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Credits",
  description: `Open data sources and attributions for ${APP_NAME}.`,
};

export default function CreditsPage() {
  return (
    <ContentPage
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
          <a href="/contact" className="font-medium text-brand hover:underline">
            contact form
          </a>{" "}
          so we can correct it promptly. Calculators and estimates are aids, not fatwas — consult a
          qualified scholar for rulings specific to your situation.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
