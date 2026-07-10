import {
  APP_NAME,
  BUNDLED_DATA_CREDITS,
  RUNTIME_DATA_CREDITS,
  SERVICE_DATA_CREDITS,
} from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Credits",
  description: `Open data sources and attributions for ${APP_NAME}.`,
};

function CreditList({
  sources,
}: {
  sources: readonly {
    name: string;
    attribution: string;
    license: string;
    url: string;
    note?: string;
  }[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {sources.map((source) => (
        <article
          key={source.name}
          className="rounded-[var(--radius-card)] border border-border/50 bg-card p-5"
        >
          <h3 className="font-semibold">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              {source.name}
            </a>
          </h3>
          <p className="mt-2 text-sm text-muted">{source.attribution}</p>
          <p className="mt-1 text-xs text-muted/80">{source.license}</p>
          {source.note ? <p className="mt-1 text-xs italic text-muted/70">{source.note}</p> : null}
        </article>
      ))}
    </div>
  );
}

export default function CreditsPage() {
  return (
    <ContentPage
      wide
      eyebrow="Credits"
      title="Open data & attributions"
      intro={`${APP_NAME} is built on the generosity of open-source contributors and classical Islamic texts. We are grateful to every project listed below. The same attributions appear in Settings → Credits & data sources inside the app.`}
    >
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
