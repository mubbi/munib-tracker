import { APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import { ContentPage, ContentSection } from "@/components/content-page";

export const metadata: Metadata = {
  title: "About",
  description: `Who builds ${APP_NAME}, and our commitment to authentic worship content.`,
};

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title={`About ${APP_NAME}`}
      intro={`${APP_NAME} is a free, offline-first companion for tracking salah, dhikr, and qadha on the journey back to Allah.`}
    >
      <ContentSection heading="Who it's for">
        <p className="text-muted">
          Whether you are rebuilding a consistent prayer habit, working through missed prayers and
          fasts, or simply keeping your daily adhkar, {APP_NAME} is designed to be a quiet,
          judgement-free record that stays entirely on your device until you choose to sign in.
        </p>
      </ContentSection>

      <ContentSection heading="Author & collaborators">
        <p className="text-muted">
          {APP_NAME} is built and maintained by the Munib Tracker team, with content reviewed for
          authenticity before it ships. We are grateful to every contributor, tester, and reviewer
          who has helped shape the app.
        </p>
      </ContentSection>

      <ContentSection heading="A dua">
        <p className="text-muted">
          We ask Allah to accept the effort of everyone who contributed to this app, to forgive our
          shortcomings, and to have mercy on our marhumeen. May He make this a source of ongoing
          benefit for all who use it. Ameen.
        </p>
      </ContentSection>

      <ContentSection heading="Content authenticity">
        <p className="text-muted">
          Arabic text, translations, transliterations, and references are drawn from established
          sources and checked before publication. If you notice an error, please report it so we can
          correct it promptly — accuracy in religious content is a trust we take seriously.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
