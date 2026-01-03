import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  redirects: async () => [
    {
      source: "/admin/academic-years",
      destination: "/admin/academic/years",
      permanent: true,
    },
    {
      source: "/admin/academic-terms",
      destination: "/admin/academic/terms",
      permanent: true,
    },
  ],
  rewrites: async () => ({
    // Proxy /api to the local backend during development. Use
    // `NEXT_PUBLIC_API_PROXY` if you need a custom address, otherwise
    // default to http://localhost:3001.
    beforeFiles: process.env.NODE_ENV === "development" ? [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_PROXY || "http://localhost:3001"}/api/:path*`,
      },
    ] : [],
  }),
};

export default nextConfig;
