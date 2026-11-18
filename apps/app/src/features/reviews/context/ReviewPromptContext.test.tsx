import { APP_FEEDBACK_TRIGGER_IDS } from "@munib-tracker/shared/reviews";
import { act, fireEvent, render, renderHook, screen } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";
import {
  ReviewPromptProvider,
  useReviewPrompt,
} from "@/features/reviews/context/ReviewPromptContext";
import {
  invokeOpenReviewFunnel,
  type ReviewFunnelTriggerId,
} from "@/features/reviews/lib/reviewPromptBridge";
import { EMPTY_REVIEW_GATING, type ReviewGatingState } from "@/features/reviews/lib/reviewStorage";
import {
  clearPendingReviewTrigger,
  flushReviewTriggerForRoute,
} from "@/features/reviews/lib/reviewTriggerBus";
import { captureAppStateListener } from "@/test-support/app-state";
import { deferred } from "@/test-support/async";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";

jest.unmock("@/features/reviews/context/ReviewPromptContext");

const mockEnv = {
  stored: null as ReviewGatingState | null,
  writes: [] as ReviewGatingState[],
  readGating: null as (() => Promise<ReviewGatingState>) | null,
  persistedTrigger: null as string | null,
  blocked: false,
  online: true,
  manualAllowed: true,
  autoAllowed: true,
};
const mockSubmit = jest.fn(async (_params: unknown) => undefined);

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);

jest.mock("@/features/reviews/lib/reviewStorage", () => {
  const actual = jest.requireActual("@/features/reviews/lib/reviewStorage");
  return {
    ...actual,
    readReviewGating: () =>
      mockEnv.readGating?.() ??
      Promise.resolve({ ...(mockEnv.stored ?? actual.EMPTY_REVIEW_GATING) }),
    writeReviewGating: async (state: ReviewGatingState) => {
      mockEnv.stored = state;
      mockEnv.writes.push(state);
    },
  };
});

jest.mock("@/features/reviews/lib/reviewPendingTrigger", () => ({
  dequeuePersistedReviewTrigger: async () => mockEnv.persistedTrigger,
}));

jest.mock("@/features/reviews/lib/reviewGating", () => ({
  ...jest.requireActual("@/features/reviews/lib/reviewGating"),
  canShowManualReviewPrompt: () => ({ allowed: mockEnv.manualAllowed }),
  canShowReviewPrompt: () => ({ allowed: mockEnv.autoAllowed }),
  isManualReviewPromptAvailable: (state: unknown, options: { loaded: boolean; blocked: boolean }) =>
    options.loaded && !options.blocked && state != null && mockEnv.manualAllowed,
}));

jest.mock("@/features/reviews/hooks/useReviewPromptBlocked", () => ({
  useReviewPromptBlocked: () => mockEnv.blocked,
}));

jest.mock("@/features/reviews/hooks/useIsOnline", () => ({
  useIsOnline: () => mockEnv.online,
}));

jest.mock("@/features/reviews/lib/submitAppFeedback", () => ({
  submitReviewFeedback: (params: unknown) => mockSubmit(params),
}));

/** Sheet stand-in that exposes its props as text and its callbacks as buttons. */
jest.mock("@/features/reviews/components/ReviewPromptSheet", () => {
  const { Pressable: P, Text: T, View } = require("react-native");
  return {
    ReviewPromptSheet: (props: {
      visible: boolean;
      onClose: () => void;
      onDismissed: () => void;
      onStoreReviewRequested: () => void;
      onFeedbackSent: (rating: number, message: string) => Promise<void>;
      feedbackOffline: boolean;
      feedbackError: string | null;
    }) => (
      <View>
        <T testID="sheet-visible">{String(props.visible)}</T>
        <T testID="sheet-offline">{String(props.feedbackOffline)}</T>
        <T testID="sheet-error">{props.feedbackError ?? ""}</T>
        <P
          testID="sheet-dismiss"
          onPress={() => {
            props.onDismissed();
            props.onClose();
          }}
        />
        <P testID="sheet-store" onPress={props.onStoreReviewRequested} />
        <P
          testID="sheet-feedback"
          onPress={() => {
            props.onFeedbackSent(2, "msg").then(props.onClose, () => {});
          }}
        />
      </View>
    ),
  };
});

