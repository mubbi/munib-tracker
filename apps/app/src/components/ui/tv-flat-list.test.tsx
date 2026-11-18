import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { TvFlatList } from "@/components/ui/tv-flat-list";
import { setPlatform } from "@/test-support/platform";

const renderList = (focusable?: boolean) =>
  render(
    <TvFlatList
      testID="list"
      focusable={focusable}
      data={["a", "b"]}
      keyExtractor={(item) => item}
      renderItem={({ item }) => <Text>{item}</Text>}
    />,
  );

describe("TvFlatList", () => {
  let restorePlatform = () => {};
  afterEach(() => restorePlatform());

  it.each([
    [false, undefined, true],
    [true, undefined, false],
    [true, true, true],
  ])("isTV=%s focusable=%s → list focusable %s", async (tv, focusable, expected) => {
    restorePlatform = setPlatform({ isTV: tv });
    await renderList(focusable);

    expect(screen.getByTestId("list").props.focusable).toBe(expected);
  });

  it("renders its rows", async () => {
    await renderList();

    expect(screen.getByText("b")).toBeTruthy();
  });
});
