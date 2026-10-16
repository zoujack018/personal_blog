/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: content comes from _posts/*.md (edited via Pages CMS),
  // so we export plain HTML to ./out and serve it as Cloudflare static assets.
  output: "export",
  // /2026/10/16/ → out/2026/10/16/index.html
  trailingSlash: true,
  images: { unoptimized: true },
};

module.exports = nextConfig;
