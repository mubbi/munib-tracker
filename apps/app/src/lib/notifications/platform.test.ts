import { mockExpoConstants, resetExpoConstantsMock } from "@/test-support/mocks/expo-constants";
import { setPlatform } from "@/test-support/platform";

import { isExpoGo, isLocalNotificationSupported } from "./platform";

jest.mock("expo-constants", () => require("@/test-support/mocks/expo-constants").expoConstantsMock);

beforeEach(resetExpoConstantsMock);

describe("notifications platform", () => {
  it("detects Expo Go from the execution environment", () => {
    mockExpoConstants.executionEnvironment = "storeClient";
    expect(isExpoGo()).toBe(true);
    expect(isLocalNotificationSupported()).toBe(false);
  });

  it("supports local notifications on native builds", () => {
    expect(isLocalNotificationSupported()).toBe(true);
  });

  it("does not support local notifications on TV", () => {
    const restore = setPlatform({ isTV: true });
    try {
      expect(isLocalNotificationSupported()).toBe(false);
    } finally {
      restore();
    }
  });
});
