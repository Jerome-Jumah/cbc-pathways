import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";
import { HumanVerificationDialog } from "@/components/security/human-verification-dialog";
import { HumanVerificationProvider } from "@/context/human-verification-context";
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} ${georgia.variable} antialiased`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const mode = localStorage.getItem("cbc-theme") || "system";
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && prefersDark));
                } catch {}
              })();
            `,
          }}
        />
        <HumanVerificationProvider>
          {children}
          <HumanVerificationDialog />
        </HumanVerificationProvider>
        <footer className="w-full bg-card border-t border-border px-6 py-8 pb-24 md:pb-8 dark:border-border dark:bg-card">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
            <p className="font-medium">
              © {new Date().getFullYear()} CBC Pathways. All rights reserved.
            </p>
            <p className="font-semibold text-muted-foreground">
              Designed and developed by{" "}
              <a
                href="https://code4flare.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-foreground hover:underline"
              >
                Code4Flare
              </a>
              .
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://wa.me/254742301435"
                aria-label="Contact Jerome on WhatsApp"
                title="WhatsApp"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-emerald-200 dark:hover:border-emerald-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600 dark:hover:text-emerald-300"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.26-1.38a9.84 9.84 0 0 0 4.78 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.46 17.51 2 12.04 2Zm0 18.16h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.4c0-4.54 3.69-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.41a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.12.16 1.73 2.64 4.19 3.7.59.25 1.05.41 1.4.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.28Z" />
                </svg>
                <span className="sr-only">WhatsApp</span>
              </a>
              <a
                href="mailto:hell@code4flare.com"
                aria-label="Email Code4Flare"
                title="Email"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-blue-200 dark:hover:border-blue-800/50 hover:bg-accent hover:text-blue-600 dark:hover:text-blue-300"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16v12H4z" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
                <span className="sr-only">Email</span>
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
