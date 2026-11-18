import { act, render, screen } from "@testing-library/react-native";
import { createRef } from "react";
import { Text } from "react-native";

import PagerView, { type PagerViewRef } from "./react-native-pager-view";

async function renderPager(initialPage?: number) {
  const ref = createRef<PagerViewRef>();
  const onPageSelected = jest.fn();
  await render(
    <PagerView ref={ref} initialPage={initialPage} onPageSelected={onPageSelected} testID="pager">
      <Text>Page A</Text>
      <Text>Page B</Text>
      <Text>Page C</Text>
    </PagerView>,
  );
  return { ref, onPageSelected };
}

describe("TV PagerView stub", () => {
  it("shows only the initial page", async () => {
    await renderPager(1);
    expect(screen.getByText("Page B")).toBeTruthy();
    expect(screen.queryByText("Page A")).toBeNull();
  });

  it("defaults to the first page", async () => {
    await renderPager();
    expect(screen.getByText("Page A")).toBeTruthy();
  });

  it("setPage clamps and reports the selected page", async () => {
    const { ref, onPageSelected } = await renderPager();
    await act(async () => ref.current?.setPage(9));
    expect(screen.getByText("Page C")).toBeTruthy();
    expect(onPageSelected).toHaveBeenCalledWith({ nativeEvent: { position: 2 } });
  });

  it("setPageWithoutAnimation clamps below zero", async () => {
    const { ref, onPageSelected } = await renderPager(2);
    await act(async () => ref.current?.setPageWithoutAnimation(-3));
    expect(screen.getByText("Page A")).toBeTruthy();
    expect(onPageSelected).toHaveBeenCalledWith({ nativeEvent: { position: 0 } });
  });
});
