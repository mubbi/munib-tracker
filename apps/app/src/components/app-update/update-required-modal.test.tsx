import { fireEvent, screen } from "@testing-library/react-native";

import { UpdateRequiredModal } from "@/components/app-update/update-required-modal";
import { buildAppVersionMeta } from "@/test-support/fixtures/app-version";
import {
  mockAppUpdateActions,
  resetAppUpdateActionsMock,
} from "@/test-support/mocks/app-update-actions";
import { mockAppVersion, resetAppVersionMock } from "@/test-support/mocks/app-version-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock(
  "@/providers/app-version-provider",
  () => require("@/test-support/mocks/app-version-provider").appVersionProviderMock,
);
jest.mock(
  "@/lib/app/app-update-actions",
  () => require("@/test-support/mocks/app-update-actions").appUpdateActionsMock,
);

type Props = Parameters<typeof UpdateRequiredModal>[0];

async function renderModal(overrides: Partial<Props> = {}) {
  await renderWithTheme(
    <UpdateRequiredModal visible meta={buildAppVersionMeta()} isHard={false} {...overrides} />,
  );
}

describe("UpdateRequiredModal", () => {
  beforeEach(() => {
    resetAppVersionMock();
    resetAppUpdateActionsMock();
  });

  it("renders nothing while hidden", async () => {
    await renderModal({ visible: false });
    expect(screen.queryByText("Update available")).toBeNull();
  });

  it("shows a soft update with the version jump", async () => {
    await renderModal();
    expect(screen.getByText("New version")).toBeTruthy();
    expect(screen.getByText("v1.0.0")).toBeTruthy();
    expect(screen.getByText("v1.2.0")).toBeTruthy();
    expect(screen.getByText(/Version 1.2.0 is ready/)).toBeTruthy();
  });

  it("updates through the app-update action", async () => {
    await renderModal();
    await fireEvent.press(screen.getByText("Update now"));
    expect(mockAppUpdateActions.performAppUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ latestVersion: "1.2.0" }),
      expect.objectContaining({ isHard: false }),
    );
  });

  it.each(["Remind me in Settings", "Close"])("dismisses via %s", async (label) => {
    await renderModal();
    await fireEvent.press(
      label === "Close" ? screen.getByLabelText(label) : screen.getByText(label),
    );
    expect(mockAppVersion.dismissUpdatePrompt).toHaveBeenCalled();
  });

  it("dismisses when the sheet closes", async () => {
    await renderModal();
    await fireEvent.press(screen.getByTestId("sheet-close"));
    expect(mockAppVersion.dismissUpdatePrompt).toHaveBeenCalled();
  });

  it("shows a full-screen hard update without a dismiss option", async () => {
    mockAppVersion.clientVersion = "1.2.0";
    await renderModal({ isHard: true });
    expect(screen.getByText("Update required")).toBeTruthy();
    expect(screen.getByText("This update is required to continue.")).toBeTruthy();
    expect(screen.queryByText("Remind me in Settings")).toBeNull();
    expect(screen.queryByText("v1.2.0")).toBeNull();
  });

  it("prefers the server message", async () => {
    await renderModal({
      meta: buildAppVersionMeta({ message: "Critical fix" }),
      presentation: "fullscreen",
    });
    expect(screen.getByText("Critical fix")).toBeTruthy();
  });

  it.each([
    [false, /Reload to get the latest version/],
    [true, /force-refresh the page/],
  ])("offers a reload on web (hard=%s)", async (isHard, hint) => {
    mockAppUpdateActions.web = true;
    await renderModal({ isHard });
    expect(screen.getByText("Reload")).toBeTruthy();
    expect(screen.getByText(hint)).toBeTruthy();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("tags the hard-update root for the web lock", async () => {
      await renderModal({ isHard: true });
      expect(screen.getByText("Update required")).toBeTruthy();
    });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("drops the invisible close target", async () => {
      await renderModal();
      expect(screen.queryByLabelText("Close")).toBeNull();
      expect(screen.getByText("Update now")).toBeTruthy();
    });
  });
});
