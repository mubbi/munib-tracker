import { act, fireEvent, screen } from "@testing-library/react-native";

import i18n from "@/i18n";
import type { FocusWindow } from "@/lib/focus-lock/plan";
import { GENTLE_HOLD_MS } from "@/lib/focus-lock/prefs";
import { renderWithProviders } from "@/test-support/render";

import { FocusSoftPrompt, holdProgress } from "./focus-soft-prompt";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock("@/components/ui/sheet", () => require("@/test-support/mocks/sheet").sheetMock);

const t = i18n.t.bind(i18n);

function makeWindow(): FocusWindow {
  const start = new Date("2026-11-24T12:30:00.000Z");
  return {
    id: "2026-11-24:dhuhr",
    date: "2026-11-24",
    prayers: ["dhuhr"],
    start,
    end: new Date(start.getTime() + 20 * 60_000),
    anchor: "adhan",
  };
}

async function renderPrompt(mode: "gentle" | "firm" | "strict" = "gentle") {
  const onUnlock = jest.fn();
  const onDismiss = jest.fn();
  await renderWithProviders(
    <FocusSoftPrompt
      window={makeWindow()}
      mode={mode}
      emergencyLeft={2}
      onUnlock={onUnlock}
      onDismiss={onDismiss}
    />,
  );
  return { onUnlock, onDismiss };
}

describe("holdProgress", () => {
  it("fills from 0 to 1 over the gentle hold and clamps", () => {
    expect(holdProgress(null, 5000)).toBe(0);
    expect(holdProgress(1000, 1000 + GENTLE_HOLD_MS / 2)).toBeCloseTo(0.5);
    expect(holdProgress(1000, 1000 + GENTLE_HOLD_MS * 2)).toBe(1);
    expect(holdProgress(1000, 500)).toBe(0);
  });
});

describe("FocusSoftPrompt", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("gentle: shows a filling bar while holding and unlocks on the long press", async () => {
    jest.useFakeTimers();
    const { onUnlock } = await renderPrompt("gentle");
    const hold = screen.getByRole("button", { name: t("focusLock.shield.prayNow") });
    expect(screen.queryByTestId("focus-hold-progress")).toBeNull();

    await act(async () => {
      fireEvent(hold, "pressIn");
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId("focus-hold-progress")).toBeTruthy();

    await act(async () => {
      fireEvent(hold, "pressOut");
    });
    expect(screen.queryByTestId("focus-hold-progress")).toBeNull();
    expect(onUnlock).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent(hold, "longPress");
    });
    expect(onUnlock).toHaveBeenCalledWith("holdPrayNow");
  });

  it("gentle: screen readers can unlock from the actions menu", async () => {
    const { onUnlock } = await renderPrompt("gentle");
    await act(async () => {
      fireEvent(screen.getByTestId("focus-hold-unlock"), "accessibilityAction", {
        nativeEvent: { actionName: "longpress" },
      });
    });
    expect(onUnlock).toHaveBeenCalledWith("holdPrayNow");
  });

  it("firm: no hold-to-unlock, marking the Salah is the way out", async () => {
    await renderPrompt("firm");
    expect(screen.queryByTestId("focus-hold-unlock")).toBeNull();
    expect(screen.getByText(t("focusLock.soft.markPrayed"))).toBeTruthy();
  });
});
