import * as Font from "expo-font";

import * as fileStore from "@/lib/native-file-store";
import {
  clearQcfFontCache,
  ensureMushafPageFonts,
  getQcfFontCacheInfo,
  isMushafPageFontReady,
  isQcfBsmlFontLoaded,
  isQcfPageFontLoaded,
  loadQcfBsmlFont,
  loadQcfPageFont,
  prefetchQcfFont,
  resetQcfFontRuntime,
  resolveCachedQcfFontUri,
  warmQcfFontsAround,
} from "@/lib/qcf-font-cache";
import { reportOssContentDownloadFailure } from "@/lib/report-oss-content-download-failure";
import { mockFetch } from "@/test-support/fetch";
import {
  mockDeletePath,
  mockDownloadToUri,
  mockEnsureDirectory,
  mockNativeFileStore,
  mockNativeFiles,
  resetNativeFileStoreMock,
} from "@/test-support/mocks/native-file-store";
import { setPlatform, usePlatform } from "@/test-support/platform";
import { fakeCacheResponse, installWebCache, type WebCacheFake } from "@/test-support/web-cache";

jest.mock(
  "@/lib/native-file-store",
  () => require("@/test-support/mocks/native-file-store").nativeFileStoreMock,
);
jest.mock("@/lib/report-oss-content-download-failure", () => ({
  reportOssContentDownloadFailure: jest.fn(),
}));
jest.mock("expo-font", () => ({ loadAsync: jest.fn(), unloadAsync: jest.fn() }));

const font = jest.mocked(Font);
const report = jest.mocked(reportOssContentDownloadFailure);

const CDN = "https://cdn.jsdelivr.net/gh/nuqayah/qpc-fonts@master/mushaf-v2";
const DIR = "file:///doc/munib-qcf-fonts/";
const pageUrl = (page: number) => `${CDN}/QCF2${String(page).padStart(3, "0")}.ttf`;
const localPage = (page: number) => `${DIR}QCF2${String(page).padStart(3, "0")}.ttf`;
const BSML_URL = `${CDN}/QCF2BSML.ttf`;
const BSML_LOCAL = `${DIR}QCF2BSML.ttf`;

/** Let fire-and-forget prefetches settle. */
const flush = async () => {
  for (let i = 0; i < 10; i++) await Promise.resolve();
};

/** Wipes the module-level runtime + caches (web path also drops object URLs). */
async function resetSubject(): Promise<void> {
  const restore = setPlatform({ OS: "web" });
  try {
    await clearQcfFontCache();
  } finally {
    restore();
  }
}

let warn: jest.SpyInstance;

