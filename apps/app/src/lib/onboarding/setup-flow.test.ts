import { act } from "@testing-library/react-native";

import { devicePreferencesStore, setDevicePreferences } from "@/stores/device-preferences-store";
import { preferencesStore } from "@/stores/preferences-store";
import { resetSettingsStores } from "@/test-support/settings";

import {
  adjacentStep,
  chooseSetupLanguage,
  completeCoreSetup,
  isCoreSetupDoneAt,
  readSetupProgress,
  resolveSetupStep,
  saveSetupProgress,
  setupDestination,
  setupStepForItem,
  setupStepPosition,
  setupStepsFor,
} from "./setup-flow";

jest.mock("@/notifications/scheduler", () => ({
  rescheduleAll: jest.fn(async () => {}),
  listScheduled: jest.fn(async () => []),
}));

const PHONE = setupStepsFor({ tv: false });
const TV_STEPS = setupStepsFor({ tv: true });

describe("setup steps", () => {
  it("orders the steps by dependency; TV skips reminders and phone extras", () => {
    expect(PHONE).toEqual(["language", "location", "madhhab", "reminders", "personalise", "done"]);
    expect(TV_STEPS).toEqual(["language", "location", "madhhab", "done"]);
  });

  it("resolves requested / resumed steps, falling back to the first", () => {
    expect(resolveSetupStep("madhhab", PHONE)).toBe("madhhab");
    expect(resolveSetupStep(["reminders"], PHONE)).toBe("reminders");
    expect(resolveSetupStep("reminders", TV_STEPS)).toBe("language");
    expect(resolveSetupStep("nope", PHONE)).toBe("language");
    expect(resolveSetupStep(undefined, PHONE)).toBe("language");
  });

  it("walks forward and back, stopping at the ends", () => {
    expect(adjacentStep("language", PHONE, -1)).toBeNull();
    expect(adjacentStep("language", PHONE, 1)).toBe("location");
    expect(adjacentStep("madhhab", TV_STEPS, 1)).toBe("done");
    expect(adjacentStep("done", PHONE, 1)).toBeNull();
  });

  it('counts "Step n of total" without the summary screen', () => {
    expect(setupStepPosition("language", PHONE)).toEqual({ position: 1, total: 5 });
    expect(setupStepPosition("personalise", PHONE)).toEqual({ position: 5, total: 5 });
    expect(setupStepPosition("done", PHONE)).toEqual({ position: 5, total: 5 });
    expect(setupStepPosition("madhhab", TV_STEPS)).toEqual({ position: 3, total: 3 });
  });

  it("is ready to use once every core step is behind", () => {
    expect(isCoreSetupDoneAt("reminders", PHONE)).toBe(false);
    expect(isCoreSetupDoneAt("personalise", PHONE)).toBe(true);
    expect(isCoreSetupDoneAt("done", TV_STEPS)).toBe(true);
    expect(isCoreSetupDoneAt("madhhab", TV_STEPS)).toBe(false);
  });

  it("maps every checklist item to the step that asks it", () => {
    expect(setupStepForItem("language")).toBe("language");
    expect(setupStepForItem("location")).toBe("location");
    expect(setupStepForItem("method")).toBe("location");
    expect(setupStepForItem("madhhab")).toBe("madhhab");
    expect(setupStepForItem("notifications")).toBe("reminders");
  });

  it("only ever finishes on Home, sign-in or back to the deep-linked page", () => {
    expect(setupDestination("/login")).toBe("/login");
    expect(setupDestination(["/login"])).toBe("/login");
    expect(setupDestination("back")).toBe("back");
    expect(setupDestination("https://evil.example")).toBe("/");
    expect(setupDestination(undefined)).toBe("/");
  });
});

describe("setup progress", () => {
  beforeEach(resetSettingsStores);

  it("saves and reads the first-run step and destination", async () => {
    await act(() => saveSetupProgress("madhhab", "/login"));
    expect(readSetupProgress()).toEqual({ step: "madhhab", next: "/login" });
    await act(() => saveSetupProgress("reminders", "/"));
    expect(devicePreferencesStore.getState().prefs.setupProgress).toEqual({ step: "reminders" });
  });

  it("ignores a corrupt saved step", async () => {
    await act(() => setDevicePreferences({ setupProgress: { step: "bogus" } }));
    expect(readSetupProgress()).toBeNull();
  });

  it("saves nothing once onboarding is complete (Run setup again)", async () => {
    await act(() => preferencesStore.getState().update({ hasCompletedOnboarding: true }));
    await act(() => saveSetupProgress("location", "/"));
    expect(readSetupProgress()).toBeNull();
  });

  it("completing the core steps marks onboarding done and clears the resume state", async () => {
    await act(() => saveSetupProgress("reminders", "/"));
    await act(completeCoreSetup);
    expect(preferencesStore.getState().prefs.hasCompletedOnboarding).toBe(true);
    expect(readSetupProgress()).toBeNull();
  });
});

describe("chooseSetupLanguage", () => {
  beforeEach(resetSettingsStores);

  it("moves the meaning-translation language with the app language", async () => {
    await act(() => chooseSetupLanguage("fr"));
    const { prefs } = preferencesStore.getState();
    expect(prefs.locale).toBe("fr");
    expect(prefs.translationLocale).toBe("fr");
    expect(devicePreferencesStore.getState().prefs.languageConfirmedAt).toEqual(expect.any(String));
    await act(() => chooseSetupLanguage("en"));
  });

  it("keeps a translation language the user chose separately", async () => {
    await act(() => preferencesStore.getState().update({ translationLocale: "ur" }));
    await act(() => chooseSetupLanguage("id"));
    expect(preferencesStore.getState().prefs.translationLocale).toBe("ur");
    await act(() => chooseSetupLanguage("en"));
  });
});
