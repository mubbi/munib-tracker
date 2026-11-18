import { getRouteSeo, normalizePath, SEO_ROUTES } from "./seo-routes";

describe("normalizePath", () => {
  it.each([
    ["", "/"],
    ["/", "/"],
    ["///", "/"],
    ["quran", "/quran"],
    ["/quran/?x=1#top", "/quran"],
  ])("normalizePath(%p) is %p", (input, expected) => {
    expect(normalizePath(input)).toBe(expected);
  });
});

describe("getRouteSeo", () => {
  it("looks routes up by their normalised path", () => {
    expect(getRouteSeo("achievements/")).toBe(SEO_ROUTES["/achievements"]);
    expect(getRouteSeo("/nope")).toBeUndefined();
  });
});
