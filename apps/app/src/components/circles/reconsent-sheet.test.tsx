import { act, fireEvent, screen } from "@testing-library/react-native";

import i18n from "@/i18n";
import { makeChildProfile } from "@/test-support/circles";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { createQueryWrapper } from "@/test-support/nearby";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);
jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock("@/lib/circles/api", () => ({
  ...jest.requireActual("@/lib/circles/api"),
  confirmChildConsent: jest.fn(async () => undefined),
  deleteChild: jest.fn(async () => undefined),
}));

import * as api from "@/lib/circles/api";

import { ReconsentSheet } from "./reconsent-sheet";

const t = i18n.t.bind(i18n);

beforeEach(() => {
  resetAuthMock();
  setMockAuth({
    session: { accessToken: "tok", userId: "u-1" },
    isAuthenticated: true,
    isGuest: false,
  });
  jest.mocked(api.deleteChild).mockClear();
});

async function renderSheet() {
  const onDone = jest.fn();
  const { QueryWrapper } = createQueryWrapper();
  await renderWithTheme(
    <QueryWrapper>
      <ReconsentSheet
        circleId="c-1"
        pending={[makeChildProfile({ consentPending: true })]}
        onDone={onDone}
      />
    </QueryWrapper>,
  );
  return { onDone };
}

describe("ReconsentSheet (D34)", () => {
  it("deleting the transferred profiles needs a second, explicit tap", async () => {
    const { onDone } = await renderSheet();
    await act(async () => {
      fireEvent.press(screen.getByText(t("family.reconsent.delete")));
    });
    expect(api.deleteChild).not.toHaveBeenCalled();
    expect(screen.getByText(t("family.reconsent.deleteConfirm"))).toBeTruthy();

    await act(async () => {
      fireEvent.press(screen.getByText(t("family.reconsent.delete")));
    });
    expect(api.deleteChild).toHaveBeenCalledWith("tok", "c-1", "child-1");
    expect(onDone).toHaveBeenCalled();
  });

  it("cancel steps back without deleting", async () => {
    await renderSheet();
    await act(async () => {
      fireEvent.press(screen.getByText(t("family.reconsent.delete")));
    });
    await act(async () => {
      fireEvent.press(screen.getByText(t("common.cancel")));
    });
    expect(screen.queryByText(t("family.reconsent.deleteConfirm"))).toBeNull();
    expect(api.deleteChild).not.toHaveBeenCalled();
  });
});
