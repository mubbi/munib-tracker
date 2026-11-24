import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import {
  handleLiveActivityPushToken,
  type LiveActivityLifecycleEvent,
  type LiveActivityPushTokenEvent,
  notifyLiveActivityLifecycle,
} from "@/lib/live-activity";
import type { BuiltReminder } from "@/lib/notifications/build-reminders";
import { openNotificationRoute } from "@/lib/notifications/open-notification-route";
import {
  registerExpoPushTokenWithApi,
  registerWebPushSubscriptionWithApi,
} from "@/lib/notifications/register-push-token";
import { tryPlayWebAdhanForReminder } from "@/lib/notifications/web-adhan-playback";
import {
  setWebReminderFireHandler,
  type WebReminderFireHandler,
} from "@/lib/notifications/web-reminder-scheduler";
import { configureNotifications, rescheduleAll } from "@/notifications/scheduler";
import { captureAppStateListener } from "@/test-support/app-state";
import { resetAuthMock, setMockAuth } from "@/test-support/mocks/auth-provider";
import { mockRouter } from "@/test-support/mocks/expo-router";
import { setPlatform, usePlatform } from "@/test-support/platform";

const mockDeliver = jest.fn();
const mockEnv = { localSupported: true, web: false };
const mockLiveActivity = {
  onToken: undefined as ((event: LiveActivityPushTokenEvent) => void) | undefined,
  onLifecycle: undefined as ((event: LiveActivityLifecycleEvent) => void) | undefined,
  unsubscribe: jest.fn(),
};

function mockStore<T>(initial: T) {
  let state = initial;
  return {
    getState: () => state,
    setState: (next: Partial<T>) => {
      state = { ...state, ...next };
    },
    subscribe: () => () => undefined,
  };
}

const mockPreferences = mockStore({
  isReady: true,
  prefs: {
    hasCompletedOnboarding: true,
    notificationPrefs: { masterEnabled: true },
    prayerAlerts: {},
    prayerReminderOffsets: {},
    bedtime: "22:30",
  },
});
const mockLocation = mockStore({
  isReady: true,
  location: { latitude: 24.86, longitude: 67.0, timeZone: "Asia/Karachi" },
});
const mockTracker = mockStore({
  isReady: true,
  qazaCounters: [] as { remaining: number }[],
  roza: { remaining: 0, completed: 0 },
});

jest.mock("expo-router", () => require("@/test-support/mocks/expo-router").expoRouterMock);
jest.mock(
  "@/providers/auth-provider",
  () => require("@/test-support/mocks/auth-provider").authProviderMock,
);
jest.mock("@/providers/in-app-notifications-provider", () => ({
  useInAppNotifications: () => ({ deliver: mockDeliver }),
}));
jest.mock("@/notifications/scheduler", () => ({
  configureNotifications: jest.fn(async () => undefined),
  rescheduleAll: jest.fn(async () => undefined),
  markFromNotification: jest.fn(),
  snoozeNotification: jest.fn(),
  MARK_ACTION_IDENTIFIER: "markcurrent",
  SNOOZE_ACTION_IDENTIFIER: "snooze",
}));
jest.mock("@/lib/notifications/platform", () => ({
  isLocalNotificationSupported: () => mockEnv.localSupported,
  get isWeb() {
    return mockEnv.web;
  },
}));
jest.mock("@/lib/live-activity", () => ({
  handleLiveActivityPushToken: jest.fn(),
  notifyLiveActivityLifecycle: jest.fn(),
  subscribeLiveActivityPushTokens: (handler: (event: LiveActivityPushTokenEvent) => void) => {
    mockLiveActivity.onToken = handler;
    return mockLiveActivity.unsubscribe;
  },
  subscribeLiveActivityLifecycle: (handler: (event: LiveActivityLifecycleEvent) => void) => {
    mockLiveActivity.onLifecycle = handler;
    return mockLiveActivity.unsubscribe;
  },
}));
jest.mock("@/lib/notifications/register-push-token", () => ({
  registerExpoPushTokenWithApi: jest.fn(),
  registerWebPushSubscriptionWithApi: jest.fn(),
}));
jest.mock("@/lib/notifications/web-reminder-scheduler", () => ({
  setWebReminderFireHandler: jest.fn(),
}));
jest.mock("@/lib/notifications/web-adhan-playback", () => ({
  tryPlayWebAdhanForReminder: jest.fn(),
}));
jest.mock("@/lib/notifications/open-notification-route", () => ({
  openNotificationRoute: jest.fn(),
}));
jest.mock("@/stores/preferences-store", () => ({
  preferencesStore: mockPreferences,
  usePreferencesReady: () => mockPreferences.getState().isReady,
}));
jest.mock("@/stores/location-store", () => ({ locationStore: mockLocation }));
jest.mock("@/stores/tracker-store", () => ({ trackerStore: mockTracker }));

