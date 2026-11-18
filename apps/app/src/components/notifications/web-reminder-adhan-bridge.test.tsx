import { render } from "@testing-library/react-native";

import { WebReminderAdhanBridge } from "@/components/notifications/web-reminder-adhan-bridge";
import { mockAudioPlayer, resetAudioPlayerMock } from "@/test-support/mocks/audio-player-provider";

let mockHandler: (() => void) | null = null;

jest.mock(
  "@/providers/audio-player-provider",
  () => require("@/test-support/mocks/audio-player-provider").audioPlayerProviderMock,
);
jest.mock("@/lib/notifications/web-adhan-playback", () => ({
  setWebAdhanPlaybackHandler: (next: (() => void) | null) => {
    mockHandler = next;
  },
}));

describe("WebReminderAdhanBridge", () => {
  beforeEach(() => {
    resetAudioPlayerMock();
    mockHandler = null;
  });

  it("plays the adhan from the tracker when a reminder fires", async () => {
    await render(<WebReminderAdhanBridge />);
    mockHandler?.();
    expect(mockAudioPlayer.play).toHaveBeenCalledWith([expect.any(Object)], 0, {
      sourceHref: "/tracker",
    });
  });

  it("unregisters on unmount", async () => {
    const utils = await render(<WebReminderAdhanBridge />);
    await utils.unmount();
    expect(mockHandler).toBeNull();
  });
});
