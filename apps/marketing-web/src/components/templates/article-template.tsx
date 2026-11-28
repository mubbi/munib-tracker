import { APP_NAME } from "@munib-tracker/shared/constants";
import { ListChecks } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Blocks, blockText, Note, tableOfContents } from "@/components/content/blocks";
import { DownloadCta } from "@/components/content/download-cta";
import { PageHero } from "@/components/content/page-hero";
import {
  DateStamp,
  FaqList,
  JsonLdScript,
  LinkCard,
  Screenshot,
} from "@/components/content/primitives";
import { ProductAppLink } from "@/components/content/product-app-link";
import { RichText } from "@/components/content/rich-text";
import { TryFeatureLink } from "@/components/content/try-feature";
import { featureHref, getFeature } from "@/content/features";
import { articleByHref, articleHref } from "@/content/resources";
import { categoryHref, getCategory } from "@/content/resources/categories";
import type { Article } from "@/content/types";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { type Frame, getScreenshot } from "@/lib/screenshots";
import { readingMinutes } from "@/lib/seo";
import { isProductAppHref } from "@/lib/site";
import { articleSchema, faqNodes, graph } from "@/lib/structured-data";
import { cn } from "@/lib/utils";

const PHONE_FRAMES = new Set<Frame>(["phone", "android"]);

type TemplatesT = ReturnType<typeof useTranslations<"templates">>;

function relatedCard(href: string, locale: Locale, t: TemplatesT) {
  const a = articleByHref(href, locale);
  if (a) return { href, title: a.title, description: a.description, meta: t("cardMeta.guide") };
  if (href.startsWith("/features/")) {
    const f = getFeature(href.slice("/features/".length), locale);
    if (f) {
      return { href, title: f.navLabel, description: f.description, meta: t("cardMeta.feature") };
    }
  }
  return null;
}

export function ArticleTemplate({ article }: { article: Article }) {
  const t = useTranslations("templates");
  const locale = useLocale();
  const path = articleHref(article);
  const category = getCategory(article.category, locale);
  const categoryTitle = category?.title ?? t("crumbs.guides");
  const text = blockText(article.body);
  const words = text.join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = readingMinutes(text);
  const toc = tableOfContents(article.body);
  const tieIn = getFeature(article.appTieIn.feature, locale);
  // The feature's own hero screen illustrates the tie-in — phones only, so it stays small.
  const tieInShot =
    tieIn?.hero && PHONE_FRAMES.has(getScreenshot(tieIn.hero.key, locale, tieIn.hero.device).frame)
      ? tieIn.hero
      : null;
  const related = article.related
    .map((href) => relatedCard(href, locale, t))
    .filter((c) => c !== null);

  return (
    <>
      <JsonLdScript
        data={graph(
          articleSchema({
            locale,
            path,
            headline: article.title,
            description: article.seoDescription,
            published: article.published,
            modified: article.updated,
            section: categoryTitle,
            keywords: article.keywords,
            wordCount: words,
          }),
          ...faqNodes(article.faqs),
        )}
      />
      <PageHero
        crumbs={[
          { name: t("crumbs.resources"), href: "/resources" },
          { name: categoryTitle, href: categoryHref(article.category) },
          { name: article.title, href: path },
        ]}
        eyebrow={category?.title}
        title={article.title}
        intro={<p>{article.description}</p>}
        meta={
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <DateStamp label="updated" iso={article.updated} />
            <span aria-hidden>·</span>
            <span>{t("article.readingTime", { minutes })}</span>
            <span aria-hidden>·</span>
            <span>
              {t.rich("article.byline", {
                appName: APP_NAME,
                link: (chunks) => (
                  <Link href="/about" className="underline underline-offset-2 hover:text-brand">
                    {chunks}
                  </Link>
                ),
              })}
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
              {t("article.takeaways")}
            </h2>
            <ul className="mt-3 flex list-disc flex-col gap-2 ps-5 text-[15px] leading-relaxed text-white/80 marker:text-brand">
              {article.takeaways.map((takeaway) => (
                <li key={takeaway}>
                  <RichText text={takeaway} />
                </li>
              ))}
            </ul>
          </aside>

          <div className="mt-10">
            <Blocks blocks={article.body} />
          </div>

          {tieIn ? (
            <div
              className={cn(
                "mt-10",
                tieInShot && "grid items-center gap-8 sm:grid-cols-[minmax(0,1fr)_auto]",
              )}
            >
              <div className="flex flex-col gap-3">
                <Note
                  tone="app"
                  title={t("article.tieInTitle", { feature: tieIn.navLabel })}
                  text={t("article.tieInText", {
                    text: article.appTieIn.text,
                    feature: tieIn.navLabel.toLocaleLowerCase(locale),
                    href: featureHref(tieIn.slug),
                  })}
                />
                <TryFeatureLink slug={tieIn.slug} className="px-1" />
              </div>
              {tieInShot ? (
                <Screenshot
                  slot={tieInShot}
                  showCaption={false}
                  className="mx-auto w-[150px] sm:w-[140px]"
                  sizes="150px"
                />
              ) : null}
            </div>
          ) : null}

          {article.faqs?.length ? (
            <section aria-labelledby="article-faq" className="mt-12">
              <h2 id="article-faq" className="font-display text-2xl font-bold text-white">
                {t("article.faqTitle")}
              </h2>
              <div className="mt-5">
                <FaqList items={article.faqs} />
              </div>
            </section>
          ) : null}

          <section aria-labelledby="sources-title" className="mt-12 border-t border-white/10 pt-8">
            <h2 id="sources-title" className="font-display text-xl font-bold text-white">
              {t("article.sourcesTitle")}
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              {article.sources.map((s) => (
                <li key={s.url}>
                  {isProductAppHref(s.url) ? (
                    <ProductAppLink
                      href={s.url}
                      className="text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
                    >
                      {s.label}
                    </ProductAppLink>
                  ) : (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
                    >
                      {s.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-white/55">
              {t.rich("article.disclaimer", {
                appName: APP_NAME,
                link: (chunks) => (
                  <Link href="/contact" className="text-brand underline underline-offset-2">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>
        </article>

        {toc.length > 2 ? (
          <nav aria-label={t("article.onThisPage")} className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
                {t("article.onThisPage")}
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
              {t("article.keepReading")}
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
