export default function robots() {
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
