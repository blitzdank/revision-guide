import Link from "next/link";
import { ChevronLeft } from "lucide-react";

/** A consistent "go up one level" link for screens nested under a tab, so
 * you're never forced back to a subject's start to navigate around. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex w-fit items-center gap-1 rounded-full bg-surface py-1.5 pl-2 pr-3.5 text-sm font-semibold text-text shadow-sm"
    >
      <ChevronLeft size={18} aria-hidden /> {label}
    </Link>
  );
}
