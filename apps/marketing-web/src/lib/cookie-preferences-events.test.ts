import { describe, expect, it, vi } from "vitest";
import { COOKIE_PREFERENCES_OPEN_EVENT, openCookiePreferences } from "./cookie-preferences-events";

describe("cookie-preferences-events", () => {
  it("openCookiePreferences dispatches a CustomEvent", () => {
    const handler = vi.fn();
    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handler);

    openCookiePreferences();

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler.mock.calls[0]?.[0]).toBeInstanceOf(CustomEvent);
    expect((handler.mock.calls[0]?.[0] as CustomEvent).type).toBe(COOKIE_PREFERENCES_OPEN_EVENT);

    window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handler);
  });
});
