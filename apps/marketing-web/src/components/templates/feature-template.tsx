import { Check } from "lucide-react";
import { PracticePreview } from "@/components/ai-practice-highlight";
import { Note } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { FeatureIcon } from "@/components/content/feature-icon";
import { PageHero } from "@/components/content/page-hero";
import {
  FaqList,
  frameWidthClass,
  JsonLdScript,
  LinkCard,
  PageSection,
  Screenshot,
} from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { StoreBadges } from "@/components/store-badges";
import { featureHref, getFeature } from "@/content/features";
import { articleByHref } from "@/content/resources";
import type { FeaturePage } from "@/content/types";
import { graph, webPageSchema } from "@/lib/structured-data";

/**
 * Feature landing page: what it does → why → how → benefits → screenshots →
 * examples → notes → FAQ → related → download. One H1, H2 per section.
 */
export function FeatureTemplate({ feature }: { feature: FeaturePage }) {
  const path = featureHref(feature.slug);
  const [firstShot, ...moreShots] = feature.gallery ?? [];
  const related = feature.related.map(getFeature).filter((f) => f !== undefined);
  const guides = (feature.guides ?? []).map(articleByHref).filter((a) => a !== undefined);

  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ path, name: feature.title, description: feature.seoDescription }),
        )}
      />
      <PageHero
        crumbs={[
          { name: "Features", href: "/features" },
          { name: feature.navLabel, href: path },
        ]}
        eyebrow={feature.eyebrow}
        title={feature.title}
        intro={<RichText text={feature.intro} />}
        actions={<StoreBadges placement="feature_page" />}
        screenshot={feature.hero}
        visual={
          feature.slug === "quran-practice" ? (
            <PracticePreview />
          ) : (
            <FeatureSummaryCard feature={feature} />
          )
        }
      />

      <PageSection
        id="what-it-does"
        title={feature.whatItDoes.title}
        intro={feature.whatItDoes.intro}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {feature.whatItDoes.groups.map((group) => (
            <div
              key={group.title}
              className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-6 md:p-7"
            >
              <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
              <ul className="mt-4 flex flex-col gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-white/75">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                    <span>
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection id="why" tone="band" title={feature.why.title}>
        <div className={firstShot ? "grid items-center gap-12 lg:grid-cols-[1.3fr_0.7fr]" : ""}>
          <div className="flex max-w-2xl flex-col gap-5 text-[17px] leading-[1.75] text-white/78">
            {feature.why.paragraphs.map((p) => (
              <p key={p}>
                <RichText text={p} />
              </p>
            ))}
          </div>
          {firstShot ? (
            <Screenshot slot={firstShot} className="mx-auto w-[220px] sm:w-[240px]" />
          ) : null}
        </div>
      </PageSection>

      <PageSection id="how-it-works" eyebrow="Step by step" title={feature.howItWorks.title}>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {feature.howItWorks.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="font-display text-sm font-bold text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-[17px] font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                <RichText text={step.text} />
              </p>
            </li>
          ))}
        </ol>
      </PageSection>

      <PageSection id="benefits" tone="band" eyebrow="Benefits" title="What you get from it">
        <div className="grid gap-4 sm:grid-cols-2">
          {feature.benefits.map((b) => (
            <div
              key={b.title}
              className="flex gap-4 rounded-2xl border border-white/10 bg-[#0c2131]/45 p-6"
            >
              <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand ring-1 ring-brand/20">
                <Check aria-hidden className="size-4" />
              </span>
              <div>
                <h3 className="font-display text-[17px] font-semibold text-white">{b.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white/70">
                  <RichText text={b.text} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      {moreShots.length > 0 ? (
        <PageSection id="screenshots" eyebrow="In the app" title="See it in Munib Tracker">
          <div className="flex flex-wrap items-start justify-center gap-10">
            {moreShots.map((slot) => (
              <Screenshot key={slot.key} slot={slot} className={frameWidthClass(slot.key)} />
            ))}
          </div>
        </PageSection>
      ) : null}

      <PageSection id="examples" eyebrow="In practice" title={feature.examples.title}>
        <div className="grid gap-4 md:grid-cols-3">
          {feature.examples.items.map((ex) => (
            <div key={ex.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3 className="font-display text-[17px] font-semibold text-white">{ex.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">
                <RichText text={ex.text} />
              </p>
            </div>
          ))}
        </div>
        {feature.notes?.length ? (
          <div className="mt-8 flex flex-col gap-4">
            {feature.notes.map((n) => (
              <Note key={n.text} tone={n.tone} title={n.title} text={n.text} />
            ))}
          </div>
        ) : null}
      </PageSection>

      <PageSection
        id="faq"
        tone="band"
        eyebrow="FAQ"
        title={`${feature.navLabel}: common questions`}
      >
        <div className="max-w-3xl">
          <FaqList items={feature.faqs} />
        </div>
      </PageSection>

      <PageSection id="related" eyebrow="Keep exploring" title="Related features and guides">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((f) => (
            <LinkCard
              key={f.slug}
              href={featureHref(f.slug)}
              title={f.navLabel}
              description={f.description}
              icon={<FeatureIcon icon={f.icon} />}
              meta="Feature"
            />
          ))}
          {guides.map((a) => (
            <LinkCard
              key={a.slug}
              href={`/resources/${a.category}/${a.slug}`}
              title={a.title}
              description={a.description}
              meta="Guide"
            />
          ))}
        </div>
      </PageSection>

      <DownloadCta title={feature.cta.title} text={feature.cta.text} placement="feature_page" />
    </>
  );
}

/** Hero visual for features without a real screenshot: a summary, never a mock UI. */
function FeatureSummaryCard({ feature }: { feature: FeaturePage }) {
  const highlights = feature.whatItDoes.groups.map((g) => g.title).slice(0, 4);
  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-[1.75rem] border border-white/12 bg-[linear-gradient(150deg,#0f3a30_0%,#0b2734_60%,#13213a_100%)] p-7 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.9)]">
      <div
        aria-hidden
        className="islamic-tiles-soft pointer-events-none absolute inset-0 opacity-[0.08]"
      />
      <span className="relative inline-flex size-14 items-center justify-center rounded-2xl bg-brand/15 text-brand ring-1 ring-brand/25">
        <FeatureIcon icon={feature.icon} className="size-7" />
      </span>
      <p className="relative mt-5 font-display text-xl font-semibold text-white">
        {feature.navLabel}
      </p>
      <ul className="relative mt-4 flex flex-col gap-2.5">
        {highlights.map((h) => (
          <li key={h} className="flex items-center gap-2.5 text-[15px] text-white/80">
            <Check aria-hidden className="size-4 shrink-0 text-brand" />
            {h}
          </li>
        ))}
      </ul>
      <p className="relative mt-6 text-xs uppercase tracking-[0.16em] text-gold/90">
        Free · No ads · In the app
      </p>
    </div>
  );
}
