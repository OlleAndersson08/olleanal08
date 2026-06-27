import { ImageResponse } from "next/og";

/* Ikon som visas när man lägger Knega på iPhones hemskärm. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

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
          fontSize: 120,
          backgroundImage: "linear-gradient(135deg,#ffb347,#ff5e62,#ff2d78)",
        }}
      >
        ☀
      </div>
    ),
    { ...size },
  );
}