beforeEach(async () => {
  jest.resetAllMocks();
  resetNativeFileStoreMock();
  font.loadAsync.mockResolvedValue(undefined);
  font.unloadAsync.mockResolvedValue(undefined);
  await resetSubject();
  jest.clearAllMocks();
  warn = jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => jest.restoreAllMocks());

const downloadedUrls = () => mockDownloadToUri.mock.calls.map(([url]) => url);
/** Pretend a font file is already on disk. */
const cacheOnDisk = (uri: string) => mockNativeFiles.set(uri, { size: 1 });
/** Make `fileInfo` (stat) throw for every path. */
const statThrows = () =>
  jest.spyOn(fileStore, "fileInfo").mockImplementation(() => {
    throw new Error("stat");
  });

describe("resolveCachedQcfFontUri (native)", () => {
  it("returns an already-cached local file without downloading", async () => {
    cacheOnDisk(localPage(3));
    await expect(resolveCachedQcfFontUri(3)).resolves.toBe(localPage(3));
    expect(mockDownloadToUri).not.toHaveBeenCalled();
  });

  it("returns the remote URL when the documents directory is unavailable", async () => {
    mockNativeFileStore.documentDir = null;
    await expect(resolveCachedQcfFontUri(12)).resolves.toBe(pageUrl(12));
  });

  it("returns the remote URL when stat throws", async () => {
    statThrows();
    await expect(resolveCachedQcfFontUri(1)).resolves.toBe(pageUrl(1));
  });

  it("downloads into the cache folder once for concurrent callers", async () => {
    const [a, b] = await Promise.all([resolveCachedQcfFontUri(5), resolveCachedQcfFontUri(5)]);
    expect([a, b]).toEqual([localPage(5), localPage(5)]);
    expect(mockEnsureDirectory).toHaveBeenCalledWith(DIR);
    expect(mockDownloadToUri).toHaveBeenCalledTimes(1);
  });

  it.each([404, 100])("reports HTTP %i and falls back to the remote URL", async (status) => {
    // Non-retryable: one try on jsDelivr, one on the GitHub raw mirror.
    mockDownloadToUri.mockResolvedValue({ status, uri: "ignored" });
    await expect(resolveCachedQcfFontUri(7)).resolves.toBe(pageUrl(7));
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({
        contentKind: "qcf_font",
        contentKey: "qcf_font:page:7",
        sourceProvider: "nuqayah/qpc-fonts",
        sourceUrl: pageUrl(7),
        contentMeta: { page: 7, decisionId: "NF-mushaf" },
        errorCode: "http_error",
        httpStatus: status,
      }),
    );
  });

  it.each([
    [new Error("offline"), "offline"],
    ["boom", "boom"],
  ])("reports a thrown download error (%p)", async (error, message) => {
    mockDownloadToUri.mockRejectedValue(error);
    await expect(resolveCachedQcfFontUri(9)).resolves.toBe(pageUrl(9));
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ errorCode: "download_failed", errorMessage: message }),
    );
  });
});

describe("QCF download retries (native)", () => {
  it("retries a dropped download, then uses the GitHub raw mirror", async () => {
    mockDownloadToUri
      .mockRejectedValueOnce(new Error("reset"))
      .mockResolvedValueOnce({ status: 503, uri: "ignored" });
    await expect(resolveCachedQcfFontUri(11)).resolves.toBe(localPage(11));
    expect(downloadedUrls()).toEqual([
      pageUrl(11),
      pageUrl(11),
      "https://raw.githubusercontent.com/nuqayah/qpc-fonts/master/mushaf-v2/QCF2011.ttf",
    ]);
    expect(report).not.toHaveBeenCalled();
  });
});

describe("loadQcfPageFont (native)", () => {
  it("registers the cached page font and marks it ready", async () => {
    await loadQcfPageFont(10);
    expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_10: localPage(10) });
    expect(isQcfPageFontLoaded(10)).toBe(true);
  });

  it("registers once across concurrent and repeated calls", async () => {
    await Promise.all([loadQcfPageFont(4), loadQcfPageFont(4)]);
    await loadQcfPageFont(4);
    expect(font.loadAsync).toHaveBeenCalledTimes(1);
  });

  it("prefetches the page just beyond the warm window", async () => {
    await loadQcfPageFont(20);
    await flush();
    expect(downloadedUrls()).toContain(pageUrl(23));
  });

  it("rejects with a warning and can be retried after a registration failure", async () => {
    font.loadAsync.mockRejectedValueOnce(new Error("bad font"));
    await expect(loadQcfPageFont(2)).rejects.toThrow("bad font");
    expect(warn).toHaveBeenCalledWith(
      "[mushaf] failed to load QCF page font QCF2_2",
      expect.any(Error),
    );
    await loadQcfPageFont(2);
    expect(isQcfPageFontLoaded(2)).toBe(true);
  });

  it("evicts the farthest page once more than eight fonts are registered", async () => {
    for (let page = 1; page <= 9; page++) await loadQcfPageFont(page);
    expect(font.unloadAsync).toHaveBeenCalledTimes(1);
    expect(font.unloadAsync).toHaveBeenCalledWith("QCF2_1");
    expect(isQcfPageFontLoaded(1)).toBe(false);
  });

  it("still evicts when unloadAsync rejects", async () => {
    font.unloadAsync.mockRejectedValue(new Error("nope"));
    for (let page = 600; page >= 592; page--) await loadQcfPageFont(page);
    expect(isQcfPageFontLoaded(600)).toBe(false);
  });
});

