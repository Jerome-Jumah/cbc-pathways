import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { siteConfig } from "@/lib/seo";
import "./globals.css";

const georgia = localFont({
  src: "./georgia-2/georgia.ttf",
  variable: "--font-georgia",
});

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// ─── Global Metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),

  title: {
    default: "CBC Pathways - Find Subject Combinations and Senior Schools in Kenya",
    template: "%s | CBC Pathways",
  },

  description: siteConfig.description,

  keywords: siteConfig.keywords,

  authors: [{ name: "CBC Pathways Team" }],
  creator: "CBC Pathways",
  applicationName: siteConfig.name,

  // Open Graph — shown on WhatsApp, Facebook, LinkedIn, Slack previews
  openGraph: {
    type: "website",
    locale: "en_KE",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "CBC Pathways - Find Subject Combinations and Senior Schools in Kenya",
    description: siteConfig.description,
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "CBC Pathways - Find your subject combination and senior school in Kenya",
      },
    ],
  },

  // Twitter / X card
  twitter: {
    card: "summary_large_image",
    title: "CBC Pathways - Find Subject Combinations and Senior Schools in Kenya",
    description: siteConfig.description,
    images: ["/opengraph-image.png"],
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
  },

  // Indexing defaults (individual pages can override)
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Favicon / icons (Next.js picks up app/favicon.ico automatically)
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },

  // Allow search engines to verify ownership
  // verification: { google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN" },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fontSans.variable} ${georgia.variable} antialiased`}>
        {children}
        <MobileBottomNav />
        {/* Vercel Web Analytics — zero config page-view tracking */}
        <Analytics />
      </body>
    </html>
  );
}