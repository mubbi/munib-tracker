import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import AboutPage from "./about/page";
import DownloadPage from "./download/page";
import FeaturesPage from "./features/page";
import AudienceHub from "./for/page";
import HowItWorksPage from "./how-it-works/page";
import LearnPage from "./learn/page";
import PressPage from "./press/page";

/** next/image rewrites `src` through the optimizer; decode the original path. */
function sources(root: ParentNode): string[] {
  return [...root.querySelectorAll("img")].map((img) => {
    const url = new URL(img.getAttribute("src") ?? "", "http://localhost");
    return url.searchParams.get("url") ?? url.pathname;
  });
}

/** Devices shown, from `/screenshots/<device>/<locale>/<theme>/<scene>.webp`. */
function devices(root: ParentNode): Set<string> {
  return new Set(
    sources(root)
      .filter((src) => src.startsWith("/screenshots/"))
      .map((src) => src.split("/")[2] ?? ""),
  );
}

const EVERY_DEVICE = ["iphone", "android", "ipad", "android-tablet", "tv", "watch", "wear"];

describe("real device captures on info pages", () => {
  it("download shows each platform card's devices", () => {
    const { container } = renderWithIntl(<DownloadPage />);
    expect([...devices(container)].sort()).toEqual([...EVERY_DEVICE].sort());
    expect(
      screen.getByRole("img", {
        name: "Munib Tracker on iPad: home screen with today's Salah times and checklist",
      }),
    ).toBeInTheDocument();
    // Wear OS uses the Tasbeeh tile (the Salah tile capture asks to open the phone app).
    expect(sources(container)).toContain("/screenshots/wear/en/dark/tasbeeh-tile.webp");
  });

  it("features hub lines up every device under Available on", () => {
    renderWithIntl(<FeaturesPage />);
    const section = document.getElementById("available-on");
    if (!section) throw new Error("missing section");
    expect([...devices(section)].sort()).toEqual([...EVERY_DEVICE].sort());
    expect(within(section).getByText("Android tablet")).toBeInTheDocument();
  });

  it("press kit offers each device capture as a download", () => {
    renderWithIntl(<PressPage />);
    const link = screen.getByRole("link", { name: "Download the TV screenshot" });
    expect(link).toHaveAttribute("href", "/screenshots/tv/en/dark/home.webp");
    expect(link).toHaveAttribute("download");
    expect(screen.getAllByRole("link", { name: /^Download the .+ screenshot$/ })).toHaveLength(
      EVERY_DEVICE.length,
    );
  });

  it("learn shows the library on TV, iPad and iPhone", () => {
    renderWithIntl(<LearnPage />);
    const section = document.getElementById("inside-the-app");
    if (!section) throw new Error("missing section");
    expect(sources(section)).toEqual([
      "/screenshots/tv/en/dark/library.webp",
      "/screenshots/ipad/en/dark/quran.webp",
      "/screenshots/iphone/en/dark/names.webp",
    ]);
  });

  it("how it works shows both phones and the same tracker across devices", () => {
    const { container } = renderWithIntl(<HowItWorksPage />);
    const srcs = sources(container);
    expect(srcs).toContain("/screenshots/android/en/dark/tracker.webp");
    expect(srcs).toContain("/screenshots/tv/en/dark/tracker.webp");
    expect(
      screen.getByText(/The same tracker on the TV, an Android tablet, iPhone and iPad/),
    ).toBeInTheDocument();
  });

  it("about shows the home screen in both themes, and /for opens on iPad", () => {
    const { container, unmount } = renderWithIntl(<AboutPage />);
    expect(sources(container)).toEqual([
      "/screenshots/iphone/en/light/home.webp",
      "/screenshots/iphone/en/dark/home.webp",
    ]);
    unmount();
    const hub = renderWithIntl(<AudienceHub />);
    expect(sources(hub.container)).toEqual(["/screenshots/ipad/en/dark/home.webp"]);
  });
});
