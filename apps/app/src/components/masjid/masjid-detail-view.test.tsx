import type { MasjidDetail } from "@munib-tracker/shared/masjid";
import { screen } from "@testing-library/react-native";

import { formatMasjidAddress, MasjidDetailView } from "@/components/masjid/masjid-detail-view";
import { MasjidRow } from "@/components/masjid/masjid-row";
import { OsmAttribution } from "@/components/masjid/osm-attribution";
import { renderWithProviders } from "@/test-support/render";

const BARE: MasjidDetail = { osmType: "way", osmId: "2", lat: 51.5, lon: -0.12 };
const FULL: MasjidDetail = {
  ...BARE,
  name: "East Masjid",
  address: { street: "High Street", city: "London" },
  website: "https://example.org/",
  phone: "+44 20 1234 5678",
  denomination: "sunni",
  jumuah: ["13:00"],
  serviceTimes: ["Mo-Su 05:00,13:00"],
  openingHours: "24/7",
  badges: ["wheelchair"],
  timetable: {
    daily: { fajr: "05:30" },
    source: { id: "feed", attribution: "Feed (CC0)", fetchedAt: "2026-11-01T00:00:00Z" },
  },
};

const SECTION_IDS = [
  "masjid-address",
  "masjid-denomination",
  "masjid-open",
  "masjid-badges",
  "masjid-private-times",
  "masjid-public-times",
  "masjid-jumuah-section",
  "masjid-service-times",
  "masjid-contact",
];

describe("MasjidDetailView (D5: no section without data)", () => {
  it("renders no optional section when OSM has no data", async () => {
    await renderWithProviders(<MasjidDetailView detail={BARE} isHome={false} />);
    for (const id of SECTION_IDS) expect(screen.queryByTestId(id)).toBeNull();
    // No "unknown" / "add times" prompts either — only the fallback name.
    expect(screen.getByText("Unnamed masjid")).toBeTruthy();
    expect(screen.queryByText(/unknown/i)).toBeNull();
    expect(screen.queryByText(/Add/)).toBeNull();
  });

  it("renders each section when its data exists, with the source attribution", async () => {
    await renderWithProviders(
      <MasjidDetailView
        detail={FULL}
        isHome
        privateTimetable={{ daily: { isha: "20:00" }, source: { id: "private" } }}
        distanceMeters={1234}
      />,
    );
    for (const id of SECTION_IDS) expect(screen.getByTestId(id)).toBeTruthy();
    expect(screen.getByText("Source: Feed (CC0)")).toBeTruthy();
    expect(screen.getByText("Your times")).toBeTruthy();
    expect(screen.getByText("Mo-Su 05:00,13:00")).toBeTruthy();
  });

  it("formats addresses only from present parts", () => {
    expect(formatMasjidAddress(undefined)).toBeUndefined();
    expect(formatMasjidAddress({})).toBeUndefined();
    expect(formatMasjidAddress({ housenumber: "1", street: "High St", city: "London" })).toBe(
      "1 High St, London",
    );
    expect(formatMasjidAddress({ full: "Full line", city: "x" })).toBe("Full line");
  });
});

describe("MasjidRow", () => {
  const noop = () => undefined;

  it("shows name + distance always, and no Jumu'ah/badges when absent", async () => {
    await renderWithProviders(
      <MasjidRow
        masjid={{ ...BARE, name: "Way Masjid", distanceMeters: 350 }}
        isHome={false}
        readOnly={false}
        onOpen={noop}
        onDirections={noop}
        onSetHome={noop}
      />,
    );
    expect(screen.getByText("Way Masjid")).toBeTruthy();
    expect(screen.getByText("350 m")).toBeTruthy();
    expect(screen.queryByTestId("masjid-jumuah")).toBeNull();
    expect(screen.queryByTestId("masjid-badges")).toBeNull();
    expect(screen.getByText("Directions")).toBeTruthy();
  });

  it("is read-only on TV (no directions / set home)", async () => {
    await renderWithProviders(
      <MasjidRow
        masjid={{ ...FULL, distanceMeters: 2000 }}
        isHome={false}
        readOnly
        onOpen={noop}
        onDirections={noop}
        onSetHome={noop}
      />,
    );
    expect(screen.getByTestId("masjid-jumuah")).toBeTruthy();
    expect(screen.queryByText("Directions")).toBeNull();
    expect(screen.queryByText("Set as home masjid")).toBeNull();
  });
});

describe("OsmAttribution", () => {
  it("shows the ODbL attribution", async () => {
    await renderWithProviders(<OsmAttribution />);
    expect(screen.getByText("© OpenStreetMap contributors")).toBeTruthy();
  });
});
