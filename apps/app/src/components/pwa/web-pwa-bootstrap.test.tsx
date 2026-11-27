import { render } from "@testing-library/react-native";

import { WebPwaBootstrap } from "@/components/pwa/web-pwa-bootstrap";
import { usePlatform } from "@/test-support/platform";

const mockRegister = jest.fn();
const mockListen = jest.fn();
const mockStopListening = jest.fn();
const mockPersist = jest.fn(async () => true);

jest.mock("@/lib/pwa/register-service-worker", () => ({
  registerWebPwaServiceWorker: () => mockRegister(),
}));
jest.mock("@/lib/pwa/storage-persistence", () => ({
  requestPersistentStorage: () => mockPersist(),
}));
jest.mock("@/components/pwa/install-prompt-store", () => ({
  listenForInstallPrompt: () => {
    mockListen();
    return mockStopListening;
  },
}));

describe("WebPwaBootstrap", () => {
  beforeEach(() => {
    mockRegister.mockClear();
    mockListen.mockClear();
    mockStopListening.mockClear();
    mockPersist.mockClear();
  });

  it("does nothing on native", async () => {
    await render(<WebPwaBootstrap />);
    expect(mockRegister).not.toHaveBeenCalled();
    expect(mockListen).not.toHaveBeenCalled();
    expect(mockPersist).not.toHaveBeenCalled();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("registers the service worker once", async () => {
      await render(<WebPwaBootstrap />);
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });

    it("asks the browser to keep the app's storage", async () => {
      await render(<WebPwaBootstrap />);
      expect(mockPersist).toHaveBeenCalledTimes(1);
    });

    it("captures the install prompt until unmount", async () => {
      const view = await render(<WebPwaBootstrap />);
      expect(mockListen).toHaveBeenCalledTimes(1);
      await view.unmount();
      expect(mockStopListening).toHaveBeenCalledTimes(1);
    });
  });
});
