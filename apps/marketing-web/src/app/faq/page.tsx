import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { AccordionFaq } from "@/components/accordion-faq";
import { ContentPage } from "@/components/content-page";
import { FAQ_ITEMS } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Frequently asked questions about ${APP_NAME}.`,
};

export default function FaqPage() {
  return (
    <ContentPage
      wide
      eyebrow="FAQ"
      title="Frequently asked questions"
      intro="Everything you need to know about privacy, offline use, platforms, and religious content."
    >
      <AccordionFaq items={FAQ_ITEMS} />
    </ContentPage>
  );
}
