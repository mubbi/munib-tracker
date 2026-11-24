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
});
