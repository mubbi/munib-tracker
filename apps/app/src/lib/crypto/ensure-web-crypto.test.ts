import { usePlatform } from "@/test-support/platform";

const mockInstall = jest.fn();
jest.mock("react-native-quick-crypto", () => ({ install: () => mockInstall() }), { virtual: true });

/** Fresh module state (`installed` flag) per test. */
function load(): () => void {
  let ensure: () => void = () => {};
  jest.isolateModules(() => {
    ensure = require("./ensure-web-crypto").ensureWebCrypto;
  });
  return ensure;
}

const g = globalThis as { crypto?: unknown };
const realCrypto = g.crypto;

beforeEach(() => mockInstall.mockReset());
afterEach(() => {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    writable: true,
    value: realCrypto,
  });
});

function setCrypto(value: unknown) {
  Object.defineProperty(globalThis, "crypto", { configurable: true, writable: true, value });
}

describe("ensureWebCrypto", () => {
  it("does nothing when crypto.subtle exists", () => {
    setCrypto({ subtle: {} });
    load()();
    expect(mockInstall).not.toHaveBeenCalled();
  });

  it("installs the native polyfill once", () => {
    setCrypto(undefined);
    const ensure = load();
    ensure();
    ensure();
    expect(mockInstall).toHaveBeenCalledTimes(1);
  });

  it("fails open when the polyfill throws", () => {
    setCrypto({});
    mockInstall.mockImplementation(() => {
      throw new Error("no native module");
    });
    expect(() => load()()).not.toThrow();
  });

  describe("on web", () => {
    usePlatform({ OS: "web" });

    it("never loads the native polyfill", () => {
      setCrypto(undefined);
      load()();
      expect(mockInstall).not.toHaveBeenCalled();
    });
  });
});
