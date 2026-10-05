import type { MetadataRoute } from "next";
import { candidatures } from "@/lib/candidatures";
import { demarches } from "@/lib/demarches";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const paths = [
    "",
    "/inscription",
    "/connexion",
    "/confidentialite",
    "/candidatures",
    ...candidatures.map((item) => `/candidatures/${item.id}`),
    ...demarches.map((item) => `/demarches/${item.id}`),
  ];
  return paths.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const }));
}
