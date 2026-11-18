import AsyncStorage from "@react-native-async-storage/async-storage";

import { mockSecureStore, resetSafeSecureStoreMock } from "@/test-support/mocks/safe-secure-store";
import { usePlatform } from "@/test-support/platform";

import {
  deletePlatformSecureItem,
  getPlatformSecureItem,
  setPlatformSecureItem,
} from "./platform-secure-storage";

jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

beforeEach(async () => {
  resetSafeSecureStoreMock();
  await AsyncStorage.clear();
});

describe("on native", () => {
  it("round-trips through the keychain", async () => {
    await setPlatformSecureItem("k", "v");
    expect(mockSecureStore.get("k")).toBe("v");
    expect(await getPlatformSecureItem("k")).toBe("v");
    await deletePlatformSecureItem("k");
    expect(mockSecureStore.has("k")).toBe(false);
    expect(await AsyncStorage.getItem("k")).toBeNull();
  });
});

describe("on web", () => {
  usePlatform({ OS: "web" });

  it("round-trips through AsyncStorage", async () => {
    await setPlatformSecureItem("k", "v");
    expect(await AsyncStorage.getItem("k")).toBe("v");
    expect(await getPlatformSecureItem("k")).toBe("v");
    await deletePlatformSecureItem("k");
    expect(await AsyncStorage.getItem("k")).toBeNull();
    expect(mockSecureStore.size).toBe(0);
  });
});
