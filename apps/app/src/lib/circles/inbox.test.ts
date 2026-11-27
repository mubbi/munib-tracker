import i18n from "@/i18n";

import { circleEventHref, localizeCircleInboxItem, parseCircleRouteData } from "./inbox";

const t = i18n.t.bind(i18n);

describe("circle inbox events", () => {
  it("parses only well-formed circle route data", () => {
    expect(parseCircleRouteData({ type: "circle", event: "dua_received", circleId: "c" })).toEqual({
      type: "circle",
      event: "dua_received",
      circleId: "c",
    });
    expect(parseCircleRouteData({ type: "circle", event: "nope", circleId: "c" })).toBeNull();
    expect(
      parseCircleRouteData({ type: "other", event: "dua_received", circleId: "c" }),
    ).toBeNull();
    expect(parseCircleRouteData(null)).toBeNull();
  });

  it("routes push and inbox taps to the same screen", () => {
    expect(circleEventHref({ type: "circle", event: "dua_received", circleId: "c1" })).toBe(
      "/partner?circleId=c1",
    );
    expect(
      circleEventHref({ type: "circle", event: "khatm_part_done", circleId: "c1", khatmId: "k1" }),
    ).toBe("/khatm-groups?circleId=c1&khatmId=k1");
  });

  it("localizes by routeData.event and leaves other kinds alone", () => {
    const row = {
      kind: "circle",
      title: "server fallback",
      body: "server fallback",
      routeData: { type: "circle", event: "khatm_completed", circleId: "c1" },
    };
    const localized = localizeCircleInboxItem(row, t);
    expect(localized.title).toBe(t("circles.inbox.khatm_completed.title"));
    expect(localized.title).not.toBe("server fallback");

    const other = { kind: "system", title: "x", body: "y", routeData: null };
    expect(localizeCircleInboxItem(other, t)).toBe(other);
  });
});
