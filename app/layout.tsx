import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter = vårt premium-teckensnitt, samma familj som många moderna startups.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SommarMatch – Hitta ditt sommarjobb genom att svepa",
  description:
    "TikTok för sommarjobb, extrajobb och första jobbet. Inga CV. Inget krångel. Svep, hitta, sök.",
};

// Mobil först: gör att sajten känns som en riktig app i mobilen.
export const viewport: Viewport = {
  themeColor: "#ff8a00",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
