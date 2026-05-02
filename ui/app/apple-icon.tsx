import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — shown on iOS home screen bookmarks */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
          borderRadius: "40px",
        }}
      >
        <div
          style={{
            fontSize: "96px",
            fontWeight: 800,
            color: "white",
            fontFamily: "sans-serif",
            letterSpacing: "-4px",
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size }
  );
}
