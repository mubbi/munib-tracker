import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Arabic,
  Noto_Naskh_Arabic,
  Noto_Nastaliq_Urdu,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";
import "./studio-canvas.css";

// Same faces as the marketing site (apps/marketing-web/src/app/fonts.ts):
// Plus Jakarta Sans for Latin display copy; IBM Plex Sans Arabic for ar;
// Noto Nastaliq Urdu headings + Noto Naskh Arabic body for ur. The canvas root
// carries `lang`, and studio-canvas.css picks the stack per locale.
const font = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

const nastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-nastaliq",
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  preload: false,
});

const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

export const metadata: Metadata = {
  title: "Munib Tracker — Screenshot Studio",
  description: "Design and export App Store + Google Play screenshots for Munib Tracker.",
  icons: {
    icon: [{ url: "/app-icon.png", type: "image/png" }],
    apple: [{ url: "/app-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={[font.variable, plexArabic.variable, nastaliq.variable, naskh.variable].join(" ")}
    >
      <body className={font.className}>{children}</body>
    </html>
  );
}
