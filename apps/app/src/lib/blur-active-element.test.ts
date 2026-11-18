import { blurActiveElement } from "@/lib/blur-active-element";
import { blurActiveElement as blurActiveElementWeb } from "@/lib/blur-active-element.web";

describe("blurActiveElement (native)", () => {
  it("is a no-op", () => {
    expect(blurActiveElement()).toBeUndefined();
  });
});

describe("blurActiveElement (web)", () => {
  const g = globalThis as Record<string, unknown>;
  let restore: () => void = () => {};
  afterEach(() => restore());

  /** Install a fake DOM whose focused element is `active`. */
  function setup(active: unknown) {
    class FakeHTMLElement {
      blur = jest.fn();
    }
    const previous = { document: g.document, HTMLElement: g.HTMLElement };
    g.HTMLElement = FakeHTMLElement;
    const element = active === "element" ? new FakeHTMLElement() : active;
    g.document = { activeElement: element };
    restore = () => {
      g.document = previous.document;
      g.HTMLElement = previous.HTMLElement;
    };
    return element as { blur?: jest.Mock };
  }

  it("blurs the focused HTML element", () => {
    const element = setup("element");
    blurActiveElementWeb();
    expect(element.blur).toHaveBeenCalledTimes(1);
  });

  it("ignores a missing or non-HTML focus target", () => {
    setup(null);
    expect(() => blurActiveElementWeb()).not.toThrow();
  });
});