describe("isMushafPageFontReady", () => {
  it.each([
    [false, false, false],
    [true, false, true],
    [true, true, false],
  ])("page loaded=%p, needsBsml=%p → %p", async (loadPage, needsBsml, expected) => {
    if (loadPage) await loadQcfPageFont(10);
    expect(isMushafPageFontReady(10, needsBsml)).toBe(expected);
  });

  it("is ready for basmala pages once ensureMushafPageFonts loads both fonts", async () => {
    await ensureMushafPageFonts(50, true);
    expect(isMushafPageFontReady(50, true)).toBe(true);
    expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: BSML_LOCAL });
  });

  it("skips the basmala font when the page does not need it", async () => {
    await ensureMushafPageFonts(51, false);
    expect(isQcfBsmlFontLoaded()).toBe(false);
  });
});

describe("loadQcfBsmlFont (native)", () => {
  it("registers an existing local file once", async () => {
    cacheOnDisk(BSML_LOCAL);
    await Promise.all([loadQcfBsmlFont(), loadQcfBsmlFont()]);
    await loadQcfBsmlFont();
    expect(font.loadAsync).toHaveBeenCalledTimes(1);
    expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: BSML_LOCAL });
    expect(mockDownloadToUri).not.toHaveBeenCalled();
  });

  it("registers the remote URL when the documents directory is unavailable", async () => {
    mockNativeFileStore.documentDir = null;
    await loadQcfBsmlFont();
    expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: BSML_URL });
  });

  it("registers the remote URL when stat throws", async () => {
    statThrows();
    await loadQcfBsmlFont();
    expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: BSML_URL });
  });

  it("downloads the basmala font once when two loads race", async () => {
    await Promise.all([loadQcfBsmlFont(), ensureMushafPageFonts(1, true)]);
    expect(downloadedUrls().filter((url) => url === BSML_URL)).toHaveLength(1);
  });

  it("reports a non-2xx download and registers the remote URL", async () => {
    mockDownloadToUri.mockResolvedValue({ status: 500, uri: "ignored" });
    await loadQcfBsmlFont();
    expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: BSML_URL });
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ contentKey: "qcf_font:bsml", httpStatus: 500 }),
    );
  });

  it.each([
    [new Error("eio"), "eio"],
    ["eio", "eio"],
  ])("reports a thrown download error (%p)", async (error, message) => {
    mockDownloadToUri.mockRejectedValue(error);
    await loadQcfBsmlFont();
    expect(report).toHaveBeenCalledWith(
      expect.objectContaining({ contentKey: "qcf_font:bsml", errorMessage: message }),
    );
  });

  it("rejects with a warning and can be retried after a registration failure", async () => {
    font.loadAsync.mockRejectedValueOnce(new Error("reg"));
    await expect(loadQcfBsmlFont()).rejects.toThrow("reg");
    expect(warn).toHaveBeenCalledWith(
      "[mushaf] failed to load QCF basmala font",
      expect.any(Error),
    );
    await loadQcfBsmlFont();
    expect(isQcfBsmlFontLoaded()).toBe(true);
  });
});

describe("prefetch / warm", () => {
  it.each([0, 605])("ignores out-of-range page %i", async (page) => {
    prefetchQcfFont(page);
    warmQcfFontsAround(page);
    await flush();
    expect(mockDownloadToUri).not.toHaveBeenCalled();
  });

  it("warms one page behind and two ahead, clamped to page 1", async () => {
    warmQcfFontsAround(1);
    await flush();
    expect(downloadedUrls()).toEqual([pageUrl(1), pageUrl(2), pageUrl(3)]);
  });

  it("skips a repeated anchor", async () => {
    warmQcfFontsAround(100);
    warmQcfFontsAround(100);
    await flush();
    expect(mockDownloadToUri).toHaveBeenCalledTimes(4);
  });
});

