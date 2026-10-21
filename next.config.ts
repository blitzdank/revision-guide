import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
