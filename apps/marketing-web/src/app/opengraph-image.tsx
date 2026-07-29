import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { APP_NAME, APP_TAGLINE } from "@munib-tracker/shared/constants";
import { ImageResponse } from "next/og";

export const alt = APP_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logoPath = join(process.cwd(), "public", "icon-512.png");
  const logoData = await readFile(logoPath);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 48,
        padding: 80,
        background: "linear-gradient(135deg, #12463a 0%, #0b2a22 100%)",
        color: "#f2efe6",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse requires a native img for inline base64 logos */}
      <img
        src={logoSrc}
        alt=""
        width={220}
        height={220}
        style={{ borderRadius: 48, flexShrink: 0 }}
      />
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <p style={{ fontSize: 28, color: "#e4ce9e", letterSpacing: 4, textTransform: "uppercase" }}>
          {APP_TAGLINE}
        </p>
        <h1 style={{ fontSize: 72, fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>
          {APP_NAME}
        </h1>
        <p
          style={{ fontSize: 28, color: "#a9c6bb", marginTop: 24, maxWidth: 720, lineHeight: 1.4 }}
        >
          Salah · Dhikr · Qadha · Qur&apos;an · Hadith · Learn
        </p>
      </div>
    </div>,
    { ...size },
  );
}
