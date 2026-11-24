import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { captureAppException } from "@/lib/sentry";
import {
  mockDeletePath,
  mockNativeFileStore,
  mockNativeFiles,
  resetNativeFileStoreMock,
} from "@/test-support/mocks/native-file-store";
import { setPlatform } from "@/test-support/platform";

import { exportPrintableDocument } from "./export-document";

jest.mock(
  "@/lib/native-file-store",
  () => require("@/test-support/mocks/native-file-store").nativeFileStoreMock,
);
jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));
jest.mock("expo-print", () => ({
  printToFileAsync: jest.fn(),
  printAsync: jest.fn(async () => undefined),
}));
jest.mock("@/lib/sentry", () => ({ captureAppException: jest.fn() }));
// jest-expo always fakes `ExpoPrint`; toggle it to model a binary built before D30.
let mockHasExpoPrint = true;
const expoModule = require("expo") as typeof import("expo");
const realRequireOptional = expoModule.requireOptionalNativeModule;
jest
  .spyOn(expoModule, "requireOptionalNativeModule")
  .mockImplementation(((name: string) =>
    name === "ExpoPrint"
      ? mockHasExpoPrint
        ? {}
        : null
      : realRequireOptional(name)) as typeof realRequireOptional);

const printToFile = Print.printToFileAsync as jest.Mock;
const printAsync = Print.printAsync as jest.Mock;
const shareAsync = Sharing.shareAsync as jest.Mock;
const isAvailable = Sharing.isAvailableAsync as jest.Mock;
const capture = captureAppException as jest.Mock;

const HTML = "<html><body>Statement</body></html>";
const RENDERED = "file:///cache/Print/3F2A.pdf";
const PDF = "file:///cache/printable/debts-2026-11-24.pdf";
const HTML_FILE = "file:///cache/printable/debts-2026-11-24.html";

function exportDoc(mode?: "share" | "print") {
  return exportPrintableDocument(HTML, "debts 2026-11-24", "Statement", mode ? { mode } : {});
}

beforeEach(() => {
  resetNativeFileStoreMock();
  isAvailable.mockResolvedValue(true);
  shareAsync.mockReset().mockResolvedValue(undefined);
  printAsync.mockReset().mockResolvedValue(undefined);
  printToFile.mockReset().mockImplementation(async () => {
    mockNativeFiles.set(RENDERED, { size: 2048 });
    return { uri: RENDERED, numberOfPages: 1 };
  });
  capture.mockClear();
  mockHasExpoPrint = true;
});

describe("with expo-print (D30)", () => {
  it("renders a PDF, shares it under the document's name, then deletes it", async () => {
    let filesWhileSharing: string[] = [];
    shareAsync.mockImplementation(async () => {
      filesWhileSharing = [...mockNativeFiles.keys()];
    });

    await expect(exportDoc()).resolves.toBe("shared");

    expect(printToFile).toHaveBeenCalledWith({ html: HTML });
    expect(shareAsync).toHaveBeenCalledWith(PDF, {
      mimeType: "application/pdf",
      UTI: "com.adobe.pdf",
      dialogTitle: "Statement",
    });
    expect(filesWhileSharing).toEqual([PDF]);
    expect(mockNativeFiles.size).toBe(0);
  });

  it("deletes the PDF even when the share sheet fails", async () => {
    shareAsync.mockRejectedValue(new Error("share failed"));
    await expect(exportDoc()).rejects.toThrow("share failed");
    expect(mockDeletePath).toHaveBeenCalledWith(PDF);
    expect(mockNativeFiles.size).toBe(0);
  });

  it("falls back to sharing the HTML when PDF rendering fails", async () => {
    printToFile.mockRejectedValue(new Error("WebView crashed"));
    await expect(exportDoc()).resolves.toBe("shared");
    expect(capture).toHaveBeenCalledWith(expect.any(Error), {
      tags: { area: "printable", phase: "pdf" },
    });
    expect(shareAsync).toHaveBeenCalledWith(HTML_FILE, {
      mimeType: "text/html",
      UTI: "public.html",
      dialogTitle: "Statement",
    });
    expect(mockDeletePath).toHaveBeenCalledWith(HTML_FILE);
  });

  it("opens the system print dialog in print mode without writing a file", async () => {
    await expect(exportDoc("print")).resolves.toBe("printed");
    expect(printAsync).toHaveBeenCalledWith({ html: HTML });
    expect(printToFile).not.toHaveBeenCalled();
    expect(shareAsync).not.toHaveBeenCalled();
  });

  it("treats a dismissed print dialog as done", async () => {
    printAsync.mockRejectedValue(new Error("Printing did not complete"));
    await expect(exportDoc("print")).resolves.toBe("printed");
    expect(shareAsync).not.toHaveBeenCalled();
    expect(capture).not.toHaveBeenCalled();
  });

  it("falls back to the PDF share sheet when printing errors", async () => {
    printAsync.mockRejectedValue(new Error("No print service"));
    await expect(exportDoc("print")).resolves.toBe("shared");
    expect(shareAsync).toHaveBeenCalledWith(PDF, expect.objectContaining({ UTI: "com.adobe.pdf" }));
  });

  it("is unavailable without a share sheet or cache directory", async () => {
    isAvailable.mockResolvedValue(false);
    await expect(exportDoc()).resolves.toBe("unavailable");
    mockNativeFileStore.cacheDir = null;
    isAvailable.mockResolvedValue(true);
    await expect(exportDoc()).resolves.toBe("unavailable");
    expect(printToFile).not.toHaveBeenCalled();
  });
});

describe("without the expo-print native module (binary built before D30)", () => {
  beforeEach(() => {
    mockHasExpoPrint = false;
  });

  it("shares the HTML file and never touches expo-print", async () => {
    await expect(exportDoc()).resolves.toBe("shared");
    expect(printToFile).not.toHaveBeenCalled();
    expect(shareAsync).toHaveBeenCalledWith(
      HTML_FILE,
      expect.objectContaining({ UTI: "public.html" }),
    );
    expect(mockDeletePath).toHaveBeenLastCalledWith(HTML_FILE);
  });

  it("print mode falls back to the HTML share sheet", async () => {
    await expect(exportDoc("print")).resolves.toBe("shared");
    expect(printAsync).not.toHaveBeenCalled();
    expect(shareAsync).toHaveBeenCalledWith(HTML_FILE, expect.anything());
  });
});

describe("on TV", () => {
  it("is unavailable (records are hidden on TV)", async () => {
    const restorePlatform = setPlatform({ isTV: true });
    try {
      await expect(exportDoc()).resolves.toBe("unavailable");
      await expect(exportDoc("print")).resolves.toBe("unavailable");
    } finally {
      restorePlatform();
    }
    expect(printToFile).not.toHaveBeenCalled();
    expect(printAsync).not.toHaveBeenCalled();
    expect(shareAsync).not.toHaveBeenCalled();
  });
});
