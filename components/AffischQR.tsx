"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/*
  Genererar en QR-kod som pekar på DIN egen live-länk (+/foretag),
  uträknad automatiskt från webbläsaren. Inget att hårdkoda.
*/

export default function AffischQR() {
  const [src, setSrc] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    const mal = window.location.origin + "/foretag";
    setUrl(window.location.host + "/foretag");
    QRCode.toDataURL(mal, {
      width: 560,
      margin: 1,
      color: { dark: "#0b0b10", light: "#ffffff" },
    })
      .then(setSrc)
      .catch(() => {});
  }, []);

  return (
    <div className="flex flex-col items-center">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="QR-kod till SommarMatch" className="h-56 w-56 sm:h-64 sm:w-64" />
      ) : (
        <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-zinc-100 text-sm text-zinc-400">
          Skapar QR ...
        </div>
      )}
      <p className="mt-2 text-sm font-semibold text-zinc-500">{url}</p>
    </div>
  );
}
