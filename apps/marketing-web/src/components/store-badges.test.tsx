import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { trackDownloadClick, trackWebDemoLaunch } from "@/lib/analytics";
import { productAppUrl, storeUrls } from "@/lib/site";
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
    [/App Store/, storeUrls("en").ios],
    [/Google Play/, storeUrls("en").android],
    [/browser/, productAppUrl("en")],
  ])("links %s to its store URL in the page locale", (name, href) => {
    setup();
    expect(screen.getByRole("link", { name })).toHaveAttribute("href", href);
  });

  it.each([
    [/App Store/, "ios"],
    [/Google Play/, "android"],
  ])("tracks %s clicks with the placement", (name, platform) => {
    setup({ placement: "footer" });
    fireEvent.click(screen.getByRole("link", { name }));
    expect(trackDownloadClick).toHaveBeenCalledWith(platform, "footer");
  });

  it("tracks web demo launches", () => {
    setup();
    fireEvent.click(screen.getByRole("link", { name: /browser/ }));
    expect(trackWebDemoLaunch).toHaveBeenCalledWith("hero");
  });

  it("lays badges out in a row by default", () => {
    expect(setup()).toHaveClass("flex-wrap");
  });

  it("stacks badges in a column when asked", () => {
    expect(setup({ layout: "column" })).toHaveClass("flex-col");
  });
});
