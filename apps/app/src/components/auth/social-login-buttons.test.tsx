import { act, fireEvent, screen } from "@testing-library/react-native";

import { SocialLoginButtons } from "@/components/auth/social-login-buttons";
import i18n from "@/i18n";
import { setMockPathname } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

const mockSocial = {
  signIn: jest.fn(async (..._args: unknown[]) => undefined),
  busy: null as string | null,
  googleConfigured: true,
  appleConfigured: true,
  facebookConfigured: true,
};

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/hooks/use-social-auth", () => ({
  OAUTH_CANCELLED: "oauth_cancelled",
  useSocialAuth: () => mockSocial,
}));

async function renderButtons() {
  const onSuccess = jest.fn();
  await renderWithTheme(<SocialLoginButtons onSuccess={onSuccess} />);
  return onSuccess;
}

async function pressProvider(label: string) {
  await fireEvent.press(screen.getByLabelText(label));
  await act(async () => {
    await Promise.resolve();
  });
}

describe("SocialLoginButtons", () => {
  beforeEach(() => {
    Object.assign(mockSocial, {
      busy: null,
      googleConfigured: true,
      appleConfigured: true,
      facebookConfigured: true,
    });
    mockSocial.signIn.mockReset();
    mockSocial.signIn.mockResolvedValue(undefined);
    setMockPathname("/profile");
  });

  it("explains when no provider is configured", async () => {
    Object.assign(mockSocial, {
      googleConfigured: false,
      appleConfigured: false,
      facebookConfigured: false,
    });
    await renderButtons();
    expect(screen.queryAllByRole("button")).toHaveLength(0);
    expect(screen.getByText(i18n.t("login.providersUnavailableTitle"))).toBeTruthy();
  });

  it("lists only configured providers", async () => {
    mockSocial.appleConfigured = false;
    await renderButtons();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("signs in and returns to the current route", async () => {
    const onSuccess = await renderButtons();
    await pressProvider("Continue with Google");
    expect(mockSocial.signIn).toHaveBeenCalledWith("google", { returnTo: "/profile" });
    expect(onSuccess).toHaveBeenCalled();
  });

  it("stays quiet when the user cancels", async () => {
    mockSocial.signIn.mockRejectedValue(new Error("oauth_cancelled"));
    const onSuccess = await renderButtons();
    await pressProvider("Continue with Google");
    expect(onSuccess).not.toHaveBeenCalled();
    expect(screen.queryByText("oauth_cancelled")).toBeNull();
  });

  it("shows the provider error message", async () => {
    mockSocial.signIn.mockRejectedValue(new Error("Account disabled"));
    await renderButtons();
    await pressProvider("Continue with Apple");
    expect(screen.getByText("Account disabled")).toBeTruthy();
  });

  it("falls back to a generic error", async () => {
    mockSocial.signIn.mockRejectedValue("nope");
    await renderButtons();
    await pressProvider("Continue with Facebook");
    expect(screen.getByText(/Couldn't sign in/)).toBeTruthy();
  });

  it("disables buttons and shows a spinner while busy", async () => {
    mockSocial.busy = "google";
    await renderButtons();
    await fireEvent.press(screen.getByLabelText("Continue with Apple"));
    expect(mockSocial.signIn).not.toHaveBeenCalled();
  });
});
