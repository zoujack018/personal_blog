/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static site: content comes from _posts/*.md (edited via Pages CMS),
  // so we export plain HTML to ./out and serve it as Cloudflare static assets.
  output: "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
