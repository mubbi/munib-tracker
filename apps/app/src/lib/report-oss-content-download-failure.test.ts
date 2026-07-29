import { beforeEach, describe, expect, it } from "@jest/globals";

import {
  classifyFetchError,
  clearOssContentFailureDedupe,
  httpStatusFromMessage,
} from "./report-oss-content-download-failure";

describe("report-oss-content-download-failure helpers", () => {
  beforeEach(() => {
    clearOssContentFailureDedupe();
  });

  it("parses HTTP status from fetchStaticJson messages", () => {
    expect(httpStatusFromMessage("HTTP 404 for https://cdn.example.com/x.json")).toBe(404);
    expect(httpStatusFromMessage("network down")).toBeUndefined();
  });

  it("classifies http vs network failures", () => {
    expect(classifyFetchError(new Error("HTTP 503 for https://cdn.example.com/x.json"))).toEqual({
      errorCode: "http_error",
      errorMessage: "HTTP 503 for https://cdn.example.com/x.json",
      httpStatus: 503,
    });
    expect(classifyFetchError(new Error("Failed to fetch"))).toMatchObject({
      errorCode: "network_error",
    });
  });
});
