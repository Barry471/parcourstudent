import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { publicOrigin } from "@/lib/site";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headerList = await headers();
  const base = publicOrigin(headerList.get("x-forwarded-host") ?? headerList.get("host"));
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/messages", "/compte", "/connexion", "/mot-de-passe"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
