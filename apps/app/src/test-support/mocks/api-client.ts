/**
 * `@munib-tracker/api-client` with the real helpers (`ApiError`, `getApiBaseUrl`
 * …) but a controllable `apiFetch`:
 *
 *   jest.mock("@munib-tracker/api-client", () => require("@/test-support/mocks/api-client").apiClientMock);
 *   import { mockApiFetch } from "@/test-support/mocks/api-client";
 *   beforeEach(() => mockApiFetch.mockReset().mockResolvedValue({}));
 */

export const mockApiFetch = jest.fn();

export const apiClientMock = {
  ...jest.requireActual("@munib-tracker/api-client"),
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
};
