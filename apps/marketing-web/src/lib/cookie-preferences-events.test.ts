import { describe, expect, it, vi } from "vitest";
import { COOKIE_PREFERENCES_OPEN_EVENT, openCookiePreferences } from "./cookie-preferences-events";

describe("cookie-preferences-events", () => {
  it("openCookiePreferences dispatches a CustomEvent", () => {
    const handler = vi.fn();
    window.addEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handler);

    openCookiePreferences();

    expect(handler).toHaveBeenCalledTimes(1);
    const event = handler.mock.calls[0]?.[0];
    expect(event).toBeInstanceOf(CustomEvent);
    expect(event).toHaveProperty("type", COOKIE_PREFERENCES_OPEN_EVENT);

    window.removeEventListener(COOKIE_PREFERENCES_OPEN_EVENT, handler);
  });
});
