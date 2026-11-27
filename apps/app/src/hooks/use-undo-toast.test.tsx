import { act, fireEvent, renderHook, screen } from "@testing-library/react-native";
import type { ReactNode } from "react";

import { type UndoToastAction, useUndoToast } from "@/hooks/use-undo-toast";
import { TOAST_ACTION_DURATION_MS, ToastHost, ToastProvider } from "@/providers/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { ThemeWrapper } from "@/test-support/render";

jest.mock("@/lib/haptics", () => ({ triggerHaptic: jest.fn() }));

function Harness({ children }: { children: ReactNode }) {
  return (
    <ThemeWrapper>
      <ToastProvider>
        {children}
        <ToastHost />
      </ToastProvider>
    </ThemeWrapper>
  );
}

async function setup(overrides: Partial<UndoToastAction> = {}) {
  const action = {
    do: jest.fn(),
    undo: jest.fn(),
    messageKey: "common.saved",
    ...overrides,
  };
  const { result } = await renderHook(() => useUndoToast(), { wrapper: Harness });
  const run = () => act(async () => result.current.run(action));
  return { action, result, run };
}

const advance = (ms: number) =>
  act(async () => {
    jest.advanceTimersByTime(ms);
  });

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe("useUndoToast", () => {
  it("performs the change once and shows the toast with an Undo action", async () => {
    const { action, run } = await setup();

    await run();

    expect(action.do).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Undo" })).toBeTruthy();
  });

  it("undoes exactly once from the toast", async () => {
    const { action, result, run } = await setup();
    await run();

    await fireEvent.press(screen.getByRole("button", { name: "Undo" }));
    let again = true;
    await act(async () => {
      again = result.current.undo();
    });

    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(again).toBe(false);
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("replaces the previous Undo toast on a new change (B-25)", async () => {
    const { action, run } = await setup();
    await run();
    await run();

    expect(screen.getAllByRole("button", { name: "Undo" })).toHaveLength(1);
    await fireEvent.press(screen.getByRole("button", { name: "Undo" }));
    expect(action.undo).toHaveBeenCalledTimes(1);
  });

  it("cannot undo after the toast times out", async () => {
    const { action, result, run } = await setup();
    await run();

    await advance(TOAST_ACTION_DURATION_MS);
    let undone = true;
    await act(async () => {
      undone = result.current.undo();
    });

    expect(undone).toBe(false);
    expect(action.undo).not.toHaveBeenCalled();
    expect(result.current.undoAvailable).toBe(false);
  });

  it("shows no toast when the change fails", async () => {
    const { result } = await setup();
    const failing = { do: () => Promise.reject(new Error("disk full")), undo: jest.fn() };

    await expect(
      act(async () => result.current.run({ ...failing, messageKey: "common.saved" })),
    ).rejects.toThrow("disk full");
    expect(screen.queryByText("Saved")).toBeNull();
  });

  it("only the latest change stays undoable from the hook", async () => {
    const first = jest.fn();
    const second = jest.fn();
    const { result } = await setup();
    await act(async () =>
      result.current.run({ do: jest.fn(), undo: first, messageKey: "common.saved" }),
    );
    await act(async () =>
      result.current.run({ do: jest.fn(), undo: second, messageKey: "common.saved" }),
    );

    await act(async () => {
      result.current.undo();
    });

    expect(second).toHaveBeenCalledTimes(1);
    expect(first).not.toHaveBeenCalled();
  });
});

describe("useUndoToast on TV", () => {
  usePlatform({ isTV: true });

  it("exposes undoAvailable for an in-row control instead of an action toast", async () => {
    const { action, result, run } = await setup();

    await run();

    expect(screen.getByText("Saved")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Undo" })).toBeNull();
    expect(result.current.undoAvailable).toBe(true);

    await act(async () => {
      result.current.undo();
    });
    expect(action.undo).toHaveBeenCalledTimes(1);
    expect(result.current.undoAvailable).toBe(false);
  });

  it("closes the TV undo window after the action duration", async () => {
    const { action, result, run } = await setup();
    await run();

    await advance(TOAST_ACTION_DURATION_MS);

    expect(result.current.undoAvailable).toBe(false);
    await act(async () => {
      result.current.undo();
    });
    expect(action.undo).not.toHaveBeenCalled();
  });
});
