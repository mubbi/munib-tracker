import {
  coalesceMarkCurrentCommands,
  drainCommandQueue,
  enqueueCommand,
  parseCommandQueue,
  serializeCommandQueue,
} from "@/lib/external-commands/queue";
import type { ExternalCommand } from "@/lib/external-commands/types";

describe("external command queue", () => {
  it("round-trips enqueue and drain", () => {
    let queue = parseCommandQueue(null);
    queue = enqueueCommand(queue, { type: "mark-current-obligatory", source: "siri" });
    queue = enqueueCommand(queue, {
      type: "mark-prayer",
      prayerId: "fajr",
      date: "2026-07-20",
      source: "notification",
    });

    const raw = serializeCommandQueue(queue);
    const parsed = parseCommandQueue(raw);
    expect(parsed).toHaveLength(2);
    expect(parsed[0]?.type).toBe("mark-current-obligatory");

    const { commands, remaining } = drainCommandQueue(parsed);
    expect(commands).toHaveLength(2);
    expect(remaining).toHaveLength(0);
  });
});

describe("coalesceMarkCurrentCommands", () => {
  it("keeps only the first mark-current-obligatory in a batch", () => {
    const commands: ExternalCommand[] = [
      { type: "mark-current-obligatory", source: "deeplink" },
      { type: "mark-current-obligatory", source: "assistant" },
      {
        type: "mark-prayer",
        prayerId: "fajr",
        date: "2026-07-20",
        source: "notification",
      },
      { type: "mark-current-obligatory", source: "widget" },
    ];

    expect(coalesceMarkCurrentCommands(commands)).toEqual([
      { type: "mark-current-obligatory", source: "deeplink" },
      {
        type: "mark-prayer",
        prayerId: "fajr",
        date: "2026-07-20",
        source: "notification",
      },
    ]);
  });

  it("leaves non-mark-current commands untouched", () => {
    const commands: ExternalCommand[] = [
      { type: "open-route", href: "/tracker", source: "siri" },
      {
        type: "mark-prayer",
        prayerId: "dhuhr",
        date: "2026-07-20",
        source: "notification",
      },
    ];
    expect(coalesceMarkCurrentCommands(commands)).toEqual(commands);
  });
});
