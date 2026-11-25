import { APP_NAME, DUA_COUNT } from "@munib-tracker/shared/constants";
import { screen } from "@testing-library/react";
import { createTranslator } from "next-intl";
import { describe, expect, it } from "vitest";
import { FaqPreview } from "@/components/faq-preview";
import { FAQ_IDS, getFaqItems } from "@/lib/faq";
import messages from "@/messages/en";
import { renderWithIntl } from "@/test-support/intl";

const t = createTranslator({ locale: "en", messages, namespace: "faq" });

describe("FAQ", () => {
  it("has catalog copy for exactly the listed ids", () => {
    expect(Object.keys(messages.faq.items).sort()).toEqual([...FAQ_IDS].sort());
  });

  it("fills in the app name and counts", () => {
    const items = getFaqItems(t);
    expect(items).toHaveLength(FAQ_IDS.length);
    expect(items[1]?.question).toBe(`Is ${APP_NAME} free?`);
    expect(items[3]?.answer).toContain(`${DUA_COUNT} duas`);
    expect(items.every((i) => !/[{}]/.test(i.question + i.answer))).toBe(true);
  });

  it("limits the preview to the first five questions", () => {
    renderWithIntl(<FaqPreview />);
    expect(screen.getByText("What is Munib Tracker?")).toBeTruthy();
    expect(screen.getByText("Does Qur'an practice record my voice?")).toBeTruthy();
    expect(screen.queryByText("Which platforms are supported?")).toBeNull();
    expect(screen.getByText("View all questions →")).toBeTruthy();
  });
});
