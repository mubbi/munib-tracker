/** Minimal `Response`-shaped object covering what app code reads from fetch results. */
export type FakeResponse = {
  ok: boolean;
  status: number;
  headers: { get: (name: string) => string | null };
  json: () => Promise<unknown>;
  text: () => Promise<string>;
  arrayBuffer: () => Promise<ArrayBuffer>;
};

/** Builds a fake fetch `Response`. Non-string bodies are served as JSON. */
export function fakeResponse(
  body: unknown = {},
  { status = 200, headers = {} }: { status?: number; headers?: Record<string, string> } = {},
): FakeResponse {
  const text = typeof body === "string" ? body : JSON.stringify(body);
  const lowerHeaders = Object.fromEntries(
    Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]),
  );
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: (name) => lowerHeaders[name.toLowerCase()] ?? null },
    json: async () => (typeof body === "string" ? JSON.parse(body) : body),
    text: async () => text,
    arrayBuffer: async () => new TextEncoder().encode(text).buffer as ArrayBuffer,
  };
}

type FetchReply = FakeResponse | Error;

/**
 * Installs a `global.fetch` mock that answers with `replies` in order (the
 * last reply repeats). An `Error` reply rejects, modelling a network failure.
 * `jest.setup.ts` reinstalls the rejecting no-network default per test file
 * (`no-network.ts`), so an unmocked call fails the test.
 *
 * @example const fetchMock = mockFetch(fakeResponse({ ok: 1 }), new Error("offline"));
 */
export function mockFetch(...replies: FetchReply[]): jest.Mock {
  const queue = replies.length > 0 ? replies : [fakeResponse()];
  let call = 0;
  const mock = jest.fn(async () => {
    const reply = queue[Math.min(call++, queue.length - 1)];
    if (reply instanceof Error) throw reply;
    return reply;
  });
  globalThis.fetch = mock as unknown as typeof fetch;
  return mock;
}

/**
 * Installs a `global.fetch` mock that answers by URL: the first `routes` key
 * contained in the requested URL wins. Unmatched URLs get a 404. Use when calls
 * run in parallel and reply order is not deterministic.
 *
 * @example mockFetchByUrl({ "eng-bukhari": fakeResponse(eng), "ara-bukhari": new Error("offline") });
 */
export function mockFetchByUrl(routes: Record<string, FetchReply>): jest.Mock {
  const mock = jest.fn(async (input: unknown) => {
    const url = String(input);
    const key = Object.keys(routes).find((fragment) => url.includes(fragment));
    const reply = key ? routes[key] : fakeResponse({ message: "not found" }, { status: 404 });
    if (reply instanceof Error) throw reply;
    return reply;
  });
  globalThis.fetch = mock as unknown as typeof fetch;
  return mock;
}
