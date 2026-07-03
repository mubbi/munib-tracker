import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms under which you may use ${APP_NAME}.`,
};

export default function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Service"
      intro={`By using ${APP_NAME}, you agree to these terms.`}
    >
      <ContentSection heading="Personal & educational use">
        <p className="text-muted">
          {APP_NAME} is provided free of charge for personal and educational use. You may use it to
          support your own worship and share it with others, but you may not resell it or
          redistribute it as your own product.
        </p>
      </ContentSection>

      <ContentSection heading="Religious content disclaimer">
        <p className="text-muted">
          Calculators and estimates in the app (such as lifetime qadha and missed-fast estimates)
          are aids, not fatwas. For rulings specific to your situation, please consult a qualified
          scholar. We strive for accuracy in all religious content but the app is not a substitute
          for scholarly guidance.
        </p>
      </ContentSection>

      <ContentSection heading="No warranty">
        <p className="text-muted">
          The app is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable
          for any loss arising from its use, including loss of locally stored data. We recommend
          enabling account sync if preserving your history matters to you.
        </p>
      </ContentSection>

      <ContentSection heading="Changes to these terms">
        <p className="text-muted">
          We may update these terms as the app evolves. Continued use after an update constitutes
          acceptance of the revised terms.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
