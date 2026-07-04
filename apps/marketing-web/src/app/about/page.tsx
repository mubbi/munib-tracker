import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";
import { SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Who builds ${APP_NAME}, and our commitment to authentic worship content.`,
};

export default function AboutPage() {
  return (
    <ContentPage
      eyebrow="About"
      title={`About ${APP_NAME}`}
      intro={`${APP_NAME} is a free, offline-first companion to help you ${APP_TAGLINE.toLowerCase()}`}
    >
      <ContentSection heading="Our mission">
        <p className="text-muted">
          We believe worship tracking should feel calm and trustworthy — not gamified or
          guilt-driven. {APP_NAME} exists to help you {APP_TAGLINE.toLowerCase()} with an honest
          record of your salah, adhkar, and qaza obligations, with gentle reminders and rich Islamic
          content, all without requiring an account.
        </p>
      </ContentSection>

      <ContentSection heading="Who it's for">
        <p className="text-muted">
          Whether you are rebuilding a consistent prayer habit, working through missed prayers and
          fasts, or simply keeping your daily adhkar, {APP_NAME} is designed to be a quiet,
          judgement-free record that stays entirely on your device until you choose to sign in.
        </p>
      </ContentSection>

      <ContentSection heading="Design philosophy">
        <p className="text-muted">
          The app uses warm cream and deep-forest palettes inspired by traditional Islamic
          aesthetics — with a prayer-times hero that stays deep green regardless of theme. Motion is
          calm and confident. Cards use continuous rounded corners. Every screen pulls colors from a
          shared theme system with twelve accent presets and full dark-mode support.
        </p>
      </ContentSection>

      <ContentSection heading="What we built">
        <p className="text-muted">
          Explore the full feature set on our{" "}
          <Link href={SITE_PATHS.features} className="font-medium text-brand hover:underline">
            Features
          </Link>{" "}
          page — prayer tracking, qaza calculator and planner, adhkar and tasbeeh, offline Qur'an
          and hadith, qibla, Hijri calendar, universal search, statistics, achievements, and
          optional cloud sync.
        </p>
      </ContentSection>

      <ContentSection heading="Author & collaborators">
        <p className="text-muted">
          {APP_NAME} is built and maintained by{" "}
          <a
            href={APP_AUTHOR_URL}
            className="font-medium text-brand hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            {APP_AUTHOR}
          </a>
          , with content reviewed for authenticity before it ships. We are grateful to every
          contributor, tester, and reviewer who has helped shape the app.
        </p>
      </ContentSection>

      <ContentSection heading="A dua">
        <p className="font-serif text-lg leading-relaxed text-muted">
          We ask Allah to accept the effort of everyone who contributed to this app, to forgive our
          shortcomings, and to have mercy on our marhumeen. May He make this a source of ongoing
          benefit for all who use it. Ameen.
        </p>
      </ContentSection>

      <ContentSection heading="Content authenticity">
        <p className="text-muted">
          Arabic text, translations, transliterations, and references are drawn from established
          sources listed on our{" "}
          <Link href={SITE_PATHS.credits} className="font-medium text-brand hover:underline">
            Credits
          </Link>{" "}
          page and checked before publication. If you notice an error, please report it so we can
          correct it promptly — accuracy in religious content is a trust we take seriously.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
