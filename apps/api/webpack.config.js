const path = require("node:path");
const nodeExternals = require("webpack-node-externals");
const swcDefaultConfig =
  require("@nestjs/cli/lib/compiler/defaults/swc-defaults").swcDefaultsFactory().swcOptions;

/** @param {import('webpack').Configuration} options */
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
      // Expose `export default` from vercel-handler (Nest's default IIFE exports nothing).
      libraryTarget: "commonjs2",
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
        callback();
      },
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: (modulePath) =>
            /node_modules/.test(modulePath) && !modulePath.includes("@munib-tracker"),
          use: {
            loader: "swc-loader",
            options: swcDefaultConfig,
          },
        },
      ],
    },
  };
};
