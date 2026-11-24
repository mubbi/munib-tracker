import { readerKeyAction } from "@/components/quran/reader-shared";

function target(tagName: string, role?: string): EventTarget {
  return {
    tagName,
    getAttribute: (name: string) => (name === "role" ? (role ?? null) : null),
  } as unknown as EventTarget;
}

function key(k: string, opts: { shiftKey?: boolean; target?: EventTarget | null } = {}) {
  return { key: k, shiftKey: opts.shiftKey ?? false, target: opts.target ?? target("body") };
}

describe("readerKeyAction", () => {
  it("maps arrows and Space to reader shortcuts", () => {
    expect(readerKeyAction(key("ArrowLeft"))).toBe("ArrowLeft");
    expect(readerKeyAction(key("ArrowRight"))).toBe("ArrowRight");
    expect(readerKeyAction(key(" "))).toBe("Space");
  });

  it("leaves Shift+arrow (text selection) and slider arrows to the page", () => {
    expect(readerKeyAction(key("ArrowLeft", { shiftKey: true }))).toBeNull();
    expect(readerKeyAction(key("ArrowRight", { target: target("div", "slider") }))).toBeNull();
  });

  it("lets a focused control handle Space itself", () => {
    expect(readerKeyAction(key(" ", { target: target("button") }))).toBeNull();
    expect(readerKeyAction(key(" ", { target: target("div", "switch") }))).toBeNull();
    // Arrows still turn while a button has focus.
    expect(readerKeyAction(key("ArrowLeft", { target: target("button") }))).toBe("ArrowLeft");
  });

  it("ignores other keys", () => {
    expect(readerKeyAction(key("Enter"))).toBeNull();
    expect(readerKeyAction(key("a"))).toBeNull();
  });
});
