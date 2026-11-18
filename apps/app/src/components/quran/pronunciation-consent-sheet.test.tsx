import { fireEvent, screen } from "@testing-library/react-native";

import { PronunciationConsentSheet } from "@/components/quran/pronunciation-consent-sheet";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

async function renderSheet(visible = true) {
  const props = { visible, onAgree: jest.fn(), onClose: jest.fn() };
  await renderWithTheme(<PronunciationConsentSheet {...props} />);
  return props;
}

describe("PronunciationConsentSheet", () => {
  it("renders nothing while hidden", async () => {
    await renderSheet(false);
    expect(screen.queryByText("Before you set it up")).toBeNull();
  });

  it("explains the download, activation and on-device processing", async () => {
    await renderSheet();
    expect(screen.getByText("Before you set it up")).toBeTruthy();
    expect(screen.getByText(/about 57 MB from Quran Lab/)).toBeTruthy();
    expect(screen.getByText(/contacts Quran Lab once to activate it/)).toBeTruthy();
    expect(screen.getByText("Your recitation is processed on this device.")).toBeTruthy();
  });

  it("agrees", async () => {
    const props = await renderSheet();
    await fireEvent.press(screen.getByText("Agree and download"));
    expect(props.onAgree).toHaveBeenCalledTimes(1);
  });

  it("declines with Not now", async () => {
    const props = await renderSheet();
    await fireEvent.press(screen.getByText("Not now"));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });
});
