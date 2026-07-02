const swcDefaultConfig =
  require("@nestjs/cli/lib/compiler/defaults/swc-defaults").swcDefaultsFactory().swcOptions;

/** @param {import('webpack').Configuration} options */
module.exports = (options) => ({
  ...options,
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
