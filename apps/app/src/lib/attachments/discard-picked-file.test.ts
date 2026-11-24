import {
  mockDeletePath,
  mockNativeFiles,
  resetNativeFileStoreMock,
} from "@/test-support/mocks/native-file-store";
import { usePlatformSwitch } from "@/test-support/platform";

import { discardPickedFile } from "./discard-picked-file";

jest.mock(
  "@/lib/native-file-store",
  () => require("@/test-support/mocks/native-file-store").nativeFileStoreMock,
);

const PICKED = "file:///cache/ImagePicker/7A1B.jpg";

describe("discardPickedFile", () => {
  const switchPlatform = usePlatformSwitch();

  beforeEach(() => {
    resetNativeFileStoreMock();
    switchPlatform({ OS: "ios" });
  });

  it("deletes the picker's plaintext copy in the app cache", () => {
    mockNativeFiles.set(PICKED, { size: 1024 });
    discardPickedFile(PICKED);
    expect(mockDeletePath).toHaveBeenCalledWith(PICKED);
    expect(mockNativeFiles.has(PICKED)).toBe(false);
  });

  it("never touches a file outside the app cache (e.g. the gallery original)", () => {
    discardPickedFile("file:///var/mobile/Media/DCIM/IMG_0001.JPG");
    discardPickedFile("content://media/external/images/1");
    discardPickedFile(undefined);
    expect(mockDeletePath).not.toHaveBeenCalled();
  });

  it("revokes a blob URL on web and never deletes files there", () => {
    switchPlatform({ OS: "web" });
    const revoke = jest.fn();
    const original = URL.revokeObjectURL;
    URL.revokeObjectURL = revoke;
    try {
      discardPickedFile("blob:https://app/1234");
      discardPickedFile("data:image/png;base64,AAAA");
    } finally {
      URL.revokeObjectURL = original;
    }
    expect(revoke).toHaveBeenCalledWith("blob:https://app/1234");
    expect(revoke).toHaveBeenCalledTimes(1);
    expect(mockDeletePath).not.toHaveBeenCalled();
  });

  it("swallows a delete failure", () => {
    mockDeletePath.mockImplementationOnce(() => {
      throw new Error("gone");
    });
    expect(() => discardPickedFile(PICKED)).not.toThrow();
  });
});
