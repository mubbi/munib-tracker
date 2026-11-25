import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  trackCtaClick,
  trackFileDownload,
  trackOutboundClick,
  trackSelectContent,
  trackWebDemoLaunch,
} from "@/lib/analytics";
import { renderWithIntl } from "@/test-support/intl";
import { TrackedLink } from "./tracked-link";

vi.mock("@/lib/analytics");

type Props = Parameters<typeof TrackedLink>[0];
/** Distributes over the tracking variants so each keeps its own fields. */
type DistributiveOmit<T, K extends PropertyKey> = T extends unknown ? Omit<T, K> : never;
type LinkProps = DistributiveOmit<Props, "children">;

function setup(props: LinkProps) {
  renderWithIntl(<TrackedLink {...({ ...props, children: "Go" } as Props)} />);
  return screen.getByRole("link", { name: "Go" });
}

describe("TrackedLink", () => {
  beforeEach(() => vi.clearAllMocks());

  it.each<[string, LinkProps, () => void]>([
    [
      "cta",
      { track: "cta", href: "/download", cta: "get_app", placement: "hero" },
      () => expect(trackCtaClick).toHaveBeenCalledWith("get_app", "hero"),
    ],
    [
      "select_content",
      {
        track: "select_content",
        href: "/learn/x",
        contentType: "article",
        itemId: "x",
        placement: "learn",
      },
      () =>
        expect(trackSelectContent).toHaveBeenCalledWith({
          content_type: "article",
          item_id: "x",
          link_url: "/learn/x",
          placement: "learn",
        }),
    ],
    [
      "outbound",
      { track: "outbound", href: "https://example.com", linkText: "Ex", placement: "footer" },
      () => expect(trackOutboundClick).toHaveBeenCalledWith("https://example.com", "Ex", "footer"),
    ],
    [
      "file_download",
      { track: "file_download", href: "/kit.zip", fileName: "kit.zip", placement: "press" },
      () =>
        expect(trackFileDownload).toHaveBeenCalledWith({
          file_name: "kit.zip",
          link_url: "/kit.zip",
          placement: "press",
        }),
    ],
    [
      "web_demo",
      { track: "web_demo", href: "https://my.munibtracker.app", placement: "footer" },
      () => expect(trackWebDemoLaunch).toHaveBeenCalledWith("footer"),
    ],
  ])("fires the %s event on click", (_name, props, assertTracked) => {
    fireEvent.click(setup(props));
    assertTracked();
  });

  it("renders internal links without a target", () => {
    const link = setup({ track: "cta", href: "/features", cta: "get_app", placement: "hero" });
    expect(link).toHaveAttribute("href", "/en/features");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens outbound links in a new tab with safe rel by default", () => {
    const link = setup({ track: "outbound", href: "https://example.com", linkText: "Ex" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("honours an explicit outbound target and rel", () => {
    const link = setup({
      track: "outbound",
      href: "/out",
      linkText: "Ex",
      target: "_self",
      rel: "me",
    });
    expect(link).toHaveAttribute("target", "_self");
    expect(link).toHaveAttribute("rel", "me");
  });

  it("marks file downloads with the download attribute", () => {
    const link = setup({ track: "file_download", href: "/a.pdf", fileName: "a", placement: "x" });
    expect(link).toHaveAttribute("download");
    expect(link).not.toHaveAttribute("target");
  });

  it("renders absolute non-outbound URLs as plain anchors without a target", () => {
    const link = setup({
      track: "cta",
      href: "https://my.munibtracker.app",
      cta: "get_app",
      placement: "hero",
    });
    expect(link).toHaveAttribute("href", "https://my.munibtracker.app");
    expect(link).not.toHaveAttribute("target");
    expect(link).not.toHaveAttribute("download");
  });

  it("opens the web app in a new tab with safe rel", () => {
    const link = setup({
      track: "web_demo",
      href: "https://my.munibtracker.app",
      placement: "hero",
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("passes an accessible name through to the anchor", () => {
    renderWithIntl(
      <TrackedLink
        track="outbound"
        href="https://example.com"
        linkText="Ex"
        aria-label="Author site"
      >
        <svg />
      </TrackedLink>,
    );
    expect(screen.getByRole("link", { name: "Author site" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
  });
});
