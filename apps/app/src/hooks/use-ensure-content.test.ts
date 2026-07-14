import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useEnsureContent } from "@/hooks/use-ensure-content";

describe("useEnsureContent", () => {
  it("marks ready and bumps version after ensure resolves", async () => {
    let resolve!: () => void;
    const shared = new Promise<void>((r) => {
      resolve = r;
    });
    const ensure = jest.fn(() => shared);

    const { result } = renderHook(() => useEnsureContent(ensure));
    expect(result.current.ready).toBe(false);
    expect(result.current.version).toBe(0);

    await act(async () => {
      resolve();
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
      expect(result.current.version).toBe(1);
    });
  });

  it("starts ready when isCached reports a warm corpus", () => {
    const ensure = jest.fn(() => Promise.resolve());
    const { result } = renderHook(() => useEnsureContent(ensure, () => true));
    expect(result.current.ready).toBe(true);
    expect(result.current.version).toBe(1);
  });

  it("still bumps ready after remount while ensure is in flight", async () => {
    let resolve!: () => void;
    const shared = new Promise<void>((r) => {
      resolve = r;
    });
    const ensure = jest.fn(() => shared);

    const first = renderHook(() => useEnsureContent(ensure));
    first.unmount();

    // Remount while the original promise is still pending — simulates Strict Mode /
    // a brief navigation remount where the first effect cleaned up before resolve.
    const second = renderHook(() => useEnsureContent(ensure));

    await act(async () => {
      resolve();
    });

    await waitFor(() => {
      expect(second.result.current.ready).toBe(true);
      expect(second.result.current.version).toBeGreaterThan(0);
    });
  });

  it("marks ready even when ensure rejects", async () => {
    const ensure = jest.fn(() => Promise.reject(new Error("chunk failed")));
    const { result } = renderHook(() => useEnsureContent(ensure));

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
      expect(result.current.version).toBe(1);
    });
  });
});
