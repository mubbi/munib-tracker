import { groupEditionsByLanguage } from "./quran-edition-groups";

const edition = (id: string, language: string, name: string) => ({ id, language, name });

describe("groupEditionsByLanguage", () => {
  const editions = [
    edition("en-b", "en", "Pickthall"),
    edition("ur-a", "ur", "Jalandhry"),
    edition("en-a", "en", "Hilali"),
    edition("zz-a", "zz", "Zed"),
  ];

  it("groups by language with app-locale names and sorted editions", () => {
    const groups = groupEditionsByLanguage(editions, new Set());
    const english = groups.find((group) => group.language === "en");
    expect(english?.locale).toBe("en");
    expect(english?.editions.map((e) => e.id)).toEqual(["en-a", "en-b"]);
    const unknown = groups.find((group) => group.language === "zz");
    expect(unknown).toMatchObject({ locale: null, name: "ZZ", english: "ZZ" });
  });

  it("puts preferred languages first", () => {
    const groups = groupEditionsByLanguage(editions, new Set(["ur"]));
    expect(groups[0]?.language).toBe("ur");
  });
});
