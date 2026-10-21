"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "Auto" },
] as const;

/** Light / Dark / Auto segmented control, used on the Me / Settings screen. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Avoid rendering theme-dependent state before hydration to prevent a
  // flash — the standard next-themes pattern (no non-effect alternative,
  // since "have we hydrated yet" is inherently a client-only fact).
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex rounded-full bg-bg p-1"
    >
      {OPTIONS.map((option) => {
        const selected = mounted && theme === option.value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setTheme(option.value)}
            className={`min-w-20 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selected
                ? "bg-pink text-pink-strong"
                : "text-muted hover:text-text"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
