import { ApiError } from "@munib-tracker/api-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ALL_FIVE, makeChildProfile } from "@/test-support/circles";
import { resetSafeSecureStoreMock } from "@/test-support/mocks/safe-secure-store";

import * as api from "./api";
import {
  __resetChildSessionStoreForTests,
  CHILD_SESSION_META_KEY,
  childSessionStore,
  clearChildSession,
  dismissGraduationPrompt,
  loadChildSession,
  refreshChildProfile,
  saveChildSession,
  setChildDayStatus,
} from "./child-session";

jest.mock(
  "@/lib/storage/safe-secure-store",
  () => require("@/test-support/mocks/safe-secure-store").safeSecureStoreMock,
);

jest.mock("./api", () => {
  const actual = jest.requireActual("./api");
  return {
    ...actual,
    getChildMe: jest.fn(),
    putChildFardStatus: jest.fn(),
  };
});

const mocked = api as jest.Mocked<typeof api>;
const TOKEN = "mtc_abcdefghijklmnopqrstuvwx";

beforeEach(async () => {
  jest.clearAllMocks();
  resetSafeSecureStoreMock();
  await AsyncStorage.clear();
  await clearChildSession();
  __resetChildSessionStoreForTests();
});

describe("child session (D7 scoped token)", () => {
  it("persists the token and profile and reloads them", async () => {
    await saveChildSession(TOKEN, makeChildProfile());
    __resetChildSessionStoreForTests();
    await loadChildSession();
    const state = childSessionStore.getState();
    expect(state.token).toBe(TOKEN);
    expect(state.meta?.child.nickname).toBe("Ali");
  });

  it("starts clean when the token is missing but meta lingers", async () => {
    await AsyncStorage.setItem(
      CHILD_SESSION_META_KEY,
      JSON.stringify({ child: makeChildProfile(), linkedAt: "x", days: {} }),
    );
    await loadChildSession();
    expect(childSessionStore.getState().token).toBeNull();
    expect(await AsyncStorage.getItem(CHILD_SESSION_META_KEY)).toBeNull();
  });

  it("pushes a tap as the closed fard_status signal and clears pending", async () => {
    mocked.putChildFardStatus.mockResolvedValue({} as never);
    await saveChildSession(TOKEN, makeChildProfile());
    await setChildDayStatus("2026-11-24", ALL_FIVE);
    expect(mocked.putChildFardStatus).toHaveBeenCalledWith(TOKEN, "c-fam", {
      date: "2026-11-24",
      ...ALL_FIVE,
    });
    expect(childSessionStore.getState().meta?.days["2026-11-24"]?.pending).toBe(false);
  });

  it("keeps an offline tap pending", async () => {
    mocked.putChildFardStatus.mockRejectedValue(new TypeError("Network request failed"));
    await saveChildSession(TOKEN, makeChildProfile());
    await setChildDayStatus("2026-11-24", ALL_FIVE);
    expect(childSessionStore.getState().meta?.days["2026-11-24"]?.pending).toBe(true);
  });

  it("unlinks locally when the parent revoked the device", async () => {
    mocked.getChildMe.mockRejectedValue(new ApiError("Forbidden", 403));
    await saveChildSession(TOKEN, makeChildProfile());
    await expect(refreshChildProfile()).resolves.toBe("revoked");
    expect(childSessionStore.getState().token).toBeNull();
  });

  describe("D34: consent pending after a transfer (A5)", () => {
    const pendingError = () =>
      new ApiError("Forbidden", 403, {
        message: "Waiting for a parent to re-confirm consent",
        code: "CHILD_CONSENT_PENDING",
      });

    it("keeps taps queued, stays linked and flags the calm waiting note", async () => {
      mocked.putChildFardStatus.mockRejectedValue(pendingError());
      await saveChildSession(TOKEN, makeChildProfile());
      await setChildDayStatus("2026-11-23", ALL_FIVE);
      await setChildDayStatus("2026-11-24", ALL_FIVE);
      const state = childSessionStore.getState();
      expect(state.token).toBe(TOKEN);
      expect(state.meta?.child.consentPending).toBe(true);
      expect(state.meta?.days["2026-11-23"]?.pending).toBe(true);
      expect(state.meta?.days["2026-11-24"]?.pending).toBe(true);
      // Persisted, so nothing is lost across restarts.
      const stored = JSON.parse((await AsyncStorage.getItem(CHILD_SESSION_META_KEY)) as string);
      expect(stored.days["2026-11-24"].pending).toBe(true);
    });

    it("uploads the queue once a parent re-confirms consent", async () => {
      mocked.putChildFardStatus.mockRejectedValueOnce(pendingError());
      await saveChildSession(TOKEN, makeChildProfile());
      await setChildDayStatus("2026-11-24", ALL_FIVE);
      expect(childSessionStore.getState().meta?.days["2026-11-24"]?.pending).toBe(true);

      mocked.putChildFardStatus.mockResolvedValue({} as never);
      mocked.getChildMe.mockResolvedValue(makeChildProfile({ consentPending: false }));
      await expect(refreshChildProfile()).resolves.toBe("ok");
      const state = childSessionStore.getState();
      expect(state.meta?.child.consentPending).toBe(false);
      expect(state.meta?.days["2026-11-24"]?.pending).toBe(false);
      expect(mocked.putChildFardStatus).toHaveBeenLastCalledWith(TOKEN, "c-fam", {
        date: "2026-11-24",
        ...ALL_FIVE,
      });
    });

    it("discards the queue when the lapsed profile is deleted (session revoked)", async () => {
      mocked.putChildFardStatus.mockRejectedValue(pendingError());
      await saveChildSession(TOKEN, makeChildProfile());
      await setChildDayStatus("2026-11-24", ALL_FIVE);
      mocked.getChildMe.mockRejectedValue(new ApiError("Unauthorized", 401));
      await expect(refreshChildProfile()).resolves.toBe("revoked");
      expect(childSessionStore.getState().meta).toBeNull();
      expect(await AsyncStorage.getItem(CHILD_SESSION_META_KEY)).toBeNull();
    });
  });

  it("remembers a dismissed graduation prompt stage (E13)", async () => {
    await saveChildSession(TOKEN, makeChildProfile());
    await dismissGraduationPrompt("offer");
    expect(childSessionStore.getState().meta?.graduationDismissed).toBe("offer");
    __resetChildSessionStoreForTests();
    await loadChildSession();
    expect(childSessionStore.getState().meta?.graduationDismissed).toBe("offer");
  });
});
