import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = publicEnv.appUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/auth/",
          "/auth/callback",
          "/auth/signout",
          "/auth/reset-password",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
