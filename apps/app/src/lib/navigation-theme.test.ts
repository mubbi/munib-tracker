import { resolveTheme } from "@munib-tracker/theme/resolve";

import { createNavigationTheme } from "./navigation-theme";

describe("createNavigationTheme", () => {
  it("uses Munib dark background instead of the React Navigation default", () => {
    const colors = resolveTheme("dark", "dark", "forest");
    const theme = createNavigationTheme(colors, "dark");

    expect(theme.dark).toBe(true);
    expect(theme.colors.background).toBe("#152921");
    expect(theme.colors.card).toBe(colors.card);
    expect(theme.colors.primary).toBe(colors.accent);
  });

  it("uses Munib light background for light mode", () => {
    const colors = resolveTheme("light", "light", "forest");
    const theme = createNavigationTheme(colors, "light");

    expect(theme.dark).toBe(false);
    expect(theme.colors.background).toBe("#F5F0E6");
  });
});
