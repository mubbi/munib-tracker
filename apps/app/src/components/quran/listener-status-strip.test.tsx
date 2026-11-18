import { fireEvent, screen } from "@testing-library/react-native";

import { ListenerStatusStrip } from "@/components/quran/listener-status-strip";
import type { ListenerState } from "@/lib/quran-companion/model/download-job";
import { buildRecitationManifest } from "@/test-support/fixtures/quran-companion";
import { usePlatform } from "@/test-support/platform";
import { renderWithTheme } from "@/test-support/render";

function listener(overrides: Partial<ListenerState> = {}): ListenerState {
  return {
    status: "not-downloaded",
    engine: "tilawa-zipformer",
    manifest: null,
    bytesDone: 0,
    bytesTotal: 0,
    error: null,
    ...overrides,
  };
}

async function renderStrip(state: ListenerState, online = true) {
  const props = { onDownload: jest.fn(), onCancel: jest.fn() };
  await renderWithTheme(
    <ListenerStatusStrip listener={state} online={online} sizeMb={120} {...props} />,
  );
  return props;
}

describe("ListenerStatusStrip", () => {
  it.each([
    [
      "ready",
      listener({ status: "ready", manifest: buildRecitationManifest() }),
      "Listener ready",
      /never uploaded/,
    ],
    [
      "downloading",
      listener({ status: "downloading", bytesDone: 512, bytesTotal: 2048 }),
      "Downloading the listener · 25%",
      "512 B of 2.0 KB",
    ],
    [
      "verifying",
      listener({ status: "verifying", bytesDone: 10, bytesTotal: 10 }),
      "Checking the file",
      "10 B of 10 B",
    ],
    [
      "failed",
      listener({ status: "failed", error: "no-connection" }),
      "The download didn't finish",
      "No connection. You can still listen and reveal the words.",
    ],
    [
      "failed without a code",
      listener({ status: "failed" }),
      "The download didn't finish",
      /^Something went wrong\./,
    ],
    [
      "unsupported",
      listener({ status: "unsupported" }),
      "The listener isn't available on this device.",
      "You can still listen and reveal the words.",
    ],
    ["missing", listener(), "Follow your voice", /Download the on-device listener \(120 MB\)/],
  ])("describes the %s state", async (_name, state, title, subtitle) => {
    await renderStrip(state);
    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText(subtitle)).toBeTruthy();
  });

  it("asks to connect when missing and offline", async () => {
    await renderStrip(listener(), false);
    expect(screen.getByText(/Connect once to download the listener/)).toBeTruthy();
  });

  it.each([
    ["ready", listener({ status: "ready", manifest: buildRecitationManifest() }), true],
    ["unsupported", listener({ status: "unsupported" }), true],
    ["missing", listener(), false],
  ])("offers no download or cancel when %s", async (_name, state, online) => {
    await renderStrip(state, online);
    expect(screen.queryByText("Download")).toBeNull();
    expect(screen.queryByText("Cancel")).toBeNull();
  });

  it("cancels a download in progress", async () => {
    const props = await renderStrip(listener({ status: "downloading", bytesTotal: 100 }));
    await fireEvent.press(screen.getByText("Cancel"));
    expect(props.onCancel).toHaveBeenCalled();
  });

  it.each([
    ["Download", listener()],
    ["Try again", listener({ status: "failed" })],
  ])("starts a download from %p", async (label, state) => {
    const props = await renderStrip(state);
    await fireEvent.press(screen.getByText(label));
    expect(props.onDownload).toHaveBeenCalled();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("uses browser copy when unsupported", async () => {
      await renderStrip(listener({ status: "unsupported" }));
      expect(screen.getByText("This browser can't run the listener.")).toBeTruthy();
    });
  });
});
