import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import Home from "./page";

describe("Home page feature", () => {
  it("shows the hero, the product tour, feature pages and FAQ", () => {
    renderWithIntl(<Home />);
    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    const tour = document.getElementById("features");
    if (!tour) throw new Error("expected #features element");
    expect(within(tour).getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(within(tour).getByRole("tablist")).toBeInTheDocument();

    const salahLinks = screen.getAllByRole("link", { name: /Salah tracker/i });
    expect(salahLinks.map((l) => l.getAttribute("href"))).toContain("/en/features/salah-tracker");
    expect(screen.getAllByRole("link", { name: /App Store/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: /View all questions/i })).toHaveAttribute(
      "href",
      "/en/faq",
    );
  });
});
