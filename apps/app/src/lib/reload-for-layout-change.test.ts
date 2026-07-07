import { describe, expect, it, jest } from "@jest/globals";

jest.mock("expo", () => ({
  reloadAppAsync: jest.fn(async () => undefined),
}));

jest.mock("react-native", () => ({
  DevSettings: { reload: jest.fn() },
  Platform: { OS: "ios" },
}));

import { reloadAppAsync } from "expo";
import { DevSettings } from "react-native";

import { RTL_LOCALES, reloadForLayoutDirectionChange } from "./reload-for-layout-change";

describe("RTL_LOCALES", () => {
  it("includes Arabic and Urdu", () => {
    expect(RTL_LOCALES.has("ar")).toBe(true);
    expect(RTL_LOCALES.has("ur")).toBe(true);
    expect(RTL_LOCALES.has("en")).toBe(false);
  });
});

describe("reloadForLayoutDirectionChange", () => {
  it("uses reloadAppAsync on native", async () => {
    const ok = await reloadForLayoutDirectionChange("test");
    expect(ok).toBe(true);
    expect(reloadAppAsync).toHaveBeenCalledWith("test");
    expect(DevSettings.reload).not.toHaveBeenCalled();
  });
});
