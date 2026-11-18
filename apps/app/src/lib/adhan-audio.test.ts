import {
  ADHAN_LEARN_STYLES,
  ADHAN_STYLES,
  adhanTrack,
  allAdhanTracks,
  DEFAULT_ADHAN_STYLE,
} from "@/lib/adhan-audio";

describe("adhanTrack", () => {
  it("builds the bundled default adhan", () => {
    const track = adhanTrack();
    expect(track.id).toBe(`adhan:${DEFAULT_ADHAN_STYLE}`);
    expect(track.source).toBeDefined();
  });

  it("builds a remote muezzin style", () => {
    const [style] = ADHAN_LEARN_STYLES;
    expect(adhanTrack(style.id)).toEqual({
      id: `adhan:${style.id}`,
      title: style.name,
      subtitle: style.location,
      uri: style.uri,
      source: style.source,
    });
  });

  it("falls back to the first style for an unknown id", () => {
    expect(adhanTrack("missing").id).toBe(`adhan:${ADHAN_STYLES[0].id}`);
  });
});

describe("allAdhanTracks", () => {
  it("lists every Learn style but not the bundled preview", () => {
    const ids = allAdhanTracks().map((t) => t.id);
    expect(ids).toEqual(ADHAN_LEARN_STYLES.map((s) => `adhan:${s.id}`));
    expect(ids).not.toContain(`adhan:${DEFAULT_ADHAN_STYLE}`);
  });
});
