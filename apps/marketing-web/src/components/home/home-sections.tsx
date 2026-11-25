import { APP_NAME } from "@munib-tracker/shared/constants";
import { ArrowRight, Ban, BookCheck, Code2, ShieldCheck, UserRound, WifiOff } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { FeatureIcon } from "@/components/content/feature-icon";
import { LinkCard, PageSection } from "@/components/content/primitives";
import { TrackedLink } from "@/components/tracked-link";
import { audienceHref, getAudiencePages } from "@/content/audiences";
import { compareHref, getComparePages } from "@/content/compare";
import { featureHref, getFeaturePages } from "@/content/features";
import { articleHref, getArticles } from "@/content/resources";
import { Link } from "@/i18n/navigation";

/** Every feature landing page, one card each. */
export function FeatureHub() {
  const t = useTranslations("home.featureHub");
  const locale = useLocale();
  return (
    <PageSection
      id="all-features"
      tone="band"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro")}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getFeaturePages(locale).map((f) => (
          <LinkCard
            key={f.slug}
            href={featureHref(f.slug)}
            title={f.navLabel}
            description={f.description}
            icon={<FeatureIcon icon={f.icon} />}
          />
        ))}
        <TrackedLink
          href="/features"
          className="group flex flex-col justify-center rounded-2xl border border-dashed border-white/20 p-6 text-center transition-colors hover:border-brand/50"
          track="cta"
          cta="explore_features"
          placement="home_features"
        >
          <span className="font-display text-lg font-semibold text-white">{t("seeAll")}</span>
          <span className="mt-1 text-sm text-white/60">{t("seeAllHint")}</span>
          <span className="mt-3 inline-flex items-center justify-center gap-1 text-sm font-semibold text-brand">
            {t("allFeatures")} <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
          </span>
        </TrackedLink>
      </div>
    </PageSection>
  );
}

const STEPS = ["download", "location", "log"] as const;

export function HowItWorksTeaser() {
  const t = useTranslations("home.howItWorks");
  return (
    <PageSection
      id="how-it-works"
      eyebrow={t("eyebrow")}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <ol className="grid gap-4 md:grid-cols-3">
        {STEPS.map((id, i) => (
          <li key={id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <span className="inline-flex size-9 items-center justify-center rounded-full bg-brand/15 font-display font-bold text-brand">
              {i + 1}
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">
              {t(`steps.${id}.title`)}
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">
              {t(`steps.${id}.text`)}
            </p>
          </li>
        ))}
      </ol>
      <TrackedLink
        href="/how-it-works"
        className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
        track="cta"
        cta="how_it_works"
        placement="home_how_it_works"
      >
        {t("walkthrough")} <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
      </TrackedLink>
    </PageSection>
  );
}

const PROMISES = [
  { id: "noAds", icon: Ban },
  { id: "noAccount", icon: UserRound },
  { id: "private", icon: ShieldCheck },
  { id: "offline", icon: WifiOff },
  { id: "sources", icon: BookCheck },
  { id: "openSource", icon: Code2 },
] as const;

export function PrivacyBand() {
  const t = useTranslations("home.privacy");
  return (
    <PageSection
      id="why"
      tone="band"
      eyebrow={t("eyebrow", { appName: APP_NAME })}
      title={t("title")}
      intro={t("intro", { appName: APP_NAME })}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROMISES.map(({ id, icon: Icon }) => (
          <div
            key={id}
            className="flex gap-4 rounded-2xl border border-white/10 bg-[#0c2131]/45 p-5"
          >
            <Icon aria-hidden className="mt-0.5 size-6 shrink-0 text-brand" />
            <div>
              <h3 className="font-display font-semibold text-white">{t(`promises.${id}.title`)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/65">
                {t(`promises.${id}.text`, { github: "GitHub" })}
              </p>
            </div>
          </div>
        ))}
      </div>
      <TrackedLink
        href="/why-munib-tracker"
        className="mt-8 inline-flex items-center gap-1.5 font-semibold text-brand hover:underline"
        track="cta"
        cta="our_principles"
        placement="home_privacy"
      >
        {t("principles")} <ArrowRight aria-hidden className="size-4 rtl:-scale-x-100" />
      </TrackedLink>
    </PageSection>
  );
}

export function AudienceTeaser() {
  const t = useTranslations("home.audiences");
  const locale = useLocale();
  return (
    <PageSection id="who-its-for" eyebrow={t("eyebrow")} title={t("title")} intro={t("intro")}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {getAudiencePages(locale).map((a) => (
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

const GUIDE_SLUGS = [
  "how-to-build-a-consistent-salah-habit",
  "what-is-qaza-salah",
  "how-to-build-a-daily-zikr-routine",
  "how-to-memorize-the-quran",
] as const;

export function CompareAndGuides() {
  const t = useTranslations("home.compareGuides");
  const locale = useLocale();
  const comparisons = getComparePages(locale).slice(0, 4);
  const articles = getArticles(locale);
  const guides = GUIDE_SLUGS.map((slug) => articles.find((a) => a.slug === slug)).filter(
    (a) => a !== undefined,
  );

  return (
    <PageSection id="learn-more" tone="band" title={t("title")}>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="font-display text-xl font-semibold text-white">{t("compareTitle")}</h3>
          <p className="mt-2 text-[15px] text-white/65">{t("compareText")}</p>
          <ul className="mt-5 flex flex-col gap-2">
            {comparisons.map((c) => (
              <li key={c.slug}>
                <Link
                  href={compareHref(c.slug)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/85 transition-colors hover:border-brand/40 hover:text-white"
                >
                  {c.title}
                  <ArrowRight aria-hidden className="size-4 text-brand rtl:-scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
          <TrackedLink
            href="/compare"
            className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
            track="cta"
            cta="compare_apps"
            placement="home_compare"
          >
            {t("allComparisons")}
          </TrackedLink>
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold text-white">{t("guidesTitle")}</h3>
          <p className="mt-2 text-[15px] text-white/65">{t("guidesText")}</p>
          <ul className="mt-5 flex flex-col gap-2">
            {guides.map((a) => (
              <li key={a.slug}>
                <Link
                  href={articleHref(a)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[15px] text-white/85 transition-colors hover:border-brand/40 hover:text-white"
                >
                  {a.title}
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-brand rtl:-scale-x-100" />
                </Link>
              </li>
            ))}
          </ul>
          <TrackedLink
            href="/resources"
            className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
            track="cta"
            cta="read_guides"
            placement="home_compare"
          >
            {t("allGuides")}
          </TrackedLink>
        </div>
      </div>
    </PageSection>
  );
}
