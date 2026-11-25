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

  it("never renders the raw error message (D-01)", async () => {
    mockSocial.signIn.mockRejectedValue(new Error("Account disabled"));
    await renderButtons();
    await pressProvider("Continue with Apple");
    expect(screen.queryByText("Account disabled")).toBeNull();
    expect(screen.getByText(i18n.t("login.error"))).toBeTruthy();
    expect(screen.queryByText(/API server/)).toBeNull();
  });

  it("maps a not-configured provider to the catalog string", async () => {
    mockSocial.signIn.mockRejectedValue(new Error("Google sign-in is not configured yet."));
    await renderButtons();
    await pressProvider("Continue with Google");
    expect(screen.queryByText("Google sign-in is not configured yet.")).toBeNull();
    expect(screen.getByText(i18n.t("login.errorProviderUnavailable"))).toBeTruthy();
  });

  it.each([
    ["Sign-in is not ready yet; try again.", "login.errorNotReady"],
    ["Network request failed", "login.errorOffline"],
  ])("maps %s to %s", async (message, key) => {
    mockSocial.signIn.mockRejectedValue(new Error(message));
    await renderButtons();
    await pressProvider("Continue with Facebook");
    expect(screen.getByText(i18n.t(key))).toBeTruthy();
  });

  it("falls back to a generic error and retries the same provider", async () => {
    mockSocial.signIn.mockRejectedValueOnce("nope");
    await renderButtons();
    await pressProvider("Continue with Facebook");
    expect(screen.getByText(i18n.t("login.error"))).toBeTruthy();
    await fireEvent.press(screen.getByText(i18n.t("common.tryAgain")));
    await act(async () => {
      await Promise.resolve();
    });
    expect(mockSocial.signIn).toHaveBeenLastCalledWith("facebook", { returnTo: "/profile" });
    expect(screen.queryByText(i18n.t("login.error"))).toBeNull();
  });

  it("dims and disables the other providers while one connects (D-22)", async () => {
    mockSocial.busy = "google";
    await renderButtons();
    expect(screen.getByLabelText("Continue with Apple").props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, busy: false }),
    );
    expect(screen.getByLabelText("Continue with Google").props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true, busy: true }),
    );
  });

  it("disables buttons and shows a spinner while busy", async () => {
    mockSocial.busy = "google";
    await renderButtons();
    await fireEvent.press(screen.getByLabelText("Continue with Apple"));
    expect(mockSocial.signIn).not.toHaveBeenCalled();
  });
});
