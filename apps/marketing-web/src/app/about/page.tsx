import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME, DUA_COUNT } from "@munib-tracker/shared/constants";
import type { Metadata } from "next";
import Link from "next/link";
import { Blocks } from "@/components/content/blocks";
import { ContentPage, ContentSection } from "@/components/content-page";
import { TrackedLink } from "@/components/tracked-link";
import { MUNIB_AYAHS } from "@/lib/munib-ayahs";
import { pageMetadata } from "@/lib/seo";
import { appQuranAyahUrl, GITHUB_REPO_URL, SITE_PATHS } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  path: "/about",
  title: 'About Munib Tracker — What "Munib" Means and Why It Exists',
  description:
    "Munib means the one who turns back to Allah in repentance. Why Munib Tracker carries that name, who builds it, and how its content stays authentic.",
});

/** The two ayahs that use the word munib, rendered from the app's bundled text. */
const MUNIB_EVIDENCE = MUNIB_AYAHS.map((a) => ({
  type: "evidence" as const,
  kind: "quran" as const,
  arabic: a.arabic,
  translation: a.translation,
  reference: `Qur'an ${a.surah}:${a.ayah}`,
  href: appQuranAyahUrl(a.surah, a.ayah),
  note: "Translation: Pickthall",
}));

export default function AboutPage() {
  return (
    <ContentPage
      path="/about"
      eyebrow="About"
      title={`About ${APP_NAME}`}
      intro={`${APP_NAME} is a free, offline-first companion to help you track your journey back to Allah.`}
    >
      <ContentSection heading="What does Munib mean?">
        <p className="text-muted">
          <strong className="text-white">
            Munib (<span lang="ar">مُنيب</span>)
          </strong>{" "}
          is an Arabic word for the one who turns back: a person who returns to Allah in repentance,
          and keeps returning. Not once, dramatically. Over and over, quietly, for a lifetime.
        </p>
        <p className="text-muted">
          The word appears in the Qur&apos;an. Allah describes Ibrahim (peace be upon him) as{" "}
          <em>ḥalīmun awwāhun munīb</em> in Surah Hud, and Surah Qaf speaks of the one who comes{" "}
          <em>bi-qalbin munīb</em>, with a returning heart.
        </p>
        <Blocks blocks={MUNIB_EVIDENCE} />
        <p className="text-muted">
          <em>Munib</em> comes from <em>inābah</em>, turning to Allah in repentance. Arabic
          dictionaries describe it as a turning back that repeats, not a single one-time U-turn. The
          word itself allows for the fact that you&apos;ll need to come back more than once.
        </p>
      </ContentSection>

      <ContentSection heading="Why the app carries that name">
        <p className="text-muted">
          Every Muslim knows the return isn&apos;t a one-time event. You slip. You miss Fajr. Your
          tasbeeh sits untouched for a week. Then you turn again. And again. {APP_NAME} was built
          for that cycle, so that returning isn&apos;t only a feeling you have at 2 a.m.: it becomes
          something you can track, remember, and rebuild, one honest day at a time.
        </p>
        <p className="text-muted">
          That&apos;s why it isn&apos;t another content dump with a crescent icon. It&apos;s a
          tracker and a reminder for the walk back: honest Salah logging, missed prayers you can
          actually clear, daily zikr and gentle nudges. Its tagline says the same thing:{" "}
          <em>Track Your Journey Back to Allah.</em> The name isn&apos;t decoration. It&apos;s the
          whole thesis.
        </p>
        <p className="text-muted">
          Three design rules shaped every screen: encouragement stays gentle, the calendar stays
          honest, and your data lives on your device first.
        </p>
      </ContentSection>

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
          page: Salah tracking with Rawatib, Qaza planning, a Salah focus lock, a Masjid finder,{" "}
          {DUA_COUNT} duas and 60 adhkar with a custom adhkar builder, offline Qur&apos;an (surah,
          juz, 604-page mushaf, word-by-word, tajweed, notes and root-word search) with on-device
          recitation practice, a hadith library, Qibla, Hijri events, statistics and gentle Noor
          encouragement, family and kids mode, group khatm, an inheritance calculator and will
          builder, widgets and watch companions, optional sync, local backup, and app lock. Beyond
          tracking, {APP_NAME} is a place to learn: 350+ cited topics on aqeedah, the prophets, the
          seerah, the sahaba, the Hereafter and dua; a guided path to read and understand the
          Qur&apos;an; and practical worship guides for Salah, taharah, zakat, Friday, Janazah, and
          Hajj & Umrah, every lesson referenced to the Qur&apos;an and authentic hadith. The
          interface ships in 24 languages.
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
          educational purposes, with credit and a link to this site. It may not be sold. A tool for
          returning to Allah should be inspectable: you should be able to read the architecture, fix
          a bug, improve a translation, and trace exactly where every verse and hadith came from.
          That boundary is intentional: free for the ummah and for learning, not free for someone
          else to repackage and sell. Learn more on our{" "}
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

      <ContentSection heading="No sponsorship, no donations">
        <p className="text-muted">
          {APP_NAME} does not currently accept sponsorship, funding, or donations, and there is no
          official payment or donation channel. If anyone claims to be collecting money on its
          behalf, they&apos;re not.
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
