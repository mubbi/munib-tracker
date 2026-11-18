import { appQueryClient } from "@munib-tracker/api-client";

import { cancelCloudQueries } from "@/lib/cancel-cloud-queries";

describe("cancelCloudQueries", () => {
  it("cancels every in-flight cloud query", async () => {
    const cancel = jest.spyOn(appQueryClient, "cancelQueries").mockResolvedValue(undefined);
    await cancelCloudQueries();
    expect(cancel).toHaveBeenCalledTimes(1);
    cancel.mockRestore();
  });
});
