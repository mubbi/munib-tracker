import { AccordionFaq } from "@/components/accordion-faq";
import { Section } from "@/components/section";
import { TrackedLink } from "@/components/tracked-link";
import { FAQ_ITEMS } from "@/lib/faq";
import { SITE_PATHS } from "@/lib/site";

export function FaqPreview() {
  return (
    <Section
      eyebrow="FAQ"
      title="Common questions"
      description="Privacy, offline use, platforms, and religious content — answered clearly."
    >
      <div className="mx-auto max-w-3xl">
        <AccordionFaq items={FAQ_ITEMS.slice(0, 4)} />
      </div>
      <p className="mt-10 text-center">
        <TrackedLink
          href={SITE_PATHS.faq}
          className="font-semibold text-brand transition-opacity hover:opacity-80"
          track="cta"
          cta="view_all_faq"
          placement="home_faq"
        >
          View all questions →
        </TrackedLink>
      </p>
    </Section>
  );
}
