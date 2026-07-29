import type { ExternalCommand, QueuedCommand } from "./types";

const MAX_QUEUE_LENGTH = 32;

function newCommandId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function parseCommandQueue(raw: string | null | undefined): QueuedCommand[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isQueuedCommand);
  } catch {
    return [];
  }
}

function isQueuedCommand(value: unknown): value is QueuedCommand {
  if (!value || typeof value !== "object") return false;
  const cmd = value as QueuedCommand;
  if (typeof cmd.id !== "string" || typeof cmd.enqueuedAt !== "string") return false;
  if (cmd.type === "mark-current-obligatory") return true;
  if (cmd.type === "mark-prayer") {
    return typeof cmd.prayerId === "string" && typeof cmd.date === "string";
  }
  return false;
}

export function serializeCommandQueue(queue: QueuedCommand[]): string {
  return JSON.stringify(queue.slice(-MAX_QUEUE_LENGTH));
}

export function enqueueCommand(queue: QueuedCommand[], command: ExternalCommand): QueuedCommand[] {
  const entry: QueuedCommand = {
    ...command,
    id: newCommandId(),
    enqueuedAt: new Date().toISOString(),
  };
  const next = [...queue, entry];
  return next.length > MAX_QUEUE_LENGTH ? next.slice(-MAX_QUEUE_LENGTH) : next;
}

export function drainCommandQueue(queue: QueuedCommand[]): {
  commands: QueuedCommand[];
  remaining: QueuedCommand[];
} {
  if (queue.length === 0) return { commands: [], remaining: [] };
  return { commands: [...queue], remaining: [] };
}

/**
 * Collapse duplicate `mark-current-obligatory` entries in one drain pass.
 * Launcher shortcuts / quick actions can enqueue the same command twice
 * (deep link + broadcast); processing both would mark more than the current Salah.
 */
export function coalesceMarkCurrentCommands(commands: ExternalCommand[]): ExternalCommand[] {
  let seenMarkCurrent = false;
  const out: ExternalCommand[] = [];
  for (const command of commands) {
    if (command.type === "mark-current-obligatory") {
      if (seenMarkCurrent) continue;
      seenMarkCurrent = true;
    }
    out.push(command);
  }
  return out;
}
