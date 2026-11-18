import { SEO_ORIGIN } from "@/config/seo";

import { getRouteFaq, HOME_FAQ } from "./faq-content";
import {
  articleSchema,
  breadcrumbSchema,
  collectionPageSchema,
  faqSchema,
  siteGraphSchema,
  webPageSchema,
} from "./structured-data";

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Duas", path: "/dua" },
];

describe("siteGraphSchema", () => {
  it("links organization, website and software nodes", () => {
    const graph = siteGraphSchema()["@graph"] as Record<string, unknown>[];
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      ["SoftwareApplication", "WebApplication"],
    ]);
    expect(graph[1].publisher).toEqual({ "@id": graph[0]["@id"] });
    expect(graph[1].potentialAction).toMatchObject({
      target: { urlTemplate: `${SEO_ORIGIN}/search?q={search_term_string}` },
    });
  });
});

describe("breadcrumbSchema", () => {
  it("numbers absolute list items", () => {
    expect(breadcrumbSchema(CRUMBS).itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Home", item: SEO_ORIGIN },
      { "@type": "ListItem", position: 2, name: "Duas", item: `${SEO_ORIGIN}/dua` },
    ]);
  });
});

describe("webPageSchema", () => {
  it("defaults to a WebPage with the social image and no breadcrumb", () => {
    const page = webPageSchema({ path: "/qibla", name: "Qibla", description: "d" });
    expect(page).toMatchObject({ "@type": "WebPage", "@id": `${SEO_ORIGIN}/qibla#webpage` });
    expect(page.breadcrumb).toBeUndefined();
  });

  it("uses a custom type, image and breadcrumbs", () => {
    const page = webPageSchema({
      path: "/dua",
      name: "Duas",
      description: "d",
      type: "AboutPage",
      primaryImage: "/img.png",
      breadcrumbs: CRUMBS,
    });
    expect(page["@type"]).toBe("AboutPage");
    expect(page.primaryImageOfPage).toEqual({
      "@type": "ImageObject",
      url: `${SEO_ORIGIN}/img.png`,
    });
    expect((page.breadcrumb as { itemListElement: unknown[] }).itemListElement).toHaveLength(2);
  });
});

describe("collectionPageSchema", () => {
  it("embeds an ItemList when items are given", () => {
    const page = collectionPageSchema({
      path: "/dua",
      name: "Duas",
      description: "d",
      items: CRUMBS,
    });
    expect(page["@type"]).toBe("CollectionPage");
    expect(page.mainEntity).toMatchObject({ "@type": "ItemList", numberOfItems: 2 });
  });

  it("omits the ItemList without items", () => {
    expect(
      collectionPageSchema({ path: "/dua", name: "Duas", description: "d" }).mainEntity,
    ).toBeUndefined();
  });
});

describe("articleSchema", () => {
  it("defaults to an English Article without body or breadcrumb", () => {
    const article = articleSchema({ path: "/dua/1", headline: "H", description: "d" });
    expect(article).toMatchObject({
      "@type": "Article",
      inLanguage: "en",
      isAccessibleForFree: true,
    });
    expect(article.articleBody).toBeUndefined();
    expect(article.breadcrumb).toBeUndefined();
  });

  it("includes body, type, language and breadcrumbs when given", () => {
    const article = articleSchema({
      path: "/dua/1",
      headline: "H",
      description: "d",
      type: "CreativeWork",
      inLanguage: "ar",
      articleBody: "body",
      breadcrumbs: CRUMBS,
    });
    expect(article).toMatchObject({
      "@type": "CreativeWork",
      inLanguage: "ar",
      articleBody: "body",
    });
    expect(article.breadcrumb).toMatchObject({ "@type": "BreadcrumbList" });
  });
});

describe("FAQ content", () => {
  it("builds FAQPage questions", () => {
    expect(faqSchema([{ question: "Q?", answer: "A." }]).mainEntity).toEqual([
      { "@type": "Question", name: "Q?", acceptedAnswer: { "@type": "Answer", text: "A." } },
    ]);
  });

  it("exposes the home FAQ and looks routes up by canonical path", () => {
    expect(HOME_FAQ.length).toBeGreaterThan(0);
    expect(getRouteFaq("/")).toBe(HOME_FAQ);
    expect(getRouteFaq("/definitely-not-a-route")).toBeUndefined();
  });
});
