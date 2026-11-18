import type { Request, Response } from "express";
import { type Mock, vi } from "vitest";

/** Bearer header + bare token used by controller specs. */
export const TEST_ACCESS_TOKEN = "tok";
export const TEST_BEARER = `Bearer ${TEST_ACCESS_TOKEN}`;

export type RequestOverrides = {
  headers?: Record<string, string | string[] | undefined>;
  cookies?: Record<string, string>;
  body?: unknown;
  ip?: string;
  socket?: { remoteAddress?: string };
};

/** Minimal Express request (headers + cookies) for controllers and cookie helpers. */
export function buildRequest(overrides: RequestOverrides = {}): Request {
  return { headers: {}, cookies: {}, ...overrides } as unknown as Request;
}

export type MockResponse = Response & {
  cookie: Mock;
  clearCookie: Mock;
  redirect: Mock;
  status: Mock;
  json: Mock;
  send: Mock;
  setHeader: Mock;
  /** Headers recorded via `setHeader` (lower-cased names). */
  headers: Map<string, string>;
};

/** Express response whose writer methods are spies; `status()` chains like Express. */
export function buildResponse(): MockResponse {
  const headers = new Map<string, string>();
  const res = {
    headers,
    cookie: vi.fn(),
    clearCookie: vi.fn(),
    redirect: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
    setHeader: vi.fn((name: string, value: unknown) => {
      headers.set(name.toLowerCase(), String(value));
    }),
    status: vi.fn(),
  };
  res.status.mockReturnValue(res);
  return res as unknown as MockResponse;
}
