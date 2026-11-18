import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, screen } from "@testing-library/react-native";

import { IosPwaInstallBanner } from "@/components/pwa/ios-pwa-install-banner";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockShow = true;
let mockNeedsSafari = false;

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/lib/pwa/ios-install", () => ({
  shouldShowIosPwaInstallBanner: () => mockShow,
  getIosPwaInstallNeedsSafari: () => mockNeedsSafari,
}));

const TITLE = "Install the web app first";
const writeText = jest.fn(async (_text: string) => undefined);

async function renderBanner() {
  await renderWithTheme(<IosPwaInstallBanner />);
  await act(async () => {
    await Promise.resolve();
  });
}

describe("IosPwaInstallBanner", () => {
  beforeEach(async () => {
    mockShow = true;
    mockNeedsSafari = false;
    resetToastMock();
    writeText.mockReset();
    await AsyncStorage.clear();
  });

  it("never shows on native", async () => {
    await renderBanner();
    expect(screen.queryByText(TITLE)).toBeNull();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    beforeEach(() => {
      Object.assign(globalThis, {
        navigator: { clipboard: { writeText } },
        window: Object.assign(globalThis.window ?? {}, { location: { href: "https://app/x" } }),
      });
    });

    it("shows Safari install steps", async () => {
      await renderBanner();
      expect(screen.getByText(TITLE)).toBeTruthy();
      expect(screen.getByText(/In Safari: Share/)).toBeTruthy();
      expect(screen.queryByText("Copy link for Safari")).toBeNull();
    });

    it("stays hidden when not applicable", async () => {
      mockShow = false;
      await renderBanner();
      expect(screen.queryByText(TITLE)).toBeNull();
    });

    it("remembers a dismissal", async () => {
      await renderBanner();
      await fireEvent.press(screen.getByLabelText("Dismiss"));
      expect(screen.queryByText(TITLE)).toBeNull();
      expect(await AsyncStorage.getItem("pwa_ios_install_banner_dismissed_v1")).toBe("1");
    });

    it("stays hidden after a previous dismissal", async () => {
      await AsyncStorage.setItem("pwa_ios_install_banner_dismissed_v1", "1");
      await renderBanner();
      expect(screen.queryByText(TITLE)).toBeNull();
    });

    it("copies the page link for other iOS browsers", async () => {
      mockNeedsSafari = true;
      await renderBanner();
      await fireEvent.press(screen.getByText("Copy link for Safari"));
      await act(async () => {
        await Promise.resolve();
      });
      expect(writeText).toHaveBeenCalledWith("https://app/x");
      expect(mockToast.info).toHaveBeenCalledWith(
        "Copy link for Safari",
        expect.stringContaining("Link copied"),
      );
    });

    it("reports a failed copy", async () => {
      mockNeedsSafari = true;
      writeText.mockRejectedValue(new Error("denied"));
      await renderBanner();
      await fireEvent.press(screen.getByText("Copy link for Safari"));
      await act(async () => {
        await Promise.resolve();
      });
      expect(mockToast.error).toHaveBeenCalledWith(
        "Copy link for Safari",
        "Could not copy the link. Open this page in Safari manually.",
      );
    });
  });
});
