/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    // Cloudflare Pages serves the original files without a Next.js image server.
    unoptimized: true,
  },
};

module.exports = nextConfig;
