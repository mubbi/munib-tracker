import { ShareQrWarmup } from "@/components/share/share-qr-warmup";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

const mockWarm = jest.fn(async (..._args: unknown[]) => undefined);

jest.mock("@/lib/share/brandQrDataUri", () => ({
  warmBrandQrDataUris: (...args: unknown[]) => mockWarm(...args),
}));

describe("ShareQrWarmup", () => {
  beforeEach(() => mockWarm.mockClear());

  it("does nothing on native", async () => {
    await renderWithTheme(<ShareQrWarmup />);
    expect(mockWarm).not.toHaveBeenCalled();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("pre-generates the three store QR codes", async () => {
      await renderWithTheme(<ShareQrWarmup />);
      expect(mockWarm).toHaveBeenCalledWith(
        [expect.any(String), expect.any(String), expect.any(String)],
        expect.any(Number),
        expect.any(Number),
      );
    });
  });
});
