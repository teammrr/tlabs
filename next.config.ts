import type { NextConfig } from "next";

// Marketing pages are still prerendered (static). Only POST /api/problem/ runs on the server.
const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    // English lives at "/"; a bare /en/ lands there.
    return [{ source: "/en", destination: "/", permanent: true }];
  },
};

export default nextConfig;
