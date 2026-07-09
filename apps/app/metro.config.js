const fs = require("node:fs");
const path = require("node:path");
const { getDefaultConfig } = require("expo/metro-config");
const { withSentryConfig } = require("@sentry/react-native/metro");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// `@/assets/*` maps to `./assets/*` in tsconfig (not `./src/assets/*` like `@/*`).
// Mirror jest.config.js: resolve this before the generic `@/*` alias.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("@/assets/")) {
    const assetPath = path.join(projectRoot, "assets", moduleName.slice("@/assets/".length));
    return context.resolveRequest(context, assetPath, platform);
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
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

module.exports = withSentryConfig(config, {
  autoWrapExpoRouterErrorBoundary: true,
});
