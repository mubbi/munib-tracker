import { ArrowRight, Ban, BookCheck, Code2, ShieldCheck, UserRound, WifiOff } from "lucide-react";
import Link from "next/link";
import { FeatureIcon } from "@/components/content/feature-icon";
import { LinkCard, PageSection } from "@/components/content/primitives";
import { AUDIENCE_PAGES, audienceHref } from "@/content/audiences";
import { COMPARE_PAGES, compareHref } from "@/content/compare";
import { FEATURE_PAGES, featureHref } from "@/content/features";
import { ARTICLES, articleHref } from "@/content/resources";

/** Every feature landing page, one card each. */
export function FeatureHub() {
  return (
    <PageSection
      id="all-features"
      tone="band"
      eyebrow="Features"
      title="Everything you need to stay consistent"
      intro="Each feature has its own page with screenshots, examples and answers to common questions."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_PAGES.map((f) => (
          <LinkCard
            key={f.slug}
            href={featureHref(f.slug)}
            title={f.navLabel}
            description={f.description}
            icon={<FeatureIcon icon={f.icon} />}
          />
        ))}
        <Link
          href="/features"
          className="group flex flex-col justify-center rounded-2xl border border-dashed border-white/20 p-6 text-center transition-colors hover:border-brand/50"
        >
          <span className="font-display text-lg font-semibold text-white">
            See the complete list
          </span>
          <span className="mt-1 text-sm text-white/60">
            Hadith, duas, learning library and more
          </span>
          <span className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-semibold text-brand">
            All features <ArrowRight aria-hidden className="size-4" />
          </span>
        </Link>
      </div>
    </PageSection>
  );
}

const STEPS = [
  {
    title: "Download",
    text: "Install on iPhone or Android, or open the web app. No account needed.",
  },
  {
    title: "Set your location",
    text: "Salah times appear for your city, with your method and madhab.",
  },
  { title: "Log as you go", text: "Tap each Salah and zikr. Your progress builds day by day." },
];

export function HowItWorksTeaser() {
  return (
    <PageSection
      id="how-it-works"
      eyebrow="How it works"
      title="Up and running in a minute"
      intro="Munib Tracker fits around the five daily Salah, so your routine and the app stay in step."
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand/15 font-display font-bold text-brand">
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">{s.title}</h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">{s.text}</p>
          </li>
        ))}
      </ol>
      <Link
        href="/how-it-works"
        className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
      >
        See the full walkthrough <ArrowRight aria-hidden className="size-4" />
      </Link>
    </PageSection>
  );
}

const PROMISES = [
  { icon: Ban, title: "No ads", text: "No ads, no subscriptions, no in-app purchases." },
  {
    icon: UserRound,
    title: "No account needed",
    text: "Every personal feature works as a guest. Sign in to sync or to share with family.",
  },
  {
    icon: ShieldCheck,
    title: "Private by default",
    text: "Your record stays on your device. Practice audio never leaves it.",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    text: "Tracking, the Qur'an text, adhkar and lessons need no signal.",
  },
  {
    icon: BookCheck,
    title: "Authentic sources",
    text: "Qur'an, hadith and adhkar from established, credited datasets.",
  },
  { icon: Code2, title: "Open to inspect", text: "The source code is public on GitHub." },
];

export function PrivacyBand() {
  return (
    <PageSection
      id="why"
      tone="band"
      eyebrow="Why Munib Tracker"
      title="Built for your worship, not for screen time"
      intro="Many Islamic apps are funded by ads or subscriptions. Munib Tracker isn't, so it can stay calm, private and focused on helping you."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROMISES.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="flex gap-4 rounded-2xl border border-white/10 bg-[#0c2131]/45 p-5"
          >
            <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-brand" />
            <div>
              <h3 className="font-display font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/65">{text}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/why-munib-tracker"
        className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
      >
        Our principles <ArrowRight aria-hidden className="size-4" />
      </Link>
    </PageSection>
  );
}

export function AudienceTeaser() {
  return (
    <PageSection
      id="who-its-for"
      eyebrow="Who it's for"
      title="Wherever you're starting from"
      intro="Coming back to Salah, new to Islam, memorizing the Qur'an or teaching your children: see how the app fits."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCE_PAGES.map((a) => (
          <LinkCard
            key={a.slug}
            href={audienceHref(a.slug)}
            title={a.navLabel}
            description={a.description}
          />
        ))}
      </div>
    </PageSection>
  );
}

export function CompareAndGuides() {
  const comparisons = COMPARE_PAGES.slice(0, 4);
  const guides = [
    "how-to-build-a-consistent-salah-habit",
    "what-is-qaza-salah",
    "how-to-build-a-daily-zikr-routine",
    "how-to-memorize-the-quran",
  ]
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a) => a !== undefined);

  return (
    <PageSection id="learn-more" tone="band" title="Compare, learn, and decide for yourself">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">Honest comparisons</h3>
          <p className="mt-2 text-[15px] text-white/65">
            Sourced, dated comparisons with other Islamic apps, including where they do better.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {comparisons.map((c) => (
              <li key={c.slug}>
                <Link
                  href={compareHref(c.slug)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/85 transition-colors hover:border-brand/40 hover:text-white"
                >
                  {c.title}
                  <ArrowRight aria-hidden className="size-4 text-brand" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/compare"
            className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
          >
            All comparisons
          </Link>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-white">Guides worth reading</h3>
          <p className="mt-2 text-[15px] text-white/65">
            Practical, cited guides on Salah, Zikr and the Qur&apos;an, useful with or without the
            app.
          </p>
          <ul className="mt-5 flex flex-col gap-2">
            {guides.map((a) => (
              <li key={a.slug}>
                <Link
                  href={articleHref(a)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/85 transition-colors hover:border-brand/40 hover:text-white"
                >
                  {a.title}
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-brand" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/resources"
            className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
          >
            All guides
          </Link>
        </div>
      </div>
    </PageSection>
  );
}
