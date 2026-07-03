import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with the ${APP_NAME} team for support, feedback, or content corrections.`,
};

export default function ContactPage() {
  return (
    <ContentPage
      wide
      eyebrow="Contact"
      title="We would love to hear from you"
      intro="Questions, feedback, content corrections, or partnership inquiries — send a message and we will respond as soon as we can."
    >
      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <ContactForm />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ContentSection heading="Content corrections">
            <p className="text-sm text-muted">
              Accuracy in Qur'an, hadith, and dua text is a trust we take seriously. Please include
              the surah/ayah or hadith reference when reporting an error.
            </p>
          </ContentSection>
          <ContentSection heading="Privacy">
            <p className="text-sm text-muted">
              Your message is used only to respond to you. We do not sell contact data. See our{" "}
              <a href="/privacy" className="font-medium text-brand hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </ContentSection>
          <ContentSection heading="Response time">
            <p className="text-sm text-muted">
              We aim to reply within a few business days. Support for {APP_NAME} is handled by a
              small team — thank you for your patience.
            </p>
          </ContentSection>
        </div>
      </div>
    </ContentPage>
  );
}
