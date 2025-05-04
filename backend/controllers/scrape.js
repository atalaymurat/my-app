const axios = require("axios");
const cheerio = require("cheerio");
const {
  findContactPage,
  extractPhone,
  extractEmail,
  extractAddresses,
  extractFromBlocksScript,
} = require("../utils/contactExtractor");

const contactPageKeywords = [
  "iletisim",
  "contact",
  "contact_us",
  "contact-us",
  "bize-ulasin",
  "bize_ulasin",
];

module.exports = {
  contacts: async (req, res) => {
  console.log("Controller Contacts Entered");

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL gerekli" });

  let siteUrl = url;
  if (!/^https?:\/\//i.test(siteUrl)) {
    siteUrl = "http://" + siteUrl;
  }

  try {
    const { data: mainHtml } = await axios.get(siteUrl);
    const $ = cheerio.load(mainHtml);

    const contactPageUrl = findContactPage($, siteUrl, contactPageKeywords);
    if (!contactPageUrl) {
      return res.status(404).json({ error: "İletişim sayfası bulunamadı" });
    }

    const { data: contactHtml } = await axios.get(contactPageUrl);
    const $$ = cheerio.load(contactHtml);

    // 👇 Hem HTML içinden hem de BLOCKS verisinden adres çıkar
    const phone = extractPhone($$);
    const email = extractEmail($$);
    const htmlAddresses = extractAddresses($$);
    const jsonAddresses = extractFromBlocksScript(contactHtml);

    // 👇 Adresleri birleştirip tekrar edenleri filtrele
    const normalize = (addr) =>
      addr.raw.replace(/\s+/g, " ").trim().toLowerCase();

    const addresses = [...jsonAddresses];

    htmlAddresses.forEach((a) => {
      if (!addresses.some((b) => normalize(b) === normalize(a))) {
        addresses.push(a);
      }
    });

    return res.json({
      site: url,
      contactPage: contactPageUrl,
      phone: phone || "",
      email: email || "",
      address: addresses.length > 0 ? addresses : [],
    });
  } catch (err) {
    console.error(err.message);
    return res
      .status(500)
      .json({ error: "Hata oluştu", details: err.message });
  }
},




  meta: async (req, res) => {
    try {
      const { url } = req.body;
      console.log("URL ::", new URL(url).hostname);
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      // Add https:// if not present and validate URL
      const formattedUrl = url.startsWith("http") ? url : `https://${url}`;
      try {
        new URL(formattedUrl); // Validate URL format
      } catch (e) {
        return res.status(400).json({ error: "Invalid URL format" });
      }

      const response = await axios.get(formattedUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; MyApp/1.0)",
        },
        timeout: 5000, // 5 second timeout
      });

      const $ = cheerio.load(response.data);

      // Helper function to get meta content
      const getMeta = (nameOrProperty) => {
        return $(
          `meta[name="${nameOrProperty}"], meta[property="${nameOrProperty}"]`
        ).attr("content");
      };

      // Extract all possible metadata
      const metadata = {
        // Basic meta
        title:
          $("title").first().text() ||
          getMeta("og:title") ||
          getMeta("twitter:title"),
        description:
          getMeta("description") ||
          getMeta("og:description") ||
          getMeta("twitter:description"),
        keywords: getMeta("keywords"),
        language: $("html").attr("lang") || getMeta("language"),
        canonical: $('link[rel="canonical"]').attr("href"),

        // Open Graph (Facebook)
        ogTitle: getMeta("og:title"),
        ogDescription: getMeta("og:description"),
        ogImage: getMeta("og:image"),
        ogUrl: getMeta("og:url"),
        ogType: getMeta("og:type"),
        ogSiteName: getMeta("og:site_name"),
        ogLocale: getMeta("og:locale"),

        // Twitter Cards
        twitterCard: getMeta("twitter:card"),
        twitterSite: getMeta("twitter:site"),
        twitterCreator: getMeta("twitter:creator"),
        twitterTitle: getMeta("twitter:title"),
        twitterDescription: getMeta("twitter:description"),
        twitterImage: getMeta("twitter:image"),

        // App Links
        androidApp: getMeta("al:android:url"),
        iosApp: getMeta("al:ios:url"),

        // Favicons
        favicon:
          $('link[rel="icon"]').attr("href") ||
          $('link[rel="shortcut icon"]').attr("href") ||
          "/favicon.ico", // Default favicon path

        // Additional social
        fbAppId: getMeta("fb:app_id"),
        instagramHandle: getMeta("instagram:handle"),

        // Structured data (LD+JSON)
        structuredData: [],
      };

      // Extract JSON-LD data
      $('script[type="application/ld+json"]').each(function () {
        try {
          const jsonData = JSON.parse($(this).text());
          metadata.structuredData.push(jsonData);
        } catch (e) {
          console.error("Error parsing JSON-LD:", e);
        }
      });

      // Convert relative URLs to absolute
      const makeAbsolute = (path, base) => {
        if (!path) return null;
        try {
          return new URL(path, base).toString();
        } catch (e) {
          return path;
        }
      };

      // Process all URL fields
      const urlFields = [
        "image",
        "ogImage",
        "twitterImage",
        "favicon",
        "canonical",
        "ogUrl",
      ];
      urlFields.forEach((field) => {
        if (metadata[field]) {
          metadata[field] = makeAbsolute(metadata[field], formattedUrl);
        }
      });

      console.log("Extracted Metadata:", metadata);
      res.json(metadata);
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({
        error: "Failed to fetch metadata",
        details: error.message,
      });
    }
  },
};
