import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sororine",
  description: "Women Safety & Incident Management Platform",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#050507]">
        {/* Persistent Global Background Gradient */}
        <div className="fixed inset-0 bg-linear-to-r from-[#141414] to-[#023264] pointer-events-none z-[-100]" />

        {children}
        <Analytics />
      </body>
    </html>
  );
}
