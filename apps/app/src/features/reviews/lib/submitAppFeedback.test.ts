import { submitReviewFeedback } from "@/features/reviews/lib/submitAppFeedback";

const mockSubmit = jest.fn(async (..._args: unknown[]) => undefined);
const mockEnv = {
  platform: "ios",
  session: null as { accessToken?: string } | null,
};

jest.mock("@munib-tracker/api-client", () => ({
  appFeedbackControllerSubmit: (...args: unknown[]) => mockSubmit(...args),
}));

jest.mock("@/auth/session-store", () => ({
  SessionStore: { get: async () => mockEnv.session },
}));

jest.mock("@/lib/app/resolve-app-platform", () => ({
  resolveAppPlatform: () => mockEnv.platform,
}));

jest.mock("@/lib/app/resolve-app-version", () => ({
  resolveAppVersion: () => "9.9.9",
}));

jest.mock("@/api/auth-options", () => ({
  apiAuthOptions: (token: string) => ({ accessToken: token }),
}));

function setup(env: Partial<typeof mockEnv> = {}, message = "") {
  Object.assign(mockEnv, { platform: "ios", session: { accessToken: "tok" } }, env);
  return submitReviewFeedback({ rating: 3, message, triggerId: "perfect_day", locale: "ar" });
}

describe("submitReviewFeedback", () => {
  beforeEach(() => {
    mockSubmit.mockClear();
  });

  it.each([
    ["an unsupported platform", { platform: "tvos" }, "supported platform"],
    ["a missing session", { session: null }, "active session"],
    ["a session without a token", { session: {} }, "active session"],
  ])("rejects with %s", async (_label, env, message) => {
    await expect(setup(env)).rejects.toThrow(message);
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it.each(["ios", "android", "web"])("posts feedback on %s", async (platform) => {
    await setup({ platform });
    expect(mockSubmit).toHaveBeenCalledWith(
      {
        rating: 3,
        message: undefined,
        source: "in_app_review",
        triggerId: "perfect_day",
        appVersion: "9.9.9",
        platform,
        locale: "ar",
      },
      { accessToken: "tok" },
    );
  });

  it("forwards a non-empty message", async () => {
    await setup({}, "bad");
    expect(mockSubmit.mock.calls[0]?.[0]).toMatchObject({ message: "bad" });
  });
});
