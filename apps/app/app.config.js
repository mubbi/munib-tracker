/** @type {import('expo/config').ConfigContext} */
module.exports = ({ config }) => {
  const version = process.env.APP_VERSION ?? config.version ?? "1.0.0";
  const androidVersionCode = Number.parseInt(
    process.env.ANDROID_VERSION_CODE ??
      String(config.android?.versionCode ?? 1),
    10,
  );
  const iosBuildNumber =
    process.env.IOS_BUILD_NUMBER ?? config.ios?.buildNumber ?? "1";

  return {
    ...config,
    version,
    ios: {
      ...config.ios,
      buildNumber: iosBuildNumber,
    },
    android: {
      ...config.android,
      versionCode: androidVersionCode,
    },
  };
};
