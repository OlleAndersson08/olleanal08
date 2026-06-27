import type { MetadataRoute } from "next";

/* Gör att Knega kan läggas till på mobilens hemskärm som en app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Knega",
    short_name: "Knega",
    description: "Tjäna pengar. Bygg din framtid. Jobb, gig och extrajobb för unga 15–25.",
    start_url: "/",
    display: "standalone",
    background_color: "#08080c",
    theme_color: "#08080c",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
