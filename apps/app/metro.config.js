const fs = require("node:fs");
const path = require("node:path");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

// Queue fs ops on EMFILE instead of crashing. Metro's BinaryFileStore + async
// route HMR can open thousands of metro-cache files in parallel on Windows.
try {
  require("graceful-fs").gracefulify(fs);
} catch {
  // optional transitive dep; ignore if not hoisted
}

// realpathSync keeps drive-letter casing stable on Windows (e: vs E:). Metro's
// FileMap lookups are case-sensitive; mixed casing breaks monorepo resolves.
const projectRoot = fs.realpathSync.native(__dirname);
const monorepoRoot = fs.realpathSync.native(path.resolve(projectRoot, "../.."));
const config = getSentryExpoConfig(projectRoot, {
  autoWrapExpoRouterErrorBoundary: true,
});

// Expo monorepo watchFolders include every workspace package (api, marketing-web,
// tooling). That + ~458 async web chunks fans out HMR transforms until Windows
// hits EMFILE on metro-cache reads. Keep only packages the product app imports.
/** Case-fold paths on Windows so `E:\…` and `e:\…` match in Set lookups. */
function watchPathKey(p) {
  const resolved = path.resolve(p);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
const appWatchFolders = new Set(
  [
    // Do NOT watch root node_modules on Windows — tens of thousands of watch
    // handles tip the process into EMFILE before BinaryFileStore even runs.
    // Resolution still uses nodeModulesPaths; dep edits need a Metro restart.
    path.join(monorepoRoot, "packages/shared"),
    path.join(monorepoRoot, "packages/theme"),
    path.join(monorepoRoot, "packages/api-client"),
    path.join(monorepoRoot, "packages/api-contract"),
  ].map(watchPathKey),
);
if (process.platform !== "win32") {
  appWatchFolders.add(watchPathKey(path.join(monorepoRoot, "node_modules")));
}
config.watchFolders = (config.watchFolders || []).filter((folder) =>
  appWatchFolders.has(watchPathKey(folder)),
);

// Windows: disk metro-cache + async-route HMR opens thousands of .mp files in
// parallel (buildSubgraph Promise.all) and hits EMFILE. Keep transforms in
// memory for this process instead. Opt back into disk with METRO_DISK_CACHE=1.
if (process.platform === "win32" && process.env.METRO_DISK_CACHE !== "1") {
  const map = new Map();
  config.cacheStores = [
    {
      name: "MemoryTransformStore",
      get(key) {
        const k = key.toString("hex");
        return map.has(k) ? map.get(k) : null;
      },
      set(key, value) {
        map.set(key.toString("hex"), value);
      },
      clear() {
        map.clear();
      },
    },
  ];
}

// Cap transform workers on Windows (16-core default ≈ 8–10 workers). Override
// with METRO_MAX_WORKERS when needed.
if (process.platform === "win32") {
  const fromEnv = Number(process.env.METRO_MAX_WORKERS);
  config.maxWorkers =
    Number.isFinite(fromEnv) && fromEnv > 0 ? fromEnv : Math.min(config.maxWorkers ?? 2, 2);
}

// Expo monorepo watchFolders include apps/app. A local `dist/` (expo export) can
// hold tens of thousands of hashed chunks; on Windows the native watcher then
// times out ("Failed to start watch mode"), leaving DependencyGraph without
// `_resolutionCache` and crashing SSR with "Cannot read properties of undefined
// (reading 'get')". Keep export / lab / native / asset output out of the graph.
/** Match an absolute directory and its descendants on Windows or POSIX. */
function absoluteDirPattern(absDir) {
  const escaped = path
    .resolve(absDir)
    .split(/[/\\]/)
    .map((segment) => segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("[\\\\/]");
  return new RegExp(`^${escaped}([\\\\/]|$)`);
}

const existingBlockList = config.resolver.blockList;
config.resolver.blockList = [
  ...(Array.isArray(existingBlockList)
    ? existingBlockList
    : existingBlockList
      ? [existingBlockList]
      : []),
  absoluteDirPattern(path.join(projectRoot, "dist")),
  absoluteDirPattern(path.join(projectRoot, "web-build")),
  absoluteDirPattern(path.join(projectRoot, ".lighthouse")),
  absoluteDirPattern(path.join(projectRoot, ".screenshots-work")),
  absoluteDirPattern(path.join(projectRoot, "android")),
  absoluteDirPattern(path.join(projectRoot, "ios")),
  absoluteDirPattern(path.join(projectRoot, "store-assets")),
  absoluteDirPattern(path.join(projectRoot, "scripts")),
  absoluteDirPattern(path.join(projectRoot, "targets")),
  absoluteDirPattern(path.join(projectRoot, ".expo")),
];

// `@/assets/*` maps to `./assets/*` in tsconfig (not `./src/assets/*` like `@/*`).
// Mirror jest.config.js: resolve this before the generic `@/*` alias.
/** Themed content-space loader while async route chunks bundle (web). */
const routeSuspenseFallback = path.join(
  projectRoot,
  "src/components/navigation/route-suspense-fallback.tsx",
);

/**
 * Orval `clean: true` deletes + rewrites packages/api-client/src/generated while
 * Metro is running. On Windows the FileMap often misses the new files (watcher
 * race), so doesFileExist returns false even though the paths exist on disk.
 * Fall back to real fs for relative imports under packages/*.
 */
function resolveWorkspaceRelativeFromDisk(originModulePath, moduleName, sourceExts) {
  if (!moduleName.startsWith("./") && !moduleName.startsWith("../")) {
    return null;
  }
  const origin = (originModulePath || "").replace(/\\/g, "/").toLowerCase();
  if (!origin.includes("/packages/")) {
    return null;
  }
  const base = path.resolve(path.dirname(originModulePath), moduleName);
  const exts = sourceExts?.length ? sourceExts : ["ts", "tsx", "js", "jsx", "mjs", "cjs", "json"];
  for (const ext of exts) {
    const candidate = `${base}.${ext}`;
    if (fs.existsSync(candidate)) {
      return { type: "sourceFile", filePath: candidate };
    }
  }
  if (fs.existsSync(base) && fs.statSync(base).isFile()) {
    return { type: "sourceFile", filePath: base };
  }
  for (const ext of exts) {
    const candidate = path.join(base, `index.${ext}`);
    if (fs.existsSync(candidate)) {
      return { type: "sourceFile", filePath: candidate };
    }
  }
  return null;
}

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@/assets/")) {
    const assetPath = path.join(projectRoot, "assets", moduleName.slice("@/assets/".length));
    return context.resolveRequest(context, assetPath, platform);
  }
  // Async routes always use expo-router's built-in SuspenseFallback (tiny toast /
  // blank). Alias it to our themed content-space placeholder instead.
  const origin = (context.originModulePath || "").replace(/\\/g, "/");
  if (
    origin.includes("/expo-router/") &&
    (moduleName === "./views/SuspenseFallback" ||
      moduleName.endsWith("/views/SuspenseFallback") ||
      moduleName === "expo-router/build/views/SuspenseFallback")
  ) {
    return { filePath: routeSuspenseFallback, type: "sourceFile" };
  }
  try {
    if (originalResolveRequest) {
      return originalResolveRequest(context, moduleName, platform);
    }
    return context.resolveRequest(context, moduleName, platform);
  } catch (error) {
    const fromDisk = resolveWorkspaceRelativeFromDisk(
      context.originModulePath,
      moduleName,
      context.sourceExts,
    );
    if (fromDisk) {
      return fromDisk;
    }
    throw error;
  }
};

