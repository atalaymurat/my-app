import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/auth"],
        disallow: ["/shield/"],
      },
    ],
    sitemap: "https://app.postiva.uk/sitemap.xml",
  };
}
