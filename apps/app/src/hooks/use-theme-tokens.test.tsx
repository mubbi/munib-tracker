import { useThemeTokens } from "@/hooks/use-theme-tokens";
import { computeThemeTokens } from "@/lib/theme-tokens";
import { renderHookWithTheme } from "@/test-support/render";

describe("useThemeTokens", () => {
  it("exposes the derived design-system tokens from the provider", async () => {
    const { result } = await renderHookWithTheme(() => useThemeTokens());
    const { colors, scheme, tokens } = result.current;

    expect(tokens).toBe(computeThemeTokens(colors, scheme));
    expect(tokens).toMatchObject({
      focusRing: colors.accentText,
      switchTrackOff: colors.inputBorder,
      onScrim: "#FFFFFF",
    });
    for (const key of ["accentOnSoft", "hover", "scrimStrong"] as const) {
      expect(tokens[key]).toMatch(/^#[0-9a-f]{6,8}$/i);
    }
    expect(tokens.inputSurfaceError.borderColor).toBe(tokens.status.danger.text);
    expect(tokens.status.danger).toEqual(
      expect.objectContaining({ fill: expect.any(String), onFill: expect.any(String) }),
    );
    expect(tokens.status.info.onSoft).toMatch(/^#/);
  });

  it("returns the same token object across re-renders", async () => {
    const { result, rerender } = await renderHookWithTheme(() => useThemeTokens());
    const first = result.current.tokens;
    await rerender({});
    expect(result.current.tokens).toBe(first);
  });
});