// Serve the Web Push service worker in dev so /expo-service-worker.js is available at localhost
config.server = config.server || {};
const originalEnhanceMiddleware = config.server.enhanceMiddleware;
config.server.enhanceMiddleware = (middleware) => {
  const base =
    typeof originalEnhanceMiddleware === "function"
      ? originalEnhanceMiddleware(middleware)
      : middleware;
  return (req, res, next) => {
    const url = req.url?.split("?")[0];
    if (url === "/expo-service-worker.js") {
      const swPath = path.join(projectRoot, "public", "expo-service-worker.js");
      if (fs.existsSync(swPath)) {
        res.setHeader("Content-Type", "application/javascript");
        res.end(fs.readFileSync(swPath, "utf8"));
        return;
      }
    }
    if (url === "/manifest.json") {
      const manifestPath = path.join(projectRoot, "public", "manifest.json");
      if (fs.existsSync(manifestPath)) {
        res.setHeader("Content-Type", "application/manifest+json");
        res.end(fs.readFileSync(manifestPath, "utf8"));
        return;
      }
    }
    if (url === "/apple-touch-icon.png") {
      const iconPath = path.join(projectRoot, "public", "apple-touch-icon.png");
      if (fs.existsSync(iconPath)) {
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.end(fs.readFileSync(iconPath));
        return;
      }
    }
    /** Serve PWA / notification icons without Metro asset resolution. */
    const assetMatch = url?.match(/^\/assets\/images\/([^?]+)$/);
    if (assetMatch) {
      const safe = assetMatch[1]
        .replace(/\\/g, "/")
        .split("/")
        .filter((p) => p && p !== "..");
      const imagesDir = path.join(projectRoot, "assets", "images");
      const filePath = path.join(imagesDir, ...safe);
      if (
        filePath.startsWith(imagesDir) &&
        fs.existsSync(filePath) &&
        fs.statSync(filePath).isFile()
      ) {
        const ext = path.extname(filePath).toLowerCase();
        const mime =
          ext === ".png"
            ? "image/png"
            : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : ext === ".webp"
                ? "image/webp"
                : ext === ".gif"
                  ? "image/gif"
                  : "application/octet-stream";
        res.setHeader("Content-Type", mime);
        res.setHeader("Cache-Control", "public, max-age=86400");
        res.end(fs.readFileSync(filePath));
        return;
      }
    }
    return base(req, res, next);
  };
};

module.exports = config;
