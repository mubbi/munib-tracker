import { ListChecks } from "lucide-react";
import Link from "next/link";
import { Blocks, blockText, Note, tableOfContents } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import { DateStamp, FaqList, JsonLdScript, LinkCard } from "@/components/content/primitives";
import { RichText } from "@/components/content/rich-text";
import { featureHref, getFeature } from "@/content/features";
import { articleByHref, articleHref } from "@/content/resources";
import { categoryHref, getCategory } from "@/content/resources/categories";
import type { Article } from "@/content/types";
import { readingMinutes } from "@/lib/seo";
import { articleSchema, graph } from "@/lib/structured-data";

function relatedCard(href: string) {
  const a = articleByHref(href);
  if (a) return { href, title: a.title, description: a.description, meta: "Guide" };
  if (href.startsWith("/features/")) {
    const f = getFeature(href.slice("/features/".length));
    if (f) return { href, title: f.navLabel, description: f.description, meta: "Feature" };
  }
  return null;
}

export function ArticleTemplate({ article }: { article: Article }) {
  const path = articleHref(article);
  const category = getCategory(article.category);
  const text = blockText(article.body);
  const words = text.join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = readingMinutes(text);
  const toc = tableOfContents(article.body);
  const tieIn = getFeature(article.appTieIn.feature);
  const related = article.related.map(relatedCard).filter((c) => c !== null);

  return (
    <>
      <JsonLdScript
        data={graph(
          articleSchema({
            path,
            headline: article.title,
            description: article.seoDescription,
            published: article.published,
            modified: article.updated,
            section: category?.title ?? "Guides",
            keywords: article.keywords,
            wordCount: words,
          }),
        )}
      />
      <PageHero
        crumbs={[
          { name: "Resources", href: "/resources" },
          { name: category?.title ?? "Guides", href: categoryHref(article.category) },
          { name: article.title, href: path },
        ]}
        eyebrow={category?.title}
        title={article.title}
        intro={<p>{article.description}</p>}
        meta={
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <DateStamp label="Updated" iso={article.updated} />
            <span aria-hidden>·</span>
            <span>{minutes} min read</span>
            <span aria-hidden>·</span>
            <span>
              By{" "}
              <Link href="/about" className="underline underline-offset-2 hover:text-brand">
                Munib Tracker
              </Link>
            </span>
          </p>
        }
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-12 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <article className="min-w-0 max-w-3xl">
          <aside
            aria-labelledby="takeaways-title"
            className="rounded-2xl border border-brand/25 bg-[#0b2a24] p-6"
          >
            <h2
              id="takeaways-title"
              className="flex items-center gap-2 font-display text-base font-semibold text-white"
            >
              <ListChecks aria-hidden className="size-5 text-brand" />
              Key takeaways
            </h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[15px] leading-relaxed text-white/80 marker:text-brand">
              {article.takeaways.map((t) => (
                <li key={t}>
                  <RichText text={t} />
                </li>
              ))}
            </ul>
          </aside>

          <div className="mt-10">
            <Blocks blocks={article.body} />
          </div>

          {tieIn ? (
            <div className="mt-10">
              <Note
                tone="app"
                title={`Try it: ${tieIn.navLabel}`}
                text={`${article.appTieIn.text} [Learn about ${tieIn.navLabel.toLowerCase()}](${featureHref(tieIn.slug)}).`}
              />
            </div>
          ) : null}

          {article.faqs?.length ? (
            <section aria-labelledby="article-faq" className="mt-12">
              <h2 id="article-faq" className="font-display text-2xl font-bold text-white">
                Frequently asked questions
              </h2>
              <div className="mt-5">
                <FaqList items={article.faqs} />
              </div>
            </section>
          ) : null}

          <section aria-labelledby="sources-title" className="mt-12 border-t border-white/10 pt-8">
            <h2 id="sources-title" className="font-display text-xl font-bold text-white">
              Sources
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              {article.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-white/55">
              This guide is educational and was prepared by Munib Tracker from the sources listed
              above. It is not a fatwa. For questions about your own situation, please ask a
              qualified scholar. Found an error?{" "}
              <Link href="/contact" className="text-brand underline underline-offset-2">
                Let us know
              </Link>
              .
            </p>
          </section>
        </article>

        {toc.length > 2 ? (
          <nav aria-label="On this page" className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                On this page
              </p>
              <ol className="mt-3 flex flex-col gap-2 text-sm">
                {toc.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="text-white/65 transition-colors hover:text-brand"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>
        ) : null}
      </div>

      {related.length ? (
        <section
          aria-labelledby="related-title"
          className="border-y border-white/[0.07] bg-white/[0.025] py-14 md:py-20"
        >
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <h2
              id="related-title"
              className="font-display text-2xl font-bold text-white md:text-3xl"
            >
              Keep reading
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <LinkCard key={c.href} {...c} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {tieIn ? (
        <DownloadCta title={tieIn.cta.title} text={tieIn.cta.text} placement="article" />
      ) : null}
    </>
  );
}
