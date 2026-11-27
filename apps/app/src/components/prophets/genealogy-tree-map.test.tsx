import { act, fireEvent, screen } from "@testing-library/react-native";

import { GenealogyTreeMap, shouldMapCaptureWheel } from "@/components/prophets/genealogy-tree-map";
import i18n from "@/i18n";
import { getProphetsGenealogyNodes } from "@/lib/prophets-genealogy";
import { mockGestures, resetGestureMocks } from "@/test-support/mocks/gesture-handler";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "react-native-gesture-handler",
  () => require("@/test-support/mocks/gesture-handler").gestureHandlerMock,
);

const MAP_LABEL = "Interactive prophets family tree map";
const nodes = getProphetsGenealogyNodes();

type Props = Parameters<typeof GenealogyTreeMap>[0];

async function renderMap(props: Partial<Props> = {}) {
  const onSelect = jest.fn();
  await renderWithTheme(
    <GenealogyTreeMap
      nodes={nodes}
      selectedId={null}
      onSelect={onSelect}
      height={480}
      {...props}
    />,
  );
  return { onSelect };
}

describe("GenealogyTreeMap", () => {
  afterEach(resetGestureMocks);

  it("selects a node on press", async () => {
    const { onSelect } = await renderMap();
    await fireEvent.press(screen.getByLabelText(/^Ibrahim, /));
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "ibrahim" }));
  });

  it("renders the certainty legend", async () => {
    await renderMap();
    expect(screen.getByText("Lineage (parent → child)")).toBeTruthy();
    expect(screen.getByText("Siblings")).toBeTruthy();
  });

  it("marks only the selected node as selected", async () => {
    await renderMap({
      selectedId: "ismail",
      highlightIds: new Set(["ibrahim", "ismail"]),
      focusId: "ismail",
    });
    expect(screen.getByLabelText(/^Ismail, /).props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true }),
    );
    expect(screen.getByLabelText(/^Adam, /).props.accessibilityState).toEqual(
      expect.objectContaining({ selected: false }),
    );
  });

  it("ignores unknown focus ids and empty highlight sets", async () => {
    await renderMap({ focusId: "missing", highlightIds: new Set() });
    expect(screen.getByLabelText(/^Nuh, /)).toBeTruthy();
  });

  it.each(["Zoom in", "Zoom out", "Fit tree to screen"])(
    "handles the %s control",
    async (label) => {
      await renderMap();
      await fireEvent.press(screen.getByLabelText(label));
      expect(screen.getByLabelText(MAP_LABEL)).toBeTruthy();
    },
  );

  it("ignores zero-width layouts and accepts real widths", async () => {
    await renderMap();
    const viewport = screen.getByLabelText(MAP_LABEL);
    await fireEvent(viewport, "layout", { nativeEvent: { layout: { width: 0, height: 300 } } });
    await fireEvent(viewport, "layout", { nativeEvent: { layout: { width: 640, height: 300 } } });
    expect(viewport.props.accessibilityHint).toBe("Pinch to zoom, drag to pan, double-tap to fit");
  });

  it("wires pinch, pan and double-tap gestures", async () => {
    await renderMap();
    await act(async () => {
      mockGestures.pinch?.onUpdate?.({ scale: 2, focalX: 100, focalY: 80 });
      mockGestures.pinch?.onDeactivate?.();
      mockGestures.pan?.onUpdate?.({ translationX: 20, translationY: -10 });
      mockGestures.pan?.onDeactivate?.();
      mockGestures.tap?.onActivate?.();
    });
    expect(screen.getByTestId("gesture-detector")).toBeTruthy();
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("skips the gesture detector and the pan hint", async () => {
      await renderMap();
      expect(screen.queryByTestId("gesture-detector")).toBeNull();
      expect(screen.getByLabelText(MAP_LABEL).props.accessibilityHint).toBeUndefined();
    });
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("uses the web pan hint", async () => {
      await renderMap();
      expect(screen.getByLabelText(MAP_LABEL).props.accessibilityHint).toBe(
        i18n.t("prophets.tree.panHintWeb"),
      );
    });

    it("uses the grab cursor", async () => {
      await renderMap({ height: 360 });
      expect(JSON.stringify(screen.getByLabelText(MAP_LABEL).props.style)).toContain("grab");
    });
  });
});

describe("shouldMapCaptureWheel (G-32)", () => {
  it.each([
    [{ ctrlKey: false, metaKey: false }, false, false],
    [{ ctrlKey: true, metaKey: false }, false, true],
    [{ ctrlKey: false, metaKey: true }, false, true],
    [{ ctrlKey: false, metaKey: false }, true, true],
  ])("wheel %o with engaged=%s captures: %s", (event, engaged, expected) => {
    expect(shouldMapCaptureWheel(event, engaged)).toBe(expected);
  });
});
