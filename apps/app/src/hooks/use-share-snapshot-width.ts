import { useWindowDimensions } from "react-native";

const SHARE_SNAPSHOT_MAX_WIDTH = 430;

/** Width of the off-screen share snapshot — matches the app frame column, not the full window. */
export function useShareSnapshotWidth(): number {
  const { width: windowWidth } = useWindowDimensions();
  return Math.min(windowWidth, SHARE_SNAPSHOT_MAX_WIDTH);
}
