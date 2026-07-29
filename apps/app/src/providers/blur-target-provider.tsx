import { BlurTargetView } from "expo-blur";
import { createContext, type ReactNode, type RefObject, useContext, useRef } from "react";
import { Platform, type View as RNView, StyleSheet, View } from "react-native";

const BlurTargetContext = createContext<RefObject<RNView | null> | null>(null);

/** Ref to the Android `BlurTargetView` that `GlassSurface` blurs. Null off Android. */
export function useBlurTarget() {
  return useContext(BlurTargetContext);
}

type BlurTargetProviderProps = {
  /** Screens and scrollable content captured for Android backdrop blur. */
  children: ReactNode;
  /** Floating chrome above the target (mini-player, splash, gates). */
  overlays?: ReactNode;
};

/**
 * On Android SDK 55+, `BlurView` needs a `blurTarget` ref to a `BlurTargetView`
 * wrapping the content behind frosted chrome. This provider sets that up once at
 * the root; overlays sit outside the target so they can blur what's beneath.
 */
export function BlurTargetProvider({ children, overlays }: BlurTargetProviderProps) {
  const targetRef = useRef<RNView | null>(null);
  const contextValue = Platform.OS === "android" ? targetRef : null;

  return (
    <BlurTargetContext.Provider value={contextValue}>
      <View style={styles.root}>
        {Platform.OS === "android" ? (
          <BlurTargetView ref={targetRef} style={styles.target}>
            {children}
          </BlurTargetView>
        ) : (
          children
        )}
        {overlays}
      </View>
    </BlurTargetContext.Provider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  target: {
    flex: 1,
  },
});
