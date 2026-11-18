import type { TFunction } from "i18next";

import { usePlatform } from "@/test-support/platform";

import { tTv } from "./t-tv";

/** A `t` that knows only `keys` and echoes unknown keys (or their defaultValue). */
function makeT(keys: Record<string, string>) {
  return jest.fn((key: string, options?: { defaultValue?: string }) =>
    key in keys ? keys[key] : (options?.defaultValue ?? key),
  ) as unknown as TFunction & jest.Mock;
}

describe("tTv on phones", () => {
  it("uses the phone key", () => {
    const t = makeT({ phone: "Phone", tv: "TV" });
    expect(tTv(t, "phone", "tv", { n: 1 })).toBe("Phone");
    expect(t).toHaveBeenCalledWith("phone", { n: 1 });
  });
});

describe("tTv on TV", () => {
  usePlatform({ isTV: true });

  it("prefers the TV key", () => {
    expect(tTv(makeT({ phone: "Phone", tv: "TV" }), "phone", "tv")).toBe("TV");
  });

  it.each([
    ["missing", {}],
    ["echoed back", { tv: "tv" }],
  ])("falls back to the phone key when the TV key is %s", (_label, extra) => {
    expect(tTv(makeT({ phone: "Phone", ...extra }), "phone", "tv")).toBe("Phone");
  });

  it("falls back when t returns a non-string", () => {
    const t = jest.fn((key: string) =>
      key === "tv" ? { nested: true } : "Phone",
    ) as unknown as TFunction;
    expect(tTv(t, "phone", "tv")).toBe("Phone");
  });
});
