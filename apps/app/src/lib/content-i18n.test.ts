import i18n from "@/i18n";
import { localizeList, localizeObject } from "@/lib/content-i18n";

type Item = { id: string; title: string };
const base: Item[] = [
  { id: "a", title: "Patience" },
  { id: "b", title: "Gratitude" },
];
const overlays = { ur: [{ title: "صبر" }] } as never;

/** Pretend the UI language is `language` for one assertion. */
function withLanguage(language: string | undefined) {
  jest.replaceProperty(i18n, "language", language as string);
}

afterEach(() => jest.restoreAllMocks());

describe("localizeList", () => {
  it("applies the active locale's overlay", () => {
    withLanguage("ur-PK");
    expect(localizeList(base, overlays).map((i) => i.title)).toEqual(["صبر", "Gratitude"]);
  });

  it.each(["en", "xx", "fr", undefined])("keeps English for language %p", (language) => {
    withLanguage(language);
    expect(localizeList(base, overlays)).toEqual(base);
  });
});

describe("localizeObject", () => {
  const item = { title: "Patience", body: "Be patient" };

  it("applies the active locale's overlay", () => {
    withLanguage("ur");
    expect(localizeObject(item, { ur: { title: "صبر" } } as never)).toEqual({
      title: "صبر",
      body: "Be patient",
    });
  });

  it("keeps English without an active overlay locale", () => {
    withLanguage("en");
    expect(localizeObject(item, { ur: { title: "صبر" } } as never)).toEqual(item);
  });
});

describe("overlay readiness", () => {
  it("re-emits languageChanged when lazy overlays finish loading", () => {
    let onOverlaysReady!: () => void;
    let isolatedI18n!: typeof i18n;
    jest.isolateModules(() => {
      jest.doMock("@/lib/content-overlay-registry", () => ({
        subscribeContentOverlays: (listener: () => void) => {
          onOverlaysReady = listener;
          return () => {};
        },
      }));
      isolatedI18n = require("@/i18n").default;
      require("@/lib/content-i18n");
    });
    jest.dontMock("@/lib/content-overlay-registry");
    const emit = jest.spyOn(isolatedI18n, "emit").mockImplementation(() => {});

    onOverlaysReady();

    expect(emit).toHaveBeenCalledWith("languageChanged", isolatedI18n.language);
  });
});
