import { render } from "@testing-library/react-native";

import { WebPwaBootstrap } from "@/components/pwa/web-pwa-bootstrap";
import { usePlatform } from "@/test-support/platform";

const mockRegister = jest.fn();

jest.mock("@/lib/pwa/register-service-worker", () => ({
  registerWebPwaServiceWorker: () => mockRegister(),
}));

describe("WebPwaBootstrap", () => {
  beforeEach(() => mockRegister.mockClear());

  it("does nothing on native", async () => {
    await render(<WebPwaBootstrap />);
    expect(mockRegister).not.toHaveBeenCalled();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("registers the service worker once", async () => {
      await render(<WebPwaBootstrap />);
      expect(mockRegister).toHaveBeenCalledTimes(1);
    });
  });
});
