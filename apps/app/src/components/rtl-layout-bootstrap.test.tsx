import { render } from "@testing-library/react-native";

import { RtlLayoutBootstrap } from "@/components/rtl-layout-bootstrap";
import { consumePendingRtlReloadLocale } from "@/i18n";
import { applyRtlForLocale } from "@/lib/i18n/rtl";
import { runWhenIdle } from "@/lib/run-when-idle";
import { usePlatform } from "@/test-support/platform";

jest.mock("@/i18n", () => ({ consumePendingRtlReloadLocale: jest.fn(() => null) }));
jest.mock("@/lib/i18n/rtl", () => ({ applyRtlForLocale: jest.fn(async () => {}) }));
jest.mock("@/lib/run-when-idle", () => ({ runWhenIdle: jest.fn() }));

const cancel = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(runWhenIdle).mockImplementation((task) => {
    task();
    return { cancel };
  });
});

describe("RtlLayoutBootstrap", () => {
  it("does nothing without a pending RTL reload", async () => {
    await render(<RtlLayoutBootstrap />);

    expect(applyRtlForLocale).not.toHaveBeenCalled();
  });

  it("applies the pending locale's layout once idle", async () => {
    jest.mocked(consumePendingRtlReloadLocale).mockReturnValue("ar");
    await render(<RtlLayoutBootstrap />);

    expect(applyRtlForLocale).toHaveBeenCalledWith("ar");
  });

  it("cancels the idle reload on unmount", async () => {
    jest.mocked(consumePendingRtlReloadLocale).mockReturnValue("ur");
    const { unmount } = await render(<RtlLayoutBootstrap />);

    await unmount();

    expect(cancel).toHaveBeenCalled();
  });
});

describe("RtlLayoutBootstrap on web", () => {
  usePlatform({ OS: "web" });

  it("never reloads natively", async () => {
    jest.mocked(consumePendingRtlReloadLocale).mockReturnValue("ar");
    await render(<RtlLayoutBootstrap />);

    expect(consumePendingRtlReloadLocale).not.toHaveBeenCalled();
  });
});
