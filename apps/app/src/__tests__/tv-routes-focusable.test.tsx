import { screen } from "@testing-library/react-native";
import type { ComponentType } from "react";

import { ContentReportProvider } from "@/components/content-report/content-report-provider";
import { resetExpoRouterMock } from "@/test-support/mocks/expo-router";
import { usePlatform } from "@/test-support/platform";
import { renderWithProviders } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/hooks/use-is-online", () => ({ useIsOnline: () => true }));
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);

/**
 * P10-05: every routed screen must offer the D-pad at least one focus stop on
 * TV (a screen with nothing focusable leaves Back as the only way out).
 * Table-driven over browse / hub screens; extend when a new top-level route lands.
 */
const ROUTES: [string, () => { default: ComponentType }][] = [
  ["(tabs)/library", () => require("@/app/(tabs)/library")],
  ["dua", () => require("@/app/dua/index")],
  ["names-of-allah", () => require("@/app/names-of-allah/index")],
  ["duroods", () => require("@/app/duroods/index")],
  ["bookmarks", () => require("@/app/bookmarks/index")],
  ["settings/about", () => require("@/app/settings/about")],
];

type Json = ReturnType<typeof screen.toJSON>;

function countFocusable(node: Json | Json[] | null): number {
  if (node == null) return 0;
  if (Array.isArray(node)) return node.reduce<number>((n, c) => n + countFocusable(c), 0);
  if (typeof node === "string") return 0;
  const own = node.props?.focusable === true || node.props?.hasTVPreferredFocus === true ? 1 : 0;
  return own + countFocusable((node.children ?? null) as Json[] | null);
}

describe("TV routes expose focusable elements", () => {
  usePlatform({ OS: "android", isTV: true });
  beforeEach(() => resetExpoRouterMock());

  it.each(ROUTES)("%s", async (_name, load) => {
    const Screen = load().default;
    const errors = jest.spyOn(console, "error").mockImplementation(() => {});
    await renderWithProviders(
      <ContentReportProvider>
        <Screen />
      </ContentReportProvider>,
    );
    // An ErrorBoundary fallback has its own retry button: don't let it pass for the screen.
    const caught = errors.mock.calls.filter((c) => String(c[0]).includes("Caught error"));
    errors.mockRestore();
    expect(caught).toEqual([]);
    expect(countFocusable(screen.toJSON())).toBeGreaterThan(0);
  });
});
