import { SITE } from "@/lib/site";
import type { Metadata, Viewport } from "next";

// Inter 自托管，带光学尺寸轴：大标题自动用更紧的显示字形
import "@fontsource-variable/inter/opsz.css";
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
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// 外框只有 html 和 body：看板页带边栏（见 (board)/layout.tsx），文档页自带工具栏
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
