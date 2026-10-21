import type { ReactElement } from "react";

/** Shared mark for every generated icon size (favicon, apple touch, PWA). */
export function appIconMark(size: number): ReactElement {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F8C8DC",
        borderRadius: size * 0.22,
        fontSize: size * 0.56,
        fontWeight: 700,
        color: "#D9608F",
        fontFamily: "sans-serif",
      }}
    >
      R
    </div>
  );
}
