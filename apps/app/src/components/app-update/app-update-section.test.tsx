import { fireEvent, screen } from "@testing-library/react-native";

import { AppUpdateSection } from "@/components/app-update/app-update-section";
import { buildAppVersionMeta } from "@/test-support/fixtures/app-version";
import {
  mockAppUpdateActions,
  resetAppUpdateActionsMock,
} from "@/test-support/mocks/app-update-actions";
import { mockAppVersion, resetAppVersionMock } from "@/test-support/mocks/app-version-provider";
import { resetMockWindowSize, setMockWindowSize } from "@/test-support/mocks/use-window-dimensions";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native/Libraries/Utilities/useWindowDimensions",
  () => require("@/test-support/mocks/use-window-dimensions").useWindowDimensionsMock,
);
jest.mock(
  "@/providers/app-version-provider",
  () => require("@/test-support/mocks/app-version-provider").appVersionProviderMock,
);
jest.mock(
  "@/lib/app/app-update-actions",
  () => require("@/test-support/mocks/app-update-actions").appUpdateActionsMock,
);

function pendingUpdate(overrides: Parameters<typeof buildAppVersionMeta>[0] = {}) {
  Object.assign(mockAppVersion, {
    versionMeta: buildAppVersionMeta(overrides),
    hasPendingUpdate: true,
    updatePromptDismissed: true,
  });
}

describe("AppUpdateSection", () => {
  beforeEach(() => {
    resetAppVersionMock();
    resetAppUpdateActionsMock();
  });
  afterEach(resetMockWindowSize);

  it("renders nothing without a pending update", async () => {
    await renderWithTheme(<AppUpdateSection />);
    expect(screen.queryByText("App update")).toBeNull();
  });

  it("waits until a soft prompt was dismissed", async () => {
    pendingUpdate();
    mockAppVersion.updatePromptDismissed = false;
    await renderWithTheme(<AppUpdateSection />);
    expect(screen.queryByText("App update")).toBeNull();
  });

  it("offers a soft update and its details", async () => {
    pendingUpdate();
    await renderWithTheme(<AppUpdateSection />);
    expect(screen.getByText("Update available")).toBeTruthy();
    await fireEvent.press(screen.getByText("View details"));
    expect(mockAppVersion.openUpdatePrompt).toHaveBeenCalled();
    await fireEvent.press(screen.getByText("Update now"));
    expect(mockAppUpdateActions.performAppUpdate).toHaveBeenCalled();
  });

  it("shows a hard update with the server message side by side on wide screens", async () => {
    setMockWindowSize(1200);
    pendingUpdate({ updateRequired: "hard", message: "Security fix" });
    await renderWithTheme(<AppUpdateSection />);
    expect(screen.getByText("Update required")).toBeTruthy();
    expect(screen.getByText("Security fix")).toBeTruthy();
    expect(screen.queryByText("View details")).toBeNull();
  });

  it.each([
    ["soft", /Reload to get the latest version/],
    ["hard", /force-refresh the page/],
  ] as const)("shows the web %s reload hint", async (updateRequired, hint) => {
    mockAppUpdateActions.web = true;
    pendingUpdate({ updateRequired });
    await renderWithTheme(<AppUpdateSection />);
    expect(screen.getByText("Reload")).toBeTruthy();
    expect(screen.getByText(hint)).toBeTruthy();
  });
});
