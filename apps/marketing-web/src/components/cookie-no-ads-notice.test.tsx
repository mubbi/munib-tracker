import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithIntl } from "@/test-support/intl";
import { CookieNoAdsNotice } from "./cookie-no-ads-notice";

describe("CookieNoAdsNotice", () => {
  it("renders the no-ads notice with the app name", () => {
    renderWithIntl(<CookieNoAdsNotice appName="Munib Tracker" />);

    expect(screen.getByRole("note")).toBeInTheDocument();
    expect(screen.getByText(/No advertising or marketing tracking — ever\./i)).toBeInTheDocument();
    expect(screen.getByText(/only help us improve Munib Tracker/i)).toBeInTheDocument();
  });
});
