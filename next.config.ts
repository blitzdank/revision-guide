import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets you open the dev server from your phone on the same Wi-Fi (the
  // "Network" URL `next dev` prints) without Server Actions (sign in, sign
  // up, etc.) being rejected as cross-origin. Dev only — ignored in
  // production, where you'll have a real domain instead.
  allowedDevOrigins: ["192.168.0.22"],
  // Cache Components (experimental in Next 16) would require every page that
  // reads cookies/the database to opt in with Suspense or "use cache". That's
  // extra ceremony the brief doesn't need, so we use classic dynamic
  // rendering instead — simpler and more conventional for Connor to extend.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
