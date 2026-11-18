import { act, render } from "@testing-library/react-native";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";

import { Seo, type SeoProps } from "@/components/seo/seo";
import { resetExpoRouterMock, setMockPathname } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";

type Tag = ReactElement<Record<string, unknown>>;

let mockHeadChildren: ReactNode = null;
const mockEnsureSeoLocale = jest.fn(async (_locale: string) => undefined);
const mockLocalizedUrl = jest.fn();

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("expo-router/head", () => ({
  __esModule: true,
  default: ({ children }: { children: ReactNode }) => {
    mockHeadChildren = children;
    return null;
  },
}));
jest.mock("@/config/seo-routes-locale", () => ({
  ...jest.requireActual("@/config/seo-routes-locale"),
  ensureSeoLocale: (locale: string) => mockEnsureSeoLocale(locale),
}));
jest.mock("@/config/seo", () => {
  const actual = jest.requireActual("@/config/seo");
  return {
    ...actual,
    localizedUrl: (path: string, locale: string) =>
      mockLocalizedUrl(path, locale) ?? actual.localizedUrl(path, locale),
  };
});

function headTags(): Tag[] {
  const flat: Tag[] = [];
  const walk = (node: ReactNode) =>
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      flat.push(child as Tag);
    });
  walk(mockHeadChildren);
  return flat;
}

function meta(key: string): string | undefined {
  const tag = headTags().find((t) => t.props.name === key || t.props.property === key);
  return tag?.props.content as string | undefined;
}

function title(): string | undefined {
  return headTags().find((t) => t.type === "title")?.props.children as string | undefined;
}

async function renderSeo(props: SeoProps = {}) {
  mockHeadChildren = null;
  const utils = await render(<Seo {...props} />);
  await act(async () => {
    await Promise.resolve();
  });
  return utils;
}

describe("Seo", () => {
  beforeEach(() => {
    resetExpoRouterMock();
    mockEnsureSeoLocale.mockClear();
    mockLocalizedUrl.mockReset();
  });

  it("renders nothing on native", async () => {
    await renderSeo({ title: "Native" });
    expect(mockHeadChildren).toBeNull();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("uses explicit props for title, description and keywords", async () => {
      setMockPathname("/custom");
      await renderSeo({
        title: "Custom page",
        description: "A custom description",
        keywords: ["alpha"],
        type: "article",
      });
      expect(title()).toContain("Custom page");
      expect(meta("description")).toBe("A custom description");
      expect(meta("keywords")).toMatch(/^alpha, /);
      expect(meta("og:type")).toBe("article");
    });

    it("falls back to the route registry for the current path", async () => {
      setMockPathname("/quran");
      await renderSeo();
      expect(meta("og:title")).toBeTruthy();
      expect(headTags().find((t) => t.props.rel === "canonical")?.props.href).toMatch(/\/quran$/);
    });

    it("emits noindex, nofollow robots when asked", async () => {
      setMockPathname("/private");
      await renderSeo({ index: false, follow: false });
      expect(meta("robots")).toBe("noindex, nofollow");
    });

    it("emits rich index directives by default", async () => {
      setMockPathname("/");
      await renderSeo({ isHome: true });
      expect(meta("robots")).toContain("max-image-preview:large");
    });

    it("renders breadcrumbs and JSON-LD blocks", async () => {
      setMockPathname("/a");
      await renderSeo({
        path: "/a",
        breadcrumbs: [{ name: "Home", path: "/" }],
        jsonLd: [{ "@type": "Thing" }, { "@type": "Other" }],
      });
      expect(headTags().filter((t) => t.type === "script")).toHaveLength(3);
    });

    it("accepts a single JSON-LD object", async () => {
      setMockPathname("/a");
      await renderSeo({ path: "/a", jsonLd: { "@type": "Thing" } });
      expect(headTags().filter((t) => t.type === "script")).toHaveLength(1);
    });

    it("skips tags for screens that are not the active route", async () => {
      setMockPathname("/other");
      await renderSeo({ path: "/a" });
      expect(mockHeadChildren).toBeNull();
    });

    it("emits hreflang alternates once locales resolve to distinct URLs", async () => {
      setMockPathname("/a");
      mockLocalizedUrl.mockImplementation((path: string, locale: string) => `/${locale}${path}`);
      await renderSeo({ path: "/a" });
      const alternates = headTags().filter((t) => t.props.rel === "alternate");
      expect(alternates.some((t) => t.props.hrefLang === "x-default")).toBe(true);
    });

    it("loads the locale SEO pack for non-English pages", async () => {
      setMockPathname("/a");
      await renderSeo({ path: "/a", locale: "ar" });
      expect(mockEnsureSeoLocale).toHaveBeenCalledWith("ar");
      expect(meta("og:locale")).toBeTruthy();
    });

    it("ignores a locale pack that resolves after unmount", async () => {
      setMockPathname("/a");
      let resolvePack: () => void = () => {};
      mockEnsureSeoLocale.mockImplementationOnce(
        () =>
          new Promise<undefined>((resolve) => {
            resolvePack = () => resolve(undefined);
          }),
      );
      const utils = await renderSeo({ path: "/a", locale: "ur" });
      await utils.unmount();
      await act(async () => resolvePack());
      expect(mockEnsureSeoLocale).toHaveBeenCalledWith("ur");
    });
  });
});
