import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for smaller deployments
  output: "standalone",

  // Enable production optimizations
  reactStrictMode: true,

  // Disable the x-powered-by header for security
  poweredByHeader: false,

  // Image optimization
  images: {
    // Enable modern image formats
    formats: ["image/avif", "image/webp"],
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200],
    // Image sizes for custom sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimum cache time for optimized images (1 year)
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
      { protocol: "https", hostname: "api.qrserver.com", pathname: "/**" },
      { protocol: "https", hostname: "trendaryo.com", pathname: "/**" },
    ],
  },

  // Compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },

  // Experimental features for performance
  experimental: {
    // Optimize CSS to reduce unused CSS
    optimizeCss: true,
  },

  // Headers for caching and performance
  async headers() {
    return [
      {
        // Cache static assets aggressively
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache public assets
        source: "/:all(svg|ico|jpg|jpeg|png|gif|webp|avif|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;