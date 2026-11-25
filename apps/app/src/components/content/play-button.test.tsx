import { fireEvent, screen } from "@testing-library/react-native";

import { PlayButton } from "@/components/content/play-button";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";
import { renderWithTheme } from "@/test-support/render";

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);

describe("PlayButton", () => {
  beforeEach(resetAudioPlayerMock);

  it("starts playback when idle", async () => {
    const onPlay = jest.fn();
    await renderWithTheme(<PlayButton trackId="t1" onPlay={onPlay} />);
    await fireEvent.press(screen.getByLabelText("Play"));
    expect(onPlay).toHaveBeenCalledTimes(1);
  });

  it("shows pause while its own track plays and toggles it", async () => {
    mockAudioPlayer.current = { id: "t1" };
    mockAudioPlayer.isPlaying = true;
    const onPlay = jest.fn();
    await renderWithTheme(<PlayButton trackId="t1" onPlay={onPlay} />);
    await fireEvent.press(screen.getByLabelText("Pause"));
    expect(mockAudioPlayer.toggle).toHaveBeenCalledTimes(1);
    expect(onPlay).not.toHaveBeenCalled();
  });

  it("ignores another track's playback", async () => {
    mockAudioPlayer.current = { id: "other" };
    mockAudioPlayer.isPlaying = true;
    await renderWithTheme(<PlayButton trackId="t1" onPlay={jest.fn()} />);
    expect(screen.getByLabelText("Play")).toBeTruthy();
  });

  it("is busy while its track buffers", async () => {
    mockAudioPlayer.current = { id: "t1" };
    mockAudioPlayer.isBuffering = true;
    await renderWithTheme(<PlayButton trackId="t1" onPlay={jest.fn()} />);
    expect(screen.getByLabelText("Loading…")).toBeTruthy();
  });
});
