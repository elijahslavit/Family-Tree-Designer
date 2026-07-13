import type { MetadataRoute } from "next";

import { productConfig } from "@/lib/config/product";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/"],
      disallow: [
        "/archive/",
        "/dashboard/",
        "/directory/",
        "/import/",
        "/invite/",
        "/person/",
        "/projects/",
        "/review/",
        "/s/",
        "/settings/",
        "/t/",
      ],
    },
    host: productConfig.appUrl,
  };
}
