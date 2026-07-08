import type { ImageSourcePropType } from "react-native";

/** Self-hosted locale flags (SVG). Used on web; native falls back to emoji in LocaleFlag. */
export const FLAG_ASSETS: Record<string, ImageSourcePropType> = {
  pk: require("./pk.svg"),
  sa: require("./sa.svg"),
  us: require("./us.svg"),
};
