import { act, renderHook } from "@testing-library/react-native";
import * as Linking from "expo-linking";
import { AppState, type AppStateStatus } from "react-native";

import { familyTiesActions } from "@/lib/family-ties/family-ties-store";
import { mockToast, resetToastMock } from "@/test-support/mocks/toast-provider";

import { useContactActions } from "./use-contact-actions";

jest.mock(
  "@/providers/toast-provider",
  () => require("@/test-support/mocks/toast-provider").toastProviderMock,
);
jest.mock("expo-linking", () => ({
  openURL: jest.fn(async () => true),
  canOpenURL: jest.fn(async () => false),
}));
jest.mock("@/lib/family-ties/family-ties-store", () => ({
  familyTiesActions: {
    logContact: jest.fn(async () => "log_1"),
    removeLog: jest.fn(async () => undefined),
  },
}));

let emit: (state: AppStateStatus) => void = () => {};

beforeEach(() => {
  resetToastMock();
  jest.mocked(familyTiesActions.logContact).mockClear();
  jest.mocked(Linking.openURL).mockClear();
  jest.spyOn(AppState, "addEventListener").mockImplementation((_type, handler) => {
    emit = handler as (state: AppStateStatus) => void;
    return { remove: jest.fn() } as never;
  });
});

describe("useContactActions", () => {
  it("logs the call once the person comes back from the dialer", async () => {
    const { result } = await renderHook(() => useContactActions());
    await act(async () => {
      await result.current.open("r1", "call", "+44 20 7946 0000");
    });
    expect(Linking.openURL).toHaveBeenCalledWith("tel:+442079460000");
    await act(async () => {
      emit("inactive");
      emit("background");
      emit("active");
    });
    expect(familyTiesActions.logContact).toHaveBeenCalledWith("r1", "call");
    // The confirmation toast offers Undo, which removes exactly that log.
    const [, options] = mockToast.show.mock.calls[0] as [string, { action: { onPress(): void } }];
    expect(options).toMatchObject({ type: "success", action: { label: "Undo" } });
    options.action.onPress();
    expect(familyTiesActions.removeLog).toHaveBeenCalledWith("log_1");
  });

  it("doesn't log when the iOS call confirmation is cancelled (never left the app)", async () => {
    const { result } = await renderHook(() => useContactActions());
    await act(async () => {
      await result.current.open("r1", "call", "+44 20 7946 0000");
    });
    await act(async () => {
      emit("inactive");
      emit("active");
    });
    expect(familyTiesActions.logContact).not.toHaveBeenCalled();
  });
});
