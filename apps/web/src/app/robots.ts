import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      disallow: "*",
    },
    sitemap: `${publicEnv.NEXT_PUBLIC_BASE_URL}/sitemap.xml`,
  };
}
