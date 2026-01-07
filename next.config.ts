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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.vercel-storage.com',
        pathname: '/**',
      },
      // Allow common image hosting domains
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
