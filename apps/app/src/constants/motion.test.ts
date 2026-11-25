import { Durations, Springs, Stagger } from "./motion";

describe("motion tokens", () => {
  it("exports the sheet spring from the spec", () => {
    expect(Springs.sheet).toEqual({ damping: 20, stiffness: 300 });
  });

  it("keeps the spring presets", () => {
    expect(Object.keys(Springs)).toEqual(["press", "gentle", "pop", "sheet"]);
  });

  it("adds no new durations", () => {
    expect(Durations).toEqual({ fast: 180, base: 260, slow: 420, ambient: 9877, wallpaper: 44443 });
    expect(Stagger).toEqual({ step: 60, base: 40 });
  });
});
