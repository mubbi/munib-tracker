import type { ImageSourcePropType } from "react-native";

/** Self-hosted locale flags (SVG). Used on web; native falls back to emoji in LocaleFlag. */
export const FLAG_ASSETS: Record<string, ImageSourcePropType> = {
  pk: require("./pk.svg"),
  sa: require("./sa.svg"),
  us: require("./us.svg"),
  af: require("./af.svg"),
  al: require("./al.svg"),
  az: require("./az.svg"),
  ba: require("./ba.svg"),
  bd: require("./bd.svg"),
  fr: require("./fr.svg"),
  id: require("./id.svg"),
  ir: require("./ir.svg"),
  kg: require("./kg.svg"),
  ku: require("./ku.svg"),
  kz: require("./kz.svg"),
  my: require("./my.svg"),
  ng: require("./ng.svg"),
  ru: require("./ru.svg"),
  so: require("./so.svg"),
  tj: require("./tj.svg"),
  tm: require("./tm.svg"),
  tr: require("./tr.svg"),
  tz: require("./tz.svg"),
  uz: require("./uz.svg"),
};
