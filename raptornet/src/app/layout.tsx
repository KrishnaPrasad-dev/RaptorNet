import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RaptorNet",
  description: "A curated tech guild for serious builders at Guru Nanak institutions.",
  verification: {
    google: 'mLo8noFQdAc_ZQCaiPgD3Rpl6LC7gsLidMnGSWZQZa4',
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={{ backgroundColor: "#0d0d0f", color: "#ededed" }}
    >
      <body
        className="min-h-full bg-[#0d0d0f]"
        style={{ backgroundColor: "#0d0d0f", color: "#ededed" }}
      >
        <CustomCursor />
        <div aria-hidden="true" className="rn-grain-overlay" />
        <div className="relative z-10 flex min-h-full flex-col">
          <div className="flex-1">{children}</div>
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
