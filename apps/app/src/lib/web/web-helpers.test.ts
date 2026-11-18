import { isTypingTarget } from "./is-typing-target";
import { WEB_RAIL_COMPACT_WIDTH, WEB_RAIL_EXPANDED_WIDTH, webRailWidthFor } from "./web-rail";

describe("isTypingTarget", () => {
  it.each([
    [{ tagName: "INPUT" }, true],
    [{ tagName: "textarea" }, true],
    [{ tagName: "SELECT" }, true],
    [{ tagName: "DIV", isContentEditable: true }, true],
    [{ tagName: "BUTTON", isContentEditable: false }, false],
    [{}, false],
    [null, false],
  ])("%p → %p", (target, expected) => {
    expect(isTypingTarget(target as EventTarget | null)).toBe(expected);
  });
});

describe("webRailWidthFor", () => {
  it.each([
    [1280, WEB_RAIL_EXPANDED_WIDTH],
    [1279, WEB_RAIL_COMPACT_WIDTH],
  ])("%i px → %i", (width, expected) => {
    expect(webRailWidthFor(width)).toBe(expected);
  });
});
