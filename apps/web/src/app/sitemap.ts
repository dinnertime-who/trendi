import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: publicEnv.NEXT_PUBLIC_BASE_URL,
      lastModified: new Date(),
      priority: 1,
    },
  ];
}
