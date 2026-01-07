import type { NextConfig } from "next";
import path from "path";

const apiOrigin = (() => {
  // NEXT_PUBLIC_API_URL is expected to be like: https://<backend>/api/v1
  // Convert it to origin (https://<backend>) for rewrites.
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (apiUrl) {
    return apiUrl.replace(/\/?api\/v1\/?$/, "");
  }
  return "https://progresslms-backend.vercel.app";
})();

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Turbopack settings. Keep root configured; disable at build time via
  // env `NEXT_DISABLE_TURBOPACK=1` when needed on Windows.
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
    // Proxy /api to the local backend during development.
    beforeFiles: process.env.NODE_ENV === "development" ? [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_PROXY || "http://localhost:3001"}/api/:path*`,
      },
    ] : [],

    // In production, proxy /api/v1/* to the deployed backend.
    // This prevents 404s when the client is built with a relative API base.
    afterFiles: [
      {
        source: "/api/v1/:path*",
        destination: `${apiOrigin}/api/v1/:path*`,
      },
    ],
  }),
};

export default nextConfig;
