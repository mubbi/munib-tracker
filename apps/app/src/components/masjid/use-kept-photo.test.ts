import { act, renderHook } from "@testing-library/react-native";

jest.mock("@/lib/timetable-ocr", () => ({ discardPhoto: jest.fn() }));

import { discardPhoto } from "@/lib/timetable-ocr";

import { useKeptPhoto } from "./use-kept-photo";

const discard = jest.mocked(discardPhoto);

beforeEach(() => discard.mockReset());

describe("useKeptPhoto (D3: the app's photo copy never outlives the import)", () => {
  it("keeping a second photo discards the first (no orphaned copy)", async () => {
    const { result } = await renderHook(() => useKeptPhoto());
    await act(async () => result.current.keep("file:///cache/a.jpg"));
    expect(result.current.uri).toBe("file:///cache/a.jpg");
    expect(discard).not.toHaveBeenCalled();

    await act(async () => result.current.keep("file:///cache/b.jpg"));
    expect(discard).toHaveBeenCalledWith("file:///cache/a.jpg");
    expect(result.current.uri).toBe("file:///cache/b.jpg");
  });

  it("clear() discards the kept photo now", async () => {
    const { result } = await renderHook(() => useKeptPhoto());
    await act(async () => result.current.keep("file:///cache/a.jpg"));
    await act(async () => result.current.clear());
    expect(discard).toHaveBeenCalledWith("file:///cache/a.jpg");
    expect(result.current.uri).toBeNull();
  });

  it("unmount discards whatever is still kept", async () => {
    const { result, unmount } = await renderHook(() => useKeptPhoto());
    await act(async () => result.current.keep("file:///cache/a.jpg"));
    await act(async () => unmount());
    expect(discard).toHaveBeenCalledWith("file:///cache/a.jpg");
  });

  it("re-keeping the same uri never deletes it", async () => {
    const { result } = await renderHook(() => useKeptPhoto());
    await act(async () => result.current.keep("file:///cache/a.jpg"));
    await act(async () => result.current.keep("file:///cache/a.jpg"));
    expect(discard).not.toHaveBeenCalled();
  });
});
