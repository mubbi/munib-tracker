import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection } from "@/components/content-page";
import { TrackedLink } from "@/components/tracked-link";
import { pageMetadata } from "@/lib/seo";
import { GITHUB_REPO_URL, SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: "About Munib Tracker — Our Mission and Who Builds It",
  description:
    "Munib Tracker is a free, ad-free Islamic app for Salah, Qaza, Zikr and the Qur'an. Learn why it exists, who builds it, and how we keep content authentic.",
});

export default function AboutPage() {
  return (
    <ContentPage
      path="/about"
      eyebrow="About"
      title={`About ${APP_NAME}`}
      intro={`${APP_NAME} is a free, offline-first companion to help you track your journey back to Allah.`}
    >
      <ContentSection heading="Our mission">
        <p className="text-muted">
          We believe worship tracking should feel calm and trustworthy — not gamified or
          guilt-driven. {APP_NAME} exists to help you track your journey back to Allah, with an
          honest record of your Salah, adhkar and Qaza, gentle reminders, and rich Islamic content,
          all without requiring an account for personal use.
        </p>
      </ContentSection>

      <ContentSection heading="Who it's for">
        <p className="text-muted">
          Whether you are rebuilding a consistent Salah habit, working through missed prayers and
          fasts, learning the Qur&apos;an, or teaching your children to pray, {APP_NAME} is designed
          to be a quiet, judgement-free companion. Your personal record stays on your device unless
          you choose to sync it or share a small signal with your family or a partner.
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
          page: Salah tracking with Rawatib, Qaza planning, a Salah focus lock, a Masjid finder, 279
          duas and 60 adhkar with a custom adhkar builder, offline Qur&apos;an (surah, juz, 604-page
          mushaf, word-by-word, tajweed, notes and root-word search) with on-device recitation
          practice, a hadith library, Qibla, Hijri events, statistics and gentle Noor encouragement,
          family and kids mode, group khatm, an inheritance calculator and will builder, widgets and
          watch companions, optional sync, local backup, and app lock. Beyond tracking, {APP_NAME}{" "}
          is a place to learn: 350+ cited topics on aqeedah, the prophets, the seerah, the sahaba,
          the Hereafter and dua; a guided path to read and understand the Qur&apos;an; and practical
          worship guides for Salah, taharah, zakat, Friday, Janazah, and Hajj & Umrah, every lesson
          referenced to the Qur&apos;an and authentic hadith. The interface ships in 24 languages.
        </p>
      </ContentSection>

      <ContentSection heading="Open source">
        <p className="text-muted">
          {APP_NAME} is source-available: the code is on{" "}
          <a
            href={GITHUB_REPO_URL}
            className="font-medium text-brand hover:underline"
            rel="noopener noreferrer"
            target="_blank"
          >
            GitHub
          </a>{" "}
          under a non-commercial license: free to use, modify, and redistribute for personal and
          educational purposes, with credit and a link to this site. It may not be sold. Learn more
          on our{" "}
          <Link href={SITE_PATHS.openSource} className="font-medium text-brand hover:underline">
            Open source
          </Link>{" "}
          page, and meet the people behind the work on{" "}
          <Link href={SITE_PATHS.contributors} className="font-medium text-brand hover:underline">
            Contributors
          </Link>
          .
        </p>
      </ContentSection>

      <ContentSection heading="Author & collaborators">
        <p className="text-muted">
          {APP_NAME} is built and maintained by{" "}
          <TrackedLink
            href={APP_AUTHOR_URL}
            className="font-medium text-brand hover:underline"
            track="outbound"
            linkText={APP_AUTHOR}
            placement="about"
          >
            {APP_AUTHOR}
          </TrackedLink>
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
