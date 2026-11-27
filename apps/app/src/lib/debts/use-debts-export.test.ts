import { act, renderHook } from "@testing-library/react-native";

import { exportPrintableDocument } from "@/lib/printable/export-document";

import { makeDebt } from "./test-fixtures";
import { useDebtsStatementExport } from "./use-debts-export";

jest.mock("@/lib/printable/export-document", () => ({
  exportPrintableDocument: jest.fn(async () => "shared"),
}));

const exportDoc = exportPrintableDocument as jest.Mock;

beforeEach(() => exportDoc.mockClear());

describe("useDebtsStatementExport (D30)", () => {
  it("exports the rendered statement under a dated file name", async () => {
    const { result } = await renderHook(() => useDebtsStatementExport());
    const input = {
      debts: [makeDebt({ counterparty: "Yusuf <b>" })],
      obligations: [],
      today: "2026-11-24",
    };

    let outcome: unknown;
    await act(async () => {
      outcome = await result.current(input);
    });

    expect(outcome).toBe("shared");
    expect(exportDoc).toHaveBeenCalledTimes(1);
    const [html, fileName, dialogTitle, options] = exportDoc.mock.calls[0] as unknown[];
    expect(html).toMatch(/^<!doctype html>/i);
    expect(html).toContain("Yusuf &lt;b&gt;");
    expect(fileName).toBe("debts-2026-11-24");
    expect(dialogTitle).toBeTruthy();
    expect(options).toBeUndefined();
  });

  it("passes the print mode through", async () => {
    const { result } = await renderHook(() => useDebtsStatementExport());
    await act(async () => {
      await result.current({ debts: [], obligations: [], today: "2026-11-24" }, { mode: "print" });
    });
    expect(exportDoc).toHaveBeenCalledWith(
      expect.any(String),
      "debts-2026-11-24",
      expect.any(String),
      {
        mode: "print",
      },
    );
  });
});
