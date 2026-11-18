import { act, renderHook } from "@testing-library/react-native";

import { pickKnowledgeCard } from "@/lib/knowledge-card";
import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";

import { useKnowledgeCard } from "./use-knowledge-card";

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock("@/lib/knowledge-card", () => ({ pickKnowledgeCard: jest.fn() }));

const pickMock = pickKnowledgeCard as jest.Mock;
let appState: ReturnType<typeof captureAppStateListener>;

function card(key: string) {
  return {
    key,
    kind: "ayah",
    topic: "patience",
    titleKey: "x",
    body: key,
    icon: {},
    palette: "accent",
  };
}

async function setup() {
  const hook = await renderHook(() => useKnowledgeCard());
  await act(async () => {
    await Promise.resolve();
  });
  return hook;
}

beforeEach(() => {
  jest.clearAllMocks();
  let n = 0;
  pickMock.mockImplementation(async () => card(`card-${++n}`));
  appState = captureAppStateListener();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useKnowledgeCard", () => {
  it("shows a fallback until the first card resolves", async () => {
    const pending = deferred<ReturnType<typeof card>>();
    pickMock.mockReturnValueOnce(pending.promise);
    const { result } = await renderHook(() => useKnowledgeCard());
    expect(result.current.card.key).toBe("fallback");
    await act(async () => pending.resolve(card("first")));
    expect(result.current.card.key).toBe("first");
  });

  it("picks a new card on refresh", async () => {
    const { result } = await setup();
    expect(result.current.card.key).toBe("card-1");
    await act(async () => result.current.refresh());
    expect(result.current.card.key).toBe("card-2");
  });

  it("picks a new card when the app returns to the foreground", async () => {
    const { result } = await setup();
    await act(async () => appState.emit("background"));
    expect(result.current.card.key).toBe("card-1");
    await act(async () => appState.emit("active"));
    expect(result.current.card.key).toBe("card-2");
  });

  it("ignores a card that resolves after unmount", async () => {
    const pending = deferred<ReturnType<typeof card>>();
    pickMock.mockReturnValueOnce(pending.promise);
    const { result, unmount } = await renderHook(() => useKnowledgeCard());
    await unmount();
    await act(async () => pending.resolve(card("late")));
    expect(result.current.card.key).toBe("fallback");
    const subscription = appState.spy.mock.results[0].value as { remove: jest.Mock };
    expect(subscription.remove).toHaveBeenCalled();
  });
});
