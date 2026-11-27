import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import Home from "./page";

/** next/image rewrites `src` through the optimizer; decode the original path. */
function source(img: HTMLElement): string {
  const url = new URL(img.getAttribute("src") ?? "", "http://localhost");
  return url.searchParams.get("url") ?? url.pathname;
}

function section(id: string): HTMLElement {
  const el = document.getElementById(id);
  if (!el) throw new Error(`expected #${id} element`);
  return el;
}

describe("Home page feature", () => {
  it("shows the hero, the product tour, feature pages and FAQ", () => {
    renderWithIntl(<Home />);
    expect(screen.getByRole("heading", { name: APP_TAGLINE, level: 1 })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);

    const tour = section("features");
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

  it("tours the app with real captures, each tab on its own device", () => {
    renderWithIntl(<Home />);
    const tour = section("features");
    const panel = within(tour).getByRole("tabpanel");
    const shot = () => source(within(panel).getByRole("img"));

    expect(shot()).toBe("/screenshots/iphone/en/dark/tracker.webp");
    expect(within(panel).getByText("Shown on iPhone")).toBeInTheDocument();

    const expected = [
      ["Qaza", "/screenshots/android/en/dark/qaza.webp", "Shown on an Android phone"],
      ["Zikr", "/screenshots/android-tablet/en/dark/zikr.webp", "Shown on an Android tablet"],
      ["Qur'an", "/screenshots/ipad/en/dark/quran.webp", "Shown on iPad"],
    ] as const;
    for (const [label, src, caption] of expected) {
      fireEvent.click(within(tour).getByRole("tab", { name: label }));
      const current = within(tour).getByRole("tabpanel");
      expect(source(within(current).getByRole("img"))).toBe(src);
      expect(within(current).getByText(caption)).toBeInTheDocument();
    }
  });

  it("shows the app on every device, with captions and a link to the devices page", () => {
    renderWithIntl(<Home />);
    const devices = section("devices");
    const figures = within(devices).getAllByRole("figure");
    expect(figures).toHaveLength(7);
    for (const figure of figures) {
      const img = within(figure).getByRole("img");
      expect(source(img)).toMatch(/^\/screenshots\/[a-z-]+\/en\/dark\/[a-z-]+\.webp$/);
      expect(img).toHaveAccessibleName();
    }
    for (const name of ["Apple TV & Android TV", "iPad", "Apple Watch", "Wear OS"]) {
      expect(within(devices).getByText(name)).toBeInTheDocument();
    }
    expect(within(devices).getByRole("link", { name: /every device/i })).toHaveAttribute(
      "href",
      "/en/features/widgets-and-devices",
    );
  });
});
