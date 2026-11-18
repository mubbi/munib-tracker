import QRCode from "qrcode";

import { brandQrDataUri, getCachedBrandQrDataUri, warmBrandQrDataUris } from "./brandQrDataUri";

jest.mock("qrcode", () => ({
  toDataURL: jest.fn(async (data: string) => `data:image/png;base64,${data}`),
}));

const toDataURL = QRCode.toDataURL as jest.Mock;

describe("brand QR data URIs", () => {
  it("renders once and serves later calls from the cache", async () => {
    expect(getCachedBrandQrDataUri("https://a", 100)).toBeNull();
    const uri = await brandQrDataUri("https://a", 100);
    expect(uri).toBe("data:image/png;base64,https://a");
    expect(await brandQrDataUri("https://a", 100)).toBe(uri);
    expect(toDataURL).toHaveBeenCalledTimes(1);
    expect(getCachedBrandQrDataUri("https://a", 100)).toBe(uri);
  });

  it("keys the cache by size and margin", async () => {
    await brandQrDataUri("https://b", 100, 4);
    expect(getCachedBrandQrDataUri("https://b", 100)).toBeNull();
    expect(toDataURL).toHaveBeenLastCalledWith(
      "https://b",
      expect.objectContaining({ width: 100, margin: 4 }),
    );
  });

  it("warms several URLs", async () => {
    await warmBrandQrDataUris(["https://c", "https://d"], 80);
    expect(getCachedBrandQrDataUri("https://c", 80)).not.toBeNull();
    expect(getCachedBrandQrDataUri("https://d", 80)).not.toBeNull();
  });
});
