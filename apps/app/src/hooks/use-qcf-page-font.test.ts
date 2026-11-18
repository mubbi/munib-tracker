import { act, renderHook } from "@testing-library/react-native";

import { QCF_BSML_FONT_FAMILY, qcfPageFontFamily } from "@/lib/arabic-fonts";
import { isMushafPageFontReady, loadQcfBsmlFont, loadQcfPageFont } from "@/lib/qcf-font-cache";
import { deferred } from "@/test-support/async";

import { useQcfPageFont } from "./use-qcf-page-font";

jest.mock("@/lib/qcf-font-cache", () => ({
  isMushafPageFontReady: jest.fn(() => false),
  loadQcfBsmlFont: jest.fn(async () => undefined),
  loadQcfPageFont: jest.fn(async () => undefined),
}));

const isReady = isMushafPageFontReady as jest.Mock;

async function setup(page: number, needsBsml?: boolean) {
  const hook = await renderHook(
    (props: { page: number }) => useQcfPageFont(props.page, needsBsml),
    {
      initialProps: { page },
    },
  );
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  isReady.mockReturnValue(false);
});

describe("useQcfPageFont", () => {
  it("is ready immediately when the page font is cached", async () => {
    isReady.mockReturnValue(true);
    const { result } = await setup(3);
    expect(result.current).toEqual({
      ready: true,
      fontFamily: qcfPageFontFamily(3),
      basmalaFontFamily: QCF_BSML_FONT_FAMILY,
    });
    expect(loadQcfPageFont).not.toHaveBeenCalled();
  });

  it("loads the page font then becomes ready", async () => {
    const { result } = await setup(4);
    expect(loadQcfPageFont).toHaveBeenCalledWith(4);
    expect(loadQcfBsmlFont).not.toHaveBeenCalled();
    expect(result.current.ready).toBe(true);
  });

  it("also loads the basmala font when needed", async () => {
    await setup(1, true);
    expect(loadQcfBsmlFont).toHaveBeenCalled();
  });

  it("is not ready while the font loads", async () => {
    const pending = deferred<void>();
    (loadQcfPageFont as jest.Mock).mockReturnValueOnce(pending.promise);
    const { result } = await setup(5);
    expect(result.current.ready).toBe(false);
    await act(async () => pending.resolve());
    expect(result.current.ready).toBe(true);
  });

  it("ignores a load that finishes after switching pages", async () => {
    const pending = deferred<void>();
    (loadQcfPageFont as jest.Mock)
      .mockReturnValueOnce(pending.promise)
      .mockReturnValueOnce(new Promise(() => {}));
    const { result, rerender } = await setup(6);
    await rerender({ page: 7 });
    await act(async () => pending.resolve());
    expect(result.current.ready).toBe(false);
    expect(result.current.fontFamily).toBe(qcfPageFontFamily(7));
  });
});
