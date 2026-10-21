import { ImageResponse } from "next/og";
import { appIconMark } from "@/lib/app-icon";

// Referenced only from manifest.ts (PWA install icons need specific sizes,
// separate from the favicon/apple-icon conventions above).
export function GET() {
  return new ImageResponse(appIconMark(192), { width: 192, height: 192 });
}
