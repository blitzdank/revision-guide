import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Revision Guide",
    short_name: "Revision",
    description: "GCSE revision guides, flashcards, quizzes and past papers in one place.",
    start_url: "/",
    display: "standalone",
    background_color: "#fff9fb",
    theme_color: "#f8c8dc",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
