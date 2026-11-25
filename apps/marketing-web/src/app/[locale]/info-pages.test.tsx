import { screen } from "@testing-library/react";
import type { ComponentType } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import CompareHub from "./compare/page";
import FaqPage from "./faq/page";
import FeaturesPage from "./features/page";
import AudienceHub from "./for/page";
import HowItWorksPage from "./how-it-works/page";
import LearnPage from "./learn/page";
import PrivacyPage from "./privacy/page";
import ResourcesHub from "./resources/page";
import TermsPage from "./terms/page";
import WhyPage from "./why-munib-tracker/page";

const PAGES: [string, ComponentType, string][] = [
  ["privacy", PrivacyPage, "Privacy Policy"],
  ["terms", TermsPage, "Terms of Service"],
  ["faq", FaqPage, "Frequently asked questions"],
  ["how it works", HowItWorksPage, "Set up your worship routine in a minute"],
  ["why", WhyPage, "A worship companion that's on your side"],
  ["learn", LearnPage, "Learn your deen, deeply"],
  ["features hub", FeaturesPage, "Everything Munib Tracker can do"],
  ["audiences hub", AudienceHub, "Who Munib Tracker is for"],
  ["compare hub", CompareHub, "Compare Munib Tracker with other Islamic apps"],
  ["resources hub", ResourcesHub, "Guides for Salah, Zikr and learning the Qur'an"],
];

afterEach(() => {
  vi.restoreAllMocks();
});

describe("info and hub pages", () => {
  it.each(PAGES)("%s renders its catalog copy without missing messages", (_, Page, h1) => {
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const { container } = renderWithIntl(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: h1 })).toBeInTheDocument();
    // Unformatted ICU arguments or missing-key fallbacks would leak braces / dotted keys.
    expect(container.textContent).not.toMatch(/\{[a-zA-Z]+[,}]/);
    expect(errors).not.toHaveBeenCalled();
  });

  it("privacy links to the contact form in the current locale", () => {
    renderWithIntl(<PrivacyPage />);
    expect(screen.getAllByRole("link", { name: "contact form" })[0]).toHaveAttribute(
      "href",
      "/en/contact",
    );
  });

  it("features hub fills in the dua count and keeps the detailed list", () => {
    renderWithIntl(<FeaturesPage />);
    expect(screen.getByText(/^\d+ duas across 16 categories/)).toBeInTheDocument();
    expect(screen.getByText(/Prayer times hero with time-of-day sky/)).toBeInTheDocument();
  });
});
