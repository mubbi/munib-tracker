/**
 * Shared `@/hooks/use-web-key-handler` mock. Captures the screen key handler so
 * tests can simulate desktop shortcuts without a DOM:
 *
 *   jest.mock("@/hooks/use-web-key-handler", () => require("@/test-support/mocks/web-key-handler").webKeyHandlerMock);
 *   import { pressWebKey, webKeyHandlerState } from "@/test-support/mocks/web-key-handler";
 *   expect(await pressWebKey("ArrowRight")).toBe(true);
 */
import { act } from "@testing-library/react-native";

type KeyEvent = { key: string; target?: unknown };
type KeyHandler = (event: KeyEvent) => boolean | undefined;

export const webKeyHandlerState: { handler: KeyHandler | null; enabled: boolean } = {
  handler: null,
  enabled: false,
};

/** Fires the captured handler inside `act`; returns whether it handled the key. */
export async function pressWebKey(key: string, target?: unknown): Promise<boolean | undefined> {
  let handled: boolean | undefined;
  await act(async () => {
    handled = webKeyHandlerState.handler?.({ key, target });
  });
  return handled;
}

export function resetWebKeyHandlerMock(): void {
  webKeyHandlerState.handler = null;
  webKeyHandlerState.enabled = false;
}

/** Targets equal to the string "interactive" count as focused buttons/links. */
export const MOCK_INTERACTIVE_TARGET = "interactive";

export const webKeyHandlerMock = {
  __esModule: true,
  isWebTypingTarget: () => false,
  isWebInteractiveTarget: (target: unknown) => target === MOCK_INTERACTIVE_TARGET,
  useWebScreenKeyHandler: (handler: KeyHandler, enabled = true) => {
    webKeyHandlerState.handler = handler;
    webKeyHandlerState.enabled = enabled;
  },
};
