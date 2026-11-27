import {
  APP_FEEDBACK_TRIGGER_IDS,
  REVIEW_PROMPT_SETTLE_MS,
  REVIEW_SESSION_IDLE_MINUTES,
} from "@munib-tracker/shared/reviews";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { AppState, Pressable, Text } from "react-native";
import {
  ReviewPromptProvider,
  useReviewPrompt,
} from "@/features/reviews/context/ReviewPromptContext";
import {
  loadReviewGating,
  resetReviewGatingCache,
  updateReviewGating,
} from "@/features/reviews/lib/reviewGatingStore";
import { invokeOpenWriteReview } from "@/features/reviews/lib/reviewPromptBridge";
import {
  clearPendingReviewTrigger,
  emitReviewTrigger,
  flushReviewTriggerForRoute,
} from "@/features/reviews/lib/reviewTriggerBus";
import { captureAppStateListener } from "@/test-support/app-state";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";

jest.unmock("@/features/reviews/context/ReviewPromptContext");

const mockEnv = {
  blocked: false,
  online: true,
  gateAllowed: true,
  storeAvailable: true,
  requestOk: true,
  writeReviewOk: true,
  canWriteReview: true,
};
const mockStore = {
  request: jest.fn(async () => mockEnv.requestOk),
  openWriteReview: jest.fn(async (_options?: unknown) => mockEnv.writeReviewOk),
};
const mockGate = jest.fn((..._args: unknown[]) =>
  mockEnv.gateAllowed ? { allowed: true } : { allowed: false, reason: "min_sessions" },
);
const mockSubmit = jest.fn(async (_params: unknown) => undefined);

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

jest.mock("@/features/reviews/hooks/useReviewPromptBlocked", () => ({
  useReviewPromptBlocked: () => mockEnv.blocked,
}));

jest.mock("@/hooks/use-is-online", () => ({
  useIsOnline: () => mockEnv.online,
}));

jest.mock("@/features/reviews/lib/reviewGating", () => ({
  ...jest.requireActual("@/features/reviews/lib/reviewGating"),
  canRequestAutomaticReview: (...args: unknown[]) => mockGate(...args),
}));

jest.mock("@/lib/platform/storeReview", () => ({
  canOpenStoreWriteReview: () => mockEnv.canWriteReview,
  isStoreReviewAvailable: async () => mockEnv.storeAvailable,
  requestNativeStoreReview: () => mockStore.request(),
  openStoreWriteReview: (options?: unknown) => mockStore.openWriteReview(options),
}));

jest.mock("@/lib/achievements-persistence", () => ({
  readPersistedAchievementIds: async () => ["first-salah"],
}));

jest.mock("@/lib/app/resolve-app-version", () => ({
  resolveAppVersion: () => "2.4.0",
}));

jest.mock("@/stores/preferences-store", () => ({
  usePreferences: () => ({ hasCompletedOnboarding: true }),
  usePreferencesReady: () => true,
}));

jest.mock("@/stores/tracker-store", () => ({ trackerStore: {} }));
jest.mock("@/stores/create-store", () => ({
  useStore: (_store: unknown, select: (s: unknown) => unknown) =>
    select({ achievementStats: { prayersCompleted: 12, streak: 4 } }),
}));

jest.mock("@/features/reviews/lib/submitAppFeedback", () => ({
  submitReviewFeedback: (params: unknown) => mockSubmit(params),
}));

/** Sheet stand-in that exposes its props as text and submit as a button. */
jest.mock("@/features/reviews/components/AppFeedbackSheet", () => {
  const { Pressable: P, Text: T, View } = require("react-native");
  return {
    AppFeedbackSheet: (props: {
      visible: boolean;
      onClose: () => void;
      onSubmit: (rating: number, message: string) => Promise<void>;
      offline: boolean;
      error: string | null;
    }) => (
      <View>
        <T testID="sheet-visible">{String(props.visible)}</T>
        <T testID="sheet-offline">{String(props.offline)}</T>
        <T testID="sheet-error">{props.error ?? ""}</T>
        <P
          testID="sheet-submit"
          onPress={() => {
            props.onSubmit(5, "msg").then(props.onClose, () => {});
          }}
        />
        <P testID="sheet-close" onPress={props.onClose} />
      </View>
    ),
  };
});

