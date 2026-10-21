import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { RegisterServiceWorker } from "@/components/register-service-worker";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Revision Guide",
  description: "GCSE revision guides, flashcards, quizzes and past papers in one place.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Revision Guide",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff9fb" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1720" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full font-sans antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
