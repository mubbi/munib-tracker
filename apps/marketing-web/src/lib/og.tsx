import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { APP_NAME } from "@munib-tracker/shared/constants";
import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

let logoCache: string | null = null;
async function logoDataUri(): Promise<string> {
  if (logoCache) return logoCache;
  const data = await readFile(join(process.cwd(), "public", "icon-512.png"));
  logoCache = `data:image/png;base64,${data.toString("base64")}`;
  return logoCache;
}

/** Branded 1200×630 social card shared by every route's `opengraph-image`. */
export async function renderOgImage({
  eyebrow,
  title,
  footer = "Salah · Zikr · Qaza · Qur'an · Learn",
}: {
  eyebrow: string;
  title: string;
  footer?: string;
}) {
  const logo = await logoDataUri();
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "linear-gradient(135deg, #0f3a30 0%, #0b2734 55%, #13213a 100%)",
        color: "#f4f1ea",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* biome-ignore lint/performance/noImgElement: ImageResponse requires a native img */}
        <img src={logo} alt="" width={72} height={72} style={{ borderRadius: 18 }} />
        <span style={{ fontSize: 32, fontWeight: 700 }}>{APP_NAME}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{ fontSize: 26, color: "#ecc978", letterSpacing: 4, textTransform: "uppercase" }}
        >
          {eyebrow}
        </span>
        <span
          style={{
            fontSize: title.length > 60 ? 56 : 66,
            fontWeight: 800,
            lineHeight: 1.1,
            marginTop: 18,
            maxWidth: 1000,
          }}
        >
          {title}
        </span>
      </div>
      <span style={{ fontSize: 26, color: "#a9c6bb" }}>{footer}</span>
    </div>,
    { ...OG_SIZE },
  );
}
