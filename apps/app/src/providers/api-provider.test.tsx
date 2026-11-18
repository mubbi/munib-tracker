import { appQueryClient } from "@munib-tracker/api-client/provider";
import { useQueryClient } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react-native";

import { AppApiProvider } from "@/providers/api-provider";

describe("AppApiProvider", () => {
  it("exposes the shared app query client to descendants", async () => {
    const { result } = await renderHook(() => useQueryClient(), { wrapper: AppApiProvider });
    expect(result.current).toBe(appQueryClient);
  });
});
