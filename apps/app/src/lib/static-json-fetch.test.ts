import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { clearStaticJsonCache, fetchStaticJson } from "./static-json-fetch";

describe("fetchStaticJson", () => {
  beforeEach(() => {
    clearStaticJsonCache();
    jest.restoreAllMocks();
  });

  it("returns cached data without a second network call for the same URL", async () => {
    const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ chapter: [{ verse: 1, text: "Bismillah" }] }),
    } as Response);

    const url = "https://cdn.example.com/editions/eng-test/1.json";
    const first = await fetchStaticJson<{ chapter: Array<{ verse: number; text: string }> }>(url);
    const second = await fetchStaticJson(url);

    expect(first.chapter[0]?.text).toBe("Bismillah");
    expect(second).toEqual(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
