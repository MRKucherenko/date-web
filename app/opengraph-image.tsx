import { ImageResponse } from "next/og";

export const alt = "Will you go on a date with me?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #ffe4e6 0%, #fff7ed 50%, #fef3c7 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120 }}>💌</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#e11d48",
            marginTop: 24,
            textAlign: "center",
          }}
        >
          Will you go on a date with me?
        </div>
      </div>
    ),
    { ...size }
  );
}
