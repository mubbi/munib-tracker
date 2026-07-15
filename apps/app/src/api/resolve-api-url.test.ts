import { resolveApiUrl } from "@munib-tracker/api-client";

describe("resolveApiUrl", () => {
  const prev = process.env.EXPO_PUBLIC_API_URL;

  beforeAll(() => {
    process.env.EXPO_PUBLIC_API_URL = "https://api.munibtracker.app/api/v1";
  });

  afterAll(() => {
    if (prev === undefined) {
      delete process.env.EXPO_PUBLIC_API_URL;
    } else {
      process.env.EXPO_PUBLIC_API_URL = prev;
    }
  });

  it("joins short hand-written paths", () => {
    expect(resolveApiUrl("/notifications/in-app")).toBe(
      "https://api.munibtracker.app/api/v1/notifications/in-app",
    );
  });

  it("strips duplicate /api/v1 from Orval paths", () => {
    expect(resolveApiUrl("/api/v1/app-feedback")).toBe(
      "https://api.munibtracker.app/api/v1/app-feedback",
    );
    expect(resolveApiUrl("/api/v1/oss-content-failures")).toBe(
      "https://api.munibtracker.app/api/v1/oss-content-failures",
    );
  });

  it("passes through absolute URLs", () => {
    expect(resolveApiUrl("https://cdn.example/x")).toBe("https://cdn.example/x");
  });
});