// The OS tap listeners load `expo-notifications` through a dynamic `import()`,
// which Jest cannot run without --experimental-vm-modules. Load the provider as
// web (module-level `isNative` = false) so that branch stays dormant; per-test
// platform overrides still drive the runtime `Platform.OS` checks.
const restoreLoadPlatform = setPlatform({ OS: "web" });
const { NotificationProvider } =
  require("./notification-provider") as typeof import("./notification-provider");
restoreLoadPlatform();

let appState: ReturnType<typeof captureAppStateListener>;

async function setup() {
  return await render(
    <NotificationProvider>
      <Text>child</Text>
    </NotificationProvider>,
  );
}

function signIn() {
  setMockAuth({
    isAuthenticated: true,
    isGuest: false,
    session: { accessToken: "tok", userId: "u1" },
  });
}

function setOnboarded(done: boolean) {
  mockPreferences.setState({
    prefs: { ...mockPreferences.getState().prefs, hasCompletedOnboarding: done },
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  resetAuthMock();
  mockEnv.localSupported = true;
  mockEnv.web = false;
  mockLiveActivity.onToken = undefined;
  mockLiveActivity.onLifecycle = undefined;
  mockPreferences.setState({ isReady: true });
  setOnboarded(true);
  mockLocation.setState({ isReady: true });
  mockTracker.setState({ isReady: true, qazaCounters: [], roza: { remaining: 0, completed: 0 } });
  appState = captureAppStateListener();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("configuration", () => {
  it("renders children and configures local notifications", async () => {
    await setup();
    expect(screen.getByText("child")).toBeTruthy();
    expect(configureNotifications).toHaveBeenCalled();
  });

  it("skips configuration when local notifications are unsupported", async () => {
    mockEnv.localSupported = false;
    await setup();
    expect(configureNotifications).not.toHaveBeenCalled();
    expect(rescheduleAll).not.toHaveBeenCalled();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("skips configuration and push registration", async () => {
      signIn();
      await setup();
      expect(configureNotifications).not.toHaveBeenCalled();
      expect(registerExpoPushTokenWithApi).not.toHaveBeenCalled();
      expect(mockLiveActivity.onToken).toBeUndefined();
    });
  });
});

describe("push registration", () => {
  it("registers native and web push when a session exists", async () => {
    signIn();
    await setup();
    expect(registerExpoPushTokenWithApi).toHaveBeenCalledWith("tok");
    expect(registerWebPushSubscriptionWithApi).toHaveBeenCalledWith("tok");
  });

  it("skips registration without a session", async () => {
    await setup();
    expect(registerExpoPushTokenWithApi).not.toHaveBeenCalled();
  });
});

describe("rescheduling", () => {
  it("reschedules with the current prefs and location once everything is ready", async () => {
    await setup();
    expect(rescheduleAll).toHaveBeenCalledWith(
      expect.objectContaining({ bedtime: "22:30", hasCompletedOnboarding: true }),
      mockLocation.getState().location,
    );
  });

  it("re-arms reminders in the foreground when an excused period starts or ends (H4)", async () => {
    const view = await setup();
    // A fresh element each time so React re-renders (the mock stores don't notify).
    const tree = () => (
      <NotificationProvider>
        <Text>child</Text>
      </NotificationProvider>
    );
    jest.clearAllMocks();

    await view.rerender(tree());
    expect(rescheduleAll).not.toHaveBeenCalled();

    mockPreferences.setState({
      prefs: { ...mockPreferences.getState().prefs, activeExcusedReason: "hayd" } as never,
    });
    await view.rerender(tree());
    expect(rescheduleAll).toHaveBeenCalledTimes(1);
    expect(rescheduleAll).toHaveBeenLastCalledWith(
      expect.objectContaining({ activeExcusedReason: "hayd" }),
      mockLocation.getState().location,
    );

    mockPreferences.setState({
      prefs: { ...mockPreferences.getState().prefs, activeExcusedReason: null } as never,
    });
    await view.rerender(tree());
    expect(rescheduleAll).toHaveBeenCalledTimes(2);
  });

  it.each([
    ["onboarding is incomplete", () => setOnboarded(false)],
    ["prefs are loading", () => mockPreferences.setState({ isReady: false })],
    ["location is loading", () => mockLocation.setState({ isReady: false })],
    ["the tracker is loading", () => mockTracker.setState({ isReady: false })],
  ])("waits while %s", async (_label, arrange) => {
    arrange();
    await setup();
    expect(rescheduleAll).not.toHaveBeenCalled();
  });
});

describe("foreground (AppState)", () => {
  it("reschedules and re-registers push when returning active while signed in", async () => {
    signIn();
    await setup();
    jest.clearAllMocks();

    await act(async () => appState.emit("active"));

    expect(rescheduleAll).toHaveBeenCalledTimes(1);
    expect(registerExpoPushTokenWithApi).toHaveBeenCalledWith("tok");
  });

  it("reschedules without push registration for guests", async () => {
    await setup();
    jest.clearAllMocks();

    await act(async () => appState.emit("active"));

    expect(rescheduleAll).toHaveBeenCalledTimes(1);
    expect(registerExpoPushTokenWithApi).not.toHaveBeenCalled();
  });

  it("ignores non-active transitions", async () => {
    await setup();
    jest.clearAllMocks();

    await act(async () => appState.emit("background"));

    expect(rescheduleAll).not.toHaveBeenCalled();
  });

  it("ignores foregrounds while location is still loading", async () => {
    mockLocation.setState({ isReady: false });
    await setup();

    await act(async () => appState.emit("active"));

    expect(rescheduleAll).not.toHaveBeenCalled();
  });

  it("does not listen before onboarding", async () => {
    setOnboarded(false);
    await setup();
    expect(appState.isArmed()).toBe(false);
  });
});

describe("Live Activity (iOS)", () => {
  it("forwards push tokens", async () => {
    await setup();
    const event = { activityId: "a1", token: "t" } as unknown as LiveActivityPushTokenEvent;

    mockLiveActivity.onToken?.(event);

    expect(handleLiveActivityPushToken).toHaveBeenCalledWith(event);
  });

  it.each(["ended", "dismissed"] as const)("reports the %s lifecycle state", async (state) => {
    await setup();

    mockLiveActivity.onLifecycle?.({ activityId: "a1", state } as LiveActivityLifecycleEvent);

    expect(notifyLiveActivityLifecycle).toHaveBeenCalledWith("a1", state);
  });

  it("ignores other lifecycle states", async () => {
    await setup();

    mockLiveActivity.onLifecycle?.({
      activityId: "a1",
      state: "active",
    } as unknown as LiveActivityLifecycleEvent);

    expect(notifyLiveActivityLifecycle).not.toHaveBeenCalled();
  });

  it("unsubscribes on unmount", async () => {
    await setup();
    await act(async () => screen.unmount());
    expect(mockLiveActivity.unsubscribe).toHaveBeenCalledTimes(2);
  });

  describe("on android", () => {
    usePlatform({ OS: "android" });

    it("does not subscribe", async () => {
      await setup();
      expect(mockLiveActivity.onToken).toBeUndefined();
    });
  });
});

describe("web reminders", () => {
  const reminder = {
    id: "fajr",
    title: "Fajr",
    body: "Time for Fajr",
    route: "/salah",
  } as BuiltReminder;

  class MockNotification {
    static permission = "granted";
    static instances: MockNotification[] = [];
    onclick: (() => void) | null = null;
    close = jest.fn();
    constructor(
      readonly title: string,
      readonly options: NotificationOptions,
    ) {
      MockNotification.instances.push(this);
    }
  }

  const g = globalThis as unknown as { Notification?: unknown; focus?: () => void };

  async function fire(next: BuiltReminder = reminder) {
    await setup();
    const handler = jest.mocked(setWebReminderFireHandler).mock.calls[0]?.[0] as
      | WebReminderFireHandler
      | undefined;
    handler?.(next);
  }

  beforeEach(() => {
    mockEnv.web = true;
    MockNotification.permission = "granted";
    MockNotification.instances = [];
    g.Notification = MockNotification;
    g.focus = jest.fn();
  });

  afterEach(() => {
    delete g.Notification;
    delete g.focus;
  });

  it("plays the adhan and delivers an in-app reminder", async () => {
    await fire();

    expect(tryPlayWebAdhanForReminder).toHaveBeenCalledWith(reminder);
    expect(mockDeliver).toHaveBeenCalledWith({
      kind: "reminder",
      title: "Fajr",
      body: "Time for Fajr",
      route: "/salah",
      id: "web-fajr",
    });
  });

  it("drops a qaza nudge once the debt is cleared", async () => {
    await fire({ ...reminder, id: "qaza:salah" });
    expect(mockDeliver).not.toHaveBeenCalled();
  });

  it("delivers a qaza nudge while debt remains", async () => {
    mockTracker.setState({ qazaCounters: [{ remaining: 2 }] });
    await fire({ ...reminder, id: "qaza" });
    expect(mockDeliver).toHaveBeenCalled();
  });

  it("shows a browser notification that opens the route when clicked", async () => {
    await fire();
    const [notification] = MockNotification.instances;
    expect(notification.options).toEqual({ body: "Time for Fajr", tag: "fajr" });

    notification.onclick?.();

    expect(g.focus).toHaveBeenCalled();
    expect(openNotificationRoute).toHaveBeenCalledWith(mockRouter, "/salah");
    expect(notification.close).toHaveBeenCalled();
  });

  it("skips the browser notification without permission", async () => {
    MockNotification.permission = "denied";
    await fire();
    expect(MockNotification.instances).toHaveLength(0);
  });

  it("swallows browser notification failures", async () => {
    g.Notification = Object.assign(
      jest.fn(() => {
        throw new Error("blocked");
      }),
      { permission: "granted" },
    );
    await fire();
    expect(mockDeliver).toHaveBeenCalled();
  });

  it("clears the fire handler on unmount", async () => {
    await setup();
    await act(async () => screen.unmount());
    expect(setWebReminderFireHandler).toHaveBeenLastCalledWith(null);
  });
});
