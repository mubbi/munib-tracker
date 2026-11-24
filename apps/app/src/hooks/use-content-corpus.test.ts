import { act, renderHook } from "@testing-library/react-native";

import type { ContentCorpus } from "@/lib/content-loaders";
import { deferred } from "@/test-support/async";

import { useContentCorpus } from "./use-content-corpus";

describe("useContentCorpus", () => {
  it("returns a warm corpus on the first render without loading", async () => {
    const items = [{ id: "a" }];
    const corpus: ContentCorpus<{ id: string }> = { load: jest.fn(), peek: () => items };
    const { result } = await renderHook(() => useContentCorpus(corpus));
    expect(result.current).toEqual({ items, ready: true });
    expect(corpus.load).not.toHaveBeenCalled();
  });

  it("loads a cold corpus once and reports ready", async () => {
    const pending = deferred<{ id: string }[]>();
    const corpus: ContentCorpus<{ id: string }> = {
      load: jest.fn(() => pending.promise),
      peek: () => undefined,
    };
    const { result } = await renderHook(() => useContentCorpus(corpus));
    expect(result.current).toEqual({ items: [], ready: false });

    await act(async () => pending.resolve([{ id: "b" }]));
    expect(result.current).toEqual({ items: [{ id: "b" }], ready: true });
    expect(corpus.load).toHaveBeenCalledTimes(1);
  });

  it("settles with an empty corpus when the load fails (no endless loading)", async () => {
    const pending = deferred<{ id: string }[]>();
    const corpus: ContentCorpus<{ id: string }> = {
      load: jest.fn(() => pending.promise),
      peek: () => undefined,
    };
    const { result } = await renderHook(() => useContentCorpus(corpus));
    expect(result.current.ready).toBe(false);

    await act(async () => pending.reject(new Error("chunk failed")));
    expect(result.current).toEqual({ items: [], ready: true });
  });
});
