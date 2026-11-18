import { screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { AppVersionGate } from "@/components/app-update/app-version-gate";
import { buildAppVersionMeta } from "@/test-support/fixtures/app-version";
import { mockAppVersion, resetAppVersionMock } from "@/test-support/mocks/app-version-provider";
import { renderWithTheme } from "@/test-support/render";

const mockPinLock = { isLocked: false, isReady: true };
const mockHardLock = jest.fn();

jest.mock(
  "@/providers/app-version-provider",
  () => require("@/test-support/mocks/app-version-provider").appVersionProviderMock,
);
jest.mock("@/features/pin-lock", () => ({ usePinLock: () => mockPinLock }));
jest.mock("@/hooks/use-hard-update-web-lock", () => ({
  useHardUpdateWebLock: (active: boolean) => mockHardLock(active),
}));
jest.mock("@/components/app-update/update-required-modal", () => {
  const { Text: MockText } = require("react-native");
  return {
    UpdateRequiredModal: ({ isHard }: { isHard: boolean }) => (
      <MockText>{isHard ? "hard-modal" : "soft-modal"}</MockText>
    ),
  };
});

async function renderGate() {
  await renderWithTheme(
    <AppVersionGate>
      <Text>app</Text>
    </AppVersionGate>,
  );
}

describe("AppVersionGate", () => {
  beforeEach(() => {
    resetAppVersionMock();
    mockHardLock.mockClear();
    Object.assign(mockPinLock, { isLocked: false, isReady: true });
  });

  it("renders the app without any update prompt", async () => {
    await renderGate();
    expect(screen.getByText("app")).toBeTruthy();
    expect(screen.queryByText(/modal/)).toBeNull();
  });

  it("overlays the soft update prompt", async () => {
    Object.assign(mockAppVersion, {
      showUpdateModal: true,
      versionMeta: buildAppVersionMeta(),
      updateRequired: "soft",
    });
    await renderGate();
    expect(screen.getByText("app")).toBeTruthy();
    expect(screen.getByText("soft-modal")).toBeTruthy();
  });

  it("does not overlay a soft prompt flagged hard", async () => {
    Object.assign(mockAppVersion, {
      showUpdateModal: true,
      versionMeta: buildAppVersionMeta(),
      updateRequired: "hard",
    });
    await renderGate();
    expect(screen.queryByText("soft-modal")).toBeNull();
  });

  it("hides the soft prompt while the PIN lock is up", async () => {
    mockPinLock.isLocked = true;
    Object.assign(mockAppVersion, { showUpdateModal: true, versionMeta: buildAppVersionMeta() });
    await renderGate();
    expect(screen.queryByText("soft-modal")).toBeNull();
  });

  it("replaces the app with the hard update block", async () => {
    Object.assign(mockAppVersion, {
      isHardUpdateBlocking: true,
      versionMeta: buildAppVersionMeta({ updateRequired: "hard" }),
    });
    await renderGate();
    expect(screen.queryByText("app")).toBeNull();
    expect(screen.getByText("hard-modal")).toBeTruthy();
    expect(mockHardLock).toHaveBeenCalledWith(true);
  });

  it("keeps the PIN lock in front of a hard update", async () => {
    mockPinLock.isLocked = true;
    Object.assign(mockAppVersion, {
      isHardUpdateBlocking: true,
      versionMeta: buildAppVersionMeta({ updateRequired: "hard" }),
    });
    await renderGate();
    expect(screen.getByText("app")).toBeTruthy();
    expect(screen.queryByText("hard-modal")).toBeNull();
  });
});
