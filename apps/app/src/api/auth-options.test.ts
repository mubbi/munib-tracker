import { apiAuthHeaders, apiAuthOptions, WEB_COOKIE_SESSION_TOKEN } from "@/api/auth-options";

describe("apiAuthOptions", () => {
  it("omits accessToken for cookie sessions", () => {
    expect(apiAuthOptions(WEB_COOKIE_SESSION_TOKEN)).toEqual({});
    expect(apiAuthOptions(undefined)).toEqual({});
  });

  it("passes through real JWTs", () => {
    expect(apiAuthOptions("real-jwt")).toEqual({ accessToken: "real-jwt" });
  });
});

describe("apiAuthHeaders", () => {
  it("omits Authorization for cookie sessions", () => {
    expect(apiAuthHeaders(WEB_COOKIE_SESSION_TOKEN)).toBeUndefined();
    expect(apiAuthHeaders(undefined)).toBeUndefined();
  });

  it("sets Bearer for real JWTs", () => {
    expect(apiAuthHeaders("real-jwt")).toEqual({ Authorization: "Bearer real-jwt" });
  });
});
