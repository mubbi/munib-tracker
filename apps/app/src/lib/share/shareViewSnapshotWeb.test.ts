import { installBrowser } from "@/test-support/browser";

import {
  dataUriToBlob,
  downloadSnapshotOnWeb,
  isNavigatorShareAbortError,
  isNavigatorShareNotAllowedError,
  sharePreparedWebFile,
  shareSnapshotOnWeb,
} from "./shareViewSnapshotWeb";

const PNG_URI = "data:image/png;base64,iVBORw0KGgo=";
const OPTIONS = { filename: "proof.png", dialogTitle: "Share" };

const named = (name: string, message = name) => Object.assign(new Error(message), { name });

let restore: () => void = () => {};
let anchor: { click: jest.Mock; style: Record<string, string>; href?: string; download?: string };

/** Browser with an optional Web Share API and a stub document for downloads. */
function setup({ share, canShare }: { share?: jest.Mock; canShare?: jest.Mock } = {}) {
  anchor = { click: jest.fn(), style: {} };
  const body = { appendChild: jest.fn(), removeChild: jest.fn() };
  restore = installBrowser({
    navigator: { share, canShare },
    window: { document: { createElement: jest.fn(() => anchor), body } },
  });
  return { share, canShare, body };
}

afterEach(() => restore());

describe("error classifiers", () => {
  it.each([
    [named("AbortError"), true],
    [new DOMException("x", "AbortError"), true],
    [named("TypeError"), false],
    ["AbortError", false],
  ])("isNavigatorShareAbortError(%p) is %p", (error, expected) => {
    expect(isNavigatorShareAbortError(error)).toBe(expected);
  });

  it.each([
    [named("NotAllowedError"), true],
    [new DOMException("x", "NotAllowedError"), true],
    [new Error("Must be handling a user gesture"), true],
    [new Error("Transient activation required"), true],
    [new Error("boom"), false],
  ])("isNavigatorShareNotAllowedError(%p) is %p", (error, expected) => {
    expect(isNavigatorShareNotAllowedError(error)).toBe(expected);
  });
});

describe("dataUriToBlob", () => {
  it("decodes base64 payloads with their mime type", async () => {
    const blob = dataUriToBlob(PNG_URI);
    expect(blob.type).toBe("image/png");
    expect(blob.size).toBe(8);
  });

  it("decodes percent-encoded payloads", async () => {
    const blob = dataUriToBlob("data:text/plain,hi%20there");
    expect(blob.type).toBe("text/plain");
    expect(await blob.text()).toBe("hi there");
  });

  it("uses the fallback mime type when the header has none", () => {
    expect(dataUriToBlob("data:;base64,AA==", "image/jpeg").type).toBe("image/jpeg");
  });

  it.each(["https://x/y.png", "data:image/png;base64"])("rejects %s", (uri) => {
    expect(() => dataUriToBlob(uri)).toThrow("INVALID_DATA_URI");
  });
});

describe("downloadSnapshotOnWeb", () => {
  it("clicks a hidden download link and removes it", () => {
    const { body } = setup();
    downloadSnapshotOnWeb(PNG_URI, "proof.png");
    expect(anchor).toMatchObject({
      href: PNG_URI,
      download: "proof.png",
      style: { display: "none" },
    });
    expect(anchor.click).toHaveBeenCalled();
    expect(body.removeChild).toHaveBeenCalledWith(anchor);
  });
});

describe("shareSnapshotOnWeb", () => {
  it("downloads when the Web Share API is missing", async () => {
    setup();
    expect(await shareSnapshotOnWeb(PNG_URI, OPTIONS)).toEqual({ status: "unavailable" });
    expect(anchor.click).toHaveBeenCalled();
  });

  it("shares the file-only payload first", async () => {
    const { share } = setup({ share: jest.fn(async () => undefined) });
    expect(await shareSnapshotOnWeb(PNG_URI, { ...OPTIONS, message: "text" })).toEqual({
      status: "shared",
    });
    expect(share).toHaveBeenCalledTimes(1);
    expect(share.mock.calls[0][0]).not.toHaveProperty("text");
  });

  it("reports aborted when the user dismisses the sheet", async () => {
    setup({ share: jest.fn(async () => Promise.reject(named("AbortError"))) });
    expect(await shareSnapshotOnWeb(PNG_URI, OPTIONS)).toEqual({ status: "aborted" });
  });

  it("asks for another tap when the gesture expired", async () => {
    setup({ share: jest.fn(async () => Promise.reject(named("NotAllowedError"))) });
    const result = await shareSnapshotOnWeb(PNG_URI, { ...OPTIONS, message: "text" });
    expect(result).toMatchObject({ status: "needsUserGesture" });
    expect(result.status === "needsUserGesture" && result.payloads).toHaveLength(2);
  });

  it("retries payloads canShare rejected, then downloads on failure", async () => {
    const { share } = setup({
      share: jest.fn(async () => Promise.reject(new Error("boom"))),
      canShare: jest.fn(() => false),
    });
    expect(await shareSnapshotOnWeb(PNG_URI, OPTIONS)).toEqual({ status: "unavailable" });
    expect(share).toHaveBeenCalledTimes(1);
    expect(anchor.click).toHaveBeenCalled();
  });

  it("treats a throwing canShare as unsupported for that payload", async () => {
    const { share } = setup({
      share: jest.fn(async () => undefined),
      canShare: jest.fn(() => {
        throw new Error("bad payload");
      }),
    });
    expect(await shareSnapshotOnWeb(PNG_URI, OPTIONS)).toEqual({ status: "shared" });
    expect(share).toHaveBeenCalledTimes(1);
  });
});

describe("sharePreparedWebFile", () => {
  const file = new File(["x"], "proof.png");
  const payloads = [{ files: [file], title: "Share" }];

  it("is unavailable without the Web Share API", async () => {
    setup();
    expect(await sharePreparedWebFile(payloads)).toEqual({ status: "unavailable" });
  });

  it.each([
    [async () => undefined, { status: "shared" }],
    [async () => Promise.reject(named("AbortError")), { status: "aborted" }],
    [
      async () => Promise.reject(named("NotAllowedError")),
      { status: "needsUserGesture", file, payloads },
    ],
    [async () => Promise.reject(new Error("boom")), { status: "unavailable" }],
  ])("maps a share outcome to %o", async (impl, expected) => {
    setup({ share: jest.fn(impl) });
    expect(await sharePreparedWebFile(payloads)).toEqual(expected);
  });
});
