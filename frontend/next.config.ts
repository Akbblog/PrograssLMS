import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  rewrites: async () => ({
    // Only proxy /api to localhost during development. In production the
    // real API should be configured via `NEXT_PUBLIC_API_URL` or a platform
    // proxy. Leaving a localhost rewrite in production can cause the browser
    // or hosting platform to attempt local-network connections and trigger
    // permission prompts like "Look for and connect to any device on your
    // local network."
    beforeFiles: process.env.NODE_ENV === "development" ? [
      {
        source: "/api/:path*",
        destination: "http://localhost:5130/api/:path*",
      },
    ] : [],
  }),
};

export default nextConfig;
