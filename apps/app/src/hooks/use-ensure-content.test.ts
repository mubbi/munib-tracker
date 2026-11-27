import { act, renderHook, waitFor } from "@testing-library/react-native";

import { useEnsureContent } from "@/hooks/use-ensure-content";

describe("useEnsureContent", () => {
  it("marks ready and bumps version after ensure resolves", async () => {
    let resolve!: () => void;
    const shared = new Promise<void>((r) => {
      resolve = r;
    });
    const ensure = jest.fn(() => shared);

    const { result } = await renderHook(() => useEnsureContent(ensure));
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
    const { result } = await renderHook(() => useEnsureContent(ensure, () => true));
    expect(result.current.ready).toBe(true);
    // RNTL 14 renders asynchronously, so the warm-corpus ensure() may already have
    // settled (version 2) by the time render resolves.
    expect(result.current.version).toBeGreaterThanOrEqual(1);

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

    const first = await renderHook(() => useEnsureContent(ensure));
    await first.unmount();

    // Remount while the original promise is still pending — simulates Strict Mode /
    // a brief navigation remount where the first effect cleaned up before resolve.
    const second = await renderHook(() => useEnsureContent(ensure));

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
    const { result } = await renderHook(() => useEnsureContent(ensure, () => false));

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
    const { result } = await renderHook(() => useEnsureContent(ensure, () => true));
    expect(result.current.ready).toBe(true);

    await act(async () => {
      await Promise.resolve();
    });

    await waitFor(() => {
      expect(ensure).toHaveBeenCalled();
    });
    expect(result.current.ready).toBe(true);
  });

  it("reports a cold failure as error and recovers on retry", async () => {
    const ensure = jest
      .fn<Promise<void>, []>()
      .mockRejectedValueOnce(new Error("chunk failed"))
      .mockResolvedValueOnce(undefined);
    const { result } = await renderHook(() => useEnsureContent(ensure, () => false));

    await waitFor(() => {
      expect(result.current.error).toBeInstanceOf(Error);
    });
    expect(result.current.ready).toBe(false);

    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => {
      expect(result.current.ready).toBe(true);
    });
    expect(result.current.error).toBeNull();
    expect(ensure).toHaveBeenCalledTimes(2);
  });
});
