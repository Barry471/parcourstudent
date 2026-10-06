import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { candidatures } from "@/lib/candidatures";
import { guides } from "@/lib/content";
import { demarches } from "@/lib/demarches";
import { publicOrigin } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headerList = await headers();
  const base = publicOrigin(headerList.get("x-forwarded-host") ?? headerList.get("host"));
  const paths = [
    "/",
    "/inscription",
    "/confidentialite",
    "/contact",
    "/candidatures",
    ...candidatures.map((item) => `/candidatures/${item.id}`),
    ...demarches.map((item) => `/demarches/${item.id}`),
    ...guides.map((guide) => `/guides/${guide.slug}`),
  ];
  return paths.map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "weekly",
  }));
}
