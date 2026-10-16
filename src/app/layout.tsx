import { Today } from "@/components/Today";
import { SITE } from "@/lib/site";
import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.title}` },
  description: SITE.tagline,
  robots: SITE.indexable ? undefined : { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: { types: { "application/rss+xml": "/feed.xml" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f4" },
    { media: "(prefers-color-scheme: dark)", color: "#161513" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip" href="#main">
          跳到正文
        </a>
        <header className="site-header">
          <div className="wrap bar">
            <div className="brand">
              <a className="brand-title" href="/">
                {SITE.title}
              </a>
              <p className="brand-tagline">{SITE.tagline}</p>
            </div>
            <Today />
          </div>
        </header>

        {children}

        <footer className="site-footer">
          <div className="wrap">
            <span>
              © {new Date().getFullYear()} {SITE.title}
            </span>
            <a href="/feed.xml">RSS 订阅</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
