import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Inter = vårt premium-teckensnitt, samma familj som många moderna startups.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SommarMatch – Tjäna pengar. Bygg din framtid.",
  description:
    "Sveriges plattform för unga 15–25. Sommarjobb, extrajobb, gig och praktik – allt på ett ställe. Svep, matcha, sök på en sekund.",
};

// Mobil först: gör att sajten känns som en riktig app i mobilen.
export const viewport: Viewport = {
  themeColor: "#08080c",
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
      <body className="min-h-full flex flex-col bg-bg text-text">{children}</body>
    </html>
  );
}
