import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { LinkedDuaCard } from "@/components/learn-guide/linked-dua-card";
import { loadDuaItems } from "@/lib/content-loaders";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/components/content/reading-card", () => {
  const { Pressable, Text } = require("react-native");
  return {
    ReadingCard: (props: {
      item: { title: string };
      sourceHref?: string;
      isFavorite: boolean;
      onToggleFavorite: () => void;
    }) => (
      <Pressable accessibilityLabel="toggle-favorite" onPress={props.onToggleFavorite}>
        <Text>{`${props.item.title}|${props.sourceHref}|${props.isFavorite ? "fav" : "plain"}`}</Text>
      </Pressable>
    ),
  };
});

describe("LinkedDuaCard", () => {
  it("renders the bundled dua and toggles it as a favorite", async () => {
    const [dua] = await loadDuaItems();
    await renderWithTheme(<LinkedDuaCard duaId={dua.id} sourceHref="/dua/x" />);
    await waitFor(() => expect(screen.getByText(`${dua.title}|/dua/x|plain`)).toBeTruthy());
    await fireEvent.press(screen.getByLabelText("toggle-favorite"));
    await waitFor(() => expect(screen.getByText(`${dua.title}|/dua/x|fav`)).toBeTruthy());
  });

  it("renders nothing for an unknown dua", async () => {
    await renderWithTheme(<LinkedDuaCard duaId="does-not-exist" />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByLabelText("toggle-favorite")).toBeNull();
  });

  it("ignores a load that resolves after unmount", async () => {
    const utils = await renderWithTheme(<LinkedDuaCard duaId="does-not-exist" />);
    await utils.unmount();
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.queryByLabelText("toggle-favorite")).toBeNull();
  });
});
