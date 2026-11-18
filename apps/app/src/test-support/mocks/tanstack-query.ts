/**
 * `@tanstack/react-query` whose `useQuery` returns the options it was given, so
 * query-hook tests can assert keys / `enabled` and run `queryFn` directly without
 * a QueryClient:
 *
 *   jest.mock("@tanstack/react-query", () => require("@/test-support/mocks/tanstack-query").tanstackQueryOptionsMock);
 *   import { queryOptionsOf } from "@/test-support/mocks/tanstack-query";
 *   const options = queryOptionsOf((await renderHook(() => useFoo(1))).result.current);
 */
export type CapturedQueryOptions = {
  queryKey: unknown[];
  queryFn: () => Promise<unknown>;
  enabled?: boolean;
  [key: string]: unknown;
};

export const tanstackQueryOptionsMock = {
  __esModule: true,
  useQuery: jest.fn((options: CapturedQueryOptions) => ({ options })),
};

/** The options a mocked `useQuery` captured, from a query hook's return value. */
export function queryOptionsOf(result: unknown): CapturedQueryOptions {
  return (result as { options: CapturedQueryOptions }).options;
}
