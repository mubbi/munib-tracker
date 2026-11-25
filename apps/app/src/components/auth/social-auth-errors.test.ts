import { OAUTH_CANCELLED } from "@/hooks/use-social-auth";

import { oauthReturnErrorKey, socialAuthErrorKey } from "./social-auth-errors";

jest.mock("@/hooks/use-social-auth", () => ({ OAUTH_CANCELLED: "oauth-cancelled" }));

/** Same shape as `ApiError` from `@munib-tracker/api-client`. */
function apiError(message: string, status: number) {
  return Object.assign(new Error(message), { name: "ApiError", status });
}

describe("socialAuthErrorKey", () => {
  it("stays silent when the person dismissed the provider", () => {
    expect(socialAuthErrorKey(new Error(OAUTH_CANCELLED))).toBeNull();
  });

  it("maps client-side failures", () => {
    expect(socialAuthErrorKey(new Error("Google sign-in is not configured yet."))).toBe(
      "login.errorProviderUnavailable",
    );
    expect(socialAuthErrorKey(new Error("Sign-in lost PKCE verifier; try again."))).toBe(
      "login.errorNotReady",
    );
    expect(socialAuthErrorKey(new TypeError("Network request failed"))).toBe("login.errorOffline");
  });

  it("maps API failures by status, never showing the raw server message", () => {
    expect(socialAuthErrorKey(apiError("Too many OAuth attempts", 429))).toBe(
      "login.errorRateLimited",
    );
    expect(socialAuthErrorKey(apiError("Invalid Google token", 401))).toBe("login.errorRejected");
    expect(socialAuthErrorKey(apiError("Request failed with status 503", 503))).toBe(
      "login.errorServer",
    );
    expect(socialAuthErrorKey(apiError("This account has been closed", 400))).toBe(
      "login.errorAccountClosed",
    );
    expect(socialAuthErrorKey(apiError("Apple sign-in session expired. Try again.", 400))).toBe(
      "login.errorOAuthReturn",
    );
    expect(socialAuthErrorKey(apiError("Bad request", 400))).toBe("login.error");
  });

  it("falls back to the generic line for anything else", () => {
    expect(socialAuthErrorKey(new Error("boom"))).toBe("login.error");
    expect(socialAuthErrorKey(undefined)).toBe("login.error");
  });
});

describe("oauthReturnErrorKey", () => {
  it("maps the return route's ?error=", () => {
    expect(oauthReturnErrorKey(undefined)).toBeNull();
    expect(oauthReturnErrorKey("oauth_failed")).toBe("login.errorOAuthReturn");
    expect(oauthReturnErrorKey(["other"])).toBe("login.error");
  });
});
