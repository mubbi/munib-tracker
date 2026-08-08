/**
 * Dev-only console filter for known-noise React Native logs.
 *
 * VirtualizedList's "large list that is slow to update" log does not measure
 * render time — it measures the gap between consecutive scroll *events*
 * (`dt > 500 && prevDt > 500 && contentLength > 5 * visibleLength`). Any two
 * isolated scroll events (initial layout adjustment, reading-chrome collapse,
 * the first frame of a follow-scroll animation) spaced >500ms apart trip it,
 * even on a completely idle JS thread. Documented upstream false positive:
 * https://github.com/facebook/react-native/issues/32680 ("dt is exactly how
 * long I spend idle"). Genuine ayah-reader jank was fixed by moving playback /
 * word-by-word state into contexts; this filter drops the remaining noise.
 */
const SUPPRESSED_LOG_PREFIXES = ["VirtualizedList: You have a large list that is slow to update"];

if (__DEV__) {
  const originalLog = console.log;
  console.log = (...args: unknown[]) => {
    const first = args[0];
    if (
      typeof first === "string" &&
      SUPPRESSED_LOG_PREFIXES.some((prefix) => first.startsWith(prefix))
    ) {
      return;
    }
    originalLog(...args);
  };
}
