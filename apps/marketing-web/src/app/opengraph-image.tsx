import { APP_TAGLINE } from "@munib-tracker/shared/constants";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = "Munib Tracker — Salah tracker, Zikr and Qur'an app";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OpenGraphImage() {
  return renderOgImage({
    eyebrow: APP_TAGLINE,
    title: "Salah, Qaza, Zikr and the Qur'an in one calm app",
  });
}