function Consumer() {
  const { canRateApp, maybePromptReview } = useReviewPrompt();
  return (
    <>
      <Text testID="can-rate">{String(canRateApp)}</Text>
      <Pressable testID="prompt" onPress={maybePromptReview} />
    </>
  );
}

const tree = () => (
  <ReviewPromptProvider>
    <Consumer />
  </ReviewPromptProvider>
);

async function settle() {
  await act(async () => {
    for (let i = 0; i < 6; i += 1) await Promise.resolve();
  });
}

/** Renders the provider with `env` overrides and waits for the gating state to load. */
async function setup(env: Partial<typeof mockEnv> = {}) {
  Object.assign(mockEnv, env);
  const appState = captureAppStateListener();
  const utils = await render(tree());
  await settle();
  return { ...utils, appState };
}

async function pressAndSettle(testID: string) {
  await fireEvent.press(screen.getByTestId(testID));
  await settle();
}

async function openFunnel(triggerId: ReviewFunnelTriggerId) {
  await act(async () => {
    invokeOpenReviewFunnel(triggerId);
  });
  await settle();
}

const textOf = (testID: string) => screen.getByTestId(testID).props.children;

describe("ReviewPromptProvider", () => {
  beforeEach(() => {
    Object.assign(mockEnv, {
      stored: null,
      writes: [],
      readGating: null,
      persistedTrigger: null,
      blocked: false,
      online: true,
      manualAllowed: true,
      autoAllowed: true,
    });
    resetToastMock();
    mockSubmit.mockReset().mockResolvedValue(undefined);
    clearPendingReviewTrigger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("loading", () => {
    it("records a new session on mount", async () => {
      await setup();
      expect(mockEnv.writes[0]?.sessionCount).toBe(1);
    });

    it.each([
      ["allowed", true, "true"],
      ["refused", false, "false"],
    ])("exposes canRateApp when the manual gate is %s", async (_label, manualAllowed, expected) => {
      await setup({ manualAllowed });
      expect(textOf("can-rate")).toBe(expected);
    });

    it("reports canRateApp false while blocked", async () => {
      await setup({ blocked: true });
      expect(textOf("can-rate")).toBe("false");
    });

    it.each([
      [true, "false"],
      [false, "true"],
    ])("passes feedbackOffline when online=%s", async (online, expected) => {
      await setup({ online });
      expect(textOf("sheet-offline")).toBe(expected);
    });

    it("ignores prompts until the gating state has loaded", async () => {
      await setup({ readGating: () => new Promise(() => {}) });
      await pressAndSettle("prompt");
      expect(textOf("sheet-visible")).toBe("false");
    });

    it("drops a gating state that loads after unmount", async () => {
      const gating = deferred<ReviewGatingState>();
      const { unmount } = await setup({ readGating: () => gating.promise });
      await unmount();
      await act(async () => {
        gating.resolve({ ...EMPTY_REVIEW_GATING });
        await Promise.resolve();
      });
      expect(mockEnv.writes).toHaveLength(0);
    });
  });

  describe("opening the funnel", () => {
    it("opens the manual prompt", async () => {
      await setup();
      await pressAndSettle("prompt");
      expect(textOf("sheet-visible")).toBe("true");
    });

    it("persists the prompt as shown", async () => {
      await setup();
      await pressAndSettle("prompt");
      expect(mockEnv.stored).toMatchObject({
        promptCountLifetime: 1,
        lastSessionValueAt: expect.any(String),
      });
    });

    it.each([
      [
        "the manual gate refuses a manual prompt",
        { manualAllowed: false },
        APP_FEEDBACK_TRIGGER_IDS.manual,
      ],
      [
        "the automatic gate refuses an automatic trigger",
        { autoAllowed: false },
        APP_FEEDBACK_TRIGGER_IDS.streak_milestone,
      ],
    ] as const)("stays closed when %s", async (_label, env, triggerId) => {
      await setup(env);
      await openFunnel(triggerId);
      expect(textOf("sheet-visible")).toBe("false");
    });

    it("opens a persisted trigger on its deferred route", async () => {
      await setup({ persistedTrigger: APP_FEEDBACK_TRIGGER_IDS.perfect_day });
      await act(async () => {
        flushReviewTriggerForRoute("tracker");
      });
      await settle();
      expect(textOf("sheet-visible")).toBe("true");
    });

    it("holds a trigger while blocked", async () => {
      await setup({ blocked: true });
      await pressAndSettle("prompt");
      expect(textOf("sheet-visible")).toBe("false");
    });

    it("opens a held trigger once unblocked", async () => {
      const { rerender } = await setup({ blocked: true });
      await pressAndSettle("prompt");
      mockEnv.blocked = false;
      await rerender(tree());
      await settle();
      expect(textOf("sheet-visible")).toBe("true");
    });
  });

  describe("sheet outcomes", () => {
    it("records a dismissal and closes", async () => {
      await setup();
      await pressAndSettle("prompt");
      await pressAndSettle("sheet-dismiss");
      expect(textOf("sheet-visible")).toBe("false");
      expect(mockEnv.stored?.dismissStreak).toBe(1);
    });

    it("records a store review request", async () => {
      await setup();
      await pressAndSettle("sheet-store");
      expect(mockEnv.stored?.lastStoreReviewRequestAt).toEqual(expect.any(String));
    });

    it("thanks the user after a store review request", async () => {
      await setup();
      await pressAndSettle("sheet-store");
      expect(mockToast.success).toHaveBeenCalledWith("Thank you!", "Your support means a lot.");
    });

    it("submits feedback with the active trigger and locale", async () => {
      await setup();
      await openFunnel(APP_FEEDBACK_TRIGGER_IDS.weekly_report);
      await pressAndSettle("sheet-feedback");
      expect(mockSubmit).toHaveBeenCalledWith({
        rating: 2,
        message: "msg",
        triggerId: APP_FEEDBACK_TRIGGER_IDS.weekly_report,
        locale: "en",
      });
    });

    it("records sent feedback and thanks the user", async () => {
      await setup();
      await pressAndSettle("sheet-feedback");
      expect(mockEnv.stored?.lastFeedbackSentAt).toEqual(expect.any(String));
      expect(mockToast.success).toHaveBeenCalledWith(
        "Feedback received",
        "We'll use your notes to improve Munib Tracker.",
      );
    });

    it("surfaces a feedback submission error", async () => {
      mockSubmit.mockRejectedValue(new Error("offline"));
      await setup();
      await pressAndSettle("sheet-feedback");
      expect(textOf("sheet-error")).toBe("Could not send feedback. Please try again.");
    });

    it.each(["sheet-dismiss", "sheet-store", "sheet-feedback"])(
      "does not persist %s before gating has loaded",
      async (testID) => {
        await setup({ readGating: () => new Promise(() => {}) });
        await pressAndSettle(testID);
        expect(mockEnv.writes).toHaveLength(0);
        expect(mockToast.success).not.toHaveBeenCalled();
      },
    );
  });

  describe("app foreground", () => {
    it("records a foreground when the app becomes active", async () => {
      const { appState } = await setup();
      const before = mockEnv.writes.length;
      await act(async () => {
        appState.emit("active");
      });
      await settle();
      expect(mockEnv.writes).toHaveLength(before + 1);
    });

    it("ignores non-active transitions", async () => {
      const { appState } = await setup();
      const before = mockEnv.writes.length;
      await act(async () => {
        appState.emit("background");
      });
      expect(mockEnv.writes).toHaveLength(before);
    });

    it("unsubscribes on unmount", async () => {
      const { appState, unmount } = await setup();
      await unmount();
      const subscription = appState.spy.mock.results[0]?.value as { remove: jest.Mock };
      expect(subscription.remove).toHaveBeenCalled();
    });
  });

  it("throws outside the provider", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    await expect(renderHook(() => useReviewPrompt())).rejects.toThrow(
      "useReviewPrompt must be used within ReviewPromptProvider",
    );
    spy.mockRestore();
  });
});
