import { practiceSessionKeyAction } from "./session-keys";

const base = { rtl: false, interactiveTarget: false, canNavigate: true };

describe("practiceSessionKeyAction", () => {
  it("Space drives the primary control unless a button has focus", () => {
    expect(practiceSessionKeyAction(" ", base)).toBe("primary");
    expect(practiceSessionKeyAction(" ", { ...base, interactiveTarget: true })).toBeNull();
  });

  it("arrows move between ayahs, mirrored in RTL", () => {
    expect(practiceSessionKeyAction("ArrowRight", base)).toBe("next");
    expect(practiceSessionKeyAction("ArrowLeft", base)).toBe("previous");
    expect(practiceSessionKeyAction("ArrowRight", { ...base, rtl: true })).toBe("previous");
    expect(practiceSessionKeyAction("ArrowLeft", { ...base, rtl: true })).toBe("next");
  });

  it("ignores arrows mid-take, with Shift, and other keys", () => {
    expect(practiceSessionKeyAction("ArrowRight", { ...base, canNavigate: false })).toBeNull();
    expect(practiceSessionKeyAction("ArrowRight", { ...base, shiftKey: true })).toBeNull();
    expect(practiceSessionKeyAction("Enter", base)).toBeNull();
  });
});
