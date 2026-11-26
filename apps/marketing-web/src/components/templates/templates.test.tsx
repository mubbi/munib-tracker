import { render, screen, within } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import type { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { ComparisonTable } from "@/components/templates/comparison-table";
import { getAudience } from "@/content/audiences";
import { getComparison } from "@/content/compare";
import { getFeature } from "@/content/features";
import { ARTICLES, getArticle } from "@/content/resources";
import { getScreenshot } from "@/lib/screenshots";
import { mergeMessages } from "@/messages";
import ar from "@/messages/ar";
import en from "@/messages/en";
import { renderWithIntl } from "@/test-support/intl";
import { ArticleTemplate } from "./article-template";
import { AudienceTemplate } from "./audience-template";
import { CompareTemplate } from "./compare-template";
import { FeatureTemplate } from "./feature-template";

/** next/image rewrites `src` through the optimizer; decode the original path. */
function sources(container: HTMLElement): string[] {
  return [...container.querySelectorAll("img")].map((img) => {
    const url = new URL(img.getAttribute("src") ?? "", "http://localhost");
    return url.searchParams.get("url") ?? url.pathname;
  });
}

function renderInArabic(ui: ReactElement) {
  return render(
    <NextIntlClientProvider locale="ar" messages={mergeMessages(en, ar)} timeZone="UTC">
      {ui}
    </NextIntlClientProvider>,
  );
}

function jsonLd(container: HTMLElement) {
  return [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap(
    (s) => JSON.parse(s.textContent ?? "{}")["@graph"],
  );
}

describe("content templates (English catalog)", () => {
  it("renders feature page labels and breadcrumbs", () => {
    const feature = getFeature("salah-tracker", "en");
    if (!feature) throw new Error("missing feature");
    const { container } = renderWithIntl(<FeatureTemplate feature={feature} />);
    const crumbs = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(crumbs).getByRole("link", { name: "Home" })).toHaveAttribute("href", "/en");
    expect(within(crumbs).getByRole("link", { name: "Features" })).toHaveAttribute(
      "href",
      "/en/features",
    );
    expect(screen.getByRole("heading", { name: "What you get from it" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: `${feature.navLabel}: common questions` }),
    ).toBeInTheDocument();
    expect(screen.getByText("No account for personal use")).toBeInTheDocument();
    const page = jsonLd(container).find((n) => n["@type"] === "WebPage");
    expect(page.inLanguage).toBe("en");
  });

  it("renders comparison labels, verified date and table statuses", () => {
    const page = getComparison("munib-tracker-vs-muslim-pro", "en");
    if (!page) throw new Error("missing comparison");
    renderWithIntl(<CompareTemplate page={page} />);
    expect(screen.getByRole("heading", { name: "Which one should you choose?" })).toBeVisible();
    expect(screen.getByRole("heading", { name: "Everything in Munib Tracker" })).toBeVisible();
    expect(screen.getAllByText(/Last verified/).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "Try Munib Tracker and decide for yourself" }),
    ).toBeVisible();
  });

  it("formats dates day-month-year in English", () => {
    const page = getComparison("munib-tracker-vs-muslim-pro", "en");
    if (!page) throw new Error("missing comparison");
    const { container } = renderWithIntl(<CompareTemplate page={page} />);
    const time = container.querySelector(`time[datetime="${page.verifiedOn}"]`);
    expect(time?.textContent).toMatch(/^\d{1,2} [A-Z][a-z]+ \d{4}$/);
  });

  it("labels comparison cells", () => {
    const page = getComparison("munib-tracker-vs-muslim-pro", "en");
    if (!page) throw new Error("missing comparison");
    renderWithIntl(<ComparisonTable page={page} />);
    expect(screen.getAllByText("Available").length).toBeGreaterThan(0);
    expect(screen.getByRole("columnheader", { name: "Feature" })).toBeInTheDocument();
  });

  it("renders audience page labels", () => {
    const page = getAudience("new-muslims", "en");
    if (!page) throw new Error("missing audience");
    renderWithIntl(<AudienceTemplate page={page} />);
    expect(screen.getByText("How Munib Tracker helps")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Common questions" })).toBeInTheDocument();
  });

  it("renders article labels, byline and reading time", () => {
    const first = ARTICLES[0];
    const article = first && getArticle(first.category, first.slug, "en");
    if (!article) throw new Error("missing article");
    const { container } = renderWithIntl(<ArticleTemplate article={article} />);
    expect(screen.getByRole("heading", { name: "Key takeaways" })).toBeInTheDocument();
    expect(screen.getByText(/^\d+ min read$/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Munib Tracker" })).toHaveAttribute(
      "href",
      "/en/about",
    );
    expect(screen.getByRole("link", { name: "Let us know" })).toHaveAttribute(
      "href",
      "/en/contact",
    );
    const node = jsonLd(container).find((n) => n["@type"] === "Article");
    expect(node.inLanguage).toBe("en");
    expect(node.image).toMatch(/\/opengraph-image$/);
  });
});

describe("real screenshots in templates", () => {
  it("shows widgets-and-devices on every device the app ships on", () => {
    const feature = getFeature("widgets-and-devices", "en");
    if (!feature) throw new Error("missing feature");
    const { container } = renderWithIntl(<FeatureTemplate feature={feature} />);
    const devices = new Set(sources(container).map((src) => src.split("/")[2]));
    for (const device of ["iphone", "android", "ipad", "android-tablet", "tv", "watch", "wear"]) {
      expect(devices).toContain(device);
    }
  });

  it("gives a slot moved onto another device a device-specific alt", () => {
    const feature = getFeature("salah-tracker", "en");
    if (!feature) throw new Error("missing feature");
    renderWithIntl(<FeatureTemplate feature={feature} />);
    expect(screen.getByRole("img", { name: "Munib Tracker on iPad: Salah tracker" })).toBeVisible();
    expect(screen.getByText("The same tracker on an Android phone.")).toBeInTheDocument();
  });

  it("shows Arabic app screens on Arabic pages", () => {
    const feature = getFeature("quran", "ar");
    if (!feature) throw new Error("missing feature");
    const { container } = renderInArabic(<FeatureTemplate feature={feature} />);
    const handheld = sources(container).filter((src) => !src.includes("offline-data"));
    expect(handheld.length).toBeGreaterThan(2);
    for (const src of handheld) expect(src).toMatch(/^\/screenshots\/[a-z-]+\/ar\//);
  });

  it("puts the families page on iPad with a TV screen in its gallery", () => {
    const page = getAudience("families", "en");
    if (!page) throw new Error("missing audience");
    const { container } = renderWithIntl(<AudienceTemplate page={page} />);
    const srcs = sources(container);
    expect(srcs[0]).toBe("/screenshots/ipad/en/dark/home.webp");
    expect(srcs).toContain("/screenshots/tv/en/dark/quran.webp");
  });

  it("adds an at-a-glance strip of real phone screens to comparisons", () => {
    const page = getComparison("munib-tracker-vs-muslim-pro", "en");
    if (!page) throw new Error("missing comparison");
    renderWithIntl(<CompareTemplate page={page} />);
    const strip = document.getElementById("at-a-glance");
    if (!strip) throw new Error("missing strip");
    expect(within(strip).getByRole("heading", { name: "Munib Tracker at a glance" })).toBeVisible();
    expect(within(strip).getAllByRole("img")).toHaveLength(4);
    expect(within(strip).getByText("The Salah tracker on Android.")).toBeVisible();
  });

  it("illustrates an article's app tie-in with the feature's own screen", () => {
    const first = ARTICLES.find((a) => getFeature(a.appTieIn.feature, "en")?.hero);
    const article = first && getArticle(first.category, first.slug, "en");
    if (!article) throw new Error("missing article");
    const hero = getFeature(article.appTieIn.feature, "en")?.hero;
    if (!hero) throw new Error("missing hero");
    const { container } = renderWithIntl(<ArticleTemplate article={article} />);
    expect(sources(container)).toContain(getScreenshot(hero.key, "en", hero.device).src);
  });
});
