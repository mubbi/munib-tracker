/**
 * Shared `expo-router` mock. Wire it up once per test file:
 *
 *   jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
 *   import { mockRouter, setMockSearchParams, resetExpoRouterMock } from "@/test-support/mocks/expo-router";
 *   beforeEach(resetExpoRouterMock);
 *
 * Then assert navigation with `expect(mockRouter.push).toHaveBeenCalledWith(...)`.
 */
import { type ReactNode, useEffect } from "react";

export const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  navigate: jest.fn(),
  back: jest.fn(),
  dismiss: jest.fn(),
  dismissAll: jest.fn(),
  setParams: jest.fn(),
  canGoBack: jest.fn(() => true),
};

const routeState = {
  params: {} as Record<string, string | string[] | undefined>,
  pathname: "/",
  segments: [] as string[],
};

export function setMockSearchParams(params: Record<string, string | string[] | undefined>): void {
  routeState.params = params;
}

export function setMockPathname(pathname: string, segments: string[] = []): void {
  routeState.pathname = pathname;
  routeState.segments = segments;
}

/** Clears recorded navigation calls and route state. Use in `beforeEach`. */
export function resetExpoRouterMock(): void {
  for (const fn of Object.values(mockRouter)) fn.mockClear();
  mockRouter.canGoBack.mockImplementation(() => true);
  routeState.params = {};
  routeState.pathname = "/";
  routeState.segments = [];
}

function Passthrough({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

export const expoRouterMock = {
  __esModule: true,
  router: mockRouter,
  useRouter: () => mockRouter,
  useLocalSearchParams: () => routeState.params,
  useGlobalSearchParams: () => routeState.params,
  usePathname: () => routeState.pathname,
  useSegments: () => routeState.segments,
  useNavigation: () => ({ setOptions: jest.fn(), addListener: jest.fn(() => jest.fn()) }),
  useIsFocused: () => true,
  /** Runs the focus callback like a mount effect (screens are "focused" in tests). */
  useFocusEffect: (effect: () => undefined | (() => void)) => {
    useEffect(() => effect(), [effect]);
  },
  Link: Passthrough,
  Redirect: () => null,
  Stack: Object.assign(Passthrough, { Screen: () => null }),
  Tabs: Object.assign(Passthrough, { Screen: () => null }),
};

/**
 * `router.canDismiss()` stand-in (false by default). Set per test with
 * `mockRouterCanDismiss.mockReturnValue(true)`; reset it in `beforeEach`.
 */
export const mockRouterCanDismiss = jest.fn(() => false);
Object.assign(mockRouter, { canDismiss: mockRouterCanDismiss });

/**
 * `Redirect` that renders `redirect:<href>` so a test can assert where a guard
 * sends the user (the default `Redirect` renders nothing). Opt in per file:
 * `({ ...expoRouterMock, Redirect: MockRedirect })`.
 */
export function MockRedirect({ href }: { href: string }) {
  const { Text } = require("react-native") as typeof import("react-native");
  return <Text>{`redirect:${href}`}</Text>;
}
