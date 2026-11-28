import { APP_HTTPS_ORIGIN, restorableSharePath } from "@/lib/app-links";
import {
  checkDeferredInvite,
  DEFERRED_INVITE_WINDOW_MS,
  type DeferredInviteDeps,
  pathFromInstallReferrer,
} from "@/lib/deferred-invite";

const NOW = Date.UTC(2026, 10, 28, 12, 0, 0);

function deps(overrides: Partial<DeferredInviteDeps> = {}) {
  const markChecked = jest.fn(async () => {});
  const value: DeferredInviteDeps = {
    os: "android",
    alreadyChecked: async () => false,
    markChecked,
    installedAt: async () => new Date(NOW - 5 * 60 * 1000),
    now: () => NOW,
    initialUrlPath: async () => null,
    installReferrer: async () => "mt_link=%2Fcircle%2Fjoin%2FABCDEFGH23&utm_source=web",
    clipboardHasContent: async () => true,
    ...overrides,
  };
  return { value, markChecked };
}

describe("restorableSharePath", () => {
  it("accepts share paths and our HTTPS links inside pasted text", () => {
    expect(restorableSharePath("/circle/join/ABCDEFGH23")).toBe("/circle/join/ABCDEFGH23");
    expect(
      restorableSharePath(`Join our group khatm: ${APP_HTTPS_ORIGIN}/circle/join/ABCDEFGH23.`),
    ).toBe("/circle/join/ABCDEFGH23");
    expect(restorableSharePath(`${APP_HTTPS_ORIGIN}/kids/link?token=mtl_abc`)).toBe(
      "/kids/link?token=mtl_abc",
    );
    expect(restorableSharePath(`${APP_HTTPS_ORIGIN}/tv-pair?code=AB12`)).toBe("/tv-pair?code=AB12");
  });

  it("rejects anything that isn't a share link", () => {
    expect(restorableSharePath("")).toBeNull();
    expect(restorableSharePath("hello world")).toBeNull();
    expect(restorableSharePath(`${APP_HTTPS_ORIGIN}/settings/backup`)).toBeNull();
    expect(restorableSharePath("https://evil.example/circle/join/ABCDEFGH23")).toBeNull();
    expect(restorableSharePath("/circle/join")).toBeNull();
    expect(restorableSharePath("/circle/join/../../settings")).toBeNull();
    expect(restorableSharePath("/circle/joinx/ABC")).toBeNull();
  });
});

describe("pathFromInstallReferrer", () => {
  it("reads mt_link from the Play referrer", () => {
    expect(pathFromInstallReferrer("utm_source=x&mt_link=%2Ftv-pair%3Fcode%3DAB12")).toBe(
      "/tv-pair?code=AB12",
    );
  });

  it("ignores organic installs and foreign paths", () => {
    expect(pathFromInstallReferrer("utm_source=google-play&utm_medium=organic")).toBeNull();
    expect(pathFromInstallReferrer("mt_link=%2Fsettings")).toBeNull();
    expect(pathFromInstallReferrer("mt_link=%E0%A4%A")).toBeNull();
    expect(pathFromInstallReferrer(undefined)).toBeNull();
  });
});

describe("checkDeferredInvite", () => {
  it("Android: opens the invite from the install referrer, once", async () => {
    const { value, markChecked } = deps();
    await expect(checkDeferredInvite(value)).resolves.toEqual({
      kind: "open",
      path: "/circle/join/ABCDEFGH23",
    });
    expect(markChecked).toHaveBeenCalledTimes(1);
    await expect(
      checkDeferredInvite({ ...value, alreadyChecked: async () => true }),
    ).resolves.toBeNull();
  });

  it("iOS: asks to paste when the clipboard holds something — without reading it", async () => {
    const { value } = deps({ os: "ios" });
    await expect(checkDeferredInvite(value)).resolves.toEqual({ kind: "askPaste" });
    await expect(
      checkDeferredInvite({ ...value, clipboardHasContent: async () => false }),
    ).resolves.toBeNull();
  });

  it("stays quiet outside the install window, after a real link launch, and on errors", async () => {
    const old = deps({ installedAt: async () => new Date(NOW - DEFERRED_INVITE_WINDOW_MS - 1) });
    await expect(checkDeferredInvite(old.value)).resolves.toBeNull();
    expect(old.markChecked).toHaveBeenCalled();

    const linked = deps({ initialUrlPath: async () => "quran/2" });
    await expect(checkDeferredInvite(linked.value)).resolves.toBeNull();

    const failing = deps({
      installedAt: async () => {
        throw new Error("no native module");
      },
    });
    await expect(checkDeferredInvite(failing.value)).resolves.toBeNull();

    const web = deps({ os: "other" });
    await expect(checkDeferredInvite(web.value)).resolves.toBeNull();
    expect(web.markChecked).not.toHaveBeenCalled();
  });
});
