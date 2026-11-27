import { toInAppPath } from "@/lib/in-app-path";

describe("toInAppPath", () => {
  it.each([
    ["/tracker", "/tracker"],
    ["  /circles/abc?tab=feed#top ", "/circles/abc?tab=feed#top"],
    ["/", "/"],
  ])("keeps app path %p", (input, expected) => {
    expect(toInAppPath(input)).toBe(expected);
  });

  it.each([
    "https://evil.example/login",
    "javascript:alert(1)",
    "//evil.example",
    "/\\evil.example",
    "tracker",
    "/tracker\nx",
    `/${"a".repeat(2048)}`,
    "",
    undefined,
    42,
  ])("rejects %p", (input) => {
    expect(toInAppPath(input)).toBeNull();
  });
});
