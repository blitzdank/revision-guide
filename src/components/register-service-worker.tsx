"use client";

import { useEffect } from "react";

export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Non-fatal: the app still works without it, just without the PWA
        // install prompt / offline fallback.
      });
    }
  }, []);

  return null;
}
