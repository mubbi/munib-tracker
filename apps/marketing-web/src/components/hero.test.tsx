import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import { Hero } from "./hero";

/** next/image rewrites `src` through the optimizer; decode the original path. */
function source(img: HTMLElement): string {
  const src = img.getAttribute("src") ?? "";
  const url = new URL(src, "http://localhost");
  return url.searchParams.get("url") ?? url.pathname;
}

describe("Hero", () => {
  it("renders the Day Arc headline and CTAs", () => {
    renderWithIntl(<Hero />);
    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Get the app/i })).toHaveAttribute(
      "href",
      "/en/download",
    );
    expect(screen.getByRole("link", { name: /Explore features/i })).toHaveAttribute(
      "href",
      "/en/features",
    );
  });

  it("lines up the real home screen on iPhone, iPad, TV and Apple Watch", () => {
    renderWithIntl(<Hero />);
    const iphone = screen.getByRole("img", { name: /countdown to Fajr/i });
    expect(source(iphone)).toBe("/screenshots/iphone/en/dark/home.webp");

    const sources = screen
      .getAllByRole("img")
      .map(source)
      .filter((s) => s.startsWith("/screenshots/"));
    expect(sources).toEqual(
      expect.arrayContaining([
        "/screenshots/watch/en/dark/schedule.webp",
        "/screenshots/apple-tv/en/dark/home.webp",
        "/screenshots/ipad/en/dark/home.webp",
      ]),
    );
    expect(screen.getByRole("img", { name: /on iPad/i })).toBeInTheDocument();
  });
});
