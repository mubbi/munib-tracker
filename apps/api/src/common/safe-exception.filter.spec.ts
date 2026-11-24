import { type ArgumentsHost, BadRequestException, HttpStatus, Logger } from "@nestjs/common";
import { afterEach, describe, expect, it, vi } from "vitest";

import { errorClassName, routeTemplate, SafeExceptionFilter } from "./safe-exception.filter";

class QueryFailedError extends Error {}

function hostFor(req: Record<string, unknown>, headersSent = false) {
  const json = vi.fn();
  const res = { headersSent, status: vi.fn(() => res), json };
  const host = {
    getType: () => "http",
    switchToHttp: () => ({ getResponse: () => res, getRequest: () => req }),
  } as unknown as ArgumentsHost;
  return { host, res, json };
}

const REQ = {
  method: "POST",
  url: "/api/v1/sync/push?email=someone@example.com",
  route: { path: "/api/v1/sync/push" },
  ip: "203.0.113.9",
  body: { changes: [{ data: { note: "private reflection" } }] },
};

afterEach(() => vi.restoreAllMocks());

describe("SafeExceptionFilter", () => {
  it("logs only the error class, method, route template and status for unknown errors", () => {
    const error = vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    const { host, res, json } = hostFor(REQ);

    new SafeExceptionFilter().catch(
      new QueryFailedError("duplicate key value (email)=(someone@example.com)"),
      host,
    );

    expect(error).toHaveBeenCalledTimes(1);
    const logged = error.mock.calls.flat().join(" ");
    expect(logged).toBe("QueryFailedError POST /api/v1/sync/push 500");
    for (const secret of ["someone@example.com", "203.0.113.9", "private reflection", "email="]) {
      expect(logged).not.toContain(secret);
    }
    expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(json).toHaveBeenCalledWith({ statusCode: 500, message: "Internal server error" });
  });

  it("keeps HttpException responses and doesn't log 4xx", () => {
    const error = vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    const { host, res, json } = hostFor(REQ);

    new SafeExceptionFilter().catch(new BadRequestException("deviceId is too short"), host);

    expect(error).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 400, message: "deviceId is too short" }),
    );
  });

  it("doesn't write a second response once headers are sent", () => {
    vi.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    const { host, json } = hostFor(REQ, true);
    new SafeExceptionFilter().catch(new Error("late"), host);
    expect(json).not.toHaveBeenCalled();
  });

  it("names unmatched routes and non-Error throws without echoing them", () => {
    expect(routeTemplate({ method: "GET", route: undefined } as never)).toBe("(unmatched route)");
    expect(errorClassName("secret string")).toBe("string");
    expect(errorClassName(new TypeError("x"))).toBe("TypeError");
  });
});
