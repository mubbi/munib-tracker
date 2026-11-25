import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ComparisonTable } from "@/components/templates/comparison-table";
import { getAudience } from "@/content/audiences";
import { getComparison } from "@/content/compare";
import { getFeature } from "@/content/features";
import { ARTICLES, getArticle } from "@/content/resources";
import { renderWithIntl } from "@/test-support/intl";
import { ArticleTemplate } from "./article-template";
import { AudienceTemplate } from "./audience-template";
import { CompareTemplate } from "./compare-template";
import { FeatureTemplate } from "./feature-template";

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
