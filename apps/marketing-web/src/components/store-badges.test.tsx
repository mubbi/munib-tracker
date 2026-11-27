import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackDownloadClick, trackWebDemoLaunch } from "@/lib/analytics";
import { storeUrls, webAppUrl } from "@/lib/site";
import { renderWithIntl } from "@/test-support/intl";
import { StoreBadges } from "./store-badges";

vi.mock("@/lib/analytics");

function setup(props: Parameters<typeof StoreBadges>[0] = {}) {
  const { container } = renderWithIntl(<StoreBadges {...props} />);
  return container.firstElementChild as HTMLElement;
}

describe("StoreBadges", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each([
    [/App Store/, storeUrls("en", { placement: "hero" }).ios],
    [/Google Play/, storeUrls("en", { placement: "hero" }).android],
    [/browser/, webAppUrl("en", "/", { placement: "hero" })],
  ])("links %s to its store URL in the page locale", (name, href) => {
    setup();
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  });

  it.each([
    [/App Store/, "ios"],
    [/Google Play/, "android"],
  ])("tracks %s clicks with the placement and feature", (name, platform) => {
    setup({ placement: "footer", feature: "zakat-calculator" });
    fireEvent.click(screen.getByRole("link", { name }));
    expect(trackDownloadClick).toHaveBeenCalledWith(platform, "footer", "zakat-calculator");
  });

  it("tracks web demo launches", () => {
    setup();
    fireEvent.click(screen.getByRole("link", { name: /browser/ }));
    expect(trackWebDemoLaunch).toHaveBeenCalledWith("hero", undefined);
  });

  it("deep-links the web badge to a feature, with campaign tags", () => {
    setup({ placement: "feature_page", feature: "qibla-finder", webAppPath: "/qibla" });
    const href = screen.getByRole("link", { name: /browser/ }).getAttribute("href") ?? "";
    expect(href).toMatch(/^https:\/\/my\.munibtracker\.app\/qibla\?/);
    expect(href).toContain("utm_campaign=feature_page");
    expect(href).toContain("utm_content=qibla-finder");
  });

  it("hides the web badge for app-only features", () => {
    setup({ webAppPath: null });
    expect(screen.queryByRole("link", { name: /browser/ })).toBeNull();
    expect(screen.getByRole("link", { name: /App Store/ })).toBeInTheDocument();
  });

  it("lays badges out in a row by default", () => {
    expect(setup()).toHaveClass("flex-wrap");
  });

  it("stacks badges in a column when asked", () => {
    expect(setup({ layout: "column" })).toHaveClass("flex-col");
  });
});
