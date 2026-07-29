import { customAdhkarMediaIds } from "@/lib/user-media-api";

describe("customAdhkarMediaIds", () => {
  it("returns unique media ids", () => {
    expect(
      customAdhkarMediaIds([
        { mediaId: "a" },
        { mediaId: "b" },
        { mediaId: "a" },
        {},
        { mediaId: "" },
      ]),
    ).toEqual(["a", "b"]);
  });

  it("handles empty input", () => {
    expect(customAdhkarMediaIds(undefined)).toEqual([]);
    expect(customAdhkarMediaIds(null)).toEqual([]);
    expect(customAdhkarMediaIds([])).toEqual([]);
  });
});
