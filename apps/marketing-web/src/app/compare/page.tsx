import { Scale } from "lucide-react";
import type { Metadata } from "next";
import { Note } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { COMPARE_PAGES, compareHref } from "@/content/compare";
import { pageMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

const PATH = "/compare";
const TITLE = "Compare Munib Tracker with other Islamic apps";
const DESCRIPTION =
  "Honest, sourced comparisons of Munib Tracker with Muslim Pro, Islam360, Tarteel, Pillars, Athan and other Salah and habit tracker apps.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "Compare Islamic Apps — Munib Tracker vs Muslim Pro, Tarteel & More",
  description: DESCRIPTION,
});

export default function CompareHub() {
  const versus = COMPARE_PAGES.filter((c) => c.kind === "versus");
  const roundups = COMPARE_PAGES.filter((c) => c.kind === "roundup");
  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
          itemListSchema(COMPARE_PAGES.map((c) => ({ name: c.title, href: compareHref(c.slug) }))),
        )}
      />
      <PageHero
        crumbs={[{ name: "Compare", href: PATH }]}
        eyebrow="Compare"
        title={TITLE}
        intro={
          <p>
            Every Muslim app makes different choices about features, ads, price and privacy. These
            comparisons use each app's official website and store listings, list their sources, and
            say plainly where another app is the better fit.
          </p>
        }
      />
      <PageSection title="App roundups">
        <div className="grid gap-4 sm:grid-cols-2">
          {roundups.map((c) => (
            <LinkCard
              key={c.slug}
              href={compareHref(c.slug)}
              title={c.title}
              description={c.description}
              meta="Roundup"
              icon={<Scale className="size-5" />}
            />
          ))}
        </div>
      </PageSection>
      <PageSection tone="band" title="Head-to-head comparisons">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {versus.map((c) => (
            <LinkCard
              key={c.slug}
              href={compareHref(c.slug)}
              title={c.title}
              description={c.description}
              meta="Versus"
            />
          ))}
        </div>
        <div className="mt-10 max-w-3xl">
          <Note
            tone="info"
            title="How we compare"
            text="We only list what we can confirm from official sources, and mark everything else “Not verified”. We never invent weaknesses. Each page shows the date it was last checked. If something has changed, please [let us know](/contact)."
          />
        </div>
      </PageSection>
      <DownloadCta
        title="See for yourself"
        text="Munib Tracker is free with no ads or account. Try it alongside your current app."
        placement="hub_page"
      />
    </>
  );
}
