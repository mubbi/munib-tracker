import "react-native";

declare module "react-native" {
  interface ViewStyle {
    /** Supported on react-native-web; locks layout direction for micro-controls in RTL UI. */
    writingDirection?: "auto" | "ltr" | "rtl";
  }

  interface ViewProps {
    /** HTML `dir` attribute — react-native-web only. */
    dir?: "ltr" | "rtl" | "auto";
  }
}
