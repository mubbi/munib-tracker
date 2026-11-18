import { renderHook } from "@testing-library/react-native";

import i18n from "@/i18n";
import { buildContentReportRef } from "@/lib/content-report-ref";

import { useGuideContentReportRef } from "./use-guide-content-report-ref";

const TOPIC = { id: "wudu", title: "Wudu", summary: "How to make wudu" };

async function refFor(topic: typeof TOPIC | null | undefined, disclaimer?: string) {
  const { result } = await renderHook(() =>
    useGuideContentReportRef("guide", topic, "/learn", disclaimer),
  );
  return result.current;
}

describe("useGuideContentReportRef", () => {
  it("is undefined without a topic", async () => {
    expect(await refFor(null)).toBeUndefined();
    expect(await refFor(undefined)).toBeUndefined();
  });

  it("builds a reference for the topic route with a snapshot", async () => {
    const locale = i18n.language.split("-")[0];
    expect(await refFor(TOPIC, "learn.disclaimer")).toEqual(
      buildContentReportRef("guide", "wudu", "/learn/wudu", locale, {
        snapshot: { title: "Wudu", translation: "How to make wudu", reference: "learn.disclaimer" },
      }),
    );
  });
});
