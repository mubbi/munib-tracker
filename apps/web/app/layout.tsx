import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Munib Tracker",
  description: "Tracking salah, dhikr, and qadha in your journey back to Allah.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