describe("resetQcfFontRuntime", () => {
  it("unloads registered page and basmala fonts", async () => {
    await ensureMushafPageFonts(30, true);
    font.unloadAsync.mockRejectedValueOnce(new Error("x"));
    await resetQcfFontRuntime();
    expect(font.unloadAsync).toHaveBeenCalledWith("QCF2_30");
    expect(font.unloadAsync).toHaveBeenCalledWith("QCF2_BSML");
    expect([isQcfPageFontLoaded(30), isQcfBsmlFontLoaded()]).toEqual([false, false]);
  });

  it("does not unload anything when nothing was registered", async () => {
    await resetQcfFontRuntime();
    expect(font.unloadAsync).not.toHaveBeenCalled();
  });

  it("forgets the warmed anchor so the same page can be re-warmed", async () => {
    warmQcfFontsAround(30);
    await flush();
    await resetQcfFontRuntime();
    mockNativeFiles.clear();
    warmQcfFontsAround(30);
    await flush();
    expect(mockDownloadToUri).toHaveBeenCalledTimes(8);
  });
});

describe("native cache info and clearing", () => {
  it("sums known file sizes and counts every entry", async () => {
    mockNativeFiles.set(localPage(1), { size: 100 });
    mockNativeFiles.set(localPage(2), { size: 250 });
    // An entry that could not be stat'ed reports no size.
    mockNativeFiles.set(localPage(3), { size: undefined as unknown as number });
    await expect(getQcfFontCacheInfo()).resolves.toEqual({ bytes: 350, count: 3 });
  });

  it.each([
    [
      "the folder is missing",
      () => {
        mockNativeFileStore.directoriesExist = false;
      },
    ],
    [
      "the documents directory is unavailable",
      () => {
        mockNativeFileStore.documentDir = null;
      },
    ],
    [
      "the directory check throws",
      () => {
        mockNativeFileStore.directoriesExist = new Error("ls");
      },
    ],
  ])("reports zero when %s", async (_label, arrange) => {
    arrange();
    await expect(getQcfFontCacheInfo()).resolves.toEqual({ bytes: 0, count: 0 });
  });

  it("deletes the cache folder", async () => {
    await clearQcfFontCache();
    expect(mockDeletePath).toHaveBeenCalledWith(DIR);
  });

  it("swallows delete failures", async () => {
    mockDeletePath.mockImplementationOnce(() => {
      throw new Error("busy");
    });
    await expect(clearQcfFontCache()).resolves.toBeUndefined();
  });

  it("skips deletion when the documents directory is unavailable", async () => {
    mockNativeFileStore.documentDir = null;
    await clearQcfFontCache();
    expect(mockDeletePath).not.toHaveBeenCalled();
  });
});

describe("on web without Cache Storage", () => {
  usePlatform({ OS: "web" });

  it("resolves page fonts to the remote URL", async () => {
    await expect(resolveCachedQcfFontUri(2)).resolves.toBe(pageUrl(2));
  });

  it("registers the basmala font from the remote URL", async () => {
    await loadQcfBsmlFont();
    expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: BSML_URL });
  });

  it("reports an empty cache", async () => {
    await expect(getQcfFontCacheInfo()).resolves.toEqual({ bytes: 0, count: 0 });
  });

  it("clears without touching the native store", async () => {
    await clearQcfFontCache();
    expect(mockDeletePath).not.toHaveBeenCalled();
  });
});

