import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable caching during development/debugging
  // Remove this if you want to re-enable caching
  // experimental: {
  //   isrMemoryCacheSize: 0,
  // },
  // Render.com configuration
  output: 'standalone',
};

export default nextConfig;
