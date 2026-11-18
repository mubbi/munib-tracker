import { act, fireEvent, screen } from "@testing-library/react-native";

import { BrandQrCode } from "@/components/share/brand-qr-code";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

let mockCachedUri: string | null = null;
const mockDataUri = jest.fn(async (..._args: unknown[]) => "data:image/png;base64,QR");

jest.mock("react-native-qrcode-styled", () => {
  const { View } = require("react-native");
  return {
    __esModule: true,
    default: (props: { data: string; logo?: unknown }) => (
      <View testID="qr-styled" accessibilityHint={props.logo ? "logo" : "plain"} />
    ),
  };
});
jest.mock("@/lib/share/brandQrDataUri", () => ({
  getCachedBrandQrDataUri: () => mockCachedUri,
  brandQrDataUri: (...args: unknown[]) => mockDataUri(...args),
}));

const LABEL = "Scan to open";

describe("BrandQrCode (native)", () => {
  it("renders the styled QR with a logo at large sizes", async () => {
    await renderWithTheme(<BrandQrCode data="https://x" size={400} accessibilityLabel={LABEL} />);
    expect(screen.getByTestId("qr-styled").props.accessibilityHint).toBe("logo");
  });

  it("can drop the logo", async () => {
    await renderWithTheme(<BrandQrCode data="https://x" includeLogo={false} />);
    expect(screen.getByTestId("qr-styled").props.accessibilityHint).toBe("plain");
  });

  it("reports ready once on layout", async () => {
    const onReady = jest.fn();
    await renderWithTheme(
      <BrandQrCode data="https://x" accessibilityLabel={LABEL} onReady={onReady} />,
    );
    await fireEvent(screen.getByLabelText(LABEL), "layout");
    await fireEvent(screen.getByLabelText(LABEL), "layout");
    expect(onReady).toHaveBeenCalledTimes(1);
  });
});

describe("BrandQrCode (web)", () => {
  usePlatform({ OS: "web" });

  beforeEach(() => {
    mockCachedUri = null;
    mockDataUri.mockClear();
  });

  it("uses a cached data URI immediately", async () => {
    mockCachedUri = "data:cached";
    await renderWithTheme(<BrandQrCode data="https://x" accessibilityLabel={LABEL} />);
    expect(mockDataUri).not.toHaveBeenCalled();
    expect(screen.getByLabelText(LABEL)).toBeTruthy();
  });

  it("generates the data URI and reports ready after the image loads", async () => {
    jest.useFakeTimers();
    const onReady = jest.fn();
    await renderWithTheme(
      <BrandQrCode
        data="https://x"
        size={180}
        padding={6}
        accessibilityLabel={LABEL}
        onReady={onReady}
      />,
    );
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockDataUri).toHaveBeenCalledWith("https://x", 180, 3);
    const image = screen.getByLabelText(LABEL).children[0] as Parameters<typeof fireEvent>[0];
    await fireEvent(image, "load");
    await fireEvent(image, "load");
    await act(async () => jest.runAllTimers());
    expect(onReady).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });

  it("ignores a data URI that resolves after unmount", async () => {
    let resolveUri: (uri: string) => void = () => {};
    mockDataUri.mockReturnValueOnce(
      new Promise<string>((resolve) => {
        resolveUri = resolve;
      }),
    );
    const utils = await renderWithTheme(<BrandQrCode data="https://y" />);
    await utils.unmount();
    await act(async () => resolveUri("data:late"));
    expect(mockDataUri).toHaveBeenCalledTimes(1);
  });
});
