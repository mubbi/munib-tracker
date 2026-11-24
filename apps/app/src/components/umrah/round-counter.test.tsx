import { fireEvent, screen } from "@testing-library/react-native";

import { formatLapDuration, RoundCounter } from "@/components/umrah/round-counter";
import i18n from "@/i18n";
import { triggerHaptic } from "@/lib/haptics";
import {
  pressWebKey,
  resetWebKeyHandlerMock,
  webKeyHandlerState,
} from "@/test-support/mocks/web-key-handler";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/lib/haptics", () => require("@/test-support/mocks/haptics").hapticsMock);
jest.mock(
  "@/hooks/use-web-key-handler",
  () => require("@/test-support/mocks/web-key-handler").webKeyHandlerMock,
);

function renderCounter(props: Partial<Parameters<typeof RoundCounter>[0]> = {}) {
  const onCount = jest.fn();
  const onUndo = jest.fn();
  return {
    onCount,
    onUndo,
    view: renderWithTheme(
      <RoundCounter kind="tawaf" laps={0} onCount={onCount} onUndo={onUndo} {...props} />,
    ),
  };
}

const tile = (kind: "tawaf" | "sai", n: number) =>
  i18n.t(`umrahMode.counter.tileCount.${kind}`, { number: n });

beforeEach(() => {
  resetWebKeyHandlerMock();
  jest.mocked(triggerHaptic).mockClear();
});

describe("RoundCounter", () => {
  it("counts the next circuit from its big tile, with a haptic", async () => {
    const { onCount, view } = renderCounter({ laps: 2 });
    await view;
    fireEvent.press(screen.getByRole("button", { name: tile("tawaf", 3) }));
    expect(onCount).toHaveBeenCalledTimes(1);
    expect(triggerHaptic).toHaveBeenCalledWith("medium");
  });

  it("only the next tile is a tap target", async () => {
    const { view } = renderCounter({ laps: 2 });
    await view;
    expect(
      screen.getByRole("button", { name: tile("tawaf", 5) }).props.accessibilityState,
    ).toMatchObject({ disabled: true });
  });

  it("gives a success haptic on the seventh round, then stops counting", async () => {
    const { onCount, view } = renderCounter({ laps: 6 });
    await view;
    fireEvent.press(screen.getByRole("button", { name: tile("tawaf", 7) }));
    expect(triggerHaptic).toHaveBeenCalledWith("success");
    expect(onCount).toHaveBeenCalledTimes(1);
  });

  it("undoes the last round", async () => {
    const { onUndo, view } = renderCounter({ laps: 3 });
    await view;
    fireEvent.press(screen.getByRole("button", { name: i18n.t("umrahMode.counter.undo") }));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it("counts with Space on desktop web, and not once complete", async () => {
    const { onCount, view } = renderCounter({ laps: 1 });
    await view;
    expect(await pressWebKey(" ")).toBe(true);
    expect(onCount).toHaveBeenCalledTimes(1);
    await renderCounter({ laps: 7 }).view;
    expect(webKeyHandlerState.enabled).toBe(false);
  });

  it("shows the sa'i direction of the next course", async () => {
    await renderCounter({ kind: "sai", laps: 1 }).view;
    expect(screen.getByText(i18n.t("umrahMode.sai.direction.marwah_to_safa"))).toBeTruthy();
  });

  it("is read-only on TV / locked steps", async () => {
    const { onCount, view } = renderCounter({ laps: 0, readOnly: true });
    await view;
    expect(screen.queryByRole("button", { name: i18n.t("umrahMode.counter.undo") })).toBeNull();
    fireEvent.press(screen.getByRole("button", { name: tile("tawaf", 1) }));
    expect(onCount).not.toHaveBeenCalled();
  });

  it("formats lap durations as m:ss", () => {
    expect(formatLapDuration(65_000)).toBe("1:05");
    expect(formatLapDuration(-5)).toBe("0:00");
  });
});
