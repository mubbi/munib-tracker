import { Check } from "lucide-react";
import { Blocks } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import {
  DateStamp,
  FaqSection,
  JsonLdScript,
  LinkCard,
  PageSection,
  RichParagraphs,
} from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { ComparisonTable } from "@/components/templates/comparison-table";
import { FeatureInventory } from "@/components/templates/feature-inventory";
import { compareHref, getComparison } from "@/content/compare";
import { getFeature } from "@/content/features";
import { PLANNED_FEATURES, SHIPPED_FEATURE_COUNT } from "@/content/munib-features";
import { articleByHref } from "@/content/resources";
import type { ComparePage } from "@/content/types";
import { graph, webPageSchema } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

/** Resolves a related href to a card (feature, article, comparison or hub). */
function relatedCard(href: string) {
  if (href.startsWith("/features/")) {
    const f = getFeature(href.slice("/features/".length));
    if (f) return { href, title: f.navLabel, description: f.description, meta: "Feature" };
  }
  if (href.startsWith("/compare/")) {
    const c = getComparison(href.slice("/compare/".length));
    if (c) return { href, title: c.title, description: c.description, meta: "Comparison" };
  }
  const a = articleByHref(href);
  if (a) return { href, title: a.title, description: a.description, meta: "Guide" };
  if (href === "/compare") {
    return {
      href,
      title: "All comparisons",
      description: "Every app comparison in one place.",
      meta: "Compare",
    };
  }
  return null;
}

export function CompareTemplate({ page }: { page: ComparePage }) {
  const path = compareHref(page.slug);
  const related = page.related.map(relatedCard).filter((c) => c !== null);
  const roundup = page.kind === "roundup";

  return (
    <>
      <JsonLdScript
        data={graph(webPageSchema({ path, name: page.title, description: page.seoDescription }))}
      />
      <PageHero
        crumbs={[
          { name: "Compare", href: "/compare" },
          { name: page.title, href: path },
        ]}
        eyebrow={page.eyebrow}
        title={page.title}
        intro={<RichParagraphs items={page.intro} className="flex flex-col gap-4" />}
        meta={<DateStamp label="Last verified" iso={page.verifiedOn} />}
      />

      <PageSection id="verdict" eyebrow="Quick answer" title="Which one should you choose?">
        <div className="grid gap-4 md:grid-cols-2">
          {page.summary.map((s) => (
            <div key={s.title} className="rounded-2xl border border-white/10 bg-[#0c2131]/50 p-6">
              <h3 className="font-display text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-white/72">
                <RichText text={s.text} />
              </p>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="comparison-table"
        tone="band"
        eyebrow="Side by side"
        title="Feature comparison"
        intro={`Checked against official websites and US App Store and Google Play listings. "Not verified" means we couldn't confirm it from an official source, not that the feature is missing.${PLANNED_FEATURES.length ? " “Coming soon” marks Munib Tracker features on our roadmap that are not in the app yet." : ""}`}
      >
        <ComparisonTable page={page} />
      </PageSection>

      <PageSection
        id="everything-in-munib"
        eyebrow="Complete feature list"
        title="Everything in Munib Tracker"
        intro={
          PLANNED_FEATURES.length
            ? `${SHIPPED_FEATURE_COUNT} features in the app today, plus ${PLANNED_FEATURES.length} on our roadmap marked "Coming soon". Roadmap features aren't in the app yet, so they never count as available in the table above.`
            : `All ${SHIPPED_FEATURE_COUNT} features in Munib Tracker, grouped by area. Every one is free, with no ads.`
        }
      >
        <FeatureInventory />
      </PageSection>

      <PageSection id="strengths" eyebrow="Strengths" title="What each app does well">
        <div
          className={cn("grid gap-4", roundup ? "sm:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2")}
        >
          {page.apps.map((app) => (
            <div key={app.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h3
                className={cn(
                  "font-display text-lg font-semibold",
                  app.id === "munib" ? "text-brand" : "text-white",
                )}
              >
                {app.name}
              </h3>
              <p className="mt-1 text-sm text-white/60">
                <span className="font-semibold text-white/75">Best for: </span>
                {page.bestFor[app.id]}
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {(page.strengths[app.id] ?? []).map((s) => (
                  <li key={s} className="flex gap-2.5 text-[15px] leading-relaxed text-white/75">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </PageSection>

      {page.body?.length ? (
        <section className="py-6 md:py-10">
          <div className="mx-auto max-w-3xl px-5 md:px-8">
            <Blocks blocks={page.body} />
          </div>
        </section>
      ) : null}

      <PageSection
        id="sources"
        tone="band"
        eyebrow="Sources"
        title="Where this information comes from"
      >
        <p className="max-w-2xl text-[15px] leading-relaxed text-white/65">
          Prices are US App Store prices and may differ in your country. Features and prices change;
          please check the official listings. Last verified{" "}
          <DateStamp label="" iso={page.verifiedOn} />.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {page.sources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="text-[15px] text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </PageSection>

      <FaqSection items={page.faqs} title="Questions people ask" />

      {related.length ? (
        <PageSection id="related" tone="band" eyebrow="Keep exploring" title="Related pages">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <LinkCard key={c.href} {...c} />
            ))}
          </div>
        </PageSection>
      ) : null}

      <DownloadCta
        title="Try Munib Tracker and decide for yourself"
        text="It's free with no ads or account, so there's nothing to lose by trying it alongside the app you use now."
        placement="compare_page"
      />
    </>
  );
}
