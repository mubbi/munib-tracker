import { render, screen } from "@testing-library/react-native";
import { createRef } from "react";
import { Text } from "react-native";

import PagerView, { type PagerViewHandle } from "@/components/quran/pager-view";

const mockSetPage = jest.fn();

jest.mock("react-native-pager-view", () => {
  const { Component, createElement } = require("react");
  const { View } = require("react-native");
  class MockPager extends Component<Record<string, unknown>> {
    setPage(page: number) {
      mockSetPage(page);
    }
    render() {
      return createElement(View, { testID: "native-pager", ...this.props });
    }
  }
  return { __esModule: true, default: MockPager };
});

async function renderPager() {
  const ref = createRef<PagerViewHandle>();
  await render(
    <PagerView ref={ref} initialPage={1} offscreenPageLimit={2}>
      <Text key="a">first</Text>
      <Text key="b">second</Text>
    </PagerView>,
  );
  return ref;
}

describe("PagerView (native)", () => {
  it("forwards props and pages to the native pager", async () => {
    await renderPager();
    const pager = screen.getByTestId("native-pager");
    expect(pager.props.initialPage).toBe(1);
    expect(pager.props.offscreenPageLimit).toBe(2);
    expect(screen.getByText("second")).toBeTruthy();
  });

  it("exposes setPage through its ref", async () => {
    const ref = await renderPager();
    ref.current?.setPage(4);
    expect(mockSetPage).toHaveBeenCalledWith(4);
  });
});
