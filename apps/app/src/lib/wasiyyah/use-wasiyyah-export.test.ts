import type { WasiyyahData } from "@munib-tracker/shared/types";
import { act, renderHook } from "@testing-library/react-native";

import { exportPrintableDocument } from "@/lib/printable/export-document";

import { useWasiyyahExport, wasiyyahShahadah } from "./use-wasiyyah-export";
import { emptyWasiyyahData } from "./wasiyyah";

jest.mock("@/lib/printable/export-document", () => ({
  exportPrintableDocument: jest.fn(async () => "shared"),
}));

const exportDoc = exportPrintableDocument as jest.Mock;

function data(): WasiyyahData {
  return {
    ...emptyWasiyyahData("2026-11-23", "USD"),
    testator: { name: "Aminah", date: "2026-11-23" },
    witnesses: ["Ali", "Umar"],
  };
}

beforeEach(() => exportDoc.mockClear());

describe("useWasiyyahExport (D30)", () => {
  it("exports the rendered will under the testator's dated file name", async () => {
    const { result } = await renderHook(() => useWasiyyahExport());

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current(data());
    });

    expect(outcome).toBe("shared");
    const [html, fileName, dialogTitle, options] = exportDoc.mock.calls[0] as unknown[];
    expect(html).toContain("Aminah");
    expect(html).toContain(wasiyyahShahadah().arabic);
    expect(fileName).toBe("wasiyyah-2026-11-23");
    expect(dialogTitle).toBeTruthy();
    expect(options).toBeUndefined();
  });

  it("opens the print dialog when asked (Preview / print)", async () => {
    const { result } = await renderHook(() => useWasiyyahExport());
    await act(async () => {
      await result.current(data(), { mode: "print" });
    });
    expect(exportDoc).toHaveBeenCalledWith(
      expect.any(String),
      "wasiyyah-2026-11-23",
      expect.any(String),
      { mode: "print" },
    );
  });
});
