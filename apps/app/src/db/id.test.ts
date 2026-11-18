import { createId } from "./id";

describe("createId", () => {
  it("prefixes ids and defaults the prefix to id", () => {
    expect(createId("prayer")).toMatch(/^prayer_[a-z0-9]+$/);
    expect(createId()).toMatch(/^id_[a-z0-9]+$/);
  });

  it("returns a different id on each call", () => {
    expect(createId()).not.toBe(createId());
  });
});
