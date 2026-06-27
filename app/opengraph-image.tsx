import { ImageResponse } from "next/og";

/*
  Branded länk-förhandsvisning (visas när länken delas i sms, sociala medier osv).
*/

export const alt = "Knega – Tjäna pengar. Bygg din framtid.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08080c",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glöd */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(255,45,120,0.45), rgba(255,45,120,0))",
            display: "flex",
          }}
        />
        {/* Logga */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              backgroundImage: "linear-gradient(135deg,#ffb347,#ff2d78)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            ☀
          </div>
          <div style={{ display: "flex", fontSize: 34, fontWeight: 800, color: "#f5f5f8" }}>
            Knega
          </div>
        </div>

        {/* Rubrik */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: "#f5f5f8", lineHeight: 1.05 }}>
            Tjäna pengar.
          </div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, color: "#ff6a4d", lineHeight: 1.05 }}>
            Bygg din framtid.
          </div>
          <div style={{ display: "flex", marginTop: 24, fontSize: 34, color: "#9a9aae" }}>
            Sveriges plattform för unga 15–25 · Svep, matcha, sök
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
