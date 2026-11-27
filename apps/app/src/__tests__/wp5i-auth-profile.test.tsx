/**
 * WP-5I (P5-48 / P5-51): sign-in failure copy + OAuth return states, and the
 * Profile avatar / name / sync / delete-account flows.
 */
import { act, fireEvent, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";
import { Linking } from "react-native";

import i18n from "@/i18n";
import { defined } from "@/test-support/assert";
import { renderWithTheme } from "@/test-support/render";

const mockRouteState = { params: {} as Record<string, string | string[] | undefined> };
const mockReplace = jest.fn();
const mockRedirects: unknown[] = [];

jest.mock("expo-router", () => ({
  ...jest.requireActual("@/test-support/mocks/expo-router").expoRouterMock,
  useRouter: () => ({
    push: jest.fn(),
    navigate: jest.fn(),
    back: jest.fn(),
    replace: mockReplace,
    canGoBack: () => false,
    canDismiss: () => false,
  }),
  useLocalSearchParams: () => mockRouteState.params,
  Redirect: ({ href }: { href: unknown }) => {
    mockRedirects.push(href);
    return null;
  },
}));

const mockSocial = {
  signIn: jest.fn(async (..._args: unknown[]) => undefined),
  busy: null as string | null,
  googleConfigured: true,
  appleConfigured: false,
  facebookConfigured: false,
  resumeGoogleFromUrl: jest.fn(
    async (_url: string) => "failed" as "success" | "skipped" | "failed",
  ),
  resumeAppleFromUrl: jest.fn(async (_url: string) => "failed" as "success" | "skipped" | "failed"),
};
jest.mock("@/hooks/use-social-auth", () => ({
  OAUTH_CANCELLED: "cancelled",
  useSocialAuth: () => mockSocial,
}));
jest.mock("@/lib/oauth/oauth-pending", () => ({
  loadGoogleOAuthPendingSession: jest.fn(async () => ({ returnTo: "/profile" })),
  loadAppleOAuthPendingSession: jest.fn(async () => ({ returnTo: "/profile" })),
}));

const mockToast = {
  show: jest.fn(() => "id"),
  success: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  dismiss: jest.fn(),
};
jest.mock("@/providers/toast-provider", () => ({
  useToast: () => mockToast,
  ToastProvider: ({ children }: { children: ReactNode }) => children,
  useToastOutlet: () => null,
  ToastHost: () => null,
}));

const mockCalls: string[] = [];
const mockAuth = {
  signedIn: true,
  syncNow: jest.fn(async () => "ok" as const),
  deleteAccount: jest.fn(async (_body: unknown) => {
    mockCalls.push("deleteAccount");
    return "ok" as "ok" | "error";
  }),
};
jest.mock("@/providers/auth-provider", () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
  useAuth: () => ({
    session: null,
    user: mockAuth.signedIn
      ? { email: "user@example.com", displayName: "Amina", provider: "google" }
      : null,
    isReady: true,
    isGuest: !mockAuth.signedIn,
    isAuthenticated: mockAuth.signedIn,
    isSyncing: false,
    signOut: jest.fn(),
    syncNow: mockAuth.syncNow,
    deleteAccount: mockAuth.deleteAccount,
    applySessionDto: jest.fn(),
  }),
}));
jest.mock("@/features/pin-lock", () => ({
  usePinLock: () => ({
    factoryResetPinLock: jest.fn(async () => {
      mockCalls.push("factoryResetPinLock");
    }),
  }),
}));
jest.mock("@/providers/in-app-notifications-provider", () => ({
  useInAppNotifications: () => ({
    clearAll: jest.fn(async () => {
      mockCalls.push("clearAll");
    }),
  }),
}));
jest.mock("@/lib/wipe-local-data", () => ({
  wipeLocalDeviceData: jest.fn(async () => {
    mockCalls.push("wipeLocalDeviceData");
  }),
}));
jest.mock("@/sync/sync-engine", () => ({
  readSyncMetadata: jest.fn(async () => ({ lastSyncedAt: null })),
}));

const mockPicker = {
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: false })),
  launchImageLibraryAsync: jest.fn(async () => ({ canceled: true, assets: [] })),
};
jest.mock("expo-image-picker", () => mockPicker);

async function flush() {
  await act(async () => {
    await Promise.resolve();
    await Promise.resolve();
  });
}

beforeEach(() => {
  mockRouteState.params = {};
  mockRedirects.length = 0;
  mockCalls.length = 0;
  mockAuth.signedIn = true;
  mockReplace.mockReset();
  mockToast.show.mockClear();
  mockToast.success.mockClear();
  mockAuth.deleteAccount.mockClear();
});

describe("login screen (P5-48)", () => {
  const LoginScreen = require("@/app/(auth)/login").default as () => ReactNode;

  it("shows the OAuth return failure as a danger callout", async () => {
    mockAuth.signedIn = false;
    mockRouteState.params = { error: "oauth_failed" };
    await renderWithTheme(<LoginScreen />);
    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.getByText(i18n.t("login.errorOAuthReturn"))).toBeTruthy();
  });

  it("has no error callout on a plain visit, and offers terms + privacy links", async () => {
    mockAuth.signedIn = false;
    await renderWithTheme(<LoginScreen />);
    expect(screen.queryByRole("alert")).toBeNull();
    expect(screen.getByRole("link", { name: i18n.t("about.termsOfService") })).toBeTruthy();
    expect(screen.getByRole("link", { name: i18n.t("about.privacyPolicy") })).toBeTruthy();
  });

  it("clears the return error when a provider is tried again", async () => {
    mockAuth.signedIn = false;
    mockRouteState.params = { error: "oauth_failed" };
    await renderWithTheme(<LoginScreen />);
    await fireEvent.press(screen.getByLabelText(i18n.t("login.google")));
    await flush();
    expect(screen.queryByText(i18n.t("login.errorOAuthReturn"))).toBeNull();
  });
});

