import { ImageResponse } from "next/og";
import { appIconMark } from "@/lib/app-icon";

export function GET() {
  return new ImageResponse(appIconMark(512), { width: 512, height: 512 });
}
