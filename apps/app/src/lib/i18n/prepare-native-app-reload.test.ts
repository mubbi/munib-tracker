import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import * as cloudQueries from "../cancel-cloud-queries";
import * as reloadGate from "../cloud-api-reload-gate";
import { prepareForNativeAppReload } from "./prepare-native-app-reload";

describe("prepareForNativeAppReload", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    reloadGate.setAppReloadInProgress(false);
  });

  it("sets reload gate and cancels React Query work", async () => {
    const cancelSpy = jest.spyOn(cloudQueries, "cancelCloudQueries").mockResolvedValue(undefined);

    await prepareForNativeAppReload();

    expect(reloadGate.isAppReloadInProgress()).toBe(true);
    expect(cancelSpy).toHaveBeenCalled();
    cancelSpy.mockRestore();
  });

  it("waits for in-flight HTTP to drain", async () => {
    jest.spyOn(cloudQueries, "cancelCloudQueries").mockResolvedValue(undefined);
    const spy = jest
      .spyOn(reloadGate, "getApiInFlightCount")
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0);

    await prepareForNativeAppReload();

    expect(spy.mock.calls.length).toBeGreaterThanOrEqual(3);
    spy.mockRestore();
    jest.restoreAllMocks();
  });
});
