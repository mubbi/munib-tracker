module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      // Jest only (NODE_ENV=test): make `import()` runnable without VM modules.
      test: { plugins: ["./scripts/babel/jest-dynamic-import.cjs"] },
    },
  };
};
