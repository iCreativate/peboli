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
  // Configure Content Security Policy headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            // Allow unsafe-eval only in development for Next.js and third-party libraries
            // In production, this should be removed for better security
            value: process.env.NODE_ENV === 'development'
              ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; object-src 'none'; base-uri 'self';"
              : "script-src 'self' 'unsafe-inline' https:; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
