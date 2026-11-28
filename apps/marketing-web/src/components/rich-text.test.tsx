import { fireEvent, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { RichText } from "@/components/content/rich-text";
import { trackWebDemoLaunch } from "@/lib/analytics";
import { PRODUCT_APP_URL } from "@/lib/site";
import messages from "@/messages/ar";

vi.mock("@/lib/analytics");

describe("RichText product-app links", () => {
  beforeEach(() => vi.clearAllMocks());

  it("opens citations in the page's language, tagged and tracked", () => {
    render(
      <NextIntlClientProvider locale="ar" messages={messages} timeZone="UTC">
        <RichText text="See [Bukhari 1](https://my.munibtracker.app/hadith/bukhari?q=1) and [x](https://example.com/a)." />
      </NextIntlClientProvider>,
    );
    const app = screen.getByRole("link", { name: "Bukhari 1" });
    const url = new URL(app.getAttribute("href") ?? "");
    expect(`${url.origin}${url.pathname}`).toBe(`${PRODUCT_APP_URL}/ar/hadith/bukhari`);
    expect(url.searchParams.get("q")).toBe("1");
    expect(url.searchParams.get("utm_campaign")).toBe("content_link");
    expect(url.searchParams.get("utm_content")).toBe("hadith");
    expect(app.getAttribute("target")).toBe("_blank");
    fireEvent.click(app);
    expect(trackWebDemoLaunch).toHaveBeenCalledWith("content_link", undefined);

    expect(screen.getByRole("link", { name: "x" }).getAttribute("href")).toBe(
      "https://example.com/a",
    );
  });
});
