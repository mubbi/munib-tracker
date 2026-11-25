import type { TFunction } from "i18next";

import { WIDGET_APP_GROUP } from "@/lib/appSurfaces/config";
import { syncTvHomeSurfaces } from "@/lib/tv-home/sync";
import { buildWidgetSnapshot } from "@/test-support/fixtures/widgets";
import { usePlatformSwitch } from "@/test-support/platform";

const mockNative = {
  isTvHomeChannelSupported: jest.fn(() => true),
  publishTvHomeChannel: jest.fn(async () => true),
  isTopShelfSupported: jest.fn(() => true),
  publishTopShelf: jest.fn(async () => true),
};
jest.mock("@/lib/tv-home/native", () => ({
  isTvHomeChannelSupported: () => mockNative.isTvHomeChannelSupported(),
  publishTvHomeChannel: (json: string) => mockNative.publishTvHomeChannel(json),
  isTopShelfSupported: () => mockNative.isTopShelfSupported(),
  publishTopShelf: (json: string, group: string) => mockNative.publishTopShelf(json, group),
}));

const t = ((key: string) => `t:${key}`) as unknown as TFunction;
const snapshot = buildWidgetSnapshot({
  progress: { title: "Progress", summary: "2 of 5", deepLink: "munib-tracker://tracker" },
});

describe("syncTvHomeSurfaces", () => {
  const onPlatform = usePlatformSwitch();
  beforeEach(() => jest.clearAllMocks());

  it("does nothing off TV", async () => {
    onPlatform({ OS: "android", isTV: false });
    expect(await syncTvHomeSurfaces(snapshot, t)).toBeNull();
    expect(mockNative.publishTvHomeChannel).not.toHaveBeenCalled();
  });

  it("publishes the launcher channel on Android TV with localized labels", async () => {
    onPlatform({ OS: "android", isTV: true, constants: { Manufacturer: "Google", Model: "G" } });

    expect(await syncTvHomeSurfaces(snapshot, t)).toBe("channel");
    const payload = JSON.parse(mockNative.publishTvHomeChannel.mock.calls[0][0]);
    expect(payload).toMatchObject({ channelName: "t:common.appName", appLink: "munib-tracker://" });
    expect(payload.sections[0].title).toBe("t:common.today");
  });

  it("skips Fire TV — its launcher has no app channels", async () => {
    onPlatform({
      OS: "android",
      isTV: true,
      constants: { Manufacturer: "Amazon", Model: "AFTKA" },
    });

    expect(await syncTvHomeSurfaces(snapshot, t)).toBeNull();
    expect(mockNative.publishTvHomeChannel).not.toHaveBeenCalled();
  });

  it("writes the Top Shelf payload to the shared App Group on Apple TV", async () => {
    onPlatform({ OS: "ios", isTV: true });

    expect(await syncTvHomeSurfaces(snapshot, t)).toBe("topShelf");
    expect(mockNative.publishTopShelf).toHaveBeenCalledWith(expect.any(String), WIDGET_APP_GROUP);
  });

  it("reports nothing when the native side declines (no App Group / no extension)", async () => {
    onPlatform({ OS: "ios", isTV: true });
    mockNative.publishTopShelf.mockResolvedValueOnce(false);

    expect(await syncTvHomeSurfaces(snapshot, t)).toBeNull();
  });
});
