import { fireEvent, screen } from "@testing-library/react-native";

import { CONTENT_ACTION_ORDER, ContentActions } from "@/components/content/content-actions";
import { resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

describe("ContentActions", () => {
  beforeEach(resetAudioPlayerMock);

  it("keeps the fixed order Play, Save, Share, More", async () => {
    expect(CONTENT_ACTION_ORDER).toEqual(["play", "save", "share", "more"]);
    await renderWithTheme(
      <ContentActions
        play={{ trackId: "t", onPlay: jest.fn() }}
        save={{ saved: false, onToggle: jest.fn() }}
        share={{ onShare: jest.fn() }}
        more={{ actions: [{ id: "copy", title: "Copy" }], onAction: jest.fn() }}
      />,
    );
    const labels = screen
      .getAllByRole("button")
      .map((node) => node.props.accessibilityLabel)
      .filter(Boolean);
    expect(labels.slice(0, 4)).toEqual(["Play", "Save", "Share", "More actions"]);
  });

  it("toggles save — Saved when on (D-UX9)", async () => {
    const onToggle = jest.fn();
    await renderWithTheme(<ContentActions save={{ saved: true, onToggle }} />);
    const button = screen.getByLabelText("Saved");
    expect(button.props.accessibilityState).toEqual(expect.objectContaining({ selected: true }));
    await fireEvent.press(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("labelled rows caption each action in the same order", async () => {
    await renderWithTheme(
      <ContentActions
        labelled
        play={{ trackId: "t", onPlay: jest.fn() }}
        save={{ saved: false, onToggle: jest.fn() }}
        share={{ onShare: jest.fn(), label: "Tap to share" }}
        more={{ actions: [{ id: "report", title: "Report" }], onAction: jest.fn() }}
      />,
    );
    for (const caption of ["Play", "Save", "Tap to share", "More"]) {
      expect(screen.getByText(caption)).toBeTruthy();
    }
  });

  it("opens More actions and runs the chosen action", async () => {
    const onAction = jest.fn();
    await renderWithTheme(
      <ContentActions more={{ actions: [{ id: "copy", title: "Copy text" }], onAction }} />,
    );
    await fireEvent.press(screen.getByLabelText("More actions"));
    await fireEvent.press(await screen.findByLabelText("Copy text"));
    expect(onAction).toHaveBeenCalledWith("copy");
  });
});
