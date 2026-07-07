import {
  drainCommandQueue,
  enqueueCommand,
  parseCommandQueue,
  serializeCommandQueue,
} from "./queue";

describe("external command queue", () => {
  it("round-trips enqueue and drain", () => {
    let queue = parseCommandQueue(null);
    queue = enqueueCommand(queue, { type: "mark-current-obligatory", source: "siri" });
    queue = enqueueCommand(queue, {
      type: "mark-prayer",
      prayerId: "fajr",
      date: "2026-07-08",
      source: "watch",
    });
    const serialized = serializeCommandQueue(queue);
    const parsed = parseCommandQueue(serialized);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.type).toBe("mark-current-obligatory");
    expect(parsed[1]?.prayerId).toBe("fajr");

    const { commands, remaining } = drainCommandQueue(parsed);
    expect(commands).toHaveLength(2);
    expect(remaining).toHaveLength(0);
  });

  it("rejects invalid JSON", () => {
    expect(parseCommandQueue("{bad")).toEqual([]);
    expect(parseCommandQueue('{"not":"array"}')).toEqual([]);
  });
});
