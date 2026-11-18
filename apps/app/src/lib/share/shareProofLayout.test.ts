import {
  BRAND_QR_SURFACE,
  brandQrContainerStyle,
  brandQrIncludesLogo,
  brandQrOuterEyesOptions,
} from "./brandQrConfig";
import { contentShareFilename } from "./shareFilename";
import {
  computeShareProofQrSize,
  formatShareExportStamp,
  SHARE_PROOF_QR_MAX,
  SHARE_PROOF_QR_MIN,
} from "./shareProofLayout";

jest.mock("expo-crypto", () => ({ getRandomBytes: () => new Uint8Array([0, 15, 171, 255]) }));

describe("computeShareProofQrSize", () => {
  it.each([
    [200, SHARE_PROOF_QR_MIN],
    [400, 101],
    [1000, SHARE_PROOF_QR_MAX],
  ])("frame %i → %i", (width, expected) => {
    expect(computeShareProofQrSize(width)).toBe(expected);
  });
});

describe("formatShareExportStamp", () => {
  it("formats the current time", () => {
    expect(formatShareExportStamp()).toEqual(expect.any(String));
    expect(formatShareExportStamp().length).toBeGreaterThan(5);
  });
});

describe("brand QR config", () => {
  it("includes the logo only on larger QRs", () => {
    expect(brandQrIncludesLogo(104)).toBe(true);
    expect(brandQrIncludesLogo(103)).toBe(false);
  });

  it("builds container and eye styles", () => {
    expect(brandQrContainerStyle(120)).toMatchObject({
      width: 120,
      height: 120,
      backgroundColor: BRAND_QR_SURFACE,
    });
    expect(brandQrOuterEyesOptions("#123456")).toEqual({ borderRadius: 12, color: "#123456" });
  });
});

describe("contentShareFilename", () => {
  it("uses a random hex nonce by default", () => {
    expect(contentShareFilename("dua")).toBe("munib-tracker-dua-000fabff.png");
  });

  it("accepts an explicit slug and nonce", () => {
    expect(contentShareFilename(undefined, "abc")).toBe("munib-tracker-content-abc.png");
  });
});
