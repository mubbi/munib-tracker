import {
  ACCOUNT_CLOSURE_DETAILS_MAX,
  buildDeleteAccountRequest,
  isAccountClosureConfirmed,
} from "@/lib/auth/account-closure-reasons";

describe("isAccountClosureConfirmed", () => {
  it("needs the typed word (trimmed), the acknowledgement and a reason", () => {
    expect(isAccountClosureConfirmed(" DELETE ", true, "other")).toBe(true);
    expect(isAccountClosureConfirmed("delete", true, "other")).toBe(false);
    expect(isAccountClosureConfirmed("DELETE", false, "other")).toBe(false);
    expect(isAccountClosureConfirmed("DELETE", true, null)).toBe(false);
  });
});

describe("buildDeleteAccountRequest", () => {
  it("omits blank details", () => {
    expect(buildDeleteAccountRequest("not_using", "   ")).toEqual({
      confirmation: "DELETE",
      primaryReason: "not_using",
    });
  });

  it("trims details and caps them at the API limit", () => {
    expect(buildDeleteAccountRequest("other", "  too slow  ").details).toBe("too slow");
    const long = "x".repeat(ACCOUNT_CLOSURE_DETAILS_MAX + 20);
    expect(buildDeleteAccountRequest("other", long).details).toHaveLength(500);
  });
});
