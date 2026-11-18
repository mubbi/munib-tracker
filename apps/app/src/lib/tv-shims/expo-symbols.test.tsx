import { render } from "@testing-library/react-native";
import { SymbolView as BaseSymbolView } from "expo-symbols";

import { TV_DENSITY } from "@/constants/tv-density";

import { SymbolView } from "./expo-symbols";

jest.mock("expo-symbols", () => ({ SymbolView: jest.fn(() => null) }));

const base = jest.mocked(BaseSymbolView);

describe("TV SymbolView shim", () => {
  beforeEach(() => base.mockClear());

  it("scales an explicit size by the TV density", async () => {
    await render(<SymbolView name="star" size={10} />);
    expect(base.mock.calls[0][0]).toMatchObject({ name: "star", size: 10 * TV_DENSITY });
  });

  it("scales the default 24pt size", async () => {
    await render(<SymbolView name="star" />);
    expect(base.mock.calls[0][0]).toMatchObject({ size: 24 * TV_DENSITY });
  });
});
