import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { claimTvPairing } from "@/api/endpoints";
import TvPairScreen from "@/app/tv-pair";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { resetExpoRouterMock, setMockSearchParams } from "@/test-support/mocks/expo-router";
import { renderWithTheme } from "@/test-support/render";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock("@/api/endpoints", () => ({ claimTvPairing: jest.fn(() => Promise.resolve()) }));
jest.mock("@/components/auth/social-login-buttons", () => ({ SocialLoginButtons: () => null }));
jest.mock("@/lib/platform/is-tv", () => ({ isTV: jest.fn(() => false) }));

const claim = claimTvPairing as jest.MockedFunction<typeof claimTvPairing>;

beforeEach(() => {
  resetExpoRouterMock();
  resetAuthMock();
  claim.mockClear();
  setMockSearchParams({ code: "ab12-cd" });
});

describe("TV pairing claim (phone)", () => {
  it("never claims just because a signed-in user opened the link", async () => {
    setMockAuth({ session: { accessToken: "tok" }, isAuthenticated: true, isGuest: false });
    await renderWithTheme(<TvPairScreen />);
    await waitFor(() => expect(screen.getByRole("button", { name: "Sign in on TV" })).toBeTruthy());
    expect(claim).not.toHaveBeenCalled();
  });

  it("claims the normalized code after the user confirms", async () => {
    setMockAuth({ session: { accessToken: "tok" }, isAuthenticated: true, isGuest: false });
    await renderWithTheme(<TvPairScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Sign in on TV" }));
    await waitFor(() => expect(claim).toHaveBeenCalledWith("tok", "AB12CD"));
    expect(claim).toHaveBeenCalledTimes(1);
  });

  it("offers no confirm button to guests", async () => {
    setMockAuth({ session: { accessToken: "guest" }, isAuthenticated: true, isGuest: true });
    await renderWithTheme(<TvPairScreen />);
    expect(screen.queryByRole("button", { name: "Sign in on TV" })).toBeNull();
    expect(claim).not.toHaveBeenCalled();
  });

  it("says the missing code once and offers a way home (D-35)", async () => {
    setMockSearchParams({});
    await renderWithTheme(<TvPairScreen />);
    expect(screen.getAllByText("This link has no pairing code")).toHaveLength(1);
    expect(
      screen.getByText("Scan the code on your TV again with this phone's camera."),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Go home" })).toBeTruthy();
  });

  it("shows a retry after a failed claim for a linked account", async () => {
    setMockAuth({ session: { accessToken: "tok" }, isAuthenticated: true, isGuest: false });
    claim.mockRejectedValueOnce(new Error("nope"));
    await renderWithTheme(<TvPairScreen />);
    await fireEvent.press(screen.getByRole("button", { name: "Sign in on TV" }));
    await waitFor(() => expect(screen.getByRole("button", { name: "Try again" })).toBeTruthy());
    await fireEvent.press(screen.getByRole("button", { name: "Try again" }));
    await waitFor(() => expect(claim).toHaveBeenCalledTimes(2));
  });

  it("gives guests one message and no doomed Retry", async () => {
    setMockAuth({ session: { accessToken: "guest" }, isAuthenticated: true, isGuest: true });
    await renderWithTheme(<TvPairScreen />);
    expect(screen.getAllByText(/guest accounts can't link a TV/)).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Try again" })).toBeNull();
  });
});
