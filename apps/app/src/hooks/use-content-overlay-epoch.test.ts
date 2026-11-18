import { act, renderHook } from "@testing-library/react-native";

import { useContentOverlayEpoch } from "./use-content-overlay-epoch";

jest.mock("@/lib/content-overlay-registry", () => ({
  getContentOverlaysReadyVersion: () => mockRegistry.version,
  subscribeContentOverlays: (listener: () => void) => {
    mockRegistry.listener = listener;
    return mockRegistry.unsubscribe;
  },
}));

const mockRegistry: { version: number; listener?: () => void; unsubscribe: jest.Mock } = {
  version: 3,
  unsubscribe: jest.fn(),
};

describe("useContentOverlayEpoch", () => {
  it("starts at the current version and advances when overlays load", async () => {
    const { result, unmount } = await renderHook(() => useContentOverlayEpoch());
    expect(result.current).toBe(3);
    mockRegistry.version = 4;
    await act(async () => mockRegistry.listener?.());
    expect(result.current).toBe(4);
    await unmount();
    expect(mockRegistry.unsubscribe).toHaveBeenCalled();
  });
});
