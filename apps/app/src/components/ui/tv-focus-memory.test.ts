import {
  captureTvFocusOrigin,
  forgetTvFocus,
  lastTvFocus,
  noteTvFocus,
  resetTvFocusMemory,
  restoreTvFocus,
  type TvFocusHandle,
} from "@/components/ui/tv-focus-memory";
import { setCurrentPathname } from "@/lib/navigation";

const handle = (mounted = true): TvFocusHandle & { focus: jest.Mock } => ({
  focus: jest.fn(),
  isMounted: () => mounted,
});

beforeEach(() => {
  resetTvFocusMemory();
  setCurrentPathname("/tracker");
});
afterAll(() => setCurrentPathname(null));

describe("tv-focus-memory", () => {
  it("remembers the last focused control until it unmounts", () => {
    const a = handle();
    noteTvFocus(a);
    expect(lastTvFocus()).toBe(a);

    forgetTvFocus(a);
    expect(lastTvFocus()).toBeNull();
  });

  it("ignores a control focused on another route (a screen left underneath)", () => {
    noteTvFocus(handle());
    setCurrentPathname("/tracker/details");

    expect(captureTvFocusOrigin()).toBeNull();
  });

  it("restores focus to the origin when nothing else holds it", () => {
    const origin = handle();
    noteTvFocus(origin);
    const captured = captureTvFocusOrigin();
    const inside = handle();
    noteTvFocus(inside);
    forgetTvFocus(inside); // the sheet's button unmounts with the sheet

    restoreTvFocus(captured, "/tracker");

    expect(origin.focus).toHaveBeenCalledTimes(1);
  });

  it("does not steal focus from another live control or across routes", () => {
    const origin = handle();
    noteTvFocus(origin);
    noteTvFocus(handle());

    restoreTvFocus(origin, "/tracker");
    expect(origin.focus).not.toHaveBeenCalled();

    resetTvFocusMemory();
    restoreTvFocus(origin, "/qaza");
    expect(origin.focus).not.toHaveBeenCalled();
  });

  it("skips an origin that has unmounted", () => {
    const origin = handle(false);
    restoreTvFocus(origin, "/tracker");

    expect(origin.focus).not.toHaveBeenCalled();
  });
});