describe("on web with Cache Storage", () => {
  usePlatform({ OS: "web" });
  let web: WebCacheFake;
  let fetchMock: jest.Mock;

  beforeEach(() => {
    web = installWebCache();
    fetchMock = mockFetch(fakeCacheResponse());
  });
  afterEach(() => web.restore());

  describe("page fonts", () => {
    it("fetches with CORS, stores in the bucket and returns a blob URL once", async () => {
      const [a, b] = await Promise.all([resolveCachedQcfFontUri(2), resolveCachedQcfFontUri(2)]);
      expect([a, b]).toEqual(["blob:fake-1", "blob:fake-1"]);
      expect(fetchMock).toHaveBeenCalledWith(pageUrl(2), { mode: "cors", credentials: "omit" });
      expect(web.store.has(pageUrl(2))).toBe(true);
    });

    it("memoises the blob URL for later calls", async () => {
      await resolveCachedQcfFontUri(2);
      await resolveCachedQcfFontUri(2);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it("serves a bucket hit without the network", async () => {
      web.store.set(pageUrl(4), fakeCacheResponse());
      await expect(resolveCachedQcfFontUri(4)).resolves.toBe("blob:fake-1");
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("refetches an opaque bucket entry and tolerates a failed put", async () => {
      web.store.set(pageUrl(4), fakeCacheResponse({ type: "opaque" }));
      web.cache.put.mockRejectedValueOnce(new Error("quota"));
      await expect(resolveCachedQcfFontUri(4)).resolves.toBe("blob:fake-1");
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it.each([
      [
        "an HTTP error",
        fakeCacheResponse({ status: 503 }),
        { errorCode: "http_error", httpStatus: 503 },
      ],
      ["an empty payload", fakeCacheResponse({ body: "" }), { errorCode: "empty_payload" }],
    ])("reports %s and falls back to the remote URL", async (_label, reply, expected) => {
      mockFetch(reply);
      await expect(resolveCachedQcfFontUri(6)).resolves.toBe(pageUrl(6));
      expect(report).toHaveBeenCalledWith(expect.objectContaining(expected));
    });

    it.each([
      [new TypeError("Failed to fetch"), "Failed to fetch"],
      ["denied", "denied"],
    ])("reports a thrown network error (%p)", async (error, message) => {
      web.caches.open.mockRejectedValueOnce(error);
      await expect(resolveCachedQcfFontUri(6)).resolves.toBe(pageUrl(6));
      expect(report).toHaveBeenCalledWith(
        expect.objectContaining({ errorCode: "network_error", errorMessage: message }),
      );
    });
  });

  describe("basmala font", () => {
    it("serves a bucket hit without the network", async () => {
      web.store.set(BSML_URL, fakeCacheResponse());
      await loadQcfBsmlFont();
      expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: "blob:fake-1" });
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("refetches an opaque entry once for racing loads, tolerating a failed put", async () => {
      web.store.set(BSML_URL, fakeCacheResponse({ type: "opaque" }));
      web.cache.put.mockRejectedValueOnce(new Error("quota"));
      await Promise.all([loadQcfBsmlFont(), ensureMushafPageFonts(1, true)]);
      expect(fetchMock.mock.calls.filter(([url]) => url === BSML_URL)).toHaveLength(1);
    });

    it("reuses the blob URL after a runtime reset", async () => {
      await loadQcfBsmlFont();
      await resetQcfFontRuntime();
      await loadQcfBsmlFont();
      expect(font.loadAsync).toHaveBeenLastCalledWith({ QCF2_BSML: "blob:fake-1" });
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    it.each([
      ["an HTTP error", fakeCacheResponse({ status: 404 }), { httpStatus: 404 }],
      ["an empty payload", fakeCacheResponse({ body: "" }), { errorCode: "empty_payload" }],
    ])("reports %s and registers the remote URL", async (_label, reply, expected) => {
      mockFetch(reply);
      await loadQcfBsmlFont();
      expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_BSML: BSML_URL });
      expect(report).toHaveBeenCalledWith(
        expect.objectContaining({ contentKey: "qcf_font:bsml", ...expected }),
      );
    });

    it.each([
      [new Error("net"), "net"],
      [42, "42"],
    ])("reports a thrown network error (%p)", async (error, message) => {
      web.caches.open.mockRejectedValueOnce(error);
      await loadQcfBsmlFont();
      expect(report).toHaveBeenCalledWith(
        expect.objectContaining({ errorCode: "network_error", errorMessage: message }),
      );
    });
  });

  describe("font registration", () => {
    /** Installs a CSS `FontFace` + `document.fonts`; returns handles + restore. */
    function installFontFace({ fail = false } = {}) {
      const added: unknown[] = [];
      const FontFaceMock = jest.fn(function (this: Record<string, unknown>) {
        this.load = async () => {
          if (fail) throw new Error("decode");
          return this;
        };
      });
      const g = globalThis as Record<string, unknown>;
      const previousDocument = Object.getOwnPropertyDescriptor(g, "document");
      g.FontFace = FontFaceMock;
      g.document = { fonts: { add: (face: unknown) => added.push(face) } };
      const restore = () => {
        delete g.FontFace;
        if (previousDocument) Object.defineProperty(g, "document", previousDocument);
        else delete g.document;
      };
      return { FontFaceMock, added, restore };
    }

    it("uses the CSS FontFace API instead of expo-font", async () => {
      const face = installFontFace();
      try {
        await loadQcfPageFont(12);
        expect(face.FontFaceMock).toHaveBeenCalledWith("QCF2_12", 'url("blob:fake-1")');
        expect(face.added).toHaveLength(1);
        expect(font.loadAsync).not.toHaveBeenCalled();
      } finally {
        face.restore();
      }
    });

    it("fails the page (no expo-font fallback) when FontFace can't load the bytes", async () => {
      const face = installFontFace({ fail: true });
      try {
        await expect(loadQcfPageFont(13)).rejects.toBeTruthy();
        // expo-font could resolve on the same broken bytes and paint empty boxes.
        expect(font.loadAsync).not.toHaveBeenCalled();
        expect(isQcfPageFontLoaded(13)).toBe(false);
      } finally {
        face.restore();
      }
    });

    it("uses expo-font when FontFace is unavailable", async () => {
      await loadQcfPageFont(14);
      expect(font.loadAsync).toHaveBeenCalledWith({ QCF2_14: "blob:fake-1" });
    });
  });

  describe("cache info and clearing", () => {
    it("sums content-length, falls back to body size and skips unreadable or missing entries", async () => {
      web.store.set("a", fakeCacheResponse({ headers: { "content-length": "1000" } }));
      web.store.set("b", fakeCacheResponse({ headers: { "content-length": "junk" } }));
      web.store.set("c", fakeCacheResponse({ body: "x".repeat(300) }));
      web.store.set("d", fakeCacheResponse({ type: "opaque" }));
      web.store.set("e", fakeCacheResponse({ unreadable: true }));
      web.store.set("f", fakeCacheResponse());
      web.cache.match.mockImplementation(async (key: string) =>
        key === "f" ? undefined : web.store.get(key),
      );
      await expect(getQcfFontCacheInfo()).resolves.toEqual({ bytes: 1300, count: 6 });
    });

    it("reports zero when the bucket cannot be opened", async () => {
      web.caches.open.mockRejectedValueOnce(new Error("sec"));
      await expect(getQcfFontCacheInfo()).resolves.toEqual({ bytes: 0, count: 0 });
    });

    it("revokes page + basmala blob URLs and deletes the bucket", async () => {
      await resolveCachedQcfFontUri(1);
      await loadQcfBsmlFont();
      await clearQcfFontCache();
      expect(web.revokeObjectURL.mock.calls).toEqual([["blob:fake-1"], ["blob:fake-2"]]);
      expect(web.caches.delete).toHaveBeenCalledWith("munib-qcf-fonts-v1");
    });

    it("refetches after clearing", async () => {
      await resolveCachedQcfFontUri(1);
      await clearQcfFontCache();
      await expect(resolveCachedQcfFontUri(1)).resolves.toBe("blob:fake-2");
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("swallows revoke and bucket-delete failures", async () => {
      await resolveCachedQcfFontUri(1);
      await loadQcfBsmlFont();
      web.revokeObjectURL.mockImplementation(() => {
        throw new Error("revoke");
      });
      web.caches.delete.mockRejectedValueOnce(new Error("del"));
      await expect(clearQcfFontCache()).resolves.toBeUndefined();
    });
  });
});
