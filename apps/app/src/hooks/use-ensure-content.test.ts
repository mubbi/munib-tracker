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

  it("starts ready when isCached reports a warm corpus", async () => {
    const ensure = jest.fn(() => Promise.resolve());
    const { result } = renderHook(() => useEnsureContent(ensure, () => true));
    expect(result.current.ready).toBe(true);
    expect(result.current.version).toBe(1);

    await waitFor(() => {
      expect(result.current.version).toBeGreaterThan(1);
    });
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

  it("keeps ready false when a cold ensure rejects", async () => {
    const ensure = jest.fn(() => Promise.reject(new Error("chunk failed")));
    const { result } = renderHook(() => useEnsureContent(ensure, () => false));

    await act(async () => {
      await Promise.resolve();
    });

    // Give the rejected promise a turn to settle without opening an empty body.
    await waitFor(() => {
      expect(ensure).toHaveBeenCalled();
    });
    expect(result.current.ready).toBe(false);
    expect(result.current.version).toBe(0);
  });

  it("stays ready when a warm ensure rejects", async () => {
    const ensure = jest.fn(() => Promise.reject(new Error("chunk failed")));
    const { result } = renderHook(() => useEnsureContent(ensure, () => true));
    expect(result.current.ready).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(ensure).toHaveBeenCalled();
    });
    expect(result.current.ready).toBe(true);
  });
});
