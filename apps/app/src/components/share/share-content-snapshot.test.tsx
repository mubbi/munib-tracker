import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ShareContentSnapshot } from "@/components/share/share-content-snapshot";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/components/share/brand-qr-code",
  () => require("@/test-support/mocks/brand-qr-code").brandQrCodeMock,
);

async function renderSnapshot(contentLabel?: string) {
  const onQrReady = jest.fn();
  await renderWithTheme(
    <ShareContentSnapshot
      frameWidth={390}
      sectionTitle="Morning adhkar"
      contentLabel={contentLabel}
      exportedAtLabel="18 Nov 2026"
      onQrReady={onQrReady}
    >
      <Text>body</Text>
    </ShareContentSnapshot>,
  );
  return onQrReady;
}

describe("ShareContentSnapshot", () => {
  it("frames the content with the brand header, section title and footer", async () => {
    await renderSnapshot("Dua 12");
    expect(screen.getByText("Munib Tracker")).toBeTruthy();
    expect(screen.getByText(/Track Your Journey Back to Allah/)).toBeTruthy();
    expect(screen.getByText("Morning adhkar")).toBeTruthy();
    expect(screen.getByText("body")).toBeTruthy();
    expect(screen.getByText("Dua 12")).toBeTruthy();
    expect(screen.getByText("Shared · 18 Nov 2026")).toBeTruthy();
  });

  it("shows download QR codes for every store and reports them ready", async () => {
    const onQrReady = await renderSnapshot();
    expect(screen.getByLabelText("QR code — download on the App Store")).toBeTruthy();
    expect(screen.getByLabelText("QR code — get it on Google Play")).toBeTruthy();
    expect(screen.getByLabelText("QR code — open the web app")).toBeTruthy();
    expect(onQrReady).toHaveBeenCalledTimes(3);
  });

  it("shows the visit link and verification notice", async () => {
    await renderSnapshot();
    expect(screen.getByText(/^OR visit: /)).toBeTruthy();
    expect(screen.getByText(/please verify religious content/)).toBeTruthy();
  });
});
