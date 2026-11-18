import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { IdleMount } from "@/components/idle-mount";
import { runWhenIdle } from "@/lib/run-when-idle";

// jest.setup runs idle tasks synchronously; capture them here to observe the deferred mount.
jest.mock("@/lib/run-when-idle", () => ({ runWhenIdle: jest.fn() }));

const cancel = jest.fn();
let idleTask: () => void = () => {};

beforeEach(() => {
  cancel.mockClear();
  jest.mocked(runWhenIdle).mockImplementation((task) => {
    idleTask = task;
    return { cancel };
  });
});

const renderIdle = () =>
  render(
    <IdleMount fallback={<Text>shell</Text>}>
      <Text>content</Text>
    </IdleMount>,
  );

describe("IdleMount", () => {
  it("shows the fallback until the JS thread is idle", async () => {
    await renderIdle();

    expect(screen.getByText("shell")).toBeTruthy();
    expect(screen.queryByText("content")).toBeNull();
  });

  it("mounts children once idle", async () => {
    await renderIdle();

    await act(async () => idleTask());

    expect(screen.getByText("content")).toBeTruthy();
  });

  it("renders nothing by default while waiting", async () => {
    await render(
      <IdleMount>
        <Text>content</Text>
      </IdleMount>,
    );

    expect(screen.toJSON()).toBeNull();
  });

  it("cancels the idle task on unmount", async () => {
    const { unmount } = await renderIdle();

    await unmount();

    expect(cancel).toHaveBeenCalled();
  });
});
