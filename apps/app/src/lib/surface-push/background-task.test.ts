import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";

import { usePlatform } from "@/test-support/platform";

import { registerSurfacePushBackgroundTask } from "./background-task";

jest.mock("expo-task-manager", () => ({
  isTaskDefined: jest.fn(() => false),
  defineTask: jest.fn(),
}));
jest.mock("expo-notifications", () => ({ registerTaskAsync: jest.fn(async () => undefined) }));
const mockHandle = jest.fn(async (_data: unknown) => undefined);
jest.mock("./register", () => ({
  handleSurfacePhaseDataMessage: (data: unknown) => mockHandle(data),
}));

const defineTask = jest.mocked(TaskManager.defineTask);
const isTaskDefined = jest.mocked(TaskManager.isTaskDefined);
const registerTaskAsync = jest.mocked(Notifications.registerTaskAsync);

type TaskBody = Parameters<typeof TaskManager.defineTask>[1];

/** Registers the task and returns its executor. */
function setup(): TaskBody {
  registerSurfacePushBackgroundTask();
  return defineTask.mock.calls[0]?.[1] as TaskBody;
}

beforeEach(() => {
  jest.clearAllMocks();
  isTaskDefined.mockReturnValue(false);
});

describe.each([
  ["iOS", { OS: "ios" as const }],
  ["Android TV", { OS: "android" as const, isTV: true }],
])("on %s", (_name, platform) => {
  usePlatform(platform);

  it("does not register", () => {
    setup();
    expect(defineTask).not.toHaveBeenCalled();
    expect(registerTaskAsync).not.toHaveBeenCalled();
  });
});

describe("on Android phones", () => {
  usePlatform({ OS: "android", isTV: false });

  it("defines the task once and registers it for notifications", () => {
    setup();
    expect(defineTask).toHaveBeenCalledWith("munib-surface-push-background", expect.any(Function));
    expect(registerTaskAsync).toHaveBeenCalledWith("munib-surface-push-background");
  });

  it("skips redefining an existing task", () => {
    isTaskDefined.mockReturnValue(true);
    setup();
    expect(defineTask).not.toHaveBeenCalled();
  });

  it("swallows registration failures", async () => {
    registerTaskAsync.mockRejectedValueOnce(new Error("unavailable"));
    expect(() => setup()).not.toThrow();
    await Promise.resolve();
  });

  it.each([
    ["a notification event", { notification: { request: { content: { data: { a: 1 } } } } }],
    ["a request event", { request: { content: { data: { a: 1 } } } }],
    ["a data event", { data: { a: 1 } }],
  ])("extracts push data from %s", async (_label, data) => {
    await setup()({ data, error: null, executionInfo: {} as never });
    expect(mockHandle).toHaveBeenCalledWith({ a: 1 });
  });

  it("passes a bare payload through", async () => {
    await setup()({ data: { type: "x" }, error: null, executionInfo: {} as never });
    expect(mockHandle).toHaveBeenCalledWith({ type: "x" });
  });

  it("passes undefined for empty task data", async () => {
    await setup()({ data: null, error: null, executionInfo: {} as never });
    expect(mockHandle).toHaveBeenCalledWith(undefined);
  });

  it("ignores task errors", async () => {
    await setup()({ data: {}, error: new Error("x") as never, executionInfo: {} as never });
    expect(mockHandle).not.toHaveBeenCalled();
  });
});
