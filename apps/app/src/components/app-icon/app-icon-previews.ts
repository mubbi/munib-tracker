import type { ImageSource } from "expo-image";

import type { AppIconId } from "@/lib/app-icon";

/** Picker / offer thumbnails (180 px); the launcher icons themselves are compiled into the binary. */
export const APP_ICON_PREVIEWS: Record<AppIconId | "classic", ImageSource> = {
  classic: require("@/assets/images/app-icons/classic/preview.png"),
  ramadan: require("@/assets/images/app-icons/ramadan/preview.png"),
  lastTen: require("@/assets/images/app-icons/lastTen/preview.png"),
  eidFitr: require("@/assets/images/app-icons/eidFitr/preview.png"),
  hajj: require("@/assets/images/app-icons/hajj/preview.png"),
  eidAdha: require("@/assets/images/app-icons/eidAdha/preview.png"),
  newYear: require("@/assets/images/app-icons/newYear/preview.png"),
  ashura: require("@/assets/images/app-icons/ashura/preview.png"),
};
