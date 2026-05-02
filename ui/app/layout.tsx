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
        <footer className="w-full bg-white border-t border-slate-100 px-6 py-8 pb-24 md:pb-8">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p className="font-medium">
              © {new Date().getFullYear()} CBC Pathways. All rights reserved.
            </p>
            <div className="flex flex-col gap-2 font-semibold text-slate-600 sm:flex-row sm:items-center sm:gap-5">
              <a href="https://wa.me/254742301435" className="hover:text-blue-600">
                WhatsApp: +254 742 301 435
              </a>
              <a href="mailto:owinojumahjerome@gmail.com" className="hover:text-blue-600">
                owinojumahjerome@gmail.com
              </a>
            </div>
          </div>
        </footer>
        <MobileBottomNav />
        {/* Vercel Web Analytics — zero config page-view tracking */}
        <Analytics />
      </body>
    </html>
  );
}
