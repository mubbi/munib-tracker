const nodeExternals = require("webpack-node-externals");
const swcDefaultConfig =
  require("@nestjs/cli/lib/compiler/defaults/swc-defaults").swcDefaultsFactory().swcOptions;

/** @param {import('webpack').Configuration} options */
module.exports = (options) => ({
  ...options,
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
});
