import { createContext, type ReactNode, useContext, useMemo, useState } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Spacing } from "@/constants/theme";
import { getNativeTabBarOffset, useIsTabScreen } from "@/hooks/use-tab-screen";
import { useWebTabLayout } from "@/hooks/use-web-tab-layout";

const MiniPlayerInsetContext = createContext<{
  inset: number;
  setInset: (height: number) => void;
}>({
  inset: 0,
  setInset: () => {},
});

/** Tracks the measured height of the docked compact mini-player. */
export function MiniPlayerInsetProvider({ children }: { children: ReactNode }) {
  const [inset, setInset] = useState(0);
  const value = useMemo(() => ({ inset, setInset }), [inset]);
  return (
    <MiniPlayerInsetContext.Provider value={value}>{children}</MiniPlayerInsetContext.Provider>
  );
}

/** Extra bottom padding when the compact mini-player is visible. */
export function useMiniPlayerInset(): number {
  return useContext(MiniPlayerInsetContext).inset;
}

/** @internal Called by the mini-player when it mounts or changes size. */
export function useSetMiniPlayerInset(): (height: number) => void {
  return useContext(MiniPlayerInsetContext).setInset;
}

/** Space reserved for the tab bar, or the home indicator on stack screens. */
export function useTabBarOffset(): number {
  const insets = useSafeAreaInsets();
  const inTabs = useIsTabScreen();
  const { bottomTabBarOffset } = useWebTabLayout();

  if (!inTabs) return insets.bottom;
  if (Platform.OS === "web") return bottomTabBarOffset;
  return getNativeTabBarOffset(insets.bottom);
}

/**
 * Bottom chrome covering scroll content: tab bar and/or the docked mini-player.
 * On stack screens the player docks at `bottom: 0` and pads the safe area itself,
 * so its measured height already includes `insets.bottom`.
 */
export function useObstructedBottomInset(): number {
  const tabBarOffset = useTabBarOffset();
  const miniPlayerInset = useMiniPlayerInset();
  const inTabs = useIsTabScreen();
  if (miniPlayerInset > 0 && !inTabs) return miniPlayerInset;
  return tabBarOffset + miniPlayerInset;
}

/** Scroll/list bottom padding: tab bar + mini-player + breathing room. */
export function useContentBottomInset(extra = Spacing.four): number {
  return useObstructedBottomInset() + extra;
}
