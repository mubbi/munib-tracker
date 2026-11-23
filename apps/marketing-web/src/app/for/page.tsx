import { Users } from "lucide-react";
import type { Metadata } from "next";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { AUDIENCE_PAGES, audienceHref } from "@/content/audiences";
import { pageMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

const PATH = "/for";
const TITLE = "Who Munib Tracker is for";
const DESCRIPTION =
  "How Munib Tracker helps new Muslims, Qur'an learners, people returning to Salah, and families learning together at home.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "Who It's For — New Muslims, Qur'an Learners & Families",
  description: DESCRIPTION,
});

export default function AudienceHub() {
  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
          itemListSchema(
            AUDIENCE_PAGES.map((a) => ({ name: a.title, href: audienceHref(a.slug) })),
          ),
        )}
      />
      <PageHero
        crumbs={[{ name: "Who it's for", href: PATH }]}
        eyebrow="Who it's for"
        title={TITLE}
        intro={
          <p>
            Munib Tracker is for any Muslim who wants to be more consistent in worship. These pages
            show how it fits a few common situations, and where it doesn't.
          </p>
        }
      />
      <PageSection title="Find your starting point">
        <div className="grid gap-4 sm:grid-cols-2">
          {AUDIENCE_PAGES.map((a) => (
            <LinkCard
              key={a.slug}
              href={audienceHref(a.slug)}
              title={a.title}
              description={a.description}
              meta={a.navLabel}
              icon={<Users className="size-5" />}
            />
          ))}
        </div>
      </PageSection>
      <DownloadCta
        title="Wherever you're starting from"
        text="Munib Tracker is free, private and works offline. Try it for a week and see what changes."
        placement="hub_page"
      />
    </>
  );
}
