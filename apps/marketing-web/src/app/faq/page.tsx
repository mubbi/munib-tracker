import type { Metadata } from "next";
import { FaqList } from "@/components/content/primitives";
import { ContentPage } from "@/components/content-page";
import { FaqJsonLd } from "@/components/json-ld";
import { FAQ_ITEMS } from "@/lib/faq";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  path: "/faq",
  title: "FAQ — Privacy, Offline Use, Platforms & Content",
  description:
    "Answers to common questions about Munib Tracker: is it free, does it work offline, does Qur'an practice record your voice, platforms, languages and data.",
});

export default function FaqPage() {
  return (
    <ContentPage
      path="/faq"
      wide
      eyebrow="FAQ"
      title="Frequently asked questions"
      intro="Everything you need to know about privacy, offline use, platforms, and religious content."
    >
      <FaqJsonLd items={FAQ_ITEMS} />
      <FaqList items={FAQ_ITEMS} headingLevel="h2" />
    </ContentPage>
  );
}
