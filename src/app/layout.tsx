import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin — Asem Ahmed",
};

/**
 * Root layout — shared by:
 * - (admin) routes: /login, /dashboard/**
 * - [locale] layout inherits from this and overrides html lang/dir
 *
 * suppressHydrationWarning on both html and body is required because:
 * 1. next-themes injects a blocking script into body during SSR
 * 2. [locale]/layout.tsx overrides lang and dir on the client
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`${inter.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
