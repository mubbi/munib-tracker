const path = require("node:path");
const nodeExternals = require("webpack-node-externals");

/**
 * Nest CLI 12 `builder: rspack` config (replaces the deprecated
 * `compilerOptions.webpack` + `webpack.config.js`). Same bundle shape as before:
 * `dist/main.js` for local runs and `dist/vercel-handler.js` for the Vercel
 * function (`api/index.js`), with `@munib-tracker/*` workspace sources inlined.
 */

/**
 * Optional peers that libraries load lazily (`import()` behind an adapter check)
 * and that this Express app never installs. @nestjs/swagger 12 lazily imports
 * `@fastify/static` only for the Fastify adapter; the bundler would otherwise fail
 * to resolve it. Leave them as runtime requires (never reached on Express) and
 * bundle them normally if they ever become installed.
 */
const OPTIONAL_LAZY_PEERS = new Set(["@fastify/static"]);

/**
 * Native addons cannot be bundled (`bindings` looks for `.node` files relative to
 * the package). TypeORM loads the driver lazily, so the runtime require is only
 * reached in sqlite mode (tests / local OpenAPI export), never on Postgres.
 */
const NATIVE_ADDONS = new Set(["better-sqlite3"]);

function isUnresolvable(request) {
  try {
    require.resolve(request, { paths: [__dirname] });
    return false;
  } catch {
    return true;
  }
}

/** Nest's default `builtin:swc-loader` options (decorators + decorator metadata). */
function nestSwcLoaderOptions(options) {
  for (const rule of options.module?.rules ?? []) {
    const use = Array.isArray(rule?.use) ? rule.use : [];
    const swc = use.find((u) => u?.loader === "builtin:swc-loader");
    if (swc) return swc.options;
  }
  throw new Error("[rspack.config] Nest default builtin:swc-loader rule not found");
}

/** @param {import('@rspack/core').Configuration} options */
module.exports = (options) => {
  const nestEntry =
    typeof options.entry === "object" && !Array.isArray(options.entry)
      ? options.entry
      : { main: options.entry };

  return {
    ...options,
    entry: {
      ...nestEntry,
      // Separate Vercel handler so serverless never requires workspace `.ts` sources.
      "vercel-handler": path.join(__dirname, "src/vercel-handler.ts"),
    },
    output: {
      ...options.output,
      filename: "[name].js",
      // Expose `export default` from vercel-handler.
      library: { type: "commonjs2" },
    },
    // Keep real __dirname so bundled deps (e.g. TypeORM app-root-path) resolve on Vercel.
    node: {
      ...(typeof options.node === "object" && options.node ? options.node : {}),
      __dirname: true,
      __filename: true,
    },
    // Workspace packages use NodeNext-style `.js` import specifiers while sources
    // remain `.ts` (e.g. `@munib-tracker/live-activity-delivery`).
    resolve: {
      ...options.resolve,
      extensionAlias: {
        ...(typeof options.resolve?.extensionAlias === "object"
          ? options.resolve.extensionAlias
          : {}),
        ".js": [".ts", ".js"],
      },
    },
    // Bundle workspace packages (package exports point at .ts sources). Keep
    // swagger-ui-dist external so absolute-path.js is not rewritten to dist/.
    externals: [
      nodeExternals({
        allowlist: [/^@munib-tracker\//],
      }),
      ({ request }, callback) => {
        if (request === "swagger-ui-dist" || request?.startsWith("swagger-ui-dist/")) {
          return callback(null, `commonjs ${request}`);
        }
        if (
          NATIVE_ADDONS.has(request) ||
          (OPTIONAL_LAZY_PEERS.has(request) && isUnresolvable(request))
        ) {
          return callback(null, `commonjs ${request}`);
        }
        callback();
      },
    ],
    module: {
      ...options.module,
      rules: [
        {
          test: /\.ts$/,
          // Nest's default rule skips node_modules; workspace packages ship .ts sources.
          exclude: (modulePath) =>
            /node_modules/.test(modulePath) && !modulePath.includes("@munib-tracker"),
          use: [{ loader: "builtin:swc-loader", options: nestSwcLoaderOptions(options) }],
        },
      ],
    },
  };
};
