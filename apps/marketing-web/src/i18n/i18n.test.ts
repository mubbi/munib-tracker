import {
  isArgumentElement,
  isDateElement,
  isLiteralElement,
  isNumberElement,
  isPluralElement,
  isSelectElement,
  isTagElement,
  isTimeElement,
  type MessageFormatElement,
  parse,
} from "@formatjs/icu-messageformat-parser";
import { describe, expect, it } from "vitest";
import { localizeEntries } from "@/content/localized";
import { isLocale, LOCALE_META, localizedPath, stripLocalePrefix } from "@/i18n/locales";
import { DEFAULT_LOCALE, LOCALES } from "@/i18n/routing";
import { languageAlternates } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { CLIENT_NAMESPACES, loadMessages, mergeMessages } from "@/messages";
import en from "@/messages/en";

/** Every leaf string in a catalog, with its dotted key. */
function leaves(value: unknown, prefix = ""): [string, unknown][] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, prefix ? `${prefix}.${k}` : k));
  }
  return [[prefix, value]];
}

describe("locales", () => {
  it("has display + SEO metadata for every published locale", () => {
    expect(LOCALES).toContain(DEFAULT_LOCALE);
    for (const locale of LOCALES) {
      const meta = LOCALE_META[locale];
      expect(meta.nativeName.length).toBeGreaterThan(0);
      expect(["ltr", "rtl"]).toContain(meta.dir);
      expect(meta.ogLocale).toMatch(/^[a-z]{2,3}_[A-Z]{2}$/);
    }
  });

  it("prefixes every locale, English included", () => {
    expect(localizedPath("/", DEFAULT_LOCALE)).toBe("/en");
    expect(localizedPath("/features", DEFAULT_LOCALE)).toBe("/en/features");
    expect(stripLocalePrefix("/en/features/hadith")).toBe("/features/hadith");
    expect(stripLocalePrefix("/en")).toBe("/");
    expect(stripLocalePrefix("/features")).toBe("/features");
    expect(isLocale("xx")).toBe(false);
  });

  it("emits hreflang for every locale plus x-default (English)", () => {
    const alternates = languageAlternates("/faq");
    expect(Object.keys(alternates)).toHaveLength(LOCALES.length + 1);
    expect(alternates["x-default"]).toBe(`${SITE_URL}/en/faq`);
  });
});

describe("message catalogs", () => {
  it("has no empty namespaces or blank strings in English", () => {
    for (const [namespace, catalog] of Object.entries(en)) {
      expect(Object.keys(catalog), namespace).not.toHaveLength(0);
    }
    // Leaves are strings, or plain string arrays read with `t.raw()`.
    const filled = (v: unknown) => typeof v === "string" && v.trim() !== "";
    const blank = leaves(en).filter(
      ([, v]) => !(Array.isArray(v) ? v.length > 0 && v.every(filled) : filled(v)),
    );
    expect(blank.map(([k]) => k)).toEqual([]);
  });

  it("loads a full catalog for every locale", async () => {
    for (const locale of LOCALES) {
      const messages = await loadMessages(locale);
      expect(leaves(messages).map(([k]) => k)).toEqual(leaves(en).map(([k]) => k));
    }
  });

  it("falls back to English for untranslated keys", () => {
    const merged = mergeMessages(
      { nav: { a: "A", b: "B" }, footer: { c: "C" } },
      { nav: { a: "Ā" } },
    );
    expect(merged).toEqual({ nav: { a: "Ā", b: "B" }, footer: { c: "C" } });
  });

  it("only ships namespaces that exist to the client", () => {
    for (const ns of CLIENT_NAMESPACES) expect(en).toHaveProperty(ns);
  });
});

describe("localized content", () => {
  const source = [
    { slug: "a", title: "A" },
    { slug: "b", title: "B" },
  ];

  it("returns the English source for the default locale", () => {
    expect(localizeEntries(source, {}, DEFAULT_LOCALE, (e) => e.slug)).toBe(source);
  });
});

/** ICU argument names, rich-text tags and inline links in a message (order-independent). */
function placeholders(message: string): string[] {
  const found = new Set<string>();
  const walk = (elements: MessageFormatElement[]) => {
    for (const el of elements) {
      if (isArgumentElement(el) || isNumberElement(el) || isDateElement(el) || isTimeElement(el)) {
        found.add(`{${el.value}}`);
      } else if (isPluralElement(el) || isSelectElement(el)) {
        found.add(`{${el.value}}`);
        // Branch keys differ by language (Arabic has more plural forms); walk their bodies.
        for (const option of Object.values(el.options)) walk(option.value);
      } else if (isTagElement(el)) {
        found.add(`<${el.value}>`);
        walk(el.children);
      } else if (isLiteralElement(el)) {
        for (const m of el.value.matchAll(/\]\((\/[^)\s]*)\)/g)) found.add(`(${m[1]})`);
      }
    }
  };
  walk(parse(message));
  return [...found].sort();
}

describe.each(LOCALES.filter((l) => l !== DEFAULT_LOCALE))("%s catalog", (locale) => {
  it("translates every English key and nothing else", async () => {
    const own = (await import(`@/messages/${locale}/index.ts`)).default as typeof en;
    expect(leaves(own).map(([k]) => k)).toEqual(leaves(en).map(([k]) => k));
  });

  it("keeps every ICU argument, rich-text tag and inline link", async () => {
    const own = (await import(`@/messages/${locale}/index.ts`)).default as typeof en;
    const theirs = new Map(leaves(own));
    const drift: string[] = [];
    for (const [key, english] of leaves(en)) {
      const translated = theirs.get(key);
      const pairs = Array.isArray(english)
        ? [[english.join("\n"), Array.isArray(translated) ? translated.join("\n") : ""]]
        : [[english, translated]];
      for (const [a, b] of pairs) {
        if (typeof a !== "string" || typeof b !== "string") continue;
        if (placeholders(a).join() !== placeholders(b).join()) drift.push(key);
      }
    }
    expect(drift).toEqual([]);
  });
});
