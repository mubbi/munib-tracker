/**
 * Jest-only sync accessor for the home below-fold body. Kept separate so
 * production Metro never sees `require("./home-below-fold")` inside the home route.
 */
export function loadHomeBelowFoldSyncForTests(): typeof import("./home-below-fold").HomeBelowFold {
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Jest CJS
  return require("./home-below-fold")
    .HomeBelowFold as typeof import("./home-below-fold").HomeBelowFold;
}
