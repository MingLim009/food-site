import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Cloudflare quick tunnels so /_next assets aren't blocked in dev
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "position-entire-issue-dry.trycloudflare.com",
  ],
  // Keep seeded SQLite available in Vercel serverless functions
  outputFileTracingIncludes: {
    "/api/**/*": ["./prisma/seed.db", "./prisma/schema.prisma"],
    "/login": ["./prisma/seed.db"],
    "/app/**/*": ["./prisma/seed.db"],
    "/*": ["./prisma/seed.db"],
  },
  async headers() {
    return [
      {
        source: "/brand/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET, OPTIONS" },
          { key: "Cache-Control", value: "public, max-age=3600" },
        ],
      },
    ];
  },
};

export default nextConfig;