function Consumer() {
  const { canWriteReview, openWriteReview, openFeedback } = useReviewPrompt();
  return (
    <>
      <Text testID="can-write">{String(canWriteReview)}</Text>
      <Pressable testID="rate" onPress={() => void openWriteReview()} />
      <Pressable testID="feedback" onPress={openFeedback} />
    </>
  );
}

async function settle() {
  await act(async () => {
    for (let i = 0; i < 10; i += 1) await Promise.resolve();
  });
}

async function setup(env: Partial<typeof mockEnv> = {}) {
  Object.assign(mockEnv, env);
  const appState = captureAppStateListener();
  const utils = await render(
    <ReviewPromptProvider>
      <Consumer />
    </ReviewPromptProvider>,
  );
  await settle();
  return { ...utils, appState };
}

async function press(testID: string) {
  await fireEvent.press(screen.getByTestId(testID));
  await settle();
}

/** Emits a value moment, flushes it on the tracker and runs the settle delay. */
async function valueMoment(advanceMs = REVIEW_PROMPT_SETTLE_MS) {
  await act(async () => {
    emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.perfect_day, { deferRoute: "tracker" });
    flushReviewTriggerForRoute("tracker");
  });
  await act(async () => {
    jest.advanceTimersByTime(advanceMs);
  });
  await settle();
}

const textOf = (testID: string) => screen.getByTestId(testID).props.children;
const originalCurrentState = AppState.currentState;

