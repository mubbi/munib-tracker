import type { Ayah } from "@munib-tracker/shared/types";
import { render, screen } from "@testing-library/react-native";
import { createRef } from "react";
import { type FlatList, Text } from "react-native";

import { AyahSeparator, ayahKeyExtractor, SurahAyahList } from "@/components/quran/ayah-reader";
import { buildAyah } from "@/test-support/fixtures/quran";
import { usePlatform } from "@/test-support/platform";

const AYAHS = [1, 2, 3].map((n) => buildAyah({ ayah: n, global: n, arabic: `ayah-${n}` }));

type Props = Parameters<typeof SurahAyahList>[0];

async function renderList(overrides: Partial<Props> = {}) {
  const listRef = createRef<FlatList<Ayah>>();
  await render(
    <SurahAyahList
      listRef={listRef}
      data={AYAHS}
      keyExtractor={ayahKeyExtractor}
      renderItem={({ item }) => <Text>{item.arabic}</Text>}
      ItemSeparatorComponent={AyahSeparator}
      testID="ayah-list"
      {...overrides}
    />,
  );
  return listRef;
}

function list() {
  return screen.getByTestId("ayah-list");
}

describe("SurahAyahList", () => {
  it("renders ayah rows and attaches the list ref", async () => {
    const ref = await renderList();
    expect(screen.getByText("ayah-1")).toBeTruthy();
    expect(ref.current).toBeTruthy();
  });

  it.each([
    [{}, true],
    [{ heavyRows: true }, true],
    [{ removeClippedSubviews: false }, false],
  ])("clips subviews for %j: %p", async (overrides, clipped) => {
    await renderList(overrides);
    expect(list().props.removeClippedSubviews).toBe(clipped);
  });

  describe("on TV", () => {
    usePlatform({ isTV: true });

    it("disables clipping", async () => {
      await renderList();
      expect(list().props.removeClippedSubviews).toBe(false);
    });
  });
});

describe("ayahKeyExtractor", () => {
  it("keys rows by ayah number", () => {
    expect(ayahKeyExtractor(buildAyah({ ayah: 2 }))).toBe("2");
  });
});
