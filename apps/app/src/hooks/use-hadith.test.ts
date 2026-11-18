import { renderHook } from "@testing-library/react-native";

import { fetchRemoteCollection } from "@/api/hadith-remote";
import { queryOptionsOf } from "@/test-support/mocks/tanstack-query";
import { resetPreferences, setPreferences } from "@/test-support/preferences";

import { useRemoteCollection } from "./use-hadith";

jest.mock(
  "@tanstack/react-query",
  () => require("@/test-support/mocks/tanstack-query").tanstackQueryOptionsMock,
);
jest.mock("@/api/hadith-remote", () => ({ fetchRemoteCollection: jest.fn() }));

afterEach(resetPreferences);

describe("useRemoteCollection", () => {
  it("keys the collection by translation locale and fetches it", async () => {
    await setPreferences({ translationLocale: "ur" });
    const { result } = await renderHook(() => useRemoteCollection("bukhari"));
    const options = queryOptionsOf(result.current);
    expect(options.queryKey).toEqual(["hadith-collection", "bukhari", "ur"]);
    expect(options.enabled).toBe(true);
    await options.queryFn();
    expect(fetchRemoteCollection).toHaveBeenCalledWith("bukhari");
  });

  it("is disabled without a collection", async () => {
    const { result } = await renderHook(() => useRemoteCollection(null));
    expect(queryOptionsOf(result.current).enabled).toBe(false);
  });
});
