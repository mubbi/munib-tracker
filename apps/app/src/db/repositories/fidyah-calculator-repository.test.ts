import AsyncStorage from "@react-native-async-storage/async-storage";

import { DB_KEYS } from "../keys";
import { writeJSON } from "../store";
import { FidyahCalculatorRepository } from "./fidyah-calculator-repository";

beforeEach(async () => {
  await AsyncStorage.clear();
});

describe("FidyahCalculatorRepository", () => {
  it("returns an empty fidyah draft in the fallback currency", async () => {
    expect(await FidyahCalculatorRepository.load("PKR")).toMatchObject({
      currencyCode: "PKR",
      scenario: "fidyah",
      days: "",
      mealCost: "",
    });
  });

  it("round-trips a saved draft", async () => {
    await FidyahCalculatorRepository.save({
      currencyCode: "GBP",
      scenario: "kaffarah",
      days: "3",
      mealCost: "5",
    });
    expect(await FidyahCalculatorRepository.load("USD")).toMatchObject({
      currencyCode: "GBP",
      scenario: "kaffarah",
      days: "3",
      mealCost: "5",
      updatedAt: expect.any(String),
    });
  });

  it("repairs malformed fields", async () => {
    await writeJSON(DB_KEYS.fidyahCalculator, {
      currencyCode: "ZZZ",
      scenario: "other",
      days: 4,
      updatedAt: 1,
    });
    expect(await FidyahCalculatorRepository.load("EUR")).toMatchObject({
      currencyCode: "EUR",
      scenario: "fidyah",
      days: "",
      mealCost: "",
      updatedAt: expect.any(String),
    });
  });

  it.each([
    ["array", []],
    ["string", "x"],
  ])("treats a stored %s as empty", async (_label, raw) => {
    await writeJSON(DB_KEYS.fidyahCalculator, raw);
    expect((await FidyahCalculatorRepository.load("USD")).days).toBe("");
  });

  it("clear removes the draft even if the raw delete fails", async () => {
    await FidyahCalculatorRepository.save({
      currencyCode: "GBP",
      scenario: "fidyah",
      days: "1",
      mealCost: "1",
    });
    (AsyncStorage.removeItem as jest.Mock)
      .mockImplementationOnce(async () => {})
      .mockRejectedValueOnce(new Error("io"));
    await FidyahCalculatorRepository.clear();
    expect((await FidyahCalculatorRepository.load("USD")).currencyCode).toBe("GBP");
  });

  it("clear deletes the stored draft", async () => {
    await FidyahCalculatorRepository.save({
      currencyCode: "GBP",
      scenario: "fidyah",
      days: "1",
      mealCost: "1",
    });
    await FidyahCalculatorRepository.clear();
    expect((await FidyahCalculatorRepository.load("USD")).currencyCode).toBe("USD");
  });
});
