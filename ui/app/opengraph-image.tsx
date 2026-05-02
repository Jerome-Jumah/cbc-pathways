import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image dimensions
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #3b82f6 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "Inter, sans-serif",
          position: "relative",
        }}
      >
        {/* Background pattern dots */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "400px",
            height: "400px",
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "100px",
            padding: "8px 20px",
            marginBottom: "32px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px", fontWeight: 600 }}>
            🇰🇪  Kenya CBC Education
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: "68px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.1,
            marginBottom: "24px",
            maxWidth: "900px",
          }}
        >
          CBC Pathways
        </div>

        {/* Sub-headline */}
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 400,
            lineHeight: 1.4,
            maxWidth: "780px",
            marginBottom: "48px",
          }}
        >
          Find subject combinations and senior schools in Kenya
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["Explore Tracks", "Find Schools", "Get Recommendations"].map(
            (label) => (
              <div
                key={label}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: "12px",
                  padding: "10px 20px",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            right: "80px",
            color: "rgba(255,255,255,0.5)",
            fontSize: "18px",
          }}
        >
          cbcpathways.co.ke
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
