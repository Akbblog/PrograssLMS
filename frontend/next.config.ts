import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname),
  },
  rewrites: async () => ({
    beforeFiles: [
      {
        source: "/api/:path*",
        destination: "http://localhost:5130/api/:path*",
      },
    ],
  }),
};

export default nextConfig;
