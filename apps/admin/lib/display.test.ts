import { describe, expect, it } from "vitest";
import { contentReportStatusVariant, feedbackRatingVariant, humanizeEnum } from "./display";

describe("humanizeEnum", () => {
  it("replaces underscores with spaces", () => {
    expect(humanizeEnum("in_progress")).toBe("in progress");
    expect(humanizeEnum("super_admin")).toBe("super admin");
  });
});

describe("feedbackRatingVariant", () => {
  it("maps low ratings to danger and warning", () => {
    expect(feedbackRatingVariant(1)).toBe("danger");
    expect(feedbackRatingVariant(2)).toBe("warning");
    expect(feedbackRatingVariant(3)).toBe("muted");
    expect(feedbackRatingVariant(5)).toBe("muted");
  });
});

describe("contentReportStatusVariant", () => {
  it("maps statuses to badge variants", () => {
    expect(contentReportStatusVariant("completed")).toBe("brand");
    expect(contentReportStatusVariant("spam")).toBe("danger");
    expect(contentReportStatusVariant("cancelled")).toBe("danger");
    expect(contentReportStatusVariant("in_progress")).toBe("warning");
    expect(contentReportStatusVariant("in_review")).toBe("warning");
    expect(contentReportStatusVariant("pending")).toBe("default");
  });
});