describe("ReviewPromptProvider", () => {
  beforeEach(async () => {
    jest.useFakeTimers();
    Object.assign(mockEnv, {
      blocked: false,
      online: true,
      gateAllowed: true,
      storeAvailable: true,
      requestOk: true,
      writeReviewOk: true,
      canWriteReview: true,
    });
    await AsyncStorage.clear();
    resetReviewGatingCache();
    resetToastMock();
    mockStore.request.mockClear();
    mockStore.openWriteReview.mockClear();
    mockGate.mockClear();
    mockSubmit.mockReset().mockResolvedValue(undefined);
    clearPendingReviewTrigger();
    // The RN jest preset mocks `currentState`; the provider reads it as the real string.
    Object.defineProperty(AppState, "currentState", {
      value: "active",
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    Object.defineProperty(AppState, "currentState", {
      value: originalCurrentState,
      configurable: true,
      writable: true,
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  describe("sessions", () => {
    it("records a new session on mount", async () => {
      await setup();
      expect((await loadReviewGating()).sessionCount).toBe(1);
    });

    it("starts a new session when the app returns after the idle window", async () => {
      const { appState } = await setup();
      const idleMs = REVIEW_SESSION_IDLE_MINUTES * 60 * 1000;
      await updateReviewGating((s) => ({
        ...s,
        lastForegroundAt: new Date(Date.now() - idleMs - 1000).toISOString(),
      }));
      await act(async () => appState.emit("active"));
      await settle();
      expect((await loadReviewGating()).sessionCount).toBe(2);
    });
  });

  describe("automatic OS review", () => {
    it("requests the OS sheet after the settle delay and records it", async () => {
      await setup();
      await valueMoment(REVIEW_PROMPT_SETTLE_MS - 1);
      expect(mockStore.request).not.toHaveBeenCalled();
      await act(async () => {
        jest.advanceTimersByTime(1);
      });
      await settle();
      expect(mockStore.request).toHaveBeenCalledTimes(1);
      const state = await loadReviewGating();
      expect(state.promptCountLifetime).toBe(1);
      expect(state.lastPromptedVersion).toBe("2.4.0");
    });

    it("passes live usage to the gate", async () => {
      await setup();
      await valueMoment();
      expect(mockGate).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          prayersLogged: 12,
          currentStreak: 4,
          achievementsUnlocked: 1,
          hasCompletedOnboarding: true,
          appVersion: "2.4.0",
        }),
      );
    });

    it("never shows a custom sheet first", async () => {
      await setup();
      await valueMoment();
      expect(textOf("sheet-visible")).toBe("false");
    });

    it.each<[string, Partial<typeof mockEnv>]>([
      ["the gate refuses", { gateAllowed: false }],
      ["the OS review API is unavailable", { storeAvailable: false }],
    ])("does nothing when %s", async (_label, env) => {
      await setup(env);
      await valueMoment();
      expect(mockStore.request).not.toHaveBeenCalled();
      expect((await loadReviewGating()).promptCountLifetime).toBe(0);
    });

    it("does not count a request the OS rejected", async () => {
      await setup({ requestOk: false });
      await valueMoment();
      expect(mockStore.request).toHaveBeenCalledTimes(1);
      expect((await loadReviewGating()).promptCountLifetime).toBe(0);
    });

    it("cancels when the app leaves the foreground during the delay", async () => {
      const { appState } = await setup();
      await act(async () => {
        emitReviewTrigger(APP_FEEDBACK_TRIGGER_IDS.perfect_day);
        flushReviewTriggerForRoute("tracker");
      });
      await act(async () => appState.emit("background"));
      await act(async () => {
        jest.advanceTimersByTime(REVIEW_PROMPT_SETTLE_MS);
      });
      await settle();
      expect(mockStore.request).not.toHaveBeenCalled();
    });

    it("keeps a blocked moment for the next focus instead of showing on unblock", async () => {
      const { rerender } = await setup({ blocked: true });
      await valueMoment();
      expect(mockStore.request).not.toHaveBeenCalled();

      mockEnv.blocked = false;
      await rerender(
        <ReviewPromptProvider>
          <Consumer />
        </ReviewPromptProvider>,
      );
      await act(async () => {
        jest.advanceTimersByTime(REVIEW_PROMPT_SETTLE_MS);
      });
      await settle();
      expect(mockStore.request).not.toHaveBeenCalled();

      await act(async () => flushReviewTriggerForRoute("tracker"));
      await act(async () => {
        jest.advanceTimersByTime(REVIEW_PROMPT_SETTLE_MS);
      });
      await settle();
      expect(mockStore.request).toHaveBeenCalledTimes(1);
    });

    it("holds off while the feedback sheet is open", async () => {
      await setup();
      await press("feedback");
      await valueMoment();
      expect(mockStore.request).not.toHaveBeenCalled();
    });
  });

  describe("Rate (write a review)", () => {
    it.each([true, false])("exposes canWriteReview = %s", async (canWriteReview) => {
      await setup({ canWriteReview });
      expect(textOf("can-write")).toBe(String(canWriteReview));
    });

    it("opens the store page with the UI locale and never the OS sheet", async () => {
      await setup();
      await press("rate");
      expect(mockStore.openWriteReview).toHaveBeenCalledWith({ locale: "en" });
      expect(mockStore.request).not.toHaveBeenCalled();
      expect((await loadReviewGating()).lastWriteReviewOpenedAt).not.toBeNull();
    });

    it("tells the person when the store can't open", async () => {
      await setup({ writeReviewOk: false });
      await press("rate");
      expect(mockToast.error).toHaveBeenCalledTimes(1);
      expect((await loadReviewGating()).lastWriteReviewOpenedAt).toBeNull();
    });

    it("serves the open-review deep link", async () => {
      await setup();
      await act(async () => {
        expect(invokeOpenWriteReview()).toBe(true);
      });
      await settle();
      expect(mockStore.openWriteReview).toHaveBeenCalledTimes(1);
    });
  });

  describe("Send feedback", () => {
    it("opens the sheet with the connectivity state", async () => {
      await setup({ online: false });
      await press("feedback");
      expect(textOf("sheet-visible")).toBe("true");
      expect(textOf("sheet-offline")).toBe("true");
    });

    it("submits as manual feedback, thanks the person and closes", async () => {
      await setup();
      await press("feedback");
      await press("sheet-submit");
      expect(mockSubmit).toHaveBeenCalledWith({
        rating: 5,
        message: "msg",
        triggerId: APP_FEEDBACK_TRIGGER_IDS.manual,
        locale: "en",
      });
      expect(mockToast.success).toHaveBeenCalledTimes(1);
      expect(textOf("sheet-visible")).toBe("false");
      expect((await loadReviewGating()).lastFeedbackSentAt).not.toBeNull();
    });

    it("shows an error and stays open when sending fails", async () => {
      mockSubmit.mockRejectedValue(new Error("offline"));
      await setup();
      await press("feedback");
      await press("sheet-submit");
      expect(textOf("sheet-error")).not.toBe("");
      expect(textOf("sheet-visible")).toBe("true");
      expect(mockToast.success).not.toHaveBeenCalled();
    });
  });
});
