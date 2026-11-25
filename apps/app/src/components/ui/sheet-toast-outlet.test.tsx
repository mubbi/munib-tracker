import { act, fireEvent, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import type { TestInstance } from "test-renderer";

import { Sheet } from "@/components/ui/sheet";
import { ToastHost, ToastProvider, useToast } from "@/providers/toast-provider";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock("@/lib/haptics", () => ({ triggerHaptic: jest.fn() }));
jest.mock("@/components/ui/glass-surface", () =>
  require("@/test-support/mocks/glass-surface").glassSurfaceWithComponentMock(),
);
jest.mock(
  "expo-glass-effect",
  () => require("@/test-support/mocks/expo-glass-effect").expoGlassEffectMock,
);
jest.mock("expo-blur", () => require("@/test-support/mocks/expo-blur").expoBlurMock);
jest.mock(
  "@/providers/blur-target-provider",
  () => require("@/test-support/mocks/blur-target-provider").blurTargetProviderMock,
);

/** Sheets are `accessibilityViewIsModal`, which hides siblings from RNTL's default queries. */
const hidden = { includeHiddenElements: true };

type Api = ReturnType<typeof useToast>;
let api: Api;

function Harness({
  firstOpen = true,
  secondOpen = false,
  rootHost = true,
}: {
  firstOpen?: boolean;
  secondOpen?: boolean;
  rootHost?: boolean;
}) {
  api = useToast();
  return (
    <>
      <Sheet visible={firstOpen} onClose={() => {}} variant="bottom" title="First sheet">
        <Text>first body</Text>
      </Sheet>
      <Sheet visible={secondOpen} onClose={() => {}} title="Second sheet">
        <Text>second body</Text>
      </Sheet>
      {rootHost ? <ToastHost /> : null}
    </>
  );
}

async function renderHarness(props: Parameters<typeof Harness>[0] = {}) {
  const ui = (p: Parameters<typeof Harness>[0]) => (
    <ToastProvider>
      <Harness {...p} />
    </ToastProvider>
  );
  const view = await renderWithTheme(ui(props));
  return { rerender: (p: Parameters<typeof Harness>[0]) => view.rerender(ui(p)) };
}

/** The `<Modal>` host whose subtree contains `node`, or `null` (root layer). */
function modalOf(node: TestInstance): TestInstance | null {
  let current: TestInstance | null = node;
  while (current) {
    if (typeof current.props.onRequestClose === "function") return current;
    current = current.parent;
  }
  return null;
}

/** The single host matching `text` (fails loudly if there are none or several). */
function onlyText(text: string): TestInstance {
  const nodes = screen.getAllByText(text, hidden);
  expect(nodes).toHaveLength(1);
  return nodes[0] as TestInstance;
}

function modalTitled(title: string): TestInstance | null {
  return modalOf(screen.getByText(title, hidden));
}

const showUndoToast = async (onUndo: jest.Mock) => {
  await act(async () => {
    api.show("Fajr marked Missed", { action: { label: "Undo", onPress: onUndo } });
  });
};

afterEach(() => {
  jest.useRealTimers();
});

describe("toasts over an open Sheet (B-01)", () => {
  it("draws the toast inside the open sheet's modal layer, not under it", async () => {
    await renderHarness();
    await showUndoToast(jest.fn());

    const layer = modalOf(onlyText("Fajr marked Missed"));
    expect(layer).not.toBeNull();
    expect(layer).toBe(modalTitled("First sheet"));
  });

  it("keeps the Undo action pressable inside the sheet", async () => {
    const onUndo = jest.fn();
    await renderHarness();
    await showUndoToast(onUndo);

    const undo = screen.getByLabelText("Undo", hidden);
    expect(modalOf(undo)).toBe(modalTitled("First sheet"));
    await fireEvent.press(undo);

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Fajr marked Missed", hidden)).toBeNull();
  });

  it("uses the top-most open sheet when sheets stack", async () => {
    const { rerender } = await renderHarness();
    await rerender({ firstOpen: true, secondOpen: true });
    await showUndoToast(jest.fn());

    expect(modalOf(onlyText("Fajr marked Missed"))).toBe(modalTitled("Second sheet"));
  });

  it("moves the toast back to the root host once every sheet closes", async () => {
    const { rerender } = await renderHarness();
    await showUndoToast(jest.fn());
    await rerender({ firstOpen: false });

    expect(modalOf(onlyText("Fajr marked Missed"))).toBeNull();
  });

  it("re-hosts the toast in a sheet that re-opens after a nested prompt", async () => {
    const { rerender } = await renderHarness();
    await rerender({ firstOpen: false, secondOpen: true });
    await rerender({ firstOpen: true, secondOpen: false });
    await showUndoToast(jest.fn());

    expect(modalOf(screen.getByText("Fajr marked Missed", hidden))).toBe(
      modalTitled("First sheet"),
    );
  });

  it("stays hidden inside sheets while the root host is unmounted (PIN lock — G-92)", async () => {
    await renderHarness({ rootHost: false });
    await showUndoToast(jest.fn());

    expect(screen.queryByText("Fajr marked Missed", hidden)).toBeNull();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("keeps the live regions on the root host and the banner in the sheet", async () => {
      await renderHarness();
      await showUndoToast(jest.fn());

      const regions = screen.container.queryAll((n) => n.props["aria-live"] === "polite");
      expect(regions).toHaveLength(1);
      expect(modalOf(regions[0] as TestInstance)).toBeNull();
      expect(modalOf(screen.getByLabelText("Undo", hidden))).toBe(modalTitled("First sheet"));
    });
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("shows the (action-less) toast above the open sheet", async () => {
      await renderHarness();
      await showUndoToast(jest.fn());

      expect(modalOf(screen.getByText("Fajr marked Missed", hidden))).toBe(
        modalTitled("First sheet"),
      );
      expect(screen.queryByLabelText("Undo", hidden)).toBeNull();
    });
  });
});

describe("Sheet without a ToastProvider", () => {
  it("renders normally (no outlet)", async () => {
    await renderWithTheme(
      <Sheet visible onClose={() => {}} title="Lonely sheet">
        <Text>body</Text>
      </Sheet>,
    );
    expect(screen.getByText("body", hidden)).toBeTruthy();
  });
});
