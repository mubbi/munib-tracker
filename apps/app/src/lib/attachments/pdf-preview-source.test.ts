import { fakeResponse, mockFetch } from "@/test-support/fetch";
import { usePlatform } from "@/test-support/platform";

import {
  buildPdfJsViewerHtml,
  isPdfViewerNavigationAllowed,
  readAttachmentAsBase64,
} from "./pdf-preview-source";

jest.mock("expo-file-system", () => ({
  File: class {
    readonly uri: string;
    constructor(mockUri: string) {
      this.uri = mockUri;
    }
    async base64() {
      return `base64:${this.uri}`;
    }
  },
}));

const mockLoadAuthedMedia = jest.fn(async (uri: string, _headers?: unknown) => uri);
jest.mock("@/lib/attachments/authed-media", () => ({
  loadAuthedMedia: (uri: string, headers?: unknown) => mockLoadAuthedMedia(uri, headers),
}));

describe("readAttachmentAsBase64 on native", () => {
  it("reads the authenticated local copy as base64", async () => {
    mockLoadAuthedMedia.mockResolvedValueOnce("file:///cache/doc.pdf");
    expect(await readAttachmentAsBase64({ uri: "https://api/doc", headers: { A: "1" } })).toBe(
      "base64:file:///cache/doc.pdf",
    );
    expect(mockLoadAuthedMedia).toHaveBeenCalledWith("https://api/doc", { A: "1" });
  });
});

describe("readAttachmentAsBase64 on web", () => {
  usePlatform({ OS: "web" });

  it("fetches the blob URL and base64-encodes its bytes", async () => {
    mockFetch(fakeResponse("ABC"));
    expect(await readAttachmentAsBase64({ uri: "blob:doc" })).toBe("QUJD");
  });

  it("rejects failed loads", async () => {
    mockFetch(fakeResponse("", { status: 404 }));
    await expect(readAttachmentAsBase64({ uri: "blob:doc" })).rejects.toThrow("(404)");
  });
});

describe("buildPdfJsViewerHtml", () => {
  it("embeds the document bytes in a PDF.js page", () => {
    const html = buildPdfJsViewerHtml("QUJD");
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html).toContain("QUJD");
  });
});

describe("PDF viewer hardening", () => {
  it("turns off PDF.js eval font compilation (CVE-2024-4367)", () => {
    expect(buildPdfJsViewerHtml("QUJD")).toContain("isEvalSupported: false");
  });

  it.each([
    ["https://localhost/", true],
    ["about:blank", true],
    ["https://evil.example/login", false],
    ["https://localhost.evil.example/", false],
    ["javascript:alert(1)", false],
    ["file:///data/user/0/app/files/x", false],
  ])("native navigation to %s allowed=%p", (url, allowed) => {
    expect(isPdfViewerNavigationAllowed(url)).toBe(allowed);
  });
});
