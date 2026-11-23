import { BookOpenText } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { JsonLdScript, LinkCard, PageSection } from "@/components/content/primitives";
import { ARTICLES, articleHref, articlesIn } from "@/content/resources";
import { categoryHref, RESOURCE_CATEGORIES } from "@/content/resources/categories";
import { pageMetadata } from "@/lib/seo";
import { graph, itemListSchema, webPageSchema } from "@/lib/structured-data";

const PATH = "/resources";
const TITLE = "Guides for Salah, Zikr and learning the Qur'an";
const DESCRIPTION =
  "Practical, cited guides on building a Salah habit, Qaza, daily Zikr, learning and memorizing the Qur'an, and staying consistent in worship.";

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: "Islamic Guides — Salah, Zikr, Qur'an Learning & Habits",
  description: DESCRIPTION,
});

export default function ResourcesHub() {
  return (
    <>
      <JsonLdScript
        data={graph(
          webPageSchema({ path: PATH, name: TITLE, description: DESCRIPTION }),
          itemListSchema(ARTICLES.map((a) => ({ name: a.title, href: articleHref(a) }))),
        )}
      />
      <PageHero
        crumbs={[{ name: "Resources", href: PATH }]}
        eyebrow="Resources"
        title={TITLE}
        intro={
          <p>
            Short, practical guides you can use today, whether or not you use our app. Every Qur'an
            ayah and hadith is quoted from its source and linked, and we point out where scholars
            differ.
          </p>
        }
      />
      {RESOURCE_CATEGORIES.map((cat, i) => (
        <PageSection
          key={cat.slug}
          tone={i % 2 ? "band" : "default"}
          eyebrow="Topic"
          title={cat.title}
          intro={cat.description}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articlesIn(cat.slug).map((a) => (
              <LinkCard
                key={a.slug}
                href={articleHref(a)}
                title={a.title}
                description={a.description}
                icon={<BookOpenText className="size-5" />}
              />
            ))}
          </div>
          <Link
            href={categoryHref(cat.slug)}
            className="mt-6 inline-block text-sm font-semibold text-brand hover:underline"
          >
            All {cat.title} guides
          </Link>
        </PageSection>
      ))}
      <PageSection
        tone="band"
        eyebrow="Go deeper"
        title="The in-app learning library"
        intro="Beyond these guides, the app includes structured, cited lessons on aqeedah, the prophets, the seerah, the Hereafter and practical fiqh. [See what's in the library](/learn)."
      />
      <DownloadCta
        title="Put a guide into practice"
        text="Munib Tracker helps you keep up the habits these guides describe, privately and for free."
        placement="hub_page"
      />
    </>
  );
}