describe.each([
  ["Google", "@/app/oauth2redirect", "resumeGoogleFromUrl"],
  ["Apple", "@/app/oauth/apple", "resumeAppleFromUrl"],
] as const)("%s OAuth return route (D-32)", (_name, path, resume) => {
  const Route = require(path).default as () => ReactNode;

  it("shows a themed signing-in state, then returns to login with an error param", async () => {
    let finish: (value: "failed") => void = () => undefined;
    mockSocial[resume].mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    mockRouteState.params = { code: "abc", state: "xyz" };
    await renderWithTheme(<Route />);
    await flush();
    expect(screen.getByRole("progressbar", { name: i18n.t("oauth.signingIn") })).toBeTruthy();
    expect(mockSocial[resume]).toHaveBeenCalledWith(expect.stringContaining("code=abc"));
    await act(async () => {
      finish("failed");
    });
    await flush();
    expect(mockRedirects.at(-1)).toEqual({
      pathname: "/(auth)/login",
      params: { error: "oauth_failed" },
    });
  });

  it("returns to the starting screen on success", async () => {
    mockSocial[resume].mockResolvedValueOnce("success" as never);
    mockRouteState.params = { code: "abc" };
    await renderWithTheme(<Route />);
    await flush();
    await flush();
    expect(mockRedirects.at(-1)).toBe("/profile");
  });
});

describe("profile (P5-51)", () => {
  const ProfileScreen = require("@/app/profile/index").default as () => ReactNode;

  it("explains a denied photo permission with an Open Settings action", async () => {
    const openSettings = jest.spyOn(Linking, "openSettings").mockResolvedValue(undefined);
    await renderWithTheme(<ProfileScreen />);
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("profile.addAvatar") }));
    await flush();
    expect(mockPicker.launchImageLibraryAsync).not.toHaveBeenCalled();
    expect(mockToast.show).toHaveBeenCalledWith(
      i18n.t("profile.photoPermissionDenied"),
      expect.objectContaining({ action: expect.objectContaining({ label: "Open Settings" }) }),
    );
    const call = mockToast.show.mock.calls.at(-1) as unknown as [
      string,
      { action: { onPress: () => void } },
    ];
    call[1].action.onPress();
    expect(openSettings).toHaveBeenCalled();
    openSettings.mockRestore();
  });

  it("edits the name with a labelled, length-capped field and Cancel", async () => {
    await renderWithTheme(<ProfileScreen />);
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("profile.editName") }));
    const field = screen.getByLabelText(i18n.t("profile.displayNameLabel"));
    expect(field.props.maxLength).toBe(40);
    await fireEvent.changeText(field, "Changed");
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("common.cancel") }));
    expect(screen.queryByLabelText(i18n.t("profile.displayNameLabel"))).toBeNull();
  });

  it("uses one sync indicator (the button's loading state)", async () => {
    let done: (value: "ok") => void = () => undefined;
    mockAuth.syncNow.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          done = resolve;
        }),
    );
    await renderWithTheme(<ProfileScreen />);
    await fireEvent.press(screen.getByRole("button", { name: i18n.t("sync.now") }));
    // No separate spinner beside the button (D-29 double indicator).
    expect(screen.queryAllByRole("progressbar")).toHaveLength(0);
    expect(
      screen.getByRole("button", { name: i18n.t("sync.syncing") }).props.accessibilityState,
    ).toEqual(expect.objectContaining({ busy: true }));
    await act(async () => {
      done("ok");
    });
  });

  it("keeps the delete-account call sequence: API, then device wipe", async () => {
    await renderWithTheme(<ProfileScreen />);
    await fireEvent.press(screen.getByLabelText(i18n.t("profile.deleteAccount")));
    expect(screen.getByText(i18n.t("profile.deleteTitle"))).toBeTruthy();
    await fireEvent.press(screen.getByText(i18n.t("profile.deleteAccountContinue")));
    await fireEvent.press(screen.getByText(i18n.t("profile.deleteAccountReasons.not_using")));
    await fireEvent.press(screen.getByText(i18n.t("profile.deleteAccountContinue")));
    await fireEvent.changeText(screen.getByLabelText("Type DELETE to confirm"), "DELETE");
    await fireEvent.press(screen.getByRole("checkbox"));
    // The sheet's destructive confirm is the last "Delete account" button.
    const confirms = screen.getAllByRole("button", { name: i18n.t("profile.deleteAccount") });
    await fireEvent.press(defined(confirms.at(-1), "delete confirm"));
    await flush();
    await flush();
    expect(mockAuth.deleteAccount).toHaveBeenCalledWith({
      confirmation: "DELETE",
      primaryReason: "not_using",
    });
    expect(mockCalls).toEqual([
      "deleteAccount",
      "wipeLocalDeviceData",
      "factoryResetPinLock",
      "clearAll",
    ]);
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});
